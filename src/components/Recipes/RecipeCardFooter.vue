<script setup lang="ts">
import { TComplexity_Enum, TRecipe } from "@/@types/general";
import { ref } from "vue";
import RecipeCardRating from "@/components/Recipes/RecipeCardRating.vue";
import ManIcon from "../Icons/ManIcon.vue";

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
    <h5
      class="flex items-center justify-start mb-1"
      :title="$t('serveFor', { count: recipe.servings })"
    >
      {{ $t("servings") }} -
      <ManIcon
        v-if="recipe.servings < 7"
        v-for="man in recipe.servings"
        :key="man"
      />
      <div v-else class="flex items-center">
        <ManIcon v-for="man in 7" :key="man" /> +
      </div>
    </h5>
    <hr class="w-full border-add mb-2" />
    <div
      class="flex flex-col sm:justify-between gap-y-3 xs:gap-y-3 xs:gap-x-4 xs:flex-row"
    >
      <div
        class="flex flex-col gap-y-2 items-start sm:items-center lg:flex-row lg:gap-x-3 min-w-[50%] sm:text-lg 2xl:text-xl"
      >
        <strong class="text-add max-w-[50%] min-w-fit"
          >{{ $t("author", { name: recipe.author.name }) }}
        </strong>

        <button
          :class="`w-full xs:w-fit text-sm sm:text-base lg:text-lg text-add flex items-center justify-center gap-x-2 border border-add rounded-sm px-4 py-0.5 font-semibold duration-200 transition-colors ${
            isSubscribed ? 'bg-add text-primary' : 'text-add'
          }`"
          @click="isSubscribed = !isSubscribed"
        >
          <template v-if="isSubscribed">
            {{ $t("unsubscribe") }}
            <i class="material-symbols-outlined note">notifications_active</i>
          </template>

          <template v-else>
            {{ $t("subscribe") }}
            <i class="material-symbols-outlined note">notifications</i>
          </template>
        </button>
      </div>
      <p class="text-sm sm:text-base text-add">
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
    <span
      class="flex items-center text-xs xs:text-sm"
      :title="$t('estimatedTimeOfCooking')"
    >
      <i class="material-symbols-outlined alarm">alarm</i>
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

<style scoped>
i.note {
  @apply text-xl lg:text-2xl;
}

i.alarm {
  @apply mr-1 text-base xs:text-lg;
}
</style>
