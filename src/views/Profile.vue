<script setup lang="ts">
import ProfileImage from "@/components/profile/ProfileImage.vue";
import BackgroundImage from "@/assets/images/Layout_Image.jpg";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const { fireUser, currentUser } = storeToRefs(authStore);
</script>

<template>
  <div class="h-full overflow-hidden p-3 w-full sm:w-[90%] lg:w-[80%] mx-auto">
    <h1 class="font-bold text-xl xs:text-2xl sm:text-3xl lg:text-4xl mb-3">
      YOUR PROFILE
    </h1>
    <div
      class="bg-add-2 text-primary p-4 sm:p-6 rounded-lg relative flex flex-col items-center xs:items-start"
    >
      <div
        class="absolute top-0 bottom-1/2 rounded-t-lg right-0 left-0 bg-danger bg-cover bg-left"
        :style="{ backgroundImage: `url(${BackgroundImage})` }"
      ></div>
      <div>
        <ProfileImage :fireUser="fireUser" />
        <h2 class="font-semibold mx-3 text-center">{{ currentUser?.name }}</h2>
      </div>
    </div>
  </div>
</template>

<!-- TODO : section that shows other user data, and allows changing it -->
<!-- TODO : Allow users to add their social account links -->
<!-- TODO : Show your recipes, allow performing actions on them -->
