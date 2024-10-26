import { TRecipe, TRecipeFormValues, TUser } from "@/@types/general";
import { recipesCollection, storage } from "@/firebase";
import { addDoc, Timestamp } from "firebase/firestore";
import { updateUser } from "@/data/updateUser";
import { v4 as uuidv4 } from "uuid";
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytes,
} from "firebase/storage";

export async function createRecipe(
  user: TUser,
  values: TRecipeFormValues,
  imageFile?: File
) {
  let storageRef: null | StorageReference = null;
  try {
    let imageUrl: string | null = null;

    if (imageFile) {
      storageRef = ref(storage, `images/${imageFile.name}-${uuidv4()}`);
      const imageSnap = await uploadBytes(storageRef, imageFile);

      imageUrl = await getDownloadURL(imageSnap.ref);
    }

    const newRecipe: Omit<TRecipe, "id"> = {
      ...values,
      user_id: user.id,
      author: {
        name: user.name,
      },
      rating: 0,
      rates: [],
      created_at: Timestamp.now(),
      image: imageUrl,
    };

    const res = await addDoc(recipesCollection, newRecipe);
    const newUserRecipes = [...user.recipes, res.id];

    await updateUser(user.id, { recipes: newUserRecipes });
    return { success: true, error: null };
  } catch (err: any) {
    if (storageRef) {
      await deleteObject(storageRef);
    }

    console.log(err.message);
    return { success: false, error: "failedToCreateRecipe" };
  }
}
