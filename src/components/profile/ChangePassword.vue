<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import FormInput from "@/components/FormInput.vue";
import Button from "@/components/Button.vue";
import { auth } from "@/firebase";
import FormError from "@/components/auth/FormError.vue";
import { createPasswordSchema } from "@/utils/createSchemas";
import { sendToast } from "@/utils/sendToast";

const emit = defineEmits<{
  (e: "done"): void;
}>();

function emitDone() {
  emit("done");
}

const error = ref<null | string>(null);
const loading = ref(false);

const oldPassword = ref("");
const newPassword = ref("");
const confirmNewPassword = ref("");

const { t } = useI18n();

async function changePassword() {
  try {
    loading.value = true;

    const fireUser = auth.currentUser;

    if (fireUser == null || fireUser.email == null) {
      emitDone();
      return;
    }

    const passwordRes = createPasswordSchema(t).safeParse(newPassword.value);

    if (!passwordRes.success) {
      error.value = passwordRes.error.formErrors.formErrors[0];
      return;
    }

    if (newPassword.value !== confirmNewPassword.value) {
      error.value = t("passwordMismatch");
      return;
    }

    // to bypass the "requires-recent-login" error
    await signInWithEmailAndPassword(auth, fireUser.email, oldPassword.value);

    await updatePassword(auth.currentUser!, newPassword.value);

    sendToast("success", t("passwordUpdateSuccess"));
    emitDone();
  } catch (err: any) {
    console.log(err.message);
    if (err.message.includes("password")) {
      error.value = t("invalidPassword");
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form
    @submit.prevent="changePassword"
    novalidate
    class="flex flex-col gap-y-4 my-2 text-xs sm:text-base 2xl:text-xl mb-9 mt-3"
  >
    <FormInput
      class="mb-2"
      type="password"
      v-model="oldPassword"
      :placeholder="$t('currPassword')"
    />

    <FormInput
      type="password"
      v-model="newPassword"
      :placeholder="$t('newPassword')"
    />

    <FormInput
      type="password"
      :placeholder="$t('confirmPassword')"
      v-model="confirmNewPassword"
    />

    <FormError v-if="error" :error="error" @clear-error="error = null" />

    <Button class="mt-2" type="submit" :loading="loading">{{
      loading
        ? `${$t("changing").toLocaleUpperCase()}...`
        : $t("change").toLocaleUpperCase()
    }}</Button>
  </form>
</template>
