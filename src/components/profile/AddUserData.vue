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
}

const authStore = useAuthStore();

const { currentUser } = defineProps<UserDataProps>();

const loading = ref(false);
const error = ref<string | null>(null);

const userBio = ref("");

const userSocialLinks = ref<TSocialLinks>({
  facebook: currentUser.socialLinks.facebook,
  instagram: currentUser.socialLinks.instagram,
  tiktok: currentUser.socialLinks.tiktok,
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
  try {
    userSocialLinks.value[type] = undefined;

    const newValue = {
      ...currentUser.socialLinks,
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
  }
}

async function handleAddData() {
  try {
    error.value = null;
    loading.value = true;

    const updateValues: Partial<TUser> & { socialLinks: TSocialLinks } = {
      socialLinks: {},
    };

    if (!!userBio.value.trim()) {
      updateValues.bio = userBio.value;
    }

    Object.keys(userSocialLinks.value).forEach((k) => {
      const key = k as keyof TSocialLinks;

      const value = userSocialLinks.value[key];

      if (value != null && validateSocialLink(key, value)) {
        updateValues.socialLinks[key] = value;
      }
    });

    await updateUser(currentUser.id, updateValues);
    const updatedUser = await getUserById(currentUser.id);
    authStore.setCurrentUser(updatedUser);
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
    class="bg-add-2 text-primary p-4 sm:p-6 rounded-lg mt-6"
  >
    <div
      v-if="currentUser.bio == null"
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
      <h3>Link social accounts</h3>

      <ul class="list-none">
        <li class="text-sm">
          <div class="flex items-center justify-between px-4 gap-x-3 w-full">
            <span class="flex justify-center items-center gap-x-2 mt-2">
              <FacebookIcon />
              Facebook</span
            >
            <span
              v-if="
                currentUser.socialLinks.facebook && userSocialLinks.facebook
              "
              @click="removeLink('facebook')"
            >
              <i class="material-symbols-outlined text-xl text-danger"
                >delete</i
              >
            </span>
          </div>

          <div class="text-xs mt-1.5 bg-black rounded-sm">
            <FormInput
              :disabled="loading || currentUser.socialLinks.facebook != null"
              placeholder="https://facebook.com/your-account"
              v-model="userSocialLinks.facebook"
            />
          </div>
        </li>

        <li class="text-sm">
          <div class="flex items-center justify-between px-4 gap-x-3 w-full">
            <span class="flex justify-center items-center gap-x-2 mt-2">
              <InstagramIcon />
              Instagram</span
            >
            <span
              v-if="
                currentUser.socialLinks.instagram && userSocialLinks.instagram
              "
              @click="removeLink('instagram')"
            >
              <i class="material-symbols-outlined text-xl text-danger"
                >delete</i
              >
            </span>
          </div>

          <div class="text-xs mt-1.5 bg-black rounded-sm">
            <FormInput
              :disabled="loading || currentUser.socialLinks.instagram != null"
              placeholder="https://instagram.com/your-account"
              v-model="userSocialLinks.instagram"
            />
          </div>
        </li>

        <li class="text-sm">
          <div class="flex items-center justify-between px-4 gap-x-3 w-full">
            <span class="flex justify-center items-center gap-x-2 mt-2">
              <TiktokIcon />
              TikTok</span
            >
            <span
              v-if="currentUser.socialLinks.tiktok && userSocialLinks.tiktok"
              @click="removeLink('tiktok')"
            >
              <i class="material-symbols-outlined text-xl text-danger"
                >delete</i
              >
            </span>
          </div>

          <div class="text-xs mt-1.5 bg-black rounded-sm">
            <FormInput
              :disabled="loading || currentUser.socialLinks.tiktok != null"
              placeholder="https://tiktok.com/your-account"
              v-model="userSocialLinks.tiktok"
            />
          </div>
        </li>
      </ul>
    </div>

    <Button
      :disabled="disableBtn"
      variation="primary"
      size="sm"
      class="w-full mt-6"
      >{{ loading ? "SAVING..." : "SAVE" }}</Button
    >
  </form>
</template>
