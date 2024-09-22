<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { watch } from "vue";

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
</script>

<template>
  <RouterView />
</template>
