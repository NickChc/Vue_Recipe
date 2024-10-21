import { defineStore } from "pinia";
import { ref } from "vue";
import { useRecipesStore } from "@/stores/recipesStore";
import { useAuthStore } from "@/stores/authStore";

export const useGlobalStore = defineStore("globalStore", () => {
  const sideBarOpen = ref(false);

  const modalOpen = ref(false);

  const recipesStore = useRecipesStore();
  const authStore = useAuthStore();

  function toggleModal() {
    modalOpen.value = !modalOpen.value;
  }

  function toggleSideBar() {
    sideBarOpen.value = !sideBarOpen.value;
  }

  function closeModal() {
    toggleModal();
    recipesStore.setDeleteRecipe(null);
    authStore.setIsDeletingAcc(false);
  }

  return { sideBarOpen, toggleSideBar, modalOpen, toggleModal, closeModal };
});
