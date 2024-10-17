import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import { TRecipe } from "@/@types/general";
import { useGlobalStore } from "@/stores/globalStore";
import { useGetRecipes } from "@/composables/useGetRecipes";
import { useTopRatedRecipes } from "@/composables/useTopRatedRecipes";
import { useNewestRecipes } from "@/composables/useNewestRecipes";
import { useGetUserRecipes } from "@/composables/useGetUserRecipes";
import { useAuthStore } from "./authStore";

interface TFetchRecipesState {
  loading: boolean;
  error: null | string;
  recipes: TRecipe[];
}

export const useRecipesStore = defineStore("recipes", () => {
  const recipes = ref<TRecipe[]>([]);
  const recipesLoading = ref(false);
  const recipesError = ref<null | string>(null);

  const topRatedRecipesState = ref<TFetchRecipesState>({
    loading: false,
    error: null,
    recipes: [],
  });

  const newestRecipesState = ref<TFetchRecipesState>({
    loading: false,
    error: null,
    recipes: [],
  });

  const currUserRecipes = ref<TRecipe[]>([]);

  const deleteRecipe = ref<TRecipe | null>(null);
  const deletingRecipe = ref(false);

  const globalStore = useGlobalStore();
  const authStore = useAuthStore();

  const { getRecipes } = useGetRecipes();
  const { getTopRatedRecipes } = useTopRatedRecipes();
  const { getNewestRecipes } = useNewestRecipes();
  const { handleGetUserRecipes } = useGetUserRecipes();

  async function fetchRecipeData() {
    getRecipes();
    getTopRatedRecipes();
    getNewestRecipes();
    if (authStore.currentUser) {
      handleGetUserRecipes();
    }
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

  function setRecipesLoading(newValue: boolean) {
    recipesLoading.value = newValue;
  }

  function setRecipesError(newValue: string | null) {
    recipesError.value = newValue;
  }

  function setTopRatedRecipesState(newState: Partial<TFetchRecipesState>) {
    topRatedRecipesState.value = { ...topRatedRecipesState.value, ...newState };
  }

  function setNewestRecipesState(newState: Partial<TFetchRecipesState>) {
    newestRecipesState.value = { ...newestRecipesState.value, ...newState };
  }

  function setCurrUserRecipes(recipes: TRecipe[]) {
    currUserRecipes.value = recipes;
  }

  onMounted(() => {
    fetchRecipeData();
  });

  return {
    recipes,
    deleteRecipe,
    recipesLoading,
    recipesError,
    topRatedRecipesState,
    newestRecipesState,
    deletingRecipe,
    currUserRecipes,
    setCurrUserRecipes,
    setNewestRecipesState,
    setRecipes,
    setDeleteRecipe,
    startDeleteRecipe,
    setRecipesLoading,
    setRecipesError,
    fetchRecipeData,
    setTopRatedRecipesState,
  };
});
