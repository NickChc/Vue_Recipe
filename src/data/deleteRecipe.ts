import { deleteObject } from "firebase/storage";
import { deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";
import { updateUser } from "@/data/updateUser";
import { getUserById } from "@/data/getUserById";
import { TRecipe, TUser } from "@/@types/general";
import { getImageRef } from "@/utils/getImageRef";
import PlaceholderImage from "@/assets/images/Fallback_Food_Image.jpeg";
import { getRecipeById } from "@/data/getRecipeById";
import { useAuthStore } from "@/stores/authStore";

export async function deleteRecipe(rec: TRecipe) {
  // Delete the recipe
  const recipe = await getRecipeById(rec.id);

  if (recipe == null) throw new Error("Recipe not found");

  const userId = recipe.user_id;
  const recipeRef = doc(db, "recipes", recipe.id);
  await deleteDoc(recipeRef);

  const user = await getUserById(userId);

  // Update user who owns the recipe
  if (user && user.recipes.includes(recipe.id)) {
    const newUserRecipes = user.recipes.filter((r) => r !== recipe.id);

    await updateUser(userId, { recipes: newUserRecipes } as Partial<TUser>);

    const ratedRecipeUserIds = recipe.rates.map((r) => r.user_id);

    // update users who rated that recipe
    if (ratedRecipeUserIds.length) {
      const batch = writeBatch(db);

      const userFetchPromises = ratedRecipeUserIds.map((id) => getUserById(id));

      const usersWhoRatedRecipe = await Promise.all(userFetchPromises);

      for (const u of usersWhoRatedRecipe) {
        if (u == null) continue;

        const filteredRates = u.rates.filter((r) => r.recipe_id !== recipe.id);

        const userDoc = doc(db, "users", u.id);

        batch.update(userDoc, { rates: filteredRates });
      }

      await batch.commit();

      // Update current users rates array (without refetching user)
      if (recipe.user_id && ratedRecipeUserIds.includes(recipe.user_id)) {
        const authStore = useAuthStore();
        const currUser = authStore.currentUser;

        if (currUser != null) {
          authStore.setCurrentUser({
            ...currUser,
            rates: currUser.rates.filter((r) => r.recipe_id !== recipe.id),
          });
        }
      }
    }
  }

  if (recipe.image == null || recipe.image === PlaceholderImage) return;

  const imageRef = getImageRef(recipe.image);

  await deleteObject(imageRef);
}
