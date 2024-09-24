import { useLangStore } from "@/stores/langStore";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { z } from "zod";

export type TRegisterValues = z.infer<ReturnType<typeof createRegisterSchema>>;

interface TRegisterErrors {
  name?: string | string[];
  email?: string | string[];
  password?: string | string[];
  confirmPassword?: string | string[];
  rootError?: string;
}

function createRegisterSchema(t: any) {
  return z
    .object({
      name: z
        .string({ message: t("enterYourName") })
        .min(1, t("enterYourName"))
        .min(2, t("nameAtLeast2Chars")),
      email: z
        .string({ message: t("invalidEmailFormat") })
        .email(t("invalidEmailFormat")),
      password: z
        .string({ message: t("enterPassword") })
        .min(1, t("enterPassword"))
        .min(8, t("passwordAtLeast8")),
      confirmPassword: z
        .string({ message: t("repeatPassword") })
        .min(1, t("repeatPassword")),
    })
    .refine(({ password, confirmPassword }) => password === confirmPassword, {
      message: t("passwordMismatch"),
      path: [],
    });
}

export function useValidateRegister(values: TRegisterValues) {
  const { t } = useI18n();

  const isValid = ref(false);
  const registerSchema = ref(createRegisterSchema(t));

  const langStore = useLangStore();
  const { locale } = storeToRefs(langStore);

  const errors = ref<TRegisterErrors>({});

  function clearError(error: keyof TRegisterErrors) {
    errors.value[error] = undefined;
  }

  function validateRegister() {
    isValid.value = false;
    const result = registerSchema.value.safeParse(values);

    if (!result.success) {
      errors.value = result.error.formErrors.fieldErrors;
      errors.value.rootError = result.error.formErrors.formErrors[0];
      return;
    }

    isValid.value = true;
    errors.value = {};
  }

  watch(locale, () => {
    registerSchema.value = createRegisterSchema(t);
    // validateRegister();
    errors.value = {};
  });

  return { errors, validateRegister, isValid, clearError };
}
