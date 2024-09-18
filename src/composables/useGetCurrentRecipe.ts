import { TRecipe } from "@/@types/general";
import { db, recipesCollection } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onMounted, ref } from "vue";
import { ref as firebaseRef } from "firebase/database";

export function useGetCurrentRecipe(recipeId: string) {
  const currentRecipe = ref<TRecipe | null>(null);
  const loading = ref(false);
  const error = ref<null | string>(null);

  async function getRecipeById(recipeId: string) {
    try {
      error.value = null;
      loading.value = true;

      const docRef = doc(db, "recipes", recipeId);

      const recipe = await getDoc(docRef);

      const data = recipe.data();

      if (data == null) {
        throw new Error("recipe is missing");
      }

      currentRecipe.value = { id: recipe.id, ...recipe.data() } as TRecipe;
    } catch (err: any) {
      console.log(err.message);
      error.value = `Couldn't fetch the product with ID - ${recipeId}`;
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    getRecipeById(recipeId);
  });

  return { currentRecipe, error, loading, getRecipeById };
}
