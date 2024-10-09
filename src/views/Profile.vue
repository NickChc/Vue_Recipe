<script setup lang="ts">
import ProfileImage from "@/components/profile/ProfileImage.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const { fireUser } = storeToRefs(authStore);
</script>

<template>
  <div class="h-full p-3">
    <h1 class="font-bold text-xl xs:text-2xl sm:text-3xl lg:text-4xl mb-3">
      YOUR PROFILE
    </h1>
    <div class="bg-add-2 p-4 rounded-lg">
      <ProfileImage :fireUser="fireUser" />
    </div>
    <!-- TODO : section that shows other user data, and allows changing it -->
    <!-- TODO : Allow users to add their social account links -->
    <!-- TODO : Show your recipes, allow performing actions on them -->
  </div>
</template>
