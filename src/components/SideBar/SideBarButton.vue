<script setup lang="ts">
import { useGlobalStore } from "@/stores/globalStore";

const globalStore = useGlobalStore();
</script>

<template>
  <button
    class="grid sm:hidden w-sidebar-btn text-primary"
    @click="globalStore.toggleSideBar"
  >
    <i class="material-symbols-outlined" :style="{ fontSize: '1.8rem' }"
      >menu</i
    >
  </button>
</template>
