<script setup lang="ts">
import { TUser, TSocialLinks } from "@/@types/general";
import FormInput from "@/components/FormInput.vue";
import FacebookIcon from "@/components/icons/FacebookIcon.vue";
import InstagramIcon from "@/components/icons/InstagramIcon.vue";
import TiktokIcon from "@/components/icons/TiktokIcon.vue";
import { computed, ref } from "vue";
import Button from "@/components/Button.vue";
import { updateUser } from "@/data/updateUser";
import { validateSocialLink } from "@/utils/validateSocialLink";
import { auth } from "@/firebase";
import { sendToast } from "@/utils/sendToast";
import { useAuthStore } from "@/stores/authStore";
import { getUserById } from "@/data/getUserById";

interface UserDataProps {
  currentUser: TUser;
  isEditMode: boolean;
}

const emit = defineEmits<{
  (e: "set-edit-mode", value: boolean): void;
}>();

function emitSetEditMode(value: boolean) {
  emit("set-edit-mode", value);
}

const authStore = useAuthStore();

const { currentUser, isEditMode } = defineProps<UserDataProps>();

const loading = ref(false);
const error = ref<string | null>(null);

const userBio = ref(currentUser.bio || "");

const { socialLinks } = currentUser;

const removalLoading = ref({
  facebook: false,
  instagram: false,
  tiktok: false,
});

const userSocialLinks = ref<{
  facebook: string;
  instagram: string;
  tiktok: string;
}>({
  facebook: socialLinks.facebook || "",
  instagram: socialLinks.instagram || "",
  tiktok: socialLinks.tiktok || "",
});

const disableBtn = computed(() => {
  if (userBio.value !== "") return false;

  const isChanged = Object.keys(userSocialLinks.value).some((k) => {
    const key = k as keyof TSocialLinks;

    if (currentUser.socialLinks[key] !== userSocialLinks.value[key]) {
      return true;
    }
  });

  if (isChanged) return false;

  return true;
});

async function removeLink(type: keyof TSocialLinks) {
  const originalUser = currentUser;
  removalLoading.value[type] = true;
  try {
    userSocialLinks.value[type] = "";

    const newValue: Partial<TSocialLinks> = {
      ...socialLinks,
      [type]: null,
    };

    await updateUser(currentUser.id, {
      socialLinks: newValue,
    });

    await auth.currentUser?.reload();
    const updatedUser = await getUserById(currentUser.id);
    authStore.setCurrentUser(updatedUser);
  } catch (err: any) {
    console.log(err.message);
    authStore.setCurrentUser(originalUser);
  } finally {
    removalLoading.value[type] = false;
  }
}

async function handleAddData() {
  try {
    error.value = null;
    loading.value = true;

    const updateValues: Partial<TUser> & { socialLinks: TSocialLinks } = {
      socialLinks: {
        ...currentUser.socialLinks,
      },
    };

    if (!!userBio.value.trim()) {
      updateValues.bio = userBio.value;
    }

    let errorToast = false;

    Object.keys(userSocialLinks.value).forEach((k) => {
      const key = k as keyof TSocialLinks;

      const value = userSocialLinks.value[key];

      if (value == null || !value.trim()) {
        updateValues.socialLinks[key] = null;
        return;
      }

      const isValidLink = validateSocialLink(key, value);

      if (!isValidLink) {
        errorToast = true;
        return;
      }

      if (value !== currentUser.socialLinks[key]) {
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

    const oldLinks = currentUser.socialLinks;
    const newLinks = updateValues.socialLinks;

    const linksChanged = Object.keys(oldLinks).some((k) => {
      const key = k as keyof TSocialLinks;

      if (oldLinks[key] !== newLinks[key]) {
        return true;
      }

      return false;
    });

    if (
      !linksChanged &&
      (userBio.value.trim() === "" || userBio.value === currentUser.bio)
    ) {
      emitSetEditMode(false);
      return;
    }

    await updateUser(currentUser.id, updateValues);
    const updatedUser = await getUserById(currentUser.id);
    authStore.setCurrentUser(updatedUser);
    emitSetEditMode(false);
  } catch (err: any) {
    console.log(err.message);
    sendToast("error", "Failed to update profile, please try again");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <form
    @submit.prevent="handleAddData"
    class="bg-add-2 text-primary p-4 sm:p-6 rounded-lg mt-6 w-full"
  >
    <div
      v-if="isEditMode"
      class="flex flex-col gap-y-2 items-stretch text-center"
    >
      <h3>Tell others about yourself</h3>
      <textarea
        v-model="userBio"
        class="outline-add p-1 resize-none h-32 text-secondary text-sm"
        maxlength="250"
        placeholder="Hello,
my name is Mike, 25 y.o Cooking enthusiast with special passion for steaks."
      />
      <p class="text-xs opacity-60 text-start">250 words max</p>
    </div>

    <hr class="w-full my-4" />

    <div class="flex flex-col gap-y-2 items-stretch text-center">
      <button
        type="button"
        class="font-merri underline"
        @click="emitSetEditMode(!isEditMode)"
      >
        Link social accounts
      </button>

      <ul class="list-none">
        <li class="text-sm">
          <div
            class="flex items-center justify-between px-4 gap-x-3 w-full"
            v-if="isEditMode || currentUser.socialLinks.facebook"
          >
            <span class="flex justify-center items-center gap-x-2 mt-2">
              <FacebookIcon />
              Facebook</span
            >
            <span
              v-if="removalLoading.facebook"
              class="animate-spin-3/2 cursor-default grid"
            >
              <i class="material-symbols-outlined">progress_activity</i>
            </span>
            <span
              v-else-if="
                currentUser.socialLinks.facebook &&
                userSocialLinks.facebook &&
                isEditMode
              "
              @click="removeLink('facebook')"
              class="cursor-pointer"
            >
              <i class="material-symbols-outlined text-xl text-danger"
                >delete</i
              >
            </span>
          </div>

          <div v-if="isEditMode" class="text-xs mt-1.5 bg-black rounded-sm">
            <FormInput
              :disabled="loading || currentUser.socialLinks.facebook != null"
              placeholder="https://facebook.com/your-account"
              v-model="userSocialLinks.facebook"
            />
          </div>
          <a
            v-else-if="currentUser.socialLinks.facebook"
            :href="currentUser.socialLinks.facebook"
            target="_blank"
            class="bg-primary flex text-secondary rounded-sm my-1 px-1 py-0.5 underline truncate"
          >
            {{ currentUser.socialLinks.facebook }}
          </a>
        </li>

        <li class="text-sm">
          <div
            v-if="isEditMode || currentUser.socialLinks.instagram"
            class="flex items-center justify-between px-4 gap-x-3 w-full"
          >
            <span class="flex justify-center items-center gap-x-2 mt-2">
              <InstagramIcon />
              Instagram</span
            >
            <span
              v-if="removalLoading.instagram"
              class="animate-spin-3/2 cursor-default grid"
            >
              <i class="material-symbols-outlined">progress_activity</i>
            </span>
            <span
              v-else-if="
                currentUser.socialLinks.instagram &&
                userSocialLinks.instagram &&
                isEditMode
              "
              @click="removeLink('instagram')"
              class="cursor-pointer"
            >
              <i class="material-symbols-outlined text-xl text-danger"
                >delete</i
              >
            </span>
          </div>

          <div v-if="isEditMode" class="text-xs mt-1.5 bg-black rounded-sm">
            <FormInput
              :disabled="loading || currentUser.socialLinks.instagram != null"
              placeholder="https://instagram.com/your-account"
              v-model="userSocialLinks.instagram"
            />
          </div>
          <a
            v-else-if="currentUser.socialLinks.instagram"
            :href="currentUser.socialLinks.instagram"
            target="_blank"
            class="bg-primary flex text-secondary rounded-sm my-1 px-1 py-0.5 underline truncate"
          >
            {{ currentUser.socialLinks.instagram }}
          </a>
        </li>

        <li class="text-sm">
          <div
            v-if="isEditMode || currentUser.socialLinks.tiktok"
            class="flex items-center justify-between px-4 gap-x-3 w-full"
          >
            <span class="flex justify-center items-center gap-x-2 mt-2">
              <TiktokIcon />
              TikTok</span
            >
            <span
              v-if="removalLoading.tiktok"
              class="animate-spin-3/2 cursor-default grid"
            >
              <i class="material-symbols-outlined">progress_activity</i>
            </span>
            <span
              v-else-if="
                currentUser.socialLinks.tiktok &&
                userSocialLinks.tiktok &&
                isEditMode
              "
              @click="removeLink('tiktok')"
              class="cursor-pointer"
            >
              <i class="material-symbols-outlined text-xl text-danger"
                >delete</i
              >
            </span>
          </div>

          <div v-if="isEditMode" class="text-xs mt-1.5 bg-black rounded-sm">
            <FormInput
              :disabled="loading || currentUser.socialLinks.tiktok != null"
              placeholder="https://tiktok.com/your-account"
              v-model="userSocialLinks.tiktok"
            />
          </div>
          <a
            v-else-if="currentUser.socialLinks.tiktok"
            :href="currentUser.socialLinks.tiktok"
            target="_blank"
            class="bg-primary flex text-secondary rounded-sm my-1 px-1 py-0.5 underline truncate"
          >
            {{ currentUser.socialLinks.tiktok }}
          </a>
        </li>
      </ul>
    </div>

    <Button
      v-if="isEditMode"
      :disabled="disableBtn || loading"
      variation="primary"
      size="sm"
      class="w-full mt-6"
      >{{ loading ? "SAVING..." : "SAVE" }}</Button
    >
  </form>
</template>
