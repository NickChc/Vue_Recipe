<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import Button from "@/components/Button.vue";
import FormInput from "@/components/FormInput.vue";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { TLoginValues, useValidateLogin } from "@/composables/useValidateLogin";
import { useI18n } from "vue-i18n";
import FormError from "./FormError.vue";

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

function handleUpdate(e: Event) {
  const target = e.target as HTMLInputElement;
  const name = target.name as keyof TLoginValues;

  loginData.value[name] = target.value;
  clearError(name);
}

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
    @submit.prevent="handleSubmit"
    class="flex flex-col gap-y-3 w-[700px] max-w-full mx-auto mt-6"
  >
    <FormInput
      :disabled="loading"
      name="email"
      v-model="loginData.email"
      :label="$t('email', 'EMAIL')"
      @update:value="handleUpdate"
      :error="errors.email?.[0]"
    />

    <FormInput
      :disabled="loading"
      type="password"
      name="password"
      v-model="loginData.password"
      :label="$t('password', 'PASSWORD')"
      @update:value="handleUpdate"
      :error="errors.password?.[0]"
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
