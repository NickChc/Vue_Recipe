<script setup lang="ts">
import Button from "@/components/Button.vue";
import { auth, googleProvider } from "@/firebase";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import GoogleIcon from "@/assets/images/GoogleIconImage.webp";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { createUserDoc } from "@/data/createUserDoc";
import { getUserById } from "@/data/getUserById";
import { sendToast } from "@/utils/sendToast";
import { useI18n } from "vue-i18n";

const loading = ref(false);

const router = useRouter();
const authStore = useAuthStore();

const { t } = useI18n();

async function handleGoogleSignIn() {
  try {
    loading.value = true;
    let res;
    const { userAgent } = window.navigator;
    if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      res = await signInWithRedirect(auth, googleProvider);
    } else {
      res = await signInWithPopup(auth, googleProvider);
    }

    const existingUser = await getUserById(res.user.uid);

    if (existingUser == null && auth.currentUser) {
      await createUserDoc(
        auth.currentUser,
        res.user.displayName!,
        res.user.email!
      );

      authStore.resetCurrUser();
    }
    router.replace("/");
  } catch (err: any) {
    console.log(err.message);
    sendToast("error", t("failedToAuth"));
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <Button
    :disabled="loading"
    class="bg-primary"
    color="add"
    type="button"
    @click="handleGoogleSignIn"
  >
    <div class="flex items-center justify-center gap-x-2">
      {{ $t("signInWithGoogle").toLocaleUpperCase() }}
      <img :src="GoogleIcon" alt="google icon" class="size-7 sm:size-8" />
    </div>
  </Button>
</template>
