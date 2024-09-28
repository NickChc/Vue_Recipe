import { storage } from "@/firebase";
import { ref } from "firebase/storage";

export function getImageRef(url: string) {
  const pathStart = url.indexOf("/o/") + 3;
  const pathEnd = url.indexOf("?");
  const imagePath = decodeURIComponent(url.substring(pathStart, pathEnd));
  const imageRef = ref(storage, imagePath);

  return imageRef;
}
