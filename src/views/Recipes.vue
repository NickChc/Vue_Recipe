<script setup lang="ts">
import HeaderImage from "@/components/HeaderImage.vue";
import RecipeCard from "@/components/Recipes/RecipeCard.vue";
import RecipeCardSkeleton from "@/components/Recipes/RecipeCardSkeleton.vue";
import { useGetRecipes } from "@/composables/useGetRecipes";

const { recipes, loading } = useGetRecipes();
</script>

<template>
  <HeaderImage />
  <div
    class="sm:w-[80%] p-3 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 my-9"
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
</template>
