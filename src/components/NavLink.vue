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
    :class="`xs:text-xl sm:text-3xl font-bold ${
      route.fullPath.endsWith(to)
        ? 'opacity-80 font-merri pointer-events-none '
        : ''
    }`"
    :to="to"
  >
    <slot></slot>
  </RouterLink>
</template>
