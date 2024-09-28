import { TRecipe } from "@/@types/general";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getRecipeById(id: string) {
  const docRef = doc(db, "recipes", id);

  const recipe = await getDoc(docRef);

  const data = recipe.data();

  if (data == null) {
    throw new Error("recipe is missing");
  }

  return { id: recipe.id, ...recipe.data() } as TRecipe;
}
