<script setup lang="ts">
import Button from "@/components/Button.vue";
import { EMAIL_CONFIRM_ATTEMPTS } from "@/config/storageKeys";
import { auth } from "@/firebase";
import { useAuthStore } from "@/stores/authStore";
import { sendEmailVerification } from "firebase/auth";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

interface TSavedAttempts {
  count: number;
  date: Date;
}

const router = useRouter();
const { t } = useI18n();

const authStore = useAuthStore();
const { fireUser } = storeToRefs(authStore);

const sending = ref(false);
const error = ref<null | string>(null);

async function confirmVerified() {
  if (fireUser.value == null) {
    error.value = t("verificationExpired");
    return;
  }

  await fireUser.value.reload();

  if (!fireUser.value.emailVerified) {
    error.value = t("emailNotVerified");
    return;
  }

  authStore.verificationSent = false;
  router.replace("/");
}

function countAttempts() {
  const attempts: TSavedAttempts | null = JSON.parse(
    localStorage.getItem(EMAIL_CONFIRM_ATTEMPTS) || "null"
  );

  if (attempts == null) {
    localStorage.setItem(
      EMAIL_CONFIRM_ATTEMPTS,
      JSON.stringify({
        count: 1,
        date: new Date(),
      })
    );

    return;
  }

  localStorage.setItem(
    EMAIL_CONFIRM_ATTEMPTS,
    JSON.stringify({
      count: attempts.count + 1,
      date: new Date(),
    })
  );
}

async function handleSendAgain() {
  try {
    error.value = null;
    sending.value = true;

    const attempts = JSON.parse(
      localStorage.getItem(EMAIL_CONFIRM_ATTEMPTS) || "null"
    );

    if (attempts != null && attempts.count >= 5) {
      const savedDate = new Date(attempts.date);
      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - savedDate.getTime();

      if (timeDifference < 15) {
        error.value = t("tooManySendAgains");
        return;
      }

      localStorage.removeItem(EMAIL_CONFIRM_ATTEMPTS);
    }

    await auth.currentUser?.reload();
    console.log(fireUser.value);
    console.log(fireUser.value);

    if (fireUser.value == null) {
      error.value = t("verificationExpired");
      return;
    }

    await sendEmailVerification(fireUser.value);
    countAttempts();
  } catch (err: any) {
    console.log(err.message);
    if (err.message.includes("auth/too-many-requests")) {
      error.value = t("tooManySendAgains");
    }
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div
    class="border-2 border-add rounded-sm flex flex-col items-center justify-between text-add p-2 text-center"
  >
    <p v-if="error == null">
      {{ $t("verificationSent", { email: fireUser?.email }) }}
    </p>
    <p v-else class="text-danger dark:text-danger-dark">{{ error }}</p>

    <div v-if="error == null" class="text-sm grid grid-cols-2 gap-x-3 mt-3">
      <Button @click="confirmVerified" variation="primary" size="sm">{{
        $t("confirm")
      }}</Button>
      <Button @click="handleSendAgain" size="sm">{{
        sending ? $t("sending") : $t("sendAgain")
      }}</Button>
    </div>
    <div v-else>
      <Button
        size="sm"
        variation="primary"
        @click="
          () => {
            if (fireUser == null) {
              authStore.verificationSent = false;
            }
            error = null;
          }
        "
        >{{ $t("tryAgain") }}</Button
      >
    </div>
  </div>
</template>
