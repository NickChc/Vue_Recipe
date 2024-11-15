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

      const categoryQueryRule = where(
        "category",
        "array-contains-any",
        categories
      );

      /* 
          !!!
           Since firebase allows to check document's array contents with one array at a time only, we have to check if filters contain 2 arrays and if so, fetch two times with different queries, then merge the query results in one array
          !!!        
        */
      if (diets.length > 0) {
        queryRules.push(where("diet", "array-contains-any", diets));
      } else if (categories.length > 0) {
        queryRules.push(categoryQueryRule);
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

      let data: TRecipe[] = recipeDocs.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as TRecipe;
      });

      const dietQueryString = JSON.stringify(
        where("diet", "array-contains-any", diets)
      );

      // Both array query rules are present
      if (categories.length > 0 && diets.length > 0) {
        const newQueryRules: QueryConstraint[] = queryRules.map((r) =>
          JSON.stringify(r) === dietQueryString ? categoryQueryRule : r
        );

        const categoriesQuery = query(recipesCollection, ...newQueryRules);

        const categoryRecipeDocs = await getDocs(categoriesQuery);

        categoryRecipeDocs.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as TRecipe);
        });

        // Remove duplicates
        data = data.filter(
          (recipe, index, self) =>
            index === self.findIndex((r) => r.id === recipe.id)
        );
      }

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
