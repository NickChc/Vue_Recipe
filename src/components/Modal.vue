slot
<script setup lang="ts">
import { useGlobalStore } from "@/stores/globalStore";

const globalStore = useGlobalStore();
</script>

<template>
  <div
    v-if="globalStore.modalOpen"
    @mousedown="globalStore.toggleModal"
    class="fixed inset-0 z-50 bg-[rgba(0,0,0,0.7)]"
  >
    <div class="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
      <div
        @mousedown="(e) => e.stopPropagation()"
        class="overflow-hidden scale-increase origin-center scale-0"
        :class="{ open: globalStore.modalOpen }"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scale-increase {
  transition: display 300ms, transform 300ms;
  transition-behavior: allow-discrete;
}

.scale-increase.open {
  transform: scale(1);

  @starting-style {
    transform: scale(0) !important;
  }
}
</style>
