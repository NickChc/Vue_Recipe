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
  <button @click="toggleTheme">{{ isDark ? "SUN" : "MOON" }}</button>
</template>
