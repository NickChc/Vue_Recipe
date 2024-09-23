<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { watch } from "vue";
import { PROTECTED_ROUTES } from "./router";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

watch(route, ({ fullPath }) => {
  const fireUser = authStore.fireUser;
  if (fireUser == null || fireUser?.emailVerified) return;

  if (fullPath.endsWith("/register")) return;

  router.replace("/register");
  authStore.verificationSent = true;
});

watch(
  () => authStore.currentUser,
  (currUser) => {
    if (!PROTECTED_ROUTES.some((path) => path.endsWith(route.fullPath))) return;

    if (currUser == null && !authStore.loadingAuth) {
      router.replace("/");
    }
  }
);
</script>

<template>
  <RouterView />
</template>
