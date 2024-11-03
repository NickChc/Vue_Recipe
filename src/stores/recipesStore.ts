import { defineStore } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
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
  highRating: boolean;
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

  const savedFilters = ref<TFilters>({
    diets: [],
    categories: [],
    cookingTime: null,
    complexity: null,
    highRating: false,
  });

  const filters = ref<TFilters>(savedFilters.value);

  const filteringBy = ref<null | TCurrFilter>(null);

  const filtersToSave = computed(() => {
    return JSON.stringify(filters.value) !== JSON.stringify(savedFilters.value);
  });

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

  function setFilteringBy(filter: TCurrFilter | null) {
    if (filteringBy.value === filter) {
      filteringBy.value = null;
    } else {
      filteringBy.value = filter;
    }
  }

  function saveFilters() {
    savedFilters.value = filters.value;

    const { cookingTime, diets, highRating, categories, complexity } =
      filters.value;

    const params = new URLSearchParams();

    if (cookingTime != null) {
      params.append("cooking_time", cookingTime);
    }

    if (complexity != null) {
      params.append("complexity", complexity);
    }

    if (highRating) {
      params.append("high_rating", "true");
    }

    diets.forEach((d) => params.append("diet", d));

    categories.forEach((c) => params.append("category", c));

    return params;
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

  watch(savedFilters, () => {
    getRecipes();
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
    filtersToSave,
    setFilters,
    saveFilters,
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
