import { TRecipe } from "@/@types/general";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function updateRecipe(
  recipeId: string,
  newValues: Partial<TRecipe>
) {
  const recipeRef = doc(db, "recipes", recipeId);

  await updateDoc(recipeRef, newValues);
}
