<script setup lang="ts">
import { useGlobalStore } from "@/stores/globalStore";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import SideBarThemeToggle from "@/components/sideBar/SideBarThemeToggle.vue";
import { onBeforeUnmount, onMounted, watch } from "vue";
import SideBarLangSelect from "@/components/sideBar/SideBarLangSelect.vue";
import Button from "@/components/Button.vue";
import { RouterLink, useRoute } from "vue-router";
import RecipesFilter from "../recipesFilters/RecipesFilter.vue";

const globalStore = useGlobalStore();
const { sideBarOpen } = storeToRefs(globalStore);

const authStore = useAuthStore();
const { currentUser, loadingAuth } = storeToRefs(authStore);

const route = useRoute();

function handleResize() {
  sideBarOpen.value = false;
}

watch(sideBarOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflowY = "hidden";
    document.body.style.position = "fixed";
  } else {
    document.body.style.overflowY = "auto";
    document.body.style.position = "";
  }
});

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<!-- TODO : add a filtered navigation here -->

<template>
  <div
    :class="`bg-priamry dark:bg-secondary overflow-hidden border-r-2 border-add p-1.5 h-full sm:hidden fixed top-0 bottom-0 z-40 duration-[400ms] ease-in w-[calc(100vw-var(--width-sidebar-btn))] text-add ${
      sideBarOpen ? 'left-0 opacity-100' : '-left-full opacity-0'
    }`"
  >
    <h2 class="text-2xl font-semibold">{{ $t("menu") }}</h2>
    <ul
      class="scrollbar-small list-none flex flex-col gap-y-3 mt-5 w-full xs:w-[80%] mx-auto pb-10 min-h-[90%] max-h-[90%] overflow-x-hidden overflow-y-auto"
    >
      <li>
        <SideBarThemeToggle />
      </li>

      <hr class="border border-secondary dark:border-primary" />

      <li>
        <SideBarLangSelect />
      </li>

      <li v-if="loadingAuth" class="mx-auto opacity-75 animate-spin-3/2 grid">
        <i class="material-symbols-outlined text-4xl">hourglass_empty</i>
      </li>

      <template v-else-if="currentUser && !route.fullPath.endsWith('/profile')">
        <li class="grid">
          <Button variation="outlined" asChild @click="sideBarOpen = false">
            <RouterLink
              class="px-2 py-1 flex items-center justify-between gap-x-2 h-8"
              to="/profile"
            >
              {{ $t("profile") }}

              <i class="material-symbols-outlined">account_circle</i>
            </RouterLink>
          </Button>
        </li>

        <li class="w-full grid">
          <Button asChild variation="outlined" @click="authStore.handleSignOut">
            <div
              class="flex items-center justify-between gap-x-2 px-2 py-1 h-8"
            >
              {{ $t("logOut") }}
              <i class="material-symbols-outlined text-xl font-semibold"
                >logout</i
              >
            </div>
          </Button>
        </li>
      </template>

      <li v-else-if="!route.fullPath.endsWith('/sign-in')" class="grid">
        <Button variation="outlined" asChild @click="sideBarOpen = false">
          <RouterLink
            class="px-2 py-1 flex items-center justify-center gap-x-2"
            to="/sign-in"
          >
            <i class="material-symbols-outlined">account_circle</i>
            {{ $t("signIn") }}</RouterLink
          >
        </Button>
      </li>
      <li v-if="!route.fullPath.endsWith('/recipes')">
        <div>
          <RecipesFilter />
        </div>
      </li>
    </ul>
  </div>
</template>
