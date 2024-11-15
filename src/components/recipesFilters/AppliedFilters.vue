<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRecipesStore } from "@/stores/recipesStore";
import { computed } from "vue";
import { TCookingTime_Enum } from "@/@types/general";
import Button from "../Button.vue";
import { INITIAL_FILTERS } from "@/config/data";

const recipesStore = useRecipesStore();

const { filters } = storeToRefs(recipesStore);

const hasFilters = computed(() => {
  const appliedFilters = filters.value;
  if (
    appliedFilters.categories.length > 0 ||
    appliedFilters.diets.length > 0 ||
    appliedFilters.complexity != null ||
    appliedFilters.highRating ||
    appliedFilters.cookingTime != null
  ) {
    return true;
  }

  return false;
});
</script>

<template>
  <div
    :class="`grid w-full duration-300 transition-[grid-template-rows,opacity] ${
      hasFilters ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
    }`"
  >
    <div :class="`overflow-hidden ${hasFilters ? '' : 'opacity-0 invisible'}`">
      <h4 class="font-bold text-center px-3 text-sm xs:text-base mt-2">
        {{ $t("appliedFilters").toLocaleUpperCase() }}
      </h4>

      <hr class="my-2" />

      <div v-if="filters.categories.length > 0">
        <h5
          class="flex items-center gap-x-2 font-bold mx-2 mb-0.5 text-base lg:text-lg"
        >
          {{ $t("categories") }}
          <i class="material-symbols-outlined">keyboard_arrow_down</i>
        </h5>
        <span
          class="px-1 text-xs xs:text-sm sm:text-sm py-0.5 m-1 bg-primary font-semibold text-add-2 rounded-md"
          v-for="cat in filters.categories"
          :key="cat"
          >{{ $t(`category_obj.${cat}`) }}</span
        >
      </div>

      <div v-if="filters.diets.length > 0">
        <h5
          class="flex items-center gap-x-2 font-bold mx-2 mb-0.5 text-base lg:text-lg"
        >
          {{ $t("diets") }}
          <i class="material-symbols-outlined">keyboard_arrow_down</i>
        </h5>
        <span
          class="px-1 inline-block text-xs xs:text-sm sm:text-sm py-0.5 m-1 bg-primary font-semibold text-add-2 rounded-md"
          v-for="diet in filters.diets"
          :key="diet"
          >{{ $t(`diet_obj.${diet.replace(/ /g, "_")}`) }}</span
        >
      </div>

      <div v-if="filters.complexity">
        <h5
          class="flex items-center gap-x-2 font-bold mx-2 mb-0.5 text-base lg:text-lg"
        >
          {{ $t("complexity") }}
          <i class="material-symbols-outlined">keyboard_arrow_down</i>
        </h5>
        <span
          class="px-1 text-xs xs:text-sm sm:text-sm py-0.5 m-1 bg-primary font-semibold text-add-2 rounded-md"
          >{{ $t(`complexity_obj.${filters.complexity}`) }}</span
        >
      </div>

      <div v-if="filters.cookingTime">
        <h5
          class="flex items-center gap-x-2 font-bold mx-2 mb-0.5 text-base lg:text-lg"
        >
          {{ $t("cookingTime") }}
          <i class="material-symbols-outlined">keyboard_arrow_down</i>
        </h5>
        <span
          class="px-1 text-xs xs:text-sm sm:text-sm py-0.5 m-1 bg-primary font-semibold text-add-2 rounded-md"
          >{{
            $t(
              `cookingTime_obj.${Object.keys(TCookingTime_Enum).find(
                (k) =>
                  TCookingTime_Enum[k as keyof typeof TCookingTime_Enum] ===
                  filters.cookingTime
              )}`
            )
          }}</span
        >
      </div>

      <div v-if="filters.highRating">
        <h5
          class="flex items-center gap-x-2 font-bold mx-2 mb-0.5 text-base lg:text-lg"
        >
          {{ $t("rating") }}
          <i class="material-symbols-outlined">keyboard_arrow_down</i>
        </h5>
        <span
          class="px-1 text-xs xs:text-sm sm:text-sm py-0.5 m-1 bg-primary font-semibold text-add-2 rounded-md"
          >{{ $t(`highRated`) }}</span
        >
      </div>

      <div v-if="hasFilters" class="w-full flex mt-3">
        <Button
          @click="
            () => {
              recipesStore.setFilters(INITIAL_FILTERS);
              recipesStore.saveFilters();
            }
          "
          class="grow"
          variation="outlined"
          color="add"
        >
          <div class="inline-flex items-center gap-x-2 mx-auto">
            {{ $t("clearFilters") }}
            <i class="material-symbols-outlined">cancel</i>
          </div>
        </Button>
      </div>
    </div>
  </div>
</template>
