<script setup lang="ts">
import { useRecipesStore } from "@/stores/recipesStore";
import { computed } from "vue";

const recipesStore = useRecipesStore();

const isChecked = computed({
  get: () => recipesStore.filters.highRating,
  set: (value: boolean) =>
    recipesStore.setFilters({ ...recipesStore.filters, highRating: value }),
});
</script>

<template>
  <button
    @click="isChecked = !isChecked"
    :class="`flex items-center justify-between w-full px-3 gap-x-2 ${
      isChecked ? 'text-add' : ''
    }`"
  >
    <p class="whitespace-nowrap font-semibold text-sm sm:text-base">
      {{ $t("highRated") }}
    </p>
    <input type="checkbox" v-model="isChecked" class="w-4 h-4 cursor-pointer" />
  </button>
</template>
