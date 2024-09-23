import { TUser } from "@/@types/general";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getUserById(id: string) {
  const docRef = doc(db, "users", id);

  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as TUser;
  }

  return null;
}
