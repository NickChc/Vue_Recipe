<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { signInWithEmailAndPassword } from "firebase/auth";
import { RouterLink, useRouter } from "vue-router";
import Button from "@/components/Button.vue";
import FormInput from "@/components/FormInput.vue";
import { auth } from "@/firebase";
import { TLoginValues, useValidateLogin } from "@/composables/useValidateLogin";
import FormError from "@/components/auth/FormError.vue";
import SocialProvidersSignIn from "@/components/auth/SocialProvidersSignIn.vue";

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

async function handleSubmit() {
  try {
    loading.value = true;
    error.value = null;
    validateLogin();

    if (!isValid.value) {
      loading.value = false;
      return;
    }

    const { email, password } = loginData.value;

    await signInWithEmailAndPassword(auth, email, password);

    router.replace("/");
  } catch (err: any) {
    console.log(err.message);
    loading.value = false;
    if (err.message.includes("invalid-credential")) {
      error.value = t("invalidCredentials");
    }
  }
}
</script>

<template>
  <form
    novalidate
    @submit.prevent="handleSubmit"
    class="flex flex-col gap-y-3 w-[700px] max-w-full mx-auto mt-6 pb-6"
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

    <SocialProvidersSignIn />

    <Button :disabled="loading" variation="primary" type="submit">
      <div class="sm:text-lg">
        {{
          loading
            ? $t("signingIn").toLocaleUpperCase()
            : $t("signIn").toLocaleUpperCase()
        }}
      </div>
    </Button>

    <div
      class="mt-5 sm:mt-10 flex items-center justify-between flex-col gap-y-5 sm:flex-row"
    >
      <RouterLink class="underline" to="/register">{{
        $t("dontHaveAnAccountYet")
      }}</RouterLink>

      <RouterLink class="underline" to="/forgot-password">{{
        $t("forgotPassword")
      }}</RouterLink>
    </div>
  </form>
</template>
