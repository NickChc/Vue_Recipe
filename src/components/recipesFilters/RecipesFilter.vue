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

const router = useRouter();

const recipesStore = useRecipesStore();
const { filtersToSave } = storeToRefs(recipesStore);

function handleSaveFilters() {
  const params = recipesStore.saveFilters();
  const route = router.currentRoute.value;

  const newQuery = params.size > 0 ? `?${params.toString()}` : "";

  router.replace(`${route.path}${newQuery}`);
  recipesStore.setFilteringBy(null);
}
</script>

<template>
  <div class="text-primary">
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
          :class="`overflow-hidden duration-300 transitiob-[visibility,opacity] w-full flex items-stretch flex-col ${
            filtersToSave ? '' : 'invisible opacity-0'
          }`"
        >
          <Button @click="handleSaveFilters">{{
            $t("save").toLocaleUpperCase()
          }}</Button>
        </div>
      </div>
    </div>
  </div>
</template>
