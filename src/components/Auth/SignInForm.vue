<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { signInWithEmailAndPassword } from "firebase/auth";
import { RouterLink, useRouter } from "vue-router";
import Button from "@/components/Button.vue";
import FormInput from "@/components/FormInput.vue";
import { auth } from "@/firebase";
import { TLoginValues, useValidateLogin } from "@/composables/useValidateLogin";
import FormError from "@/components/Auth/FormError.vue";

const loading = ref(false);
const error = ref<null | string>(null);

const loginData = ref<TLoginValues>({
  email: "",
  password: "",
});

const { t } = useI18n();
const router = useRouter();

const { validateLogin, isValid, errors, clearError } = useValidateLogin(
  loginData.value
);

// function handleUpdate(e: Event) {
//   const target = e.target as HTMLInputElement;
//   const name = target.name as keyof TLoginValues;

//   loginData.value[name] = target.value;
//   clearError(name);
// }

async function handleSubmit() {
  try {
    loading.value = true;
    error.value = null;
    validateLogin();

    if (!isValid.value) return;

    const { email, password } = loginData.value;

    await signInWithEmailAndPassword(auth, email, password);

    router.replace("/");
  } catch (err: any) {
    console.log(err.message);
    if (err.message.includes("invalid-credential")) {
      error.value = t("invalidCredentials");
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form
    novalidate
    @submit.prevent="handleSubmit"
    class="flex flex-col gap-y-3 w-[700px] max-w-full mx-auto mt-6"
  >
    <FormInput
      :disabled="loading"
      name="email"
      type="email"
      v-model="loginData.email"
      :label="$t('email', 'EMAIL')"
      :error="errors.email?.[0]"
      @clear-error="clearError('email')"
    />

    <FormInput
      :disabled="loading"
      type="password"
      name="password"
      v-model="loginData.password"
      :label="$t('password', 'PASSWORD')"
      :error="errors.password?.[0]"
      @clear-error="clearError('password')"
    />

    <FormError v-if="error" :error="error" @clear-error="error = null" />

    <div v-else class="invisible my-6"></div>

    <Button :disabled="loading" variation="primary" type="submit">
      <div class="sm:text-lg">
        {{ loading ? $t("signingIn") : $t("signIn") }}
      </div>
    </Button>
    <RouterLink class="mt-10 underline" to="/register">{{
      $t("dontHaveAnAccountYet")
    }}</RouterLink>
  </form>
</template>
