<script setup lang="ts">
import Button from "@/components/Button.vue";
import { auth, googleProvider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";
import GoogleIcon from "@/assets/images/GoogleIconImage.webp";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { createUserDoc } from "@/data/createUserDoc";
import { getUserById } from "@/data/getUserById";

const loading = ref(false);

const router = useRouter();
const authStore = useAuthStore();

async function handleGoogleSignIn() {
  try {
    loading.value = true;
    const res = await signInWithPopup(auth, googleProvider);
    const existingUser = await getUserById(res.user.uid);

    if (existingUser == null && auth.currentUser) {
      await createUserDoc(
        auth.currentUser,
        res.user.displayName!,
        res.user.email!
      );

      const newUser = await getUserById(auth.currentUser.uid);
      authStore.setCurrentUser(newUser);
    }
    router.replace("/");
  } catch (err: any) {
    console.log(err.message);
  } finally {
    setTimeout(() => {
      loading.value = false;
    }, 2000);
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
      {{ $t("signInWithGoogle") }}
      <img :src="GoogleIcon" alt="google icon" class="size-7 sm:size-8" />
    </div>
  </Button>
</template>
