import { getImageRef } from "@/utils/getImageRef";
import { deleteObject } from "firebase/storage";

export async function removeImageObj(imageUrl: string) {
  try {
    const imageRef = getImageRef(imageUrl);

    if (imageRef) {
      await deleteObject(imageRef);
    }
  } catch (err: any) {
    console.log(err.message);
  }
}
