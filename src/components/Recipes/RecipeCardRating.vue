<script setup lang="ts">
import { ref } from "vue";
import StarIcon from "@/components/Icons/StarIcon.vue";
import ManIcon from "@/components/Icons/ManIcon.vue";
import { sendToast } from "@/utils/sendToast";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { updateRecipe } from "@/data/updateRecipe";
import { TRecipe } from "@/@types/general";
import { useGetCurrentRecipe } from "@/composables/useGetCurrentRecipe";
import { computed } from "vue";

interface RecipeCardRatingProps {
  totalRating: number;
  recipe: TRecipe;
  isMore?: boolean;
}

const { recipe, isMore, totalRating } = defineProps<RecipeCardRatingProps>();

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

const { handleGetRecipeById } = useGetCurrentRecipe(recipe.id);

const { t } = useI18n();

const recipeRates = ref(recipe.rates);
// const newRating = ref(0);

const authWarning = ref(0);

const userRating = computed(() => {
  return recipeRates.value.find(
    (rate) => rate.user_id === currentUser.value?.id
  )?.point;
});

const ratingPercentage = computed(() => {
  const sumOfPoints = recipeRates.value.reduce(
    (acc, prev) => (acc += prev.point),
    0
  );

  return Math.floor(sumOfPoints / recipeRates.value.length);
});

async function handleRate(point: number) {
  const currUser = currentUser.value;

  if (currUser == null) {
    if (authWarning.value > 2) {
      setTimeout(() => {
        authWarning.value = 0;
      }, 5000);

      return;
    }

    sendToast("error", t("authPersonOnly"), { limit: 3 });
    authWarning.value++;
    return;
  }

  try {
    const existingRate = recipeRates.value.find(
      (rate) => rate.user_id === currUser.id
    );

    let newRates: { user_id: string; point: number }[] = [];

    if (existingRate) {
      if (existingRate.point === point) {
        newRates = recipeRates.value.filter(
          (rate) => rate.user_id !== currUser.id
        );

        // newRating.value = 0;
      } else {
        newRates = recipeRates.value.map((rate) =>
          rate.user_id === currUser.id ? { ...rate, point } : rate
        );
      }

      await updateRecipe(recipe.id, {
        rates: newRates,
      });

      recipeRates.value = newRates;
      return;
    }

    newRates = [...recipeRates.value, { user_id: currUser.id, point }];
    recipeRates.value = newRates;

    await updateRecipe(recipe.id, {
      rates: newRates,
    });

    await handleGetRecipeById(recipe.id);
  } catch (err: any) {
    console.log(err.message);
    sendToast("error", t("problemOccuredTryAgain"));
    recipeRates.value = recipe.rates;
  }
}

function getMaskWidth(star: number) {
  const starCount = 5;
  const percentagePerStar = 100 / starCount;

  const starStart = (star - 1) * percentagePerStar;
  const starEnd = star * percentagePerStar;

  if (starEnd < ratingPercentage.value) {
    return "100%";
  } else if (starStart > ratingPercentage.value) {
    return "0%";
  }

  const filledPercentage =
    ((ratingPercentage.value - starStart) / percentagePerStar) * 100;
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
          :fill="userRating! >= 20 * star ? 'goldenrod' : undefined"
          :mask-width="getMaskWidth(star)"
        />
      </button>
    </div>

    <div
      class="flex items-center gap-x-1.5 ml-0.5 mt-2"
      :title="$t('peopleRatedAmount', { amount: totalRating })"
    >
      <span class="text-shadow text-sm flex items-center"
        >{{ ratingPercentage }}%
      </span>
      <span class="border border-[goldenrod] h-3.5"></span>
      <span class="flex items-center text-sm xs:text-base">
        {{ recipeRates.length }} <ManIcon class="text-base xs:text-lg" />
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
