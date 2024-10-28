<script setup lang="ts">
import HeaderImage from "@/components/HeaderImage.vue";
import RecipeCard from "@/components/recipes/RecipeCard.vue";
import RecipeCardSkeleton from "@/components/recipes/RecipeCardSkeleton.vue";
import { useGetRecipes } from "@/composables/useGetRecipes";
import RecipesFilter from "@/components/recipesFilters/RecipesFilter.vue";

const { recipes, loading } = useGetRecipes();
</script>

<template>
  <HeaderImage />

  <div class="flex flex-col sm:flex-row">
    <div class="bg-add-2 pt-3 pb-6 px-1 xs:px-2 sm:relative">
      <div class="sm:sticky sm:top-0 sm:inset-x-0">
        <RecipesFilter />
      </div>
    </div>

    <div
      class="sm:w-[75%] md:w-full p-3 mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-8 mb-9"
    >
      <template v-if="loading">
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
      </template>

      <RecipeCard
        v-else
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>
