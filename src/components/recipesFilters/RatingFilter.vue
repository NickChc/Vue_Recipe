<script setup lang="ts">
import { useRecipesStore } from "@/stores/recipesStore";

const recipesStore = useRecipesStore();
</script>

<template>
  <div class="flex items-center justify-between w-full px-3 gap-x-2">
    <p class="whitespace-nowrap font-semibold text-sm">{{ $t("highRated") }}</p>
    <input
      type="checkbox"
      v-model="recipesStore.filters.highRating"
      class="w-4 h-4"
    />
  </div>
</template>
