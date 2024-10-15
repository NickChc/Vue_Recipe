<script setup lang="ts">
import { TComplexity_Enum, TRecipe } from "@/@types/general";
import RecipeCardRating from "@/components/recipes/RecipeCardRating.vue";
import ManIcon from "@/components/icons/ManIcon.vue";
import { checkRecipeComplexity } from "@/utils/checkRecipeComplexity";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import SubscribeButton from "@/components/recipes/SubscribeButton.vue";

interface RecipeCardFooterProps {
  recipe: TRecipe;
  isMore?: boolean;
  totalRates: number;
}

const { isMore, recipe, totalRates } = defineProps<RecipeCardFooterProps>();

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

const { t } = useI18n();
</script>

<template>
  <template v-if="isMore">
    <h5
      class="flex items-center justify-start mb-1"
      :title="`${$t('serveFor', { count: recipe.servings })} ${
        recipe.servings === 1 ? $t('person') : $t('people')
      }`"
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
        <template v-if="currentUser?.id !== recipe.user_id">
          <strong class="text-add max-w-[50%] min-w-fit"
            >{{ $t("author", { name: recipe.author.name }) }}
          </strong>

          <SubscribeButton v-if="currentUser" :recipe="recipe" />
        </template>
        <strong v-else class="text-[#08a408] max-w-[50%] min-w-fit"
          >{{ $t("author") }}
          <span class="]">{{ $t("you") }}</span>
        </strong>
      </div>
      <p
        v-if="currentUser?.id !== recipe.user_id"
        class="text-sm sm:text-base text-add"
      >
        {{ $t("subscribeTip") }}
      </p>
    </div>
    <hr class="w-full border-add mt-2" />
    <RecipeCardRating isMore :recipe="recipe" />
  </template>

  <strong
    v-else-if="currentUser?.id === recipe.user_id"
    class="text-success max-w-full truncate"
    >{{ $t("author") }}
    <span class="]">{{ $t("you") }}</span>
  </strong>

  <strong v-else class="text-add max-w-full truncate"
    >{{ $t("author", { name: recipe.author.name }) }}
  </strong>

  <div
    :class="`flex pb-3 gap-x-4 items-center text-xs xs:text-sm ${
      isMore
        ? 'sm:text-lg text-primary justify-between'
        : 'justify-start text-add-2 dark:text-primary'
    }`"
  >
    <span
      class="flex items-center text-xs sm:text-sm whitespace-nowrap"
      :title="$t('estimatedTimeOfCooking')"
    >
      <i class="material-symbols-outlined alarm">alarm</i>
      {{ recipe.cooking_time.replace("min", t("min")).replace("hr", t("hr")) }}
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
            checkRecipeComplexity(index, recipe.complexity)
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
      class="text-secondary dark:text-add duration-200 transition-colors hover:text-add active:opacity-75 flex items-center absolute bottom-1 right-1"
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
