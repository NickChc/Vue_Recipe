<script setup lang="ts">
import RecipeCard from "@/components/Recipes/RecipeCard.vue";
import { useGetCurrentRecipe } from "@/composables/useGetCurrentRecipe";

interface RecipePageProps {
  recipeId: string;
}

const { recipeId } = defineProps<RecipePageProps>();

const { currentRecipe, loading, error } = useGetCurrentRecipe(recipeId);
</script>

<template>
  <div class="sm:w-[80%] h-full mx-auto overflow-x-hidden">
    <div v-if="loading">LOADING...</div>
    <RecipeCard v-else-if="currentRecipe" :recipe="currentRecipe" isMore />
    <div v-else-if="error">{{ error }}</div>
  </div>
</template>
