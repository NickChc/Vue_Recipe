import { defineStore } from "pinia";
import { ref } from "vue";
import { TRecipe } from "@/@types/general";
import { useGlobalStore } from "@/stores/globalStore";

export const useRecipesStore = defineStore("recipes", () => {
  const recipes = ref<TRecipe[]>([]);
  const topRatedRecipes = ref<TRecipe[]>([]);
  const newestRecipes = ref<TRecipe[]>([]);

  const deleteRecipe = ref<TRecipe | null>(null);

  const globalStore = useGlobalStore();

  function setTopRatedRecipes(recipes: TRecipe[]) {
    topRatedRecipes.value = recipes;
  }

  function setNewestRecipes(newRecipes: TRecipe[]) {
    newestRecipes.value = newRecipes;
  }

  function setRecipes(newRecipes: TRecipe[]) {
    recipes.value = newRecipes;
  }

  function setDeleteRecipe(newValue: TRecipe | null) {
    deleteRecipe.value = newValue;
  }

  function startDeleteRecipe(recipe: TRecipe) {
    deleteRecipe.value = recipe;
    globalStore.toggleModal();
  }

  return {
    recipes,
    topRatedRecipes,
    newestRecipes,
    deleteRecipe,
    setTopRatedRecipes,
    setNewestRecipes,
    setRecipes,
    setDeleteRecipe,
    startDeleteRecipe,
  };
});
