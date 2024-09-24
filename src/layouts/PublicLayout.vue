<script setup lang="ts">
import { RouterView } from "vue-router";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar/SideBar.vue";
import { useGlobalStore } from "@/stores/globalStore";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();
const { sideBarOpen } = storeToRefs(globalStore);
</script>

<template>
  <SideBar />
  <div
    :class="`duration-500 transition-transform sm:transition-none ease-in h-full overflow-hidden ${
      sideBarOpen
        ? `translate-x-[calc(100%-var(--width-sidebar-btn))] sm:translate-x-0`
        : 'translate-x-0'
    }`"
  >
    <Header />
    <div class="h-full overflow-y-auto">
      <RouterView />
    </div>
  </div>
  <!-- TODO : add a footer -->
</template>
