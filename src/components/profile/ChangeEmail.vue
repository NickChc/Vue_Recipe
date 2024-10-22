<script setup lang="ts">
import FormInput from "@/components/FormInput.vue";
import Button from "@/components/Button.vue";
import { onMounted, ref } from "vue";
import {
  signInWithEmailAndPassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { auth } from "@/firebase";
import FormError from "@/components/auth/FormError.vue";
import { useI18n } from "vue-i18n";
import { createEmailSchema } from "@/utils/createSchemas";
import { useAuthStore } from "@/stores/authStore";

const emit = defineEmits<{
  (e: "done"): void;
}>();

function emitDone() {
  emit("done");
}

const VERIFICATION_SENT = "verification_sent";

const error = ref<null | string>(null);
const loading = ref(false);

const password = ref("");
const email = ref(auth.currentUser?.email || "");
const verificationSent = ref(false);

const { t } = useI18n();

async function changeEmail() {
  try {
    loading.value = true;

    const fireUser = auth.currentUser;

    if (fireUser == null || fireUser.email == null) {
      emitDone();
      return;
    }

    if (email.value === fireUser.email || email.value === "") {
      emitDone();
      return;
    }

    const emailRes = createEmailSchema(t).safeParse(email.value);

    if (!emailRes.success) {
      error.value = emailRes.error.formErrors.formErrors[0];
      return;
    }

    // to bypass the "requires-recent-login" error
    await signInWithEmailAndPassword(auth, fireUser.email, password.value);

    await verifyBeforeUpdateEmail(auth.currentUser!, email.value);
    verificationSent.value = true;

    const timeSent = new Date().getTime();
    localStorage.setItem(
      VERIFICATION_SENT,
      JSON.stringify({
        time: timeSent,
        email: fireUser.email,
      })
    );
  } catch (err: any) {
    console.log(err.message);
    if (err.message.includes("password")) {
      error.value = t("invalidPassword");
    }
  } finally {
    loading.value = false;
  }
}

function handleConfirm() {
  const authStore = useAuthStore();

  authStore.handleSignOut();

  localStorage.removeItem(VERIFICATION_SENT);
}

async function handleCancel() {
  await auth.currentUser?.reload();
  localStorage.removeItem(VERIFICATION_SENT);
  emitDone();
}

onMounted(() => {
  const verificationData = JSON.parse(
    localStorage.getItem(VERIFICATION_SENT) || "null"
  );

  if (verificationData == null) return;

  const sentTime = verificationData.time;
  const currTime = new Date().getTime();

  const fiveMinInMiliseconds = 5 * 60 * 1000;

  if (currTime - sentTime > fiveMinInMiliseconds) {
    localStorage.removeItem(VERIFICATION_SENT);
    return;
  }

  if (auth.currentUser?.email !== verificationData.email) {
    localStorage.removeItem(VERIFICATION_SENT);
    return;
  }

  verificationSent.value = true;
});
</script>

<template>
  <form
    @submit.prevent="changeEmail"
    novalidate
    class="flex flex-col gap-y-4 my-2 text-xs sm:text-base 2xl:text-xl mb-9"
  >
    <FormInput
      :disabled="verificationSent"
      type="password"
      v-model="password"
      :placeholder="$t('enterPassword')"
    />

    <FormInput
      :disabled="verificationSent"
      type="email"
      :placeholder="$t('email')"
      :hint="$t('enterNewEmail')"
      v-model="email"
    />

    <!-- Verification sent popup -->
    <div
      v-if="verificationSent"
      class="border-2 border-add p-2 rounded-sm shadow-xl"
    >
      <p class="text-sm sm:text-lg mb-2">
        {{ $t("confirmEmailToChange") }} - {{ email }}
      </p>
      <div class="grid grid-cols-1 xs:grid-cols-2 gap-y-2 gap-x-3 mt-4">
        <Button
          @click="handleCancel"
          size="sm"
          variation="outlined"
          color="add"
          type="button"
          >{{ $t("cancel") }}</Button
        >
        <Button
          @click="handleConfirm"
          size="sm"
          variation="primary"
          type="button"
          >{{ $t("done") }}</Button
        >
      </div>
    </div>

    <FormError v-if="error" :error="error" @clear-error="error = null" />

    <Button
      v-if="!verificationSent"
      :disabled="verificationSent"
      class="mt-2"
      type="submit"
      :loading="loading"
      >{{
        loading
          ? `${$t("changing").toLocaleUpperCase()}...`
          : $t("change").toLocaleUpperCase()
      }}</Button
    >
  </form>
</template>
