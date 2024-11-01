<script setup lang="ts">
import { ref, watch } from "vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import StarIcon from "@/components/icons/StarIcon.vue";
import ManIcon from "@/components/icons/ManIcon.vue";
import { sendToast } from "@/utils/sendToast";
import { useAuthStore } from "@/stores/authStore";
import { updateRecipe } from "@/data/updateRecipe";
import { TRecipe } from "@/@types/general";
import { useGetCurrentRecipe } from "@/composables/useGetCurrentRecipe";
import { updateUser } from "@/data/updateUser";
import { useRecipesStore } from "@/stores/recipesStore";

interface RecipeCardRatingProps {
  recipe: TRecipe;
  show?: boolean;
  isMore?: boolean;
}

const { recipe, isMore, show } = defineProps<RecipeCardRatingProps>();

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

const recipesStore = useRecipesStore();

const { handleGetRecipeById } = useGetCurrentRecipe();

const { t } = useI18n();

const recipeRates = ref(recipe.rates);

const authWarning = ref(0);

const userRating = computed(() => {
  return recipeRates.value.find(
    (rate) => rate.user_id === currentUser.value?.id
  )?.point;
});

const ratingPercentage = computed(() => {
  if (!recipeRates.value.length) return 0;

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

    sendToast("info", t("authToRate"), { limit: 3 });
    authWarning.value++;
    return;
  }

  try {
    const existingRate = recipeRates.value.find(
      (rate) => rate.user_id === currUser.id
    );

    const existingUserRate = currUser.rates.find(
      (rate) => rate.recipe_id === recipe.id
    );

    let newUserRates: {
      recipe_id: string;
      recipe_title: string;
      point: number;
    }[] = [];

    if (existingUserRate) {
      if (existingUserRate.point === point) {
        newUserRates = currUser.rates.filter((r) => r.recipe_id !== recipe.id);
      } else {
        newUserRates = currUser.rates.map((r) =>
          r.recipe_id === recipe.id ? { ...r, point } : r
        );
      }
    } else {
      newUserRates = [
        ...currUser.rates,
        { recipe_id: recipe.id, recipe_title: recipe.title, point },
      ];
    }

    await updateUser(currUser.id, {
      rates: newUserRates,
    });

    let newRates: { user_id: string; point: number }[] = [];

    if (existingRate) {
      if (existingRate.point === point) {
        newRates = recipeRates.value.filter(
          (rate) => rate.user_id !== currUser.id
        );
      } else {
        newRates = recipeRates.value.map((rate) =>
          rate.user_id === currUser.id ? { ...rate, point } : rate
        );
      }

      const newRating =
        newRates.reduce((acc, curr) => (acc += curr.point), 0) /
        newRates.length;

      await updateRecipe(recipe.id, {
        rates: newRates,
        rating: newRating,
      });

      recipeRates.value = newRates;
    } else {
      newRates = [...recipeRates.value, { user_id: currUser.id, point }];
      recipeRates.value = newRates;

      const newRating =
        newRates.reduce((acc, curr) => (acc += curr.point), 0) /
        newRates.length;

      await updateRecipe(recipe.id, {
        rates: newRates,
        rating: newRating,
      });

      await updateRecipe(recipe.id, {
        rates: newRates,
        rating: newRating,
      });

      await handleGetRecipeById(recipe.id);
    }

    authStore.setCurrentUser({
      ...currUser,
      rates: newUserRates,
    });
    recipesStore.fetchRecipeData();
  } catch (err: any) {
    console.log(err.message);
    sendToast("error", t("problemOccuredTryAgain"));
    recipeRates.value = recipe.rates;
    authStore.setCurrentUser(currUser);
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

watch(
  () => recipe.rates,
  (rates) => {
    recipeRates.value = rates;
  }
);
</script>

<template>
  <h3 v-if="isMore" class="text-sm mt-3">{{ $t("rateTheRecipe") }}:</h3>
  <div
    :class="`bottom-1 left-0 right-0 text-[goldenrod] overflow-hidden flex  pr-2  max-w-full ${
      isMore
        ? 'justify-start gap-x-2 mt-2 mb-4 gap-x-5 items-center'
        : show
        ? 'items-end gap-x-2 justify-between'
        : 'pointer-fine:translate-y-full pointer-fine:opacity-0 pointer-fine:duration-200 pointer-fine:group-hover:opacity-100 pointer-fine:group-hover:translate-y-0 absolute z-30 justify-between items-center'
    }`"
  >
    <div :class="`flex items-center gap-x-0.5 ${show ? '' : 'px-1'}`">
      <button
        v-for="star in [1, 2, 3, 4, 5]"
        :key="star"
        @click="handleRate(20 * star)"
      >
        <StarIcon
          :class="
            show
              ? 'text-[clamp(0.5rem,1vw+0.5rem,1rem)] sm:text-xs lg:text-[0.75rem] xl:text-sm'
              : 'text-xs xs:text-sm lg:text-base xl:text-sm'
          "
          :fill="userRating! >= 20 * star ? 'goldenrod' : undefined"
          :mask-width="getMaskWidth(star)"
        />
      </button>
    </div>

    <div
      class="flex items-center gap-x-0.5 xs:gap-x-1.5 ml-0.5 mt-2"
      :title="$t('peopleRatedAmount', { amount: recipe.rates.length })"
    >
      <span class="text-shadow text-sm flex items-center"
        >{{ ratingPercentage }}%
      </span>
      <span class="border border-[goldenrod] h-3.5"></span>
      <span
        :class="`flex items-center  ${
          show ? 'text-sm xs:text-sm' : 'text-sm xs:text-base'
        }`"
      >
        {{ recipeRates.length }} <ManIcon class="text-base xs:text-lg" />
      </span>
    </div>
  </div>
</template>
