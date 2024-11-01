import { storeToRefs } from "pinia";
import { getDocs, query, QueryConstraint, where } from "firebase/firestore";
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

      const { categories, diets, complexity, cookingTime, highRating } =
        recipesStore.filters;

      const queryRules: QueryConstraint[] = [];

      if (diets.length > 0) {
        queryRules.push(where("diet", "array-contains-any", diets));
      }

      if (categories.length > 0) {
        queryRules.push(where("category", "array-contains-any", categories));
      }

      if (complexity != null) {
        queryRules.push(where("complexity", "==", complexity));
      }

      if (cookingTime != null) {
        queryRules.push(where("cooking_time", "==", cookingTime));
      }

      if (highRating) {
        queryRules.push(where("rating", ">=", 75));
      }

      const recipesQuery = query(recipesCollection, ...queryRules);

      const recipeDocs = await getDocs(recipesQuery);

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
