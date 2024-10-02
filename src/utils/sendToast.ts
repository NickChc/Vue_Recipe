import { toast, type ToastContainerOptions } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export function sendToast(
  type: "success" | "error" | "info",
  message: string,
  options?: ToastContainerOptions,
  clearAll?: boolean
) {
  if (clearAll) {
    toast.clearAll();
  }

  toast[type](message, options);
}
