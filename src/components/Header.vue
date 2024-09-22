<script setup lang="ts">
import NavLink from "@/components/NavLink.vue";
import ToggleTheme from "@/components/ToggleTheme.vue";
import SelectLang from "@/components/SelectLang.vue";
import SideBarButton from "@/components/SideBar/SideBarButton.vue";
import Button from "@/components/Button.vue";
import { useRoute } from "vue-router";
import { isAuthPath } from "@/utils/isAuthPath";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

const route = useRoute();
const authStore = useAuthStore();
const { fireUser } = storeToRefs(authStore);
</script>

<template>
  <header
    class="sticky z-50 top-0 left-0 right-0 bg-add backdrop-blur-xl border-y border-add py-3 pr-6 pl-1 sm:pl-6 flex items-center"
  >
    <SideBarButton />

    <SelectLang />

    <nav
      class="flex items-center justify-around sm:justify-center w-full xs:gap-x-6 sm:gap-x-10 md:gap-x-14 lg:gap-x-20 text-primary font-merri mx-auto"
    >
      <NavLink to="/">
        <i class="material-symbols-outlined sm:text-2xl">house</i>

        <p class="hidden xs:block">
          {{ $t("home") }}
        </p>
      </NavLink>
      <NavLink to="/recipes">
        <i class="material-symbols-outlined">menu_book</i>

        <p class="hidden xs:block">
          {{ $t("recipes") }}
        </p>
      </NavLink>
    </nav>

    <!-- TODO : get rid of that logout -->
    <button
      v-if="fireUser?.emailVerified"
      @click="signOut(auth)"
      class="p-1 border-primary text-primary whitespace-nowrap"
    >
      Log Out
    </button>

    <div
      v-if="!isAuthPath(route.fullPath)"
      class="hidden sm:block mr-5 lg:mr-10"
    >
      <Button variation="outlined" asChild color="white">
        <RouterLink v-if="fireUser == null" to="/sign-in" class="px-2 py-1"
          >Sign In</RouterLink
        >
        <RouterLink
          v-else-if="fireUser.emailVerified"
          to="/profile"
          class="px-2 py-1"
          >Profile</RouterLink
        >
      </Button>
    </div>

    <ToggleTheme />
  </header>
</template>

<style scoped>
.material-symbols-outlined {
  @apply sm:text-4xl;
}
</style>
