<script setup lang="ts">
import { useGlobalStore } from "@/stores/globalStore";
import { storeToRefs } from "pinia";
import SideBarThemeToggle from "@/components/SideBar/SideBarThemeToggle.vue";
import { onBeforeUnmount, onMounted, watch } from "vue";
import SideBarLangSelect from "@/components/SideBar/SideBarLangSelect.vue";
import Button from "../Button.vue";
import { RouterLink, useRoute } from "vue-router";

const globalStore = useGlobalStore();
const { sideBarOpen } = storeToRefs(globalStore);

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

<template>
  <div
    :class="`bg overflow-hidden  border-r-2 border-add p-3 h-full sm:hidden fixed top-0 bottom-0 z-50 duration-500 transition-all ease-in w-[calc(100vw-var(--width-sidebar-btn))] text-add ${
      sideBarOpen ? 'left-0 opacity-100' : '-left-full opacity-0'
    }`"
  >
    <h2 class="text-2xl font-semibold">{{ $t("menu") }}</h2>
    <ul
      class="list-none flex flex-col gap-y-3 mt-5 w-full xs:w-[80%] mx-auto max-h-[90%] overflow-x-hidden overflow-y-auto"
    >
      <li>
        <SideBarThemeToggle />
      </li>

      <hr class="border border-secondary dark:border-primary" />

      <li>
        <SideBarLangSelect />
      </li>

      <!-- <hr class="border border-secondary dark:border-primary" /> -->

      <li
        v-if="!route.fullPath.endsWith('/sign-in')"
        class="flex flex-col items-stretch"
      >
        <Button variation="outlined" asChild @click="sideBarOpen = false">
          <RouterLink
            class="px-2 py-1 flex items-center justify-center gap-x-2"
            to="/sign-in"
          >
            <i class="material-symbols-outlined">account_circle</i>
            Sign In</RouterLink
          >
        </Button>
      </li>
    </ul>
  </div>
</template>
