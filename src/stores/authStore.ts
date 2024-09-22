import { auth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

export const useAuthStore = defineStore("authStore", () => {
  const fireUser = ref<null | User>(null);
  const verificationSent = ref(true);

  onMounted(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        fireUser.value = authUser;
      } else {
        fireUser.value = null;
      }
    });
  });

  return { fireUser, verificationSent };
});
