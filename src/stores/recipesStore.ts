import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import {
  TCategory_Enum,
  TComplexity_Enum,
  TCookingTime_Enum,
  TDiet_Enum,
  TRecipe,
} from "@/@types/general";
import { useGlobalStore } from "@/stores/globalStore";
import { useGetRecipes } from "@/composables/useGetRecipes";
import { useTopRatedRecipes } from "@/composables/useTopRatedRecipes";
import { useNewestRecipes } from "@/composables/useNewestRecipes";
import { useGetUserRecipes } from "@/composables/useGetUserRecipes";
import { useAuthStore } from "@/stores/authStore";

interface TFetchRecipesState {
  loading: boolean;
  error: null | string;
  recipes: TRecipe[];
}

interface TFilters {
  diets: TDiet_Enum[];
  categories: TCategory_Enum[];
  cookingTime: TCookingTime_Enum | null;
  complexity: TComplexity_Enum | null;
}

type TCurrFilter =
  | "diets"
  | "category"
  | "cooking_time"
  | "complexity"
  | "rating";

export const useRecipesStore = defineStore("recipes", () => {
  const recipes = ref<TRecipe[]>([]);
  const recipesLoading = ref(false);
  const recipesError = ref<null | string>(null);

  const filters = ref<TFilters>({
    diets: [],
    categories: [],
    cookingTime: null,
    complexity: null,
  });

  const filteringBy = ref<null | TCurrFilter>(null);

  function setFilteringBy(filter: TCurrFilter | null) {
    if (filteringBy.value === filter) {
      filteringBy.value = null;
    } else {
      filteringBy.value = filter;
    }
  }

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

  function setFilters(newFilters: TFilters) {
    filters.value = newFilters;
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
    filters,
    filteringBy,
    setFilters,
    setFilteringBy,
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
