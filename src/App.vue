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

const route = useRoute();
const router = useRouter();

const globalStore = useGlobalStore();
const authStore = useAuthStore();
const recipesStore = useRecipesStore();

const { handleDeleteRecipe, loading: deletingRecipe } = useDeleteRecipe();

function closeModal() {
  globalStore.toggleModal();
  recipesStore.setDeleteRecipe(null);
  authStore.setIsDeletingAcc(false);
}

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
  <Modal @close-modal="closeModal">
    <AssurePopup
      v-if="recipesStore.deleteRecipe"
      :title="recipesStore.deleteRecipe.title"
      :recipe="recipesStore.deleteRecipe"
      :loading="deletingRecipe"
      @on-decline="closeModal"
      @on-confirm="handleDeleteRecipe"
      >{{ $t("sureToDeleteRecipe") }}</AssurePopup
    >

    <!-- TODO : finish delete account -->
    <AssurePopup
      v-else-if="authStore.isDeletingAcc"
      @on-confirm="console.log('CONFIRMED')"
      @on-decline="closeModal"
      :title="$t('deleteAccount')"
      type="danger"
    >
      {{ $t("assureDeleteAcc") }}
    </AssurePopup>
  </Modal>
  <RouterView />
</template>
