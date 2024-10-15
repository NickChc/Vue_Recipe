<script setup lang="ts">
import { useRoute } from "vue-router";

interface NavLinkProps {
  to: string;
}

const route = useRoute();

const { to } = defineProps<NavLinkProps>();
</script>

<template>
  <RouterLink
    :class="`font-merri text-xs sm:text-2xl md:text-3xl flex items-center gap-x-0.5 sm:gap-x-3 font-bold ${
      route.fullPath.endsWith(to) ? 'text-add-2 pointer-events-none ' : ''
    }`"
    :to="to"
  >
    <slot></slot>
  </RouterLink>
</template>
