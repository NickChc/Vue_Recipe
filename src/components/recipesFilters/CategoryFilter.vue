<script setup lang="ts">
import { storeToRefs } from "pinia";
import { TCategory_Enum } from "@/@types/general";
import { useRecipesStore } from "@/stores/recipesStore";

const recipesStore = useRecipesStore();
const { filteringBy, filters } = storeToRefs(recipesStore);

function setCategories(category: TCategory_Enum) {
  let newCategories: TCategory_Enum[] = [];

  if (filters.value.categories.includes(category)) {
    newCategories = filters.value.categories.filter((d) => d !== category);
  } else {
    newCategories = [...filters.value.categories, category];
  }

  recipesStore.setFilters({ ...filters.value, categories: newCategories });
}
</script>

<template>
  <div
    :class="`w-full flex flex-col ${
      filteringBy === 'category' ? 'gap-y-2' : ''
    }`"
  >
    <div
      :class="`grid duration-500 ${
        filteringBy === 'category' ? 'grid-rows-[1fr] py-1' : 'grid-rows-[0fr]'
      }`"
    >
      <div
        :class="`overflow-hidden duration-500 transition-[visibility] ${
          filteringBy === 'category' ? '' : 'invisible'
        }`"
      >
        <button
          v-for="category in Object.values(TCategory_Enum)"
          :key="category"
          :class="`whitespace-nowrap border rounded-sm p-0.5 dureation-300 transition-colors font-semibold text-xs sm:text-sm m-1 ${
            filters.categories.includes(category)
              ? 'bg-add border-add border-add-2 '
              : 'bg-primary text-add-2 pointer-fine:hover:text-add  border-primary'
          }`"
          @click="setCategories(category)"
        >
          {{ $t(`category_obj.${category.replace(/ /g, "_")}`) }}
        </button>
      </div>
    </div>

    <button
      @click="recipesStore.setFilteringBy('category')"
      :class="`flex items-center justify-between px-3 gap-x-2 font-semibold text-sm sm:text-base ${
        filteringBy === 'category' ? 'text-add' : ''
      }`"
    >
      {{ $t("byCategory") }}
      <span
        class="flex duration-500 transition-transform"
        :class="{ 'rotate-180': filteringBy === 'category' }"
      >
        <i class="material-symbols-outlined">keyboard_arrow_down</i>
      </span>
    </button>
  </div>
</template>
