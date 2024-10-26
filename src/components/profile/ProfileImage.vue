<script setup lang="ts">
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { updateProfile } from "firebase/auth";
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
import { removeImageObj } from "@/data/removeImageObj";
import { updateUser } from "@/data/updateUser";

interface ProfileImageProps {
  isEditMode: boolean;
}

const { isEditMode } = defineProps<ProfileImageProps>();

const imageInput = ref<null | HTMLInputElement>(null);

const loading = ref(false);
const image = ref<string | undefined | null>(auth.currentUser?.photoURL);
const newImage = ref<undefined | File>();

async function handleImageDiscard(imageUrl: string) {
  if (auth.currentUser == null) return;

  const ogUrl = imageUrl;

  try {
    image.value = null;
    await removeImageObj(imageUrl);

    if (imageInput.value?.files) {
      imageInput.value.value = "";
    }
    await updateProfile(auth.currentUser, { photoURL: "" });
    await updateUser(auth.currentUser.uid, { image: null });
    await auth.currentUser?.reload();
  } catch (err: any) {
    console.log(err.message);
    image.value = ogUrl;
  }
}

async function handleUpload(e: Event) {
  if (auth.currentUser == null) return;

  const originalPhoto = auth.currentUser.photoURL;
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

    await updateProfile(auth.currentUser, { photoURL: imageUrl });
    await updateUser(auth.currentUser.uid, { image: imageUrl });

    if (originalPhoto == null) return;

    removeImageObj(originalPhoto);
  } catch (err: any) {
    console.log(err.message);
    sendToast("error", "Failed to upload image");
    image.value = originalPhoto;
    if (imageStorageRef) {
      await Promise.all([
        deleteObject(imageStorageRef),
        updateProfile(auth.currentUser, { photoURL: "" }),
        updateUser(auth.currentUser.uid, { image: null }),
      ]);
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
      class="relative group inline-block w-40 max-w-40 xs:w-32 xs:max-w-32 sm:w-40 sm:max-w-40 overflow-hidden bg-black"
    >
      <img
        :src="image || ProfilePlaceholderImage"
        alt="Profile picture"
        :class="`w-full aspect-square rounded-sm duration-200 transition-opacity ${
          loading ? 'opacity-75 pointer-events-none' : ''
        } ${isEditMode ? 'brightness-75 z-50' : ''}}`"
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
            auth.currentUser?.photoURL &&
            !loading
          "
          class="flex flex-col gap-y-3 text-primary top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 absolute duration-200 transition-opacity"
        >
          <div
            @click="$refs.imageInput.click()"
            class="flex flex-col items-center font-semibold text-success cursor-pointer pointer-fine:text-primary pointer-fine:hover:text-success"
          >
            <i class="material-symbols-outlined lg:text-3xl">edit</i>
            <span
              class="whitespace-nowrap text-shadow-lg text-sm xs:text-base xl:text-lg"
              >{{ $t("changeImage").toLocaleUpperCase() }}</span
            >
          </div>
          <div
            @click="handleImageDiscard(auth.currentUser.photoURL)"
            class="flex flex-col items-center font-semibold text-shadow-lg text-danger cursor-pointer pointer-fine:text-primary pointer-fine:hover:text-danger"
          >
            <i class="material-symbols-outlined lg:text-3xl">delete</i>
            <span
              class="whitespace-nowrap text-shadow-lg text-sm xs:text-base xl:text-lg"
              >{{ $t("removeImage").toLocaleUpperCase() }}</span
            >
          </div>
        </div>
        <div
          v-else
          @click="$refs.imageInput.click()"
          class="flex flex-col items-center font-semibold hover:text-success text-primary top-1/2 right-1/2 -translate-y-1/2 translate-x-1/2 absolute pointer-fine:text-primary pointer-fine:hover:text-success duration-200 transition-opacity text-success cursor-pointer"
        >
          <i class="material-symbols-outlined text-2xl lg:text-3xl"
            >add_circle</i
          >
          <span
            class="text-center text-shadow-lg xl:text-lg text-sm xs:text-base"
            >{{ $t("uploadImage").toLocaleUpperCase() }}</span
          >
        </div>
      </template>
    </div>
  </div>
</template>
