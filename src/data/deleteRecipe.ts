import { deleteObject } from "firebase/storage";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { updateUser } from "@/data/updateUser";
import { getUserById } from "@/data/getUserById";
import { TRecipe, TUser } from "@/@types/general";
import { getImageRef } from "@/utils/getImageRef";
import PlaceholderImage from "@/assets/images/Fallback_Food_Image.jpeg";

export async function deleteRecipe(recipe: TRecipe) {
  const userId = recipe.user_id;
  const recipeRef = doc(db, "recipes", recipe.id);
  await deleteDoc(recipeRef);

  const user = await getUserById(userId);

  if (user && user.recipes.includes(recipe.id)) {
    const newUserRecipes = user.recipes.filter((r) => r !== recipe.id);

    await updateUser(userId, { recipes: newUserRecipes } as Partial<TUser>);
  }

  if (recipe.image == null && recipe.image !== PlaceholderImage) return;

  const imageRef = getImageRef(recipe.image);

  await deleteObject(imageRef);
}
