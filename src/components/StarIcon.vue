<script setup lang="ts">
interface StarIconProps {
  maskWidth: string;
  fill?: string;
}

const { fill, maskWidth } = defineProps<StarIconProps>();
</script>

<template>
  <svg
    v-if="maskWidth !== '0%' && maskWidth !== '100%'"
    xmlns="http://www.w3.org/2000/svg"
    width="2em"
    height="2em"
    viewBox="0 0 24 24"
  >
    <defs>
      <mask id="star-mask-dynamic" x="0" y="0" width="100%" height="100%">
        <rect x="0" y="0" width="100%" height="100%" fill="black" />
        <rect x="0" y="0" :width="maskWidth" height="100%" fill="goldenrod" />
      </mask>
    </defs>
    <path
      :fill="fill || 'none'"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
    ></path>
    <path
      :fill="fill || 'goldenrod'"
      stroke="none"
      d="m12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
      mask="url(#star-mask-dynamic)"
    ></path>
  </svg>

  <svg
    v-else-if="maskWidth === '0%'"
    xmlns="http://www.w3.org/2000/svg"
    width="2em"
    height="2em"
    viewBox="0 0 24 24"
  >
    <path
      :fill="fill || 'none'"
      stroke="none"
      d="m12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
      mask="url(#star-mask-none)"
    ></path>
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
    ></path>
  </svg>

  <svg
    v-else
    xmlns="http://www.w3.org/2000/svg"
    width="2em"
    height="2em"
    viewBox="0 0 24 24"
  >
    <defs>
      <mask id="star-mask-partial" x="0" y="0" width="100%" height="100%">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <rect x="0" y="0" width="100%" height="100%" fill="goldenrod" />
      </mask>
    </defs>
    <path
      :fill="fill || 'goldenrod'"
      stroke="none"
      d="m12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
      mask="url(#star-mask-partial)"
    ></path>
    <path
      :fill="fill || 'none'"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="m12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
    ></path>
  </svg>
</template>
