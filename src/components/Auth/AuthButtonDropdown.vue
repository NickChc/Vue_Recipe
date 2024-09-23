<script setup lang="ts">
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";

const dropdownOpen = ref(false);

const authStore = useAuthStore();
const { loadingAuth } = storeToRefs(authStore);

function handleClick(event: MouseEvent) {
  const dropdownElement = document.getElementById("dropdown");
  const container = document.getElementById("container");

  if (dropdownElement && !container!.contains(event.target as Node)) {
    dropdownOpen.value = false;
  }
}

watch(dropdownOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener("click", handleClick);
  } else {
    document.removeEventListener("click", handleClick);
  }
});
</script>

<template>
  <div id="container" class="relative">
    <button
      :class="`p-1 border-2 grid whitespace-nowrap rounded-full ${
        dropdownOpen
          ? 'border-primary bg-primary dark:border-secondary dark:bg-secondary text-secondary dark:text-primary cursor-default'
          : 'border-primary dark:border-secondary text-primary dark:text-secondary '
      }`"
      @click="dropdownOpen = !dropdownOpen"
    >
      <i class="material-symbols-outlined">person</i>
    </button>

    <ul
      v-if="dropdownOpen"
      id="dropdown"
      class="list-none bg-primary absolute right-1/2 px-2 py-1 rounded-sm shadow-2xl hover:shadow-none"
    >
      <li
        class="text-secondary duration-200 transition-opacity hover:opacity-75"
      >
        <RouterLink
          to="/profile"
          class="flex items-center justify-between gap-x-2 whitespace-nowrap"
          >{{ $t("profile") }}
          <i class="material-symbols-outlined">arrow_forward</i>
        </RouterLink>
      </li>
      <hr class="border-secondary my-1" />
      <li class="duration-200 transition-opacity hover:opacity-75 text-danger">
        <button
          @click="authStore.handleSignOut"
          class="flex items-center justify-between gap-x-2 whitespace-nowrap"
        >
          {{ loadingAuth ? $t("loggingOut") + "..." : $t("logOut", "LOG OUT") }}
          <i class="material-symbols-outlined">logout</i>
        </button>
      </li>
    </ul>
  </div>
</template>
