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
    @touchmove="
      (e) => {
        if (sideBarOpen) {
          e.preventDefault();
        }
      }
    "
    :class="`duration-[400ms] transition-transform sm:transition-none ease-in h-full overflow-hidden touch-none ${
      sideBarOpen
        ? `translate-x-[calc(100%-var(--width-sidebar-btn))] sm:translate-x-0 touch-none overflow-hidden`
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
