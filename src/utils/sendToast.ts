import { toast, type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

// TODO : modify success toast colors

export function sendToast(
  type: "success" | "error",
  message: string,
  options?: ToastContainerOptions
) {
  toast[type](message, options);
}
