<script setup lang="ts">
import { storeToRefs } from "pinia";
import DietFilter from "@/components/recipesFilters/DietFilter.vue";
import CategoryFilter from "@/components/recipesFilters/CategoryFilter.vue";
import CookingTimeFilter from "@/components/recipesFilters/CookingTimeFilter.vue";
import ComplexityFilter from "@/components/recipesFilters/ComplexityFilter.vue";
import RatingFilter from "@/components/recipesFilters/RatingFilter.vue";
import { useRecipesStore } from "@/stores/recipesStore";
import Button from "@/components/Button.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { TCookingTime_Enum } from "@/@types/general";

const router = useRouter();

const recipesStore = useRecipesStore();
const { filtersToSave, filters } = storeToRefs(recipesStore);

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

function handleSaveFilters() {
  const params = recipesStore.saveFilters();
  const route = router.currentRoute.value;

  const newQuery = params.size > 0 ? `?${params.toString()}` : "";

  if (route.path.split("?")[0].endsWith("recipes")) {
    router.replace(`${route.path}${newQuery}`);
  } else {
    router.replace(`/recipes${newQuery}`);
  }
  recipesStore.setFilteringBy(null);
}
</script>

<template>
  <div class="text-primary pt-3">
    <h4 class="font-bold text-center px-3 text-sm xs:text-base mt-2">
      {{ $t("filterRecipes").toLocaleUpperCase() }}
    </h4>

    <div
      class="flex flex-col sm:gap-y-1 items-center mx-3 max-w-[400px] mx-auto"
    >
      <hr class="border-primary dark:border-primary my-1 w-[95%] mx-auto" />

      <DietFilter />

      <hr class="border-primary w-[95%] mx-auto my-1" />

      <CategoryFilter />

      <hr class="border-primary w-[95%] mx-auto my-1" />

      <CookingTimeFilter />

      <hr class="border-primary w-[95%] mx-auto my-1" />

      <ComplexityFilter />

      <hr class="border-primary w-[95%] mx-auto my-1" />

      <RatingFilter />

      <div
        :class="`grid mt-6 duration-300 w-[80%] transition-[grid-template-rows] ${
          filtersToSave ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`"
      >
        <div
          :class="`overflow-hidden duration-300 transitiob-[visibility,opacity] w-full flex items-stretch flex-col text-sm sm:text-base ${
            filtersToSave ? '' : 'invisible opacity-0'
          }`"
        >
          <Button variation="primary" @click="handleSaveFilters">{{
            $t("save").toLocaleUpperCase()
          }}</Button>
        </div>
      </div>

      <div
        :class="`grid w-full duration-300 transition-[grid-template-rows,opacity] ${
          hasFilters ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`"
      >
        <div
          :class="`overflow-hidden ${hasFilters ? '' : 'opacity-0 invisible'}`"
        >
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
              class="px-1 text-xs xs:text-sm sm:text-sm lg:text-base py-0.5 m-1 bg-primary font-semibold text-add-2 rounded-md"
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
              class="px-1 text-xs xs:text-sm sm:text-sm lg:text-base py-0.5 m-1 bg-primary font-semibold text-add-2 rounded-md"
              v-for="diet in filters.diets"
              :key="diet"
              >{{ $t(`diet_obj.${diet}`) }}</span
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
              class="px-1 text-xs xs:text-sm sm:text-sm lg:text-base py-0.5 m-1 bg-primary font-semibold text-add-2 rounded-md"
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
              class="px-1 text-xs xs:text-sm sm:text-sm lg:text-base py-0.5 m-1 bg-primary font-semibold text-add-2 rounded-md"
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
              class="px-1 text-xs xs:text-sm sm:text-sm lg:text-base py-0.5 m-1 bg-primary font-semibold text-add-2 rounded-md"
              >{{ $t(`highRated`) }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
