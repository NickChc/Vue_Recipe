<script setup lang="ts">
import { ref } from "vue";
import StarIcon from "@/components/StarIcon.vue";

interface RecipeCardRatingProps {
  rating: number;
}

const { rating } = defineProps<RecipeCardRatingProps>();

const newRating = ref(0);

function handleRate(point: number) {
  if (newRating.value === point) {
    newRating.value = 0;
  } else {
    newRating.value = point;
  }
}
</script>

<template>
  <div
    class="rating flex items-center gap-x-1 absolute bottom-1 px-2 text-[goldenrod]"
  >
    <button
      v-for="star in [1, 2, 3, 4, 5]"
      :key="star"
      @click="handleRate(20 * star)"
    >
      <StarIcon :fill="newRating >= 20 * star ? 'goldenrod' : undefined" />
    </button>
  </div>
</template>

<style scoped>
@media (pointer: fine) {
  .rating {
    @apply translate-y-full opacity-0 duration-200 group-hover:opacity-100 group-hover:translate-y-0;
  }
}
</style>
