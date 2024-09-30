import { TRecipeFormValues } from "@/@types/general";
import { storage } from "@/firebase";
import { getImageRef } from "@/utils/getImageRef";
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytes,
} from "firebase/storage";
import { updateRecipe } from "./updateRecipe";

export async function editRecipe(
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

    await updateRecipe(id, updateValues);

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
