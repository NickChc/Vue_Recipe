<script setup lang="ts">
import { useThemeStore } from "@/stores/themeStore";

const themeStore = useThemeStore();

function handleToggle() {
  themeStore.toggleTheme();
}
</script>

<template>
  <div
    class="flex items-center justify-between gap-x-6 text-sm xs:text-lg whitespace-nowrap"
  >
    {{ $t("theme") }}

    <div class="flex items-center gap-x-2 font-semibold">
      <i :style="{ fontSize: '1.2rem' }" class="material-symbols-outlined"
        >light_mode</i
      >
      <button class="flex items-center gap-x-2" @click="handleToggle">
        <div
          class="flex relative items-center bg-add p-0.5 h-5 w-9 rounded-xl after:content-[''] after:block after:w-4 after:h-4 after:bg-secondary after:rounded-full after:duration-300 after:absolute after:top-1/2 after:-translate-y-1/2 dark:after:translate-x-4 ease transition-transform dark:after:bg-primary"
        ></div>
      </button>
      <i :style="{ fontSize: '1.2rem' }" class="material-symbols-outlined"
        >dark_mode</i
      >
    </div>
  </div>
</template>
