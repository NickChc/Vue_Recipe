import { TRecipeFormValues } from "@/@types/general";
import { db, storage } from "@/firebase";
import { getImageRef } from "@/utils/getImageRef";
import { doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytes,
} from "firebase/storage";

export async function updateRecipe(
  id: string,
  oldValues: TRecipeFormValues,
  newValues: TRecipeFormValues,
  imageFile: File | undefined
) {
  let storageRef: null | StorageReference = null;
  try {
    const updateValues: Partial<TRecipeFormValues> = {};

    for (let k in oldValues) {
      const key = k as keyof typeof oldValues;

      if (oldValues[key]?.toString() !== newValues[key]?.toString()) {
        updateValues[key] = newValues[key] as any;
      }
    }

    if (updateValues.image && imageFile) {
      storageRef = ref(storage, `images/${imageFile.name}`);
      const imageSnapshot = await uploadBytes(storageRef, imageFile);

      const newImageUrl = await getDownloadURL(imageSnapshot.ref);

      updateValues.image = newImageUrl;
    }

    const docRef = doc(db, "recipes", id);
    await updateDoc(docRef, updateValues);

    if (newValues.image === oldValues.image || oldValues.image == null) {
      return { success: true, error: null };
    }

    const oldImageRef = getImageRef(oldValues.image);

    await deleteObject(oldImageRef);

    return { success: true, error: null };
  } catch (err: any) {
    console.log(err.message);
    return { success: false, error: "failedToEditRecipe" };
  }
}
