import { getDocs, limit, orderBy, query } from "firebase/firestore";
import { TRecipe } from "@/@types/general";
import { recipesCollection } from "@/firebase";
import { useRecipesStore } from "@/stores/recipesStore";
import { wait } from "@/utils/wait";

export function useNewestRecipes() {
  const recipesStore = useRecipesStore();
  async function getNewestRecipes() {
    try {
      recipesStore.setNewestRecipesState({
        error: null,
        loading: !!recipesStore.newestRecipesState.recipes.length
          ? false
          : true,
      });

      await wait(3000);

      const recipesQuery = query(
        recipesCollection,
        orderBy("created_at", "desc"),
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

      recipesStore.setNewestRecipesState({
        recipes: data,
      });
    } catch (err: any) {
      console.log(err.message);
      recipesStore.setNewestRecipesState({
        error: "Couldn't get top rated recipes",
      });
    } finally {
      recipesStore.setNewestRecipesState({
        loading: false,
      });
    }
  }

  return {
    getNewestRecipes,
  };
}
