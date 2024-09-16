<script setup lang="ts">
import { useGlobalStore } from "@/stores/globalStore";

const globalStore = useGlobalStore();
</script>

<template>
  <button
    class="grid sm:hidden w-sidebar-btn text-primary"
    @click="globalStore.toggleSideBar"
  >
    <i
      class="material-symbols-outlined"
      :class="{ 'text-add-2': globalStore.sideBarOpen }"
      :style="{ fontSize: '1.8rem' }"
      >menu</i
    >
  </button>
  <div class="border border-add-2 h-6 mx-2 sm:hidden"></div>
</template>
