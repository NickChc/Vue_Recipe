import { useLangStore } from "@/stores/langStore";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { z } from "zod";

export type TLoginValues = z.infer<ReturnType<typeof createLoginSchema>>;

interface TLoginErrors {
  email?: string | string[];
  password?: string | string[];
  rootError?: string;
}

function createLoginSchema(t: any) {
  return z.object({
    email: z.string().min(1, t("enterEmail")).email(t("invalidEmailFormat")),
    password: z.string().trim().min(1, t("enterPassword")),
  });
}

export function useValidateLogin(values: TLoginValues) {
  const isValid = ref(false);

  const errors = ref<TLoginErrors>({});

  const langStore = useLangStore();
  const { locale } = storeToRefs(langStore);

  const { t } = useI18n();
  const loginSchema = ref(createLoginSchema(t));

  function clearError(error: keyof TLoginErrors) {
    errors.value[error] = undefined;
  }

  function validateLogin() {
    isValid.value = false;
    const result = loginSchema.value.safeParse(values);

    if (!result.success) {
      errors.value = result.error.formErrors.fieldErrors;
      errors.value.rootError = result.error.formErrors.formErrors[0];
      return;
    }

    isValid.value = true;
    errors.value = {};
  }

  watch(locale, () => {
    loginSchema.value = createLoginSchema(t);
    // validateLogin();
    errors.value = {};
  });

  return { validateLogin, clearError, errors, isValid };
}
