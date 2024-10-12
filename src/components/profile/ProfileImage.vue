<script setup lang="ts">
import { ref } from "vue";
import { updateProfile, User } from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  StorageReference,
  uploadBytes,
} from "firebase/storage";
import { ref as storageRef } from "firebase/storage";
import ProfilePlaceholderImage from "@/assets/images/Profile_Placeholder_Image.png";
import { auth, storage } from "@/firebase";
import { sendToast } from "@/utils/sendToast";
import HourglassLoading from "@/components/HourglassLoading.vue";
import { getImageRef } from "@/utils/getImageRef";
import { v4 as uuidv4 } from "uuid";

interface ProfileImageProps {
  isEditMode: boolean;
}

const { isEditMode } = defineProps<ProfileImageProps>();

const fireUser = auth.currentUser;

const loading = ref(false);
const image = ref<string | undefined | null>(fireUser?.photoURL);
const newImage = ref<undefined | File>();

async function removeImage(imageUrl: string) {
  try {
    const imageRef = getImageRef(imageUrl);

    if (imageRef) {
      await deleteObject(imageRef);
    }
  } catch (err: any) {
    console.log(err.message);
  }
}

async function handleImageDiscard(imageUrl: string) {
  if (fireUser == null) return;

  const ogUrl = imageUrl;

  try {
    image.value = null;
    await removeImage(imageUrl);
    await updateProfile(fireUser, { photoURL: null });
  } catch (err: any) {
    console.log(err.message);
    image.value = ogUrl;
  }
}

async function handleUpload(e: Event) {
  if (fireUser == null) return;
  const originalPhoto = fireUser.photoURL;
  let imageStorageRef: undefined | StorageReference;

  try {
    loading.value = true;
    const target = e.target as HTMLInputElement;
    newImage.value = target.files?.[0];

    if (newImage.value == null) return;

    image.value = URL.createObjectURL(newImage.value);

    imageStorageRef = storageRef(
      storage,
      `images/${newImage.value.name}-${uuidv4()}`
    );

    const imageSnap = await uploadBytes(imageStorageRef, newImage.value);

    const imageUrl = await getDownloadURL(imageSnap.ref);

    await updateProfile(fireUser, { photoURL: imageUrl });

    if (originalPhoto == null) return;

    removeImage(originalPhoto);
  } catch (err: any) {
    console.log(err.message);
    sendToast("error", "Failed to upload image");
    image.value = originalPhoto;
    if (imageStorageRef) {
      await deleteObject(imageStorageRef);
      await updateProfile(fireUser, { photoURL: null });
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="inline-flex flex-col gap-y-1">
    <input
      :disabled="loading"
      @input="handleUpload"
      class="hidden"
      ref="imageInput"
      type="file"
      accept="image/*"
    />
    <div
      class="relative group inline-block w-32 max-w-32 xs:w-40 xs:max-w-40 overflow-hidden bg-black"
    >
      <img
        :src="image || ProfilePlaceholderImage"
        alt="Profile picture"
        :class="`w-full aspect-square rounded-sm duration-200 transition-opacity ${
          loading ? 'opacity-75 pointer-events-none' : ''
        } ${isEditMode ? 'profile-image-hover' : ''}}`"
        @error="image = ProfilePlaceholderImage"
      />
      <template v-if="isEditMode">
        <div
          v-if="loading"
          class="absolute top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2"
        >
          <HourglassLoading />
        </div>
        <div
          v-else-if="
            image &&
            image !== ProfilePlaceholderImage &&
            fireUser?.photoURL &&
            !loading
          "
          class="flex flex-col gap-y-3 text-primary top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 absolute add-circle-hover duration-200 transition-opacity"
        >
          <div
            @click="$refs.imageInput.click()"
            class="flex flex-col items-center font-semibold text-success cursor-pointer success-hover"
          >
            <i class="material-symbols-outlined lg:text-3xl">edit</i>
            <span
              class="whitespace-nowrap text-shadow-lg text-sm xs:text-base xl:text-lg"
              >CHANGE IMAGE</span
            >
          </div>
          <div
            @click="handleImageDiscard(fireUser.photoURL)"
            class="flex flex-col items-center font-semibold text-shadow-lg text-danger cursor-pointer danger-hover"
          >
            <i class="material-symbols-outlined lg:text-3xl">delete</i>
            <span
              class="whitespace-nowrap text-shadow-lg text-sm xs:text-base xl:text-lg"
              >REMOVE IMAGE</span
            >
          </div>
        </div>
        <div
          v-else
          @click="$refs.imageInput.click()"
          class="flex flex-col items-center font-semibold hover:text-success text-primary top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 absolute success-hover duration-200 transition-opacity text-success cursor-pointer add-circle-hover"
        >
          <i class="material-symbols-outlined text-2xl lg:text-3xl"
            >add_circle</i
          >
          <span
            class="whitespace-nowrap text-shadow-lg xl:text-lg text-sm xs:text-base"
            >UPLAOD IMAGE</span
          >
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
@media (pointer: fine) {
  .profile-image-hover {
    @apply group-hover:opacity-75;
  }

  .add-circle-hover {
    @apply group-hover:opacity-100 opacity-0;
  }

  .remove-image-btn {
    @apply duration-300 transition-transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100;
  }

  .success-hover {
    @apply text-primary hover:text-success;
  }

  .danger-hover {
    @apply text-primary hover:text-danger;
  }
}
</style>
