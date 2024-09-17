import { TRecipe } from "@/@types/general";
import { recipesCollection } from "@/firebase";
import { useRecipesStore } from "@/stores/recipesStore";
import { getDocs, limit, orderBy, query } from "firebase/firestore";
import { ref } from "vue";

export function useTopRatedRecipes() {
  const recipesStore = useRecipesStore();
  const loading = ref<boolean>(false);
  const error = ref<null | string>(null);

  async function getTopRatedRecipes() {
    try {
      error.value = null;
      loading.value = true;

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

      recipesStore.setTopRatedRecipes(data);
    } catch (err: any) {
      console.log(err.message);
      error.value = "Couldn't get top rated recipes";
    } finally {
      loading.value = false;
    }
  }

  return { getTopRatedRecipes, loading, error };
}
