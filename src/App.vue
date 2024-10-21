<script setup lang="ts">
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { PROTECTED_ROUTES } from "@/router";
import Modal from "@/components/Modal.vue";
import { useRecipesStore } from "@/stores/recipesStore";
import AssurePopup from "@/components/AssurePopup.vue";
import { useGlobalStore } from "@/stores/globalStore";
import { useDeleteRecipe } from "@/composables/useDeleteRecipe";
import DeleteAccPopup from "@/components/profile/DeleteAccPopup.vue";

const route = useRoute();
const router = useRouter();

const globalStore = useGlobalStore();
const authStore = useAuthStore();
const recipesStore = useRecipesStore();

const { handleDeleteRecipe, loading: deletingRecipe } = useDeleteRecipe();

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
  <Modal @close-modal="globalStore.closeModal">
    <AssurePopup
      v-if="recipesStore.deleteRecipe"
      :title="recipesStore.deleteRecipe.title"
      :recipe="recipesStore.deleteRecipe"
      :loading="deletingRecipe"
      @on-decline="globalStore.closeModal"
      @on-confirm="handleDeleteRecipe"
      >{{ $t("sureToDeleteRecipe") }}</AssurePopup
    >

    <DeleteAccPopup v-else-if="authStore.isDeletingAcc" />
  </Modal>
  <RouterView />
</template>
