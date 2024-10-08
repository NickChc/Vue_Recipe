<script setup lang="ts">
import FormInput from "@/components/FormInput.vue";
import Button from "@/components/Button.vue";
import { ref } from "vue";
import {
  TRegisterValues,
  useValidateRegister,
} from "@/composables/useValidateRegister";
import FormError from "@/components/auth/FormError.vue";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/firebase";
import { useI18n } from "vue-i18n";
import EmailConfirmation from "@/components/auth/EmailConfirmation.vue";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { scrollToTop } from "@/utils/scrollToTop";

const authStore = useAuthStore();
const { verificationSent } = storeToRefs(authStore);

const userData = ref<TRegisterValues>({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const { errors, isValid, validateRegister, clearError } = useValidateRegister(
  userData.value
);

const { t } = useI18n();

const submitError = ref<null | string>(null);
const loading = ref(false);

async function handleSubmit() {
  try {
    submitError.value = null;
    loading.value = true;
    validateRegister();

    if (!isValid.value) return;

    const { email, password } = userData.value;

    const result = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(result.user, { displayName: userData.value.name });

    await sendEmailVerification(result.user);
    verificationSent.value = true;

    const form = document.getElementById("registerForm");
    scrollToTop(form);
  } catch (err: any) {
    console.log(err.message);
    const message: string = err.message;
    if (message.includes("auth/email-already-in-use")) {
      if (authStore.fireUser) {
        await sendEmailVerification(authStore.fireUser);
        verificationSent.value = true;
        return;
      }

      submitError.value = t("accountAlreadyExists");
      return;
    }
    submitError.value = t("couldntRegister");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <EmailConfirmation v-if="verificationSent" />

  <form
    id="registerForm"
    novalidate
    @submit.prevent="handleSubmit"
    class="flex flex-col gap-y-3 w-[700px] max-w-full min-h-fit pb-20 sm:pb-28 mx-auto mt-6"
  >
    <FormInput
      :disabled="verificationSent || loading"
      name="name"
      :label="$t('name', 'NAME')"
      v-model="userData.name"
      :error="errors.name?.[0]"
      @clear-error="clearError('name')"
    />

    <FormInput
      :disabled="verificationSent || loading"
      name="email"
      :label="$t('email', 'EMAIL')"
      v-model="userData.email"
      :error="errors.email?.[0]"
      @clear-error="clearError('email')"
    />

    <FormInput
      :disabled="verificationSent || loading"
      type="password"
      name="password"
      :label="$t('password', 'PASSWORD')"
      v-model="userData.password"
      :error="errors.password?.[0]"
      @clear-error="clearError('password')"
    />

    <FormInput
      :disabled="verificationSent || loading"
      type="password"
      name="confirmPassword"
      :label="$t('confirmPassword', 'CONFIRM PASSWORD')"
      v-model="userData.confirmPassword"
      :error="errors.confirmPassword?.[0]"
      @clear-error="clearError('confirmPassword')"
    />

    <FormError
      v-if="errors.rootError || submitError"
      :error="errors.rootError || submitError || $t('problemOccuredTryAgain')"
      @clear-error="
        () => {
          clearError('rootError');
          submitError = null;
        }
      "
    />

    <div v-if="!verificationSent" class="invisible my-6"></div>

    <Button
      :disabled="verificationSent || loading"
      variation="primary"
      type="submit"
      >{{
        loading
          ? $t("registering").toLocaleUpperCase()
          : $t("register").toLocaleUpperCase()
      }}</Button
    >
    <RouterLink class="underline mt-10 w-fit" to="/sign-in">{{
      $t("alreadyHaveAnAccount")
    }}</RouterLink>
  </form>
</template>
