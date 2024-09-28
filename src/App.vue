<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { watch } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { PROTECTED_ROUTES } from "@/router";
import Modal from "@/components/Modal.vue";
import AssurePopup from "@/components/AssurePopup.vue";
import { useRecipesStore } from "./stores/recipesStore";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const recipesStore = useRecipesStore();

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
  <Modal>
    <AssurePopup
      v-if="recipesStore.deleteRecipe"
      :recipe="recipesStore.deleteRecipe"
    />
  </Modal>
  <RouterView />
</template>
