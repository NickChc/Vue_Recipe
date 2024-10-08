import { TUser } from "@/@types/general";
import { EMAIL_CONFIRM_ATTEMPTS } from "@/config/storageKeys";
import { createUserDoc } from "@/data/createUserDoc";
import { auth, db } from "@/firebase";
import { useAuthStore } from "@/stores/authStore";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { storeToRefs } from "pinia";
import { Ref, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export function useEmailConfirmation(cancelPassword: Ref<string>) {
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

    const newUser = await createUserDoc(fireUser.value, displayName!, email!);
    authStore.setCurrentUser({ ...newUser, id: fireUser.value.uid });

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

  return {
    confirmVerified,
    handleCancel,
    handleSendAgain,
    submitCancel,
    isCancelling,
    cancelError,
    sending,
    error,
  };
}
