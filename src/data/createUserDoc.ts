import { TUser } from "@/@types/general";
import { db } from "@/firebase";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getUserById } from "./getUserById";

export async function createUserDoc(
  fireUser: User,
  name: string,
  email: string
) {
  const existingUser = await getUserById(fireUser.uid);

  if (existingUser) throw new Error("userAlreadyExists");

  const userDocRef = doc(db, "users", fireUser.uid);

  const newUser: Omit<TUser, "id"> = {
    name,
    email,
    subscribers: [],
    subscriptions: [],
    recipes: [],
    socialLinks: {
      facebook: null,
      instagram: null,
      tiktok: null,
    },
    rates: [],
  };

  await setDoc(userDocRef, newUser);

  return newUser;
}
