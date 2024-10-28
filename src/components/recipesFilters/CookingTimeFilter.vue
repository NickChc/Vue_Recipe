<script setup lang="ts">
import { storeToRefs } from "pinia";
import { TCookingTime_Enum } from "@/@types/general";
import { useRecipesStore } from "@/stores/recipesStore";

const recipesStore = useRecipesStore();
const { filteringBy, filters } = storeToRefs(recipesStore);

function setCookingTime(time: TCookingTime_Enum | null) {
  recipesStore.setFilters({
    ...filters.value,
    cookingTime: filters.value.cookingTime === time ? null : time,
  });
}
</script>

<template>
  <div
    :class="`w-full flex flex-col ${
      filteringBy === 'cooking_time' ? 'gap-y-2' : ''
    }`"
  >
    <div
      :class="`grid duration-500 ${
        filteringBy === 'cooking_time'
          ? 'grid-rows-[1fr] py-1'
          : 'grid-rows-[0fr]'
      }`"
    >
      <div
        :class="`overflow-hidden duration-500 transition-[visibility] ${
          filteringBy === 'cooking_time' ? '' : 'invisible'
        }`"
      >
        <button
          v-for="time in Object.keys(TCookingTime_Enum)"
          :key="time"
          :class="`whitespace-nowrap border rounded-sm p-0.5 dureation-300 transition-colors text-primary font-semibold text-xs m-1 ${
              filters.cookingTime === TCookingTime_Enum[time as keyof typeof TCookingTime_Enum]
                ? 'bg-add border-add border-add '
                : 'bg-add-2 border-add-2'
            }`"
          @click="
            setCookingTime(
              TCookingTime_Enum[time as keyof typeof TCookingTime_Enum]
            )
          "
        >
          {{ $t(`cookingTime_obj.${time}`) }}
        </button>
      </div>
    </div>

    <button
      @click="recipesStore.setFilteringBy('cooking_time')"
      :class="`flex items-center justify-between px-3 gap-x-2 font-semibold text-sm ${
        filteringBy === 'cooking_time' ? 'text-add' : ''
      }`"
    >
      {{ $t("byCookingTime") }}
      <span
        class="flex duration-500 transition-transform"
        :class="{ 'rotate-180': filteringBy === 'cooking_time' }"
      >
        <i class="material-symbols-outlined">keyboard_arrow_down</i>
      </span>
    </button>
  </div>
</template>
