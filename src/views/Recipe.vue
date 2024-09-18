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
  <div class="w-[80%] mx-auto overflow-hidden">
    <div v-if="loading">LOADING...</div>
    <RecipeCard v-else-if="currentRecipe" :recipe="currentRecipe" />
    <div v-else-if="error">{{ error }}</div>
  </div>
</template>
