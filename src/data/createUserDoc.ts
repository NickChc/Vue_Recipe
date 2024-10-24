import { TUser } from "@/@types/general";
import { db, storage } from "@/firebase";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getUserById } from "@/data/getUserById";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export async function createUserDoc(
  fireUser: User,
  name: string,
  email: string
) {
  const existingUser = await getUserById(fireUser.uid);

  if (existingUser) throw new Error("userAlreadyExists");

  const userDocRef = doc(db, "users", fireUser.uid);
  let userImage = null;

  // TODO : reached rate limit here, test the image again
  if (fireUser.photoURL != null) {
    try {
      const res = await fetch(fireUser.photoURL);
      const blob = await res.blob();

      const imageStorageRef = storageRef(
        storage,
        `images/${fireUser.displayName}-${uuidv4()}`
      );

      const imageSnap = await uploadBytes(imageStorageRef, blob);

      userImage = await getDownloadURL(imageSnap.ref);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  const newUser: Omit<TUser, "id"> = {
    name,
    email,
    image: userImage,
    subscribers: [],
    subscriptions: [],
    recipes: [],
    socialLinks: {},
    rates: [],
  };

  await setDoc(userDocRef, newUser);

  return newUser;
}
