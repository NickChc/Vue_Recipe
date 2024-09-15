import { defineStore } from "pinia";
import { ref } from "vue";

export const useGlobalStore = defineStore("globalStore", () => {
  const sideBarOpen = ref(false);

  function toggleSideBar() {
    sideBarOpen.value = !sideBarOpen.value;
  }

  return { sideBarOpen, toggleSideBar };
});
