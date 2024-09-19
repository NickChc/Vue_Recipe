import { TRecipe } from "@/@types/general";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useRecipesStore = defineStore("recipes", () => {
  const recipes = ref<TRecipe[]>([]);
  const topRatedRecipes = ref<TRecipe[]>([]);
  const newestRecipes = ref<TRecipe[]>([]);

  function setTopRatedRecipes(recipes: TRecipe[]) {
    topRatedRecipes.value = recipes;
  }

  function setNewestRecipes(newRecipes: TRecipe[]) {
    newestRecipes.value = newRecipes;
  }

  function setRecipes(newRecipes: TRecipe[]) {
    recipes.value = newRecipes;
  }

  return {
    recipes,
    topRatedRecipes,
    newestRecipes,
    setTopRatedRecipes,
    setNewestRecipes,
    setRecipes,
  };
});
