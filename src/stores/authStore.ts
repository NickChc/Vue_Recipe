import { TUser } from "@/@types/general";
import { getUserById } from "@/data/getUserById";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

export enum TAuthProvider_Enum {
  PASSWORD = "password",
  GOOGLE = "google.com",
}

export const useAuthStore = defineStore("authStore", () => {
  const fireUser = ref<null | User>(null);
  const currentUser = ref<TUser | null>(null);
  const loadingAuth = ref(true);
  const currProvider = ref<null | TAuthProvider_Enum>(null);

  const isDeletingAcc = ref(false);

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

  function setIsDeletingAcc(newValue?: boolean) {
    isDeletingAcc.value = newValue || !isDeletingAcc.value;
  }

  async function resetCurrUser(id?: string) {
    if (id) {
      currentUser.value = await getUserById(id);
      return;
    }

    if (fireUser.value == null) return;

    currentUser.value = await getUserById(fireUser.value.uid);
  }

  // TODO : fix popup sign in issue on safari

  onMounted(() => {
    onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          fireUser.value = authUser;
          await resetCurrUser(authUser.uid);
        } catch (err: any) {
          console.log(err.message);
        } finally {
          loadingAuth.value = false;
        }
        const providerResult = await authUser.getIdTokenResult();

        if (providerResult == null) return;

        currProvider.value =
          providerResult.signInProvider as TAuthProvider_Enum;
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
    loadingAuth,
    isDeletingAcc,
    currProvider,
    setCurrentUser,
    handleSignOut,
    setIsDeletingAcc,
    resetCurrUser,
  };
});
