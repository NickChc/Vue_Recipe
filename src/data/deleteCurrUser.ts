import { TUser } from "@/@types/general";
import { getUserById } from "./getUserById";
import { deleteDoc, doc, writeBatch } from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { auth, db } from "@/firebase";

export async function deleteCurrUser(currUser: TUser) {
  const { subscribers, subscriptions } = currUser;

  if (auth.currentUser == null) return;
  console.log("PASSED RETURN");

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

  //   update the subscribers
  const userSubscribers = await Promise.all(subscribersPromise);

  if (userSubscribers.length) {
    const batch = writeBatch(db);

    for (const u of userSubscribers) {
      if (u == null) continue;

      const userDoc = doc(db, "users", u.id);

      const newSubscriptions = u.subscriptions.filter(
        (s) => s.id !== currUser.id
      );

      batch.update(userDoc, { subscriptions: newSubscriptions });
    }

    await batch.commit();
  }

  //   update the subscriptions
  const userSubscriptions = await Promise.all(subscriptionsPromise);

  if (userSubscriptions.length) {
    const batch = writeBatch(db);

    for (const u of userSubscriptions) {
      if (u == null) continue;

      const userDoc = doc(db, "users", u.id);

      const newSubscribers = u.subscribers.filter((s) => s.id !== currUser.id);

      batch.update(userDoc, { subscribers: newSubscribers });
    }

    await batch.commit();
  }

  //   Delete the user doc from db
  const currUserRef = doc(db, "users", currUser.id);

  await deleteDoc(currUserRef);

  //   Delete the user from firebase auth
  await deleteUser(auth.currentUser);

  console.log("REACHED THE FINISH");
}
