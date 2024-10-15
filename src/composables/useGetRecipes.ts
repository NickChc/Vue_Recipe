import { storeToRefs } from "pinia";
import { getDocs } from "firebase/firestore";
import { TRecipe } from "@/@types/general";
import { recipesCollection } from "@/firebase";
import { useRecipesStore } from "@/stores/recipesStore";

export function useGetRecipes() {
  const recipesStore = useRecipesStore();
  const { recipes, recipesLoading, recipesError } = storeToRefs(recipesStore);

  async function getRecipes() {
    try {
      if (recipesStore.recipes.length === 0) {
        recipesStore.setRecipesLoading(true);
      }
      recipesStore.setRecipesError(null);

      const recipeDocs = await getDocs(recipesCollection);

      const data: TRecipe[] = recipeDocs.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as TRecipe;
      });

      recipesStore.setRecipes(data);
    } catch (err: any) {
      console.log(err.message);
      recipesStore.setRecipesError("Couldn't fetch recipes");
    } finally {
      recipesStore.setRecipesLoading(false);
    }
  }

  return { getRecipes, recipes, loading: recipesLoading, error: recipesError };
}
