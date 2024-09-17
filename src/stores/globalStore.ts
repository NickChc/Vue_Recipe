import { defineStore } from "pinia";
import { onBeforeUnmount, onMounted, ref } from "vue";

export const useGlobalStore = defineStore("globalStore", () => {
  const sideBarOpen = ref(false);
  const hasMouse = ref(false);

  function toggleSideBar() {
    sideBarOpen.value = !sideBarOpen.value;
  }

  function checkMouse() {
    hasMouse.value = true;
  }

  onMounted(() => {
    document.addEventListener("mousemove", checkMouse);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("mousemove", checkMouse);
  });

  return { sideBarOpen, toggleSideBar, hasMouse };
});
