import { TUser } from "@/@types/general";
import { getUserById } from "@/data/getUserById";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

export const useAuthStore = defineStore("authStore", () => {
  const fireUser = ref<null | User>(null);
  const currentUser = ref<TUser | null>(null);
  const loadingAuth = ref(true);

  const verificationSent = ref(false);

  function setCurrentUser(user: TUser | null) {
    currentUser.value = user;
  }

  async function handleSignOut() {
    try {
      loadingAuth.value = true;
      await signOut(auth);
    } catch (err: any) {
      console.log(err.message);
    }
  }

  onMounted(() => {
    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          fireUser.value = authUser;
          currentUser.value = await getUserById(authUser.uid);
        } catch (err: any) {
          console.log(err.message);
        } finally {
          loadingAuth.value = false;
        }
      } else {
        loadingAuth.value = false;
        fireUser.value = null;
        currentUser.value = null;
      }
    });
  });

  return {
    fireUser,
    verificationSent,
    currentUser,
    setCurrentUser,
    loadingAuth,
    handleSignOut,
  };
});
