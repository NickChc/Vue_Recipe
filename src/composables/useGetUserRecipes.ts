import { ref } from "vue";
import { getRecipesByUserId } from "@/data/getRecipesByUserId";
import { useAuthStore } from "@/stores/authStore";
import { useRecipesStore } from "@/stores/recipesStore";
import { storeToRefs } from "pinia";

export function useGetUserRecipes() {
  const authStore = useAuthStore();
  const recipesStore = useRecipesStore();
  const { currUserRecipes } = storeToRefs(recipesStore);

  // const userRecipes = ref<TRecipe[]>([]);
  const loading = ref(false);
  const error = ref<null | string>(null);

  async function handleGetUserRecipes() {
    const userId = authStore.currentUser?.id;

    try {
      if (userId == null) return;

      error.value = null;
      loading.value = true;

      const data = await getRecipesByUserId(userId);

      recipesStore.setCurrUserRecipes(data);
    } catch (err: any) {
      console.log(err.message);
      error.value = "failedToGetYourRecipes";
    } finally {
      loading.value = false;
    }
  }

  return {
    currUserRecipes,
    loading,
    error,
    handleGetUserRecipes,
  };
}
