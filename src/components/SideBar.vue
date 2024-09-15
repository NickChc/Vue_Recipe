<script setup lang="ts">
import { useGlobalStore } from "@/stores/globalStore";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();
const { sideBarOpen } = storeToRefs(globalStore);
</script>

<template>
  <div
    :class="`bg-blue-500 border-r-2 border-add p-3 h-full sm:hidden fixed top-0 bottom-0 z-50 duration-500 transition-all ease-in w-sidebar ${
      sideBarOpen ? 'left-0 opacity-100' : '-left-full opacity-0'
    }`"
  >
    I am Sidebar
  </div>
</template>
