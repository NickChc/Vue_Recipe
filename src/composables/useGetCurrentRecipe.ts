import { TRecipe } from "@/@types/general";
import { getRecipeById } from "@/data/getRecipeById";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export function useGetCurrentRecipe() {
  const currentRecipe = ref<TRecipe | null>(null);
  const loading = ref(false);
  const error = ref<null | string>(null);

  const { params } = useRoute();
  const recipeId = Array.isArray(params.recipeId)
    ? params.recipeId[0]
    : params.recipeId || null;

  async function handleGetRecipeById(recipeId: string) {
    try {
      error.value = null;
      loading.value = true;

      const recipe = await getRecipeById(recipeId);

      currentRecipe.value = recipe;
    } catch (err: any) {
      console.log(err.message);
      error.value = "failedToFindRecipe";
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    if (recipeId == null) return;

    handleGetRecipeById(recipeId);
  });

  return { currentRecipe, error, loading, handleGetRecipeById };
}
