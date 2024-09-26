import { useLangStore } from "@/stores/langStore";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { z } from "zod";

type TNewRecipeValues = z.infer<ReturnType<typeof createRecipeSchema>>;

interface TNewRecipeErrors {
  complexity?: string | string[];
  cooking_time?: string | string[];
  ingredients?: string | string[];
  recipe?: string | string[];
  servings?: string | string[];
  title?: string | string[];
  diet?: string | string[];
  image?: string | string[];
  imageFile?: string | string[];
  rootError?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function createRecipeSchema(t: any) {
  return z.object({
    complexity: z.string(),
    cooking_time: z.string().min(1, { message: t("invalidFormat") }),
    title: z.string().min(1, t("enterTitle")),
    recipe: z.string().min(1, t("emptyField")).min(100, t("recipeTooShort")),
    ingredients: z.array(z.string()).min(1, t("enterIngredients")),
    servings: z.number().min(1, t("servingsRange")),
    diet: z.optional(z.array(z.string())),
    image: z.optional(z.string()),
    imageFile: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, {
        message: t("maxImageSize"),
      })
      .optional(),
  });
}

export function useValidateNewRecipe() {
  const isValid = ref(false);

  const errors = ref<TNewRecipeErrors>({});

  const langStore = useLangStore();
  const { locale } = storeToRefs(langStore);

  const { t } = useI18n();
  const recipeSchema = ref(createRecipeSchema(t));

  function clearError(error: keyof TNewRecipeErrors) {
    errors.value[error] = undefined;
  }

  function validateNewRecipe(
    valuesWithoutFile: Omit<TNewRecipeValues, "imageFile">,
    imageFile?: File
  ) {
    const values: TNewRecipeValues = {
      ...valuesWithoutFile,
      servings: Number(valuesWithoutFile.servings),
      imageFile,
    };

    isValid.value = false;
    const result = recipeSchema.value.safeParse(values);

    if (result.error) {
      errors.value = result.error.formErrors.fieldErrors;
      errors.value.rootError = result.error.formErrors.formErrors[0];
      return;
    }

    isValid.value = true;
    errors.value = {};
  }

  watch(locale, () => {
    recipeSchema.value = createRecipeSchema(t);
    errors.value = {};
  });

  return { isValid, errors, validateNewRecipe, clearError };
}
