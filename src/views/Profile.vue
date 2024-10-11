<script setup lang="ts">
import ProfileImage from "@/components/profile/ProfileImage.vue";
import BackgroundImage from "@/assets/images/Layout_Image.jpg";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/authStore";
import AddUserData from "@/components/profile/AddUserData.vue";

const authStore = useAuthStore();
const { fireUser, currentUser } = storeToRefs(authStore);
</script>

<template>
  <div
    v-if="currentUser"
    class="min-h-full pb-12 p-3 w-full sm:w-[90%] lg:w-[80%] mx-auto"
  >
    <h1 class="font-bold text-xl xs:text-2xl sm:text-3xl lg:text-4xl mb-3">
      YOUR PROFILE
    </h1>
    <div
      class="min-h-60 bg-add-2 text-primary p-4 sm:p-6 rounded-lg relative flex flex-col items-center justify-center xs:items-start"
    >
      <div
        class="absolute top-0 bottom-1/2 rounded-t-lg right-0 left-0 bg-danger bg-cover bg-left"
        :style="{ backgroundImage: `url(${BackgroundImage})` }"
      ></div>
      <div class="flex flex-col items-center gap-y-1.5">
        <ProfileImage :fireUser="fireUser" />
        <h2 class="font-semibold mx-3 text-center">{{ currentUser?.name }}</h2>

        <p v-if="currentUser.bio" class="line-clamp-1">{{ currentUser.bio }}</p>
      </div>
    </div>

    <AddUserData :currentUser="currentUser" />
  </div>
</template>

<!-- TODO : section that shows other user data, and allows changing it -->
<!-- TODO : Allow users to add their social account links -->

<!-- TODO : Show your recipes, allow performing actions on them -->
