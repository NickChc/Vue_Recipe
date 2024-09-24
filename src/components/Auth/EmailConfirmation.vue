<script setup lang="ts">
import { TUser } from "@/@types/general";
import Button from "@/components/Button.vue";
import { EMAIL_CONFIRM_ATTEMPTS } from "@/config/storageKeys";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import FormError from "./FormError.vue";

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
const isCancelling = ref(false);
const cancelPassword = ref("");
const cancelError = ref<null | string>(null);

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

  const { displayName, email } = fireUser.value;

  const userDocRef = doc(db, "users", fireUser.value.uid);

  const newUser: Omit<TUser, "id"> = {
    name: displayName!,
    email: email!,
    rating: 0,
    subscribers: [],
    subscriptions: [],
    recipes: [],
  };

  await setDoc(userDocRef, newUser);
  authStore.setCurrentUser({ ...newUser, id: fireUser.value.uid });
  console.log(newUser);

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

async function handleCancel() {
  await auth.currentUser?.reload();
  try {
    if (auth.currentUser) {
      await auth.currentUser?.delete();

      authStore.verificationSent = false;
    } else {
      authStore.verificationSent = false;
    }
  } catch (err: any) {
    console.log(err.message);
    if (err.message.includes("requires-recent")) {
      isCancelling.value = true;
      error.value = t("tryAgainLater");
    }
  }
}

async function submitCancel() {
  try {
    cancelError.value = null;
    if (auth.currentUser?.email == null) return;

    await signInWithEmailAndPassword(
      auth,
      auth.currentUser.email,
      cancelPassword.value
    );
    await auth.currentUser.delete();
    authStore.verificationSent = false;
  } catch (err: any) {
    cancelError.value = t("invalidPassword");
  }
}

// TODO : devide this into seperate components

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

    if (err.message.includes("token-expired")) {
      error.value = t("verificationExpired");
    }
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <div
    class="bg-add-2 border-2 border-add rounded-sm flex flex-col sm:flex-row sm:gap-x-3 items-center justify-between text-add p-2 text-center sm:text-start w-[700px] max-w-full mx-auto md:text-lg xl:text-xl"
  >
    <div v-if="isCancelling" class="flex flex-col">
      <p>{{ $t("authCancelText") }}</p>
      <form
        @submit.prevent="submitCancel"
        class="flex items-stretch justify-center mt-3 gap-x-3 py-3"
      >
        <input
          class="rounded-sm p-2 outline-add"
          placeholder="Password"
          name="password"
          type="password"
          v-model="cancelPassword"
        />

        <Button variation="outlined" color="add" size="sm" type="submit">
          {{ $t("cancel") }}
        </Button>
      </form>
      <FormError
        v-if="cancelError"
        :error="cancelError"
        @clear-error="cancelError = null"
      />
    </div>

    <p v-else-if="error == null">
      {{ $t("verificationSent", { email: fireUser?.email }) }}
    </p>

    <p v-else class="p-1 text-danger-dark dark:text-danger-dark">{{ error }}</p>

    <div
      v-if="error == null && !isCancelling"
      class="text-sm grid grid-cols-1 xs:text-base sm:w-auto sm:min-w-fit gap-y-3 w-full gap-x-3 mt-3 sm:mt-0"
    >
      <Button @click="confirmVerified" variation="primary" size="sm">{{
        $t("confirm")
      }}</Button>
      <Button @click="handleSendAgain" size="sm">{{
        sending ? $t("sending") : $t("sendAgain")
      }}</Button>

      <Button @click="handleCancel" variation="danger" size="sm">{{
        $t("cancel")
      }}</Button>
    </div>
    <div v-else-if="!isCancelling">
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
