import { deleteObject } from "firebase/storage";
import { getImageRef } from "@/utils/getImageRef";

export async function removeImageObj(imageUrl: string) {
  try {
    const imageRef = getImageRef(imageUrl);

    if (imageRef && imageUrl.includes("firebasestorage")) {
      await deleteObject(imageRef);
    }
  } catch (err: any) {
    console.log(err.message);
  }
}
