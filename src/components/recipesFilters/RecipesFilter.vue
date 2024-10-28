<script setup lang="ts">
import DietFilter from "@/components/recipesFilters/DietFilter.vue";
import CategoryFilter from "./CategoryFilter.vue";
</script>

<!-- TODO : Filter recipes by : -->
<!-- DIETS - Multiple -->
<!-- CATEGORY - multiple -->
<!-- COOKING TIME - single -->
<!-- HARDNESS - single -->
<!-- RATING - single -->

<template>
  <h4 class="font-bold text-center px-3 text-sm mt-2">
    {{ $t("filterRecipes").toLocaleUpperCase() }}
  </h4>

  <hr class="border-secondary dark:border-primary my-1 w-[90%] mx-auto" />

  <div class="flex flex-col items-center mx-3">
    <DietFilter />

    <hr class="border-add-2 w-[90%] mx-auto my-1" />

    <CategoryFilter />

    <hr class="border-add-2 w-[90%] mx-auto my-2" />
  </div>
</template>
