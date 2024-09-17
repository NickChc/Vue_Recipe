<script setup lang="ts">
import HeaderImage from "@/components/HeaderImage.vue";
import RecipeCard from "@/components/Recipes/RecipeCard.vue";
import { useTopRatedRecipes } from "@/composables/useTopRatedRecipes";
import { useRecipesStore } from "@/stores/recipesStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const recipesStore = useRecipesStore();
const { topRatedRecipes } = storeToRefs(recipesStore);

const { getTopRatedRecipes, loading: gettingTopRated } = useTopRatedRecipes();

onMounted(() => {
  getTopRatedRecipes();
});
</script>

<template>
  <HeaderImage />
  <div class="h-screen pt-6">
    <div v-if="gettingTopRated">LOADING...</div>
    <div
      v-else-if="topRatedRecipes.length > 0"
      class="w-fill sm:w-[90%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-4 p-3"
    >
      <RecipeCard
        v-for="recipe in topRatedRecipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>
