<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { isAuthPath } from "@/utils/isAuthPath";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import Button from "@/components/Button.vue";
import AuthButtonDropdown from "@/components/Auth/AuthButtonDropdown.vue";
import { computed } from "vue";

const route = useRoute();

const notProfilePage = computed(() => {
  return route.fullPath.endsWith("/profile") ? false : true;
});

const authStore = useAuthStore();
const { currentUser, loadingAuth } = storeToRefs(authStore);
</script>

<template>
  <div v-if="notProfilePage" class="select-none">
    <span
      v-if="loadingAuth"
      class="animate-spin-3/2 grid select-none opacity-75"
    >
      <i class="material-symbols-outlined" :style="{ fontSize: '1.8rem' }"
        >hourglass_empty</i
      >
    </span>

    <AuthButtonDropdown v-else-if="currentUser" />

    <div v-else-if="!isAuthPath(route.fullPath)" class="hidden sm:block">
      <Button variation="outlined" asChild color="white">
        <RouterLink
          v-if="currentUser == null"
          to="/sign-in"
          class="px-2 py-1"
          >{{ $t("signIn") }}</RouterLink
        >
        <RouterLink v-else-if="currentUser" to="/profile" class="px-2 py-1">{{
          $t("profile")
        }}</RouterLink>
      </Button>
    </div>
  </div>
</template>
