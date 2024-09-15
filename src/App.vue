<script setup lang="ts">
import { RouterView } from "vue-router";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
import { useGlobalStore } from "@/stores/globalStore";
import { storeToRefs } from "pinia";

const globalStore = useGlobalStore();
const { sideBarOpen } = storeToRefs(globalStore);
</script>

<template>
  <SideBar />
  <div
    :class="`duration-500 transition-transform sm:transition-none ease-in ${
      sideBarOpen
        ? `translate-x-[calc(100vw-var(--width-sidebar-btn))]`
        : 'translate-x-0'
    }`"
  >
    <Header />
    <div class="p-2">
      <RouterView />
    </div>
  </div>
  <!-- TODO : add a footer -->
</template>
