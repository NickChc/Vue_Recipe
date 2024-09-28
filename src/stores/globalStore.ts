import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalStore = defineStore("globalStore", () => {
  const sideBarOpen = ref(false);

  const modalOpen = ref(false);

  function toggleModal() {
    modalOpen.value = !modalOpen.value;
  }

  function toggleSideBar() {
    sideBarOpen.value = !sideBarOpen.value;
  }

  return { sideBarOpen, toggleSideBar, modalOpen, toggleModal };
});
