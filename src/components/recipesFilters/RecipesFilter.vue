<script setup lang="ts">
import DietFilter from "@/components/recipesFilters/DietFilter.vue";
import CategoryFilter from "@/components/recipesFilters/CategoryFilter.vue";
import CookingTimeFilter from "@/components/recipesFilters/CookingTimeFilter.vue";
import ComplexityFilter from "@/components/recipesFilters/ComplexityFilter.vue";
import RatingFilter from "@/components/recipesFilters/RatingFilter.vue";
</script>

<!-- TODO : Filter recipes by : -->
<!-- DIETS - Multiple -->
<!-- CATEGORY - multiple -->
<!-- COOKING TIME - single -->
<!-- HARDNESS - single -->
<!-- RATING - single -->

<template>
  <div class="text-primary">
    <h4 class="font-bold text-center px-3 text-sm xs:text-base mt-2">
      {{ $t("filterRecipes").toLocaleUpperCase() }}
    </h4>

    <div
      class="flex flex-col sm:gap-y-1 items-center mx-3 max-w-[400px] mx-auto"
    >
      <hr class="border-primary dark:border-primary my-1 w-[95%] mx-auto" />

      <DietFilter />

      <hr class="border-primary w-[95%] mx-auto my-1" />

      <CategoryFilter />

      <hr class="border-primary w-[95%] mx-auto my-1" />

      <CookingTimeFilter />

      <hr class="border-primary w-[95%] mx-auto my-1" />

      <ComplexityFilter />

      <hr class="border-primary w-[95%] mx-auto my-1" />

      <RatingFilter />
    </div>
  </div>
</template>
