import { TUser } from "@/@types/general";
import { db } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";

export async function updateUser(userId: string, newValues: Partial<TUser>) {
  const userRef = doc(db, "users", userId);

  await updateDoc(userRef, newValues);
}
