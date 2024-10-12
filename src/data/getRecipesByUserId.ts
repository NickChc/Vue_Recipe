import { TRecipe } from "@/@types/general";
import { recipesCollection } from "@/firebase";
import { getDocs, orderBy, query, where } from "firebase/firestore";

export async function getRecipesByUserId(userId: string) {
  const q = query(
    recipesCollection,
    orderBy("title", "asc"),
    where("user_id", "==", userId)
  );

  const recipeDocs = await getDocs(q);

  const data: TRecipe[] = recipeDocs.docs.map((doc) => {
    return { id: doc.id, ...doc.data() } as TRecipe;
  });

  return data;
}
