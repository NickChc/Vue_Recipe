import { TCookingTime_Enum, TRecipeFormValues } from "@/@types/general";
import { onBeforeUnmount, onMounted, Ref, ref } from "vue";
import { useValidateNewRecipe } from "./useValidateNewRecipe";
import { useAuthStore } from "@/stores/authStore";
import { createRecipe } from "@/data/createRecipe";
import { useRouter } from "vue-router";
import { RECIPE_FORM_DATA, SERVINGS } from "@/config/storageKeys";
import { useI18n } from "vue-i18n";
import { editRecipe as handleEditRecipe } from "@/data/editRecipe";

export function useCreateRecipe(
  newRecipeData: Ref<TRecipeFormValues>,
  imageFile: Ref<File | undefined>,
  setRecipeData: (values: TRecipeFormValues) => void,
  setImageValues: (values: {
    image: string | null;
    imgFile: File | undefined;
  }) => void,
  editRecipe?: { values: TRecipeFormValues; id: string }
) {
  const loading = ref(false);
  const error = ref<null | string>(null);

  const recipePlaceholder =
    "Toast the bread: Lightly toast both slices of rye bread. \n\nWarm the pastrami: Heat the pastrami slices in a skillet on medium heat for 2-3 minutes, until warm. \n\nAssemble the sandwich: Spread mustard on one side of each toasted slice. \n\nLayer the warm pastrami between the bread slices. Add Swiss cheese if desired. \n\nServe: Slice in half and serve with a pickle on the side. \n\nEnjoy!";

  const cookingTimes = Object.keys(
    TCookingTime_Enum
  ) as (keyof typeof TCookingTime_Enum)[];

  const router = useRouter();

  const { t } = useI18n();

  const { isValid, validateNewRecipe, ...rest } = useValidateNewRecipe();
  const authStore = useAuthStore();

  async function handleCreateRecipe() {
    if (authStore.currentUser == null) return;

    try {
      error.value = null;
      loading.value = true;
      validateNewRecipe(newRecipeData.value, imageFile.value);

      if (!isValid.value) {
        loading.value = false;
        return;
      }

      let res: { success: boolean; error: string | null } = {
        success: false,
        error: null,
      };

      if (editRecipe) {
        res = await handleEditRecipe(
          editRecipe.id,
          editRecipe.values,
          newRecipeData.value,
          imageFile.value
        );
      } else {
        res = await createRecipe(
          authStore.currentUser,
          newRecipeData.value,
          imageFile.value
        );
      }

      if (res.error) {
        throw new Error(res.error);
      }

      localStorage.removeItem(RECIPE_FORM_DATA);
      localStorage.removeItem(SERVINGS);
      router.push("/");
    } catch (err: any) {
      console.log(err.message);
      if (editRecipe) {
        error.value = t("failedToEditRecipe");
      } else {
        error.value = t("failedToCreateRecipe");
      }
      loading.value = false;
    }
  }

  onMounted(async () => {
    if (editRecipe) return;

    const autosaveInterval = setInterval(() => {
      localStorage.setItem(
        RECIPE_FORM_DATA,
        JSON.stringify(newRecipeData.value)
      );
      localStorage.setItem(
        SERVINGS,
        JSON.stringify(newRecipeData.value.servings)
      );
    }, 5000);

    onBeforeUnmount(() => {
      clearInterval(autosaveInterval);
    });

    const savedData = localStorage.getItem(RECIPE_FORM_DATA);

    if (savedData) {
      setRecipeData(JSON.parse(savedData));
      setImageValues({ image: null, imgFile: undefined });
    }
  });

  return {
    handleCreateRecipe,
    cookingTimes,
    recipePlaceholder,
    loading,
    error,
    validation: { ...rest, isValid },
  };
}
