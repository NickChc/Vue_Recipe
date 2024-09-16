<script setup lang="ts">
import { useGlobalStore } from "@/stores/globalStore";
import { storeToRefs } from "pinia";
import SideBarThemeToggle from "@/components/SideBar/SideBarThemeToggle.vue";
import { onBeforeUnmount, onMounted, watch } from "vue";
import SideBarLangSelect from "@/components/SideBar/SideBarLangSelect.vue";

const globalStore = useGlobalStore();
const { sideBarOpen } = storeToRefs(globalStore);

function handleResize() {
  sideBarOpen.value = false;
}

watch(sideBarOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.right = "0";
    document.body.style.left = "0";
    document.body.style.top = "0";
    document.body.style.bottom = "0";
  } else {
    document.body.style.overflow = "auto";
    document.body.style.position = "";
  }
});

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div
    :class="`bg overflow-hidden  border-r-2 border-add p-3 h-full sm:hidden fixed top-0 bottom-0 z-50 duration-500 transition-all ease-in w-[calc(100vw-var(--width-sidebar-btn))] text-add ${
      sideBarOpen ? 'left-0 opacity-100' : '-left-full opacity-0'
    }`"
  >
    <h2 class="text-2xl font-semibold">Menu</h2>
    <ul
      class="list-none flex flex-col gap-y-3 mt-8 w-fit mx-auto max-h-[90%] overflow-x-hidden overflow-y-auto"
    >
      <li>
        <SideBarThemeToggle />
      </li>
      <hr class="border border-secondary dark:border-primary" />
      <li>
        <SideBarLangSelect />
      </li>
    </ul>
  </div>
</template>
