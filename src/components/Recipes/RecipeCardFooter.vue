<script setup lang="ts">
import { TComplexity_Enum, TRecipe } from "@/@types/general";
import { ref } from "vue";
import RecipeCardRating from "@/components/Recipes/RecipeCardRating.vue";

interface RecipeCardFooterProps {
  recipe: TRecipe;
  isMore?: boolean;
  totalRates: number;
}

const { isMore, recipe, totalRates } = defineProps<RecipeCardFooterProps>();

// TODO : make real subscribe thing
const isSubscribed = ref(false);

function checkLevel(iconIndex: number) {
  const totalCases = Object.values(TComplexity_Enum);
  const lvlIndex = totalCases.indexOf(recipe.complexity);

  if (iconIndex <= lvlIndex) {
    return true;
  }

  return false;
}
</script>

<template>
  <template v-if="isMore">
    <hr class="w-full border-add mb-2" />
    <div
      class="flex flex-col sm:justify-between gap-y-3 xs:gap-y-3 xs:gap-x-4 xs:flex-row"
    >
      <div
        class="flex flex-col gap-y-2 items-start sm:items-center lg:flex-row lg:gap-x-3 min-w-[50%]"
      >
        <strong class="text-add max-w-[50%] min-w-fit"
          >{{ $t("author", { name: recipe.author.name }) }}
        </strong>

        <button
          :class="`text-sm text-add flex items-center gap-x-2 border border-add rounded-sm px-4 py-0.5 font-semibold duration-200 transition-colors ${
            isSubscribed ? 'bg-add text-primary' : 'text-add'
          }`"
          @click="isSubscribed = !isSubscribed"
        >
          <template v-if="isSubscribed">
            {{ $t("unsubscribe") }}
            <i
              class="material-symbols-outlined mt-1"
              :style="{ fontSize: '1.2rem' }"
              >notifications_active</i
            >
          </template>

          <template v-else>
            {{ $t("subscribe") }}
            <i
              class="material-symbols-outlined mt-1"
              :style="{ fontSize: '1.2rem' }"
              >notifications</i
            >
          </template>
        </button>
      </div>
      <p class="text-sm text-add">
        {{ $t("subscribeTip") }}
      </p>
    </div>
    <hr class="w-full border-add mt-2" />
    <RecipeCardRating isMore :rating="recipe.rating" :totalRates="totalRates" />
  </template>

  <strong v-else class="text-add max-w-full truncate"
    >{{ $t("author", { name: recipe.author.name }) }}
  </strong>

  <div
    :class="`flex justify-between gap-x-1 items-center text-xs xs:text-sm ${
      isMore ? 'sm:text-lg text-primary' : 'text-add-2 dark:text-primary'
    }`"
  >
    <span class="flex items-center" :title="$t('estimatedTimeOfCooking')">
      <i class="material-symbols-outlined mr-1" :style="{ fontSize: '1rem' }"
        >alarm</i
      >
      -
      {{ recipe.cooking_time }} {{ $t("min") }}
    </span>

    <div
      v-if="isMore"
      class="flex flex-col sm:flex-row sm:gap-x-2 items-center gap-y-1 text-add select-none"
      :title="$t('complexityTitle')"
    >
      <div class="flex items-center gap-x-1">
        <i
          v-for="(lvl, index) in Object.values(TComplexity_Enum)"
          :key="lvl"
          class="material-symbols-outlined text-xs sm:text-base"
          >{{
            checkLevel(index)
              ? "radio_button_checked"
              : "radio_button_unchecked"
          }}</i
        >
      </div>

      <strong class="hidden sm:block">-</strong>

      <span>
        {{
          $t(`complexity.${recipe.complexity}`, recipe.complexity.toUpperCase())
        }}</span
      >
    </div>
    <span v-else>
      {{
        $t(`complexity.${recipe.complexity}`, recipe.complexity.toUpperCase())
      }}</span
    >
    <RouterLink
      v-if="!isMore"
      class="text-secondary dark:text-add duration-200 transition-colors hover:text-add active:opacity-75 flex items-center"
      :to="`/recipes/${recipe.id}`"
    >
      <p class="underline">{{ $t("more") }}</p>
      <i class="material-symbols-outlined text-xl">chevron_right</i>
    </RouterLink>
  </div>
</template>
