import { getDocs, limit, orderBy, query } from "firebase/firestore";
import { TRecipe } from "@/@types/general";
import { recipesCollection } from "@/firebase";
import { useRecipesStore } from "@/stores/recipesStore";

export function useTopRatedRecipes() {
  const recipesStore = useRecipesStore();

  async function getTopRatedRecipes() {
    try {
      recipesStore.setTopRatedRecipesState({
        error: null,
        loading:
          recipesStore.topRatedRecipesState.recipes.length > 0 ? false : true,
      });

      const recipesQuery = query(
        recipesCollection,
        orderBy("rating", "desc"),
        limit(4)
      );

      const recipeDocs = await getDocs(recipesQuery);

      const data: TRecipe[] = recipeDocs.docs.map((doc) => {
        const docData = doc.data();

        return {
          id: doc.id,
          ...docData,
        } as TRecipe;
      });

      recipesStore.setTopRatedRecipesState({ recipes: data });
    } catch (err: any) {
      console.log(err.message);
      recipesStore.setTopRatedRecipesState({
        error: "Couldn't get top rated recipes",
      });
    } finally {
      recipesStore.setTopRatedRecipesState({
        loading: false,
      });
    }
  }

  return {
    getTopRatedRecipes,
  };
}
