import { TRecipe } from "@/@types/general";
import { getRecipeById } from "@/data/getRecipeById";
import { onMounted, ref } from "vue";

export function useGetCurrentRecipe(recipeId: string) {
  const currentRecipe = ref<TRecipe | null>(null);
  const loading = ref(false);
  const error = ref<null | string>(null);

  async function handleGetRecipeById(recipeId: string) {
    try {
      error.value = null;
      loading.value = true;

      const recipe = await getRecipeById(recipeId);

      currentRecipe.value = recipe;
    } catch (err: any) {
      console.log(err.message);
      error.value = `Couldn't fetch the recipe with ID - ${recipeId}`;
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    handleGetRecipeById(recipeId);
  });

  return { currentRecipe, error, loading, handleGetRecipeById };
}
