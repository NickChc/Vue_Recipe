<script setup lang="ts">
import { useThemeStore } from "@/stores/themeStore";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

function toggleTheme() {
  themeStore.toggle();
}
</script>

<template>
  <button
    class="bg-primary text-secondary dark:bg-secondary dark:text-primary grid p-1 rounded-full"
    @click="toggleTheme"
  >
    <i v-if="isDark" class="material-symbols-outlined">light_mode</i>
    <i v-else class="material-symbols-outlined">dark_mode</i>
  </button>
</template>
