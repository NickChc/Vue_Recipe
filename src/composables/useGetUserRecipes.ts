import { onMounted, ref } from "vue";
import { TRecipe } from "@/@types/general";
import { getRecipesByUserId } from "@/data/getRecipesByUserId";

export function useGetUserRecipes(userId: string) {
  const userRecipes = ref<TRecipe[]>([]);
  const loading = ref(false);
  const error = ref<null | string>(null);

  async function handleGetUserRecipes(userId: string) {
    try {
      error.value = null;
      loading.value = true;

      const data = await getRecipesByUserId(userId);

      userRecipes.value = data;
    } catch (err: any) {
      console.log(err.message);
      error.value = "failedToGetYourRecipes";
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    handleGetUserRecipes(userId);
  });

  return { userRecipes, loading, error };
}
