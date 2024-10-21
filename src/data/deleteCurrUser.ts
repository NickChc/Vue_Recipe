import { deleteDoc, doc, writeBatch } from "firebase/firestore";
import { TRecipe, TUser } from "@/@types/general";
import { getUserById } from "@/data/getUserById";
import { deleteUser } from "firebase/auth";
import { auth, db } from "@/firebase";
import { removeImageObj } from "@/data/removeImageObj";
import { getRecipesByUserId } from "@/data/getRecipesByUserId";

export async function deleteCurrUser(currUser: TUser) {
  const { subscribers, subscriptions } = currUser;

  if (auth.currentUser == null) return;

  const batch = writeBatch(db);

  // get user's subscribers to update
  let subscribersPromise: Promise<TUser | null>[] = [];

  subscribers.forEach((sub) => {
    subscribersPromise.push(getUserById(sub.id));
  });

  //   get user's subscriptions to update
  let subscriptionsPromise: Promise<TUser | null>[] = [];

  subscriptions.forEach((sub) => {
    subscriptionsPromise.push(getUserById(sub.id));
  });

  //   get user's recipes to update
  const userRecipes = await getRecipesByUserId(currUser.id);

  userRecipes.forEach((recipe) => {
    const recipeDoc = doc(db, "recipes", recipe.id);

    batch.update(recipeDoc, { author: null, user_id: null } as Pick<
      TRecipe,
      "author" | "user_id"
    >);
  });

  //   update the subscribers
  const userSubscribers = await Promise.all(subscribersPromise);

  for (const u of userSubscribers) {
    if (u == null) continue;

    const userDoc = doc(db, "users", u.id);

    const newSubscriptions = u.subscriptions.filter(
      (s) => s.id !== currUser.id
    );

    batch.update(userDoc, { subscriptions: newSubscriptions });
  }

  //   update the subscriptions
  const userSubscriptions = await Promise.all(subscriptionsPromise);

  for (const u of userSubscriptions) {
    if (u == null) continue;

    const userDoc = doc(db, "users", u.id);

    const newSubscribers = u.subscribers.filter((s) => s.id !== currUser.id);

    batch.update(userDoc, { subscribers: newSubscribers });
  }

  await batch.commit();

  //   Delete user's profile image
  const photoURL = auth.currentUser.photoURL;
  if (photoURL != null && !photoURL.includes("usercontent.com")) {
    await removeImageObj(photoURL);
  }

  //   Delete the user doc from db
  const currUserRef = doc(db, "users", currUser.id);

  await deleteDoc(currUserRef);

  //   Delete the user from firebase auth
  await deleteUser(auth.currentUser);
}
