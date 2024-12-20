<script setup lang="ts">
import { storeToRefs } from "pinia";
import { TDiet_Enum } from "@/@types/general";
import { useRecipesStore } from "@/stores/recipesStore";

const recipesStore = useRecipesStore();
const { filteringBy, filters } = storeToRefs(recipesStore);

function setDiets(diet: TDiet_Enum) {
  let newDietFilters: TDiet_Enum[] = [];

  if (filters.value.diets.includes(diet)) {
    newDietFilters = filters.value.diets.filter((d) => d !== diet);
  } else {
    newDietFilters = [...filters.value.diets, diet];
  }

  recipesStore.setFilters({ ...filters.value, diets: newDietFilters });
}
</script>

<template>
  <div
    :class="`w-full flex flex-col ${filteringBy === 'diets' ? 'gap-y-2' : ''}`"
  >
    <div
      :class="`grid duration-500 ${
        filteringBy === 'diets' ? 'grid-rows-[1fr] py-1' : 'grid-rows-[0fr]'
      }`"
    >
      <div
        :class="`overflow-hidden duration-500 transition-[visibility] ${
          filteringBy === 'diets' ? '' : 'invisible'
        }`"
      >
        <button
          v-for="diet in Object.values(TDiet_Enum)"
          :key="diet"
          :class="`whitespace-nowrap border rounded-sm p-0.5 dureation-300 transition-colors font-semibold text-xs sm:text-sm m-1 ${
            filters.diets.includes(diet)
              ? 'bg-add border-add border-add-2 '
              : 'bg-primary text-add-2 pointer-fine:hover:text-add  border-primary'
          }`"
          @click="setDiets(diet)"
        >
          {{ $t(`diet_obj.${diet.replace(/ /g, "_")}`) }}
        </button>
      </div>
    </div>

    <button
      @click="recipesStore.setFilteringBy('diets')"
      :class="`flex items-center justify-between px-3 gap-x-2 font-semibold text-sm sm:text-base ${
        filteringBy === 'diets' ? 'text-add' : ''
      }`"
    >
      {{ $t("byDiets") }}
      <span
        class="flex duration-500 transition-transform"
        :class="{ 'rotate-180': filteringBy === 'diets' }"
      >
        <i class="material-symbols-outlined">keyboard_arrow_down</i>
      </span>
    </button>
  </div>
</template>
