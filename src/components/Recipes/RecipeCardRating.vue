<script setup lang="ts">
import { ref } from "vue";
import StarIcon from "@/components/Icons/StarIcon.vue";
import ManIcon from "@/components/Icons/ManIcon.vue";

interface RecipeCardRatingProps {
  rating: number;
  totalRates: number;
  isMore?: boolean;
}

const { rating, totalRates, isMore } = defineProps<RecipeCardRatingProps>();

// TODO : make real rating
const newRating = ref(0);

function handleRate(point: number) {
  if (newRating.value === point) {
    newRating.value = 0;
  } else {
    newRating.value = point;
  }
}

function getMaskWidth(star: number) {
  const starCount = 5;
  const percentagePerStar = 100 / starCount;

  const starStart = (star - 1) * percentagePerStar;
  const starEnd = star * percentagePerStar;

  if (starEnd < rating) {
    return "100%";
  } else if (starStart > rating) {
    return "0%";
  }

  const filledPercentage = ((rating - starStart) / percentagePerStar) * 100;
  return `${filledPercentage}%`;
}
</script>

<template>
  <h3 v-if="isMore" class="text-sm mt-3">{{ $t("rateTheRecipe") }}:</h3>
  <div
    :class="`bottom-1 left-0 right-0 text-[goldenrod] flex  pr-2 items-center ${
      isMore
        ? 'justify-start xs:gap-x-5 mt-2 mb-4'
        : 'rating absolute z-30 justify-between'
    }`"
  >
    <div class="flex items-center gap-x-1 px-2">
      <button
        v-for="star in [1, 2, 3, 4, 5]"
        :key="star"
        @click="handleRate(20 * star)"
      >
        <StarIcon
          class="text-xs xs:text-sm lg:text-base xl:text-sm"
          :fill="newRating >= 20 * star ? 'goldenrod' : undefined"
          :mask-width="getMaskWidth(star)"
        />
      </button>
    </div>

    <div
      class="flex items-center gap-x-1.5 ml-0.5 mt-2"
      :title="$t('peopleRatedAmount', { amount: totalRates })"
    >
      <span class="text-shadow text-sm flex items-center">{{ rating }}% </span>
      <span class="border border-[goldenrod] h-3.5"></span>
      <span class="flex items-center text-sm xs:text-base">
        {{ totalRates }} <ManIcon class="text-base xs:text-lg" />
      </span>
    </div>
  </div>
</template>

<style scoped>
@media (pointer: fine) {
  .rating {
    @apply translate-y-full opacity-0 duration-200 group-hover:opacity-100 group-hover:translate-y-0;
  }
}
</style>
