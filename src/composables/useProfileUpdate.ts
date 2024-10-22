import { TSocialLinks, TUser } from "@/@types/general";
import { SOCIAL_NETWORKS } from "@/config/data";
import { getUserById } from "@/data/getUserById";
import { updateUser } from "@/data/updateUser";
import { auth } from "@/firebase";
import { useAuthStore } from "@/stores/authStore";
import { sendToast } from "@/utils/sendToast";
import { validateSocialLink } from "@/utils/validateSocialLink";
import { storeToRefs } from "pinia";
import { computed, Ref, ref } from "vue";

export function useProfileUpdate(
  state: {
    userBio: Ref<string>;
    loading: Ref<boolean>;
    userSocialLinks: Ref<TSocialLinks>;
  },
  setEditMode: (newMode: boolean) => void
) {
  const authStore = useAuthStore();
  const { currentUser } = storeToRefs(authStore);

  const error = ref<string | null>(null);

  const { socialLinks } = currentUser.value!;

  const removalLoading = ref<(keyof TSocialLinks)[]>([]);

  const disableBtn = computed(() => {
    if (state.userBio.value !== "") return false;

    const isChanged = Object.keys(state.userSocialLinks.value).some((k) => {
      const key = k as keyof TSocialLinks;

      if (
        currentUser.value?.socialLinks[key] !== state.userSocialLinks.value[key]
      ) {
        return true;
      }
    });

    return !isChanged;
  });

  async function removeLink(type: keyof TSocialLinks) {
    const originalUser = currentUser.value;
    removalLoading.value.push(type);

    if (currentUser.value == null) return;

    try {
      state.userSocialLinks.value[type] = "";

      const newValue: TSocialLinks = {
        ...socialLinks,
        [type]: null,
      };

      await updateUser(currentUser.value.id, {
        socialLinks: newValue,
      });

      await auth.currentUser?.reload();
      authStore.resetCurrUser(currentUser.value.id);
    } catch (err: any) {
      console.log(err.message);
      authStore.setCurrentUser(originalUser);
    } finally {
      removalLoading.value = removalLoading.value.filter((v) => v !== type);
    }
  }

  async function handleAddData() {
    if (currentUser.value == null) return;
    try {
      error.value = null;
      state.loading.value = true;

      const updateValues: Partial<TUser> & { socialLinks: TSocialLinks } = {
        socialLinks: {
          ...currentUser.value.socialLinks,
        },
      };

      if (!!state.userBio.value.trim() || !!currentUser.value.bio) {
        updateValues.bio = state.userBio.value;
      }

      let errorToast = false;

      Object.keys(state.userSocialLinks.value).forEach((k) => {
        if (currentUser.value == null) return;

        const key = k as keyof TSocialLinks;

        const value = state.userSocialLinks.value[key];

        if (value == null || !value.trim()) {
          updateValues.socialLinks[key] = null;
          return;
        }

        const socWeb = SOCIAL_NETWORKS.find((n) => n.name === key)!;

        const isValidLink = validateSocialLink(value, socWeb.urlMatches);

        if (!isValidLink) {
          errorToast = true;
          return;
        }

        if (value !== currentUser.value.socialLinks[key]) {
          updateValues.socialLinks[key] = value;
        }
      });

      if (errorToast) {
        sendToast(
          "error",
          `Invalid link format, make sure to start with "https://" or "https://www.""`
        );
        return;
      }

      const oldLinks = currentUser.value.socialLinks;
      const newLinks = updateValues.socialLinks;

      const linksChanged = Object.keys(newLinks)?.some((k) => {
        const key = k as keyof TSocialLinks;

        if (oldLinks[key] !== newLinks[key]) {
          return true;
        }

        return false;
      });

      if (!linksChanged && updateValues.bio == null) {
        setEditMode(false);
        return;
      }

      await updateUser(currentUser.value.id, updateValues);
      const updatedUser = await getUserById(currentUser.value.id);
      authStore.setCurrentUser(updatedUser);
      setEditMode(false);
    } catch (err: any) {
      console.log(err.message);
      sendToast("error", "Failed to update profile, please try again");
    } finally {
      state.loading.value = false;
    }
  }

  return {
    disableBtn,
    handleAddData,
    removeLink,
    removalLoading,
  };
}
