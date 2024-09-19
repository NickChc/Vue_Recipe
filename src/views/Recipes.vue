<script setup lang="ts">
import HeaderImage from "@/components/HeaderImage.vue";
import RecipeCard from "@/components/Recipes/RecipeCard.vue";
import { useGetRecipes } from "@/composables/useGetRecipes";

const { recipes } = useGetRecipes();
</script>

<template>
  <HeaderImage />
  <div
    class="sm:w-[80%] p-3 mx-auto grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-8 my-9"
  >
    <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
  </div>
</template>
