<script setup lang="ts">
import { useThemeStore } from "@/stores/themeStore";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

function toggleTheme() {
  themeStore.toggleTheme();
}
</script>

<template>
  <button
    class="text-add hidden sm:grid bg-primary dark:bg-secondary dark:text-primary p-1 rounded-full"
    @click="toggleTheme"
  >
    <i
      :style="{ color: 'var(--clr-add)' }"
      v-if="isDark"
      class="material-symbols-outlined"
      >light_mode</i
    >
    <i
      :style="{ color: 'var(--clr-add)' }"
      v-else
      class="material-symbols-outlined"
      >dark_mode</i
    >
  </button>
</template>
