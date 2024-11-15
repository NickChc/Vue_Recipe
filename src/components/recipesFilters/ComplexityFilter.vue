<script setup lang="ts">
import { storeToRefs } from "pinia";
import { TComplexity_Enum } from "@/@types/general";
import { useRecipesStore } from "@/stores/recipesStore";

const recipesStore = useRecipesStore();
const { filteringBy, filters } = storeToRefs(recipesStore);

function setComplexity(lvl: TComplexity_Enum | null) {
  recipesStore.setFilters({
    ...filters.value,
    complexity: filters.value.complexity === lvl ? null : lvl,
  });
}
</script>

<template>
  <div
    :class="`w-full flex flex-col ${
      filteringBy === 'complexity' ? 'gap-y-2' : ''
    }`"
  >
    <div
      :class="`grid duration-500 ${
        filteringBy === 'complexity'
          ? 'grid-rows-[1fr] py-1'
          : 'grid-rows-[0fr]'
      }`"
    >
      <div
        :class="`overflow-hidden duration-500 transition-[visibility] ${
          filteringBy === 'complexity' ? '' : 'invisible'
        }`"
      >
        <button
          v-for="lvl in Object.keys(TComplexity_Enum)"
          :key="lvl"
          :class="`whitespace-nowrap border rounded-sm p-0.5 dureation-300 transition-colors font-semibold text-xs sm:text-sm m-1 ${
              filters.complexity === TComplexity_Enum[lvl as keyof typeof TComplexity_Enum]
                ? 'bg-add border-add border-2 '
              : 'bg-primary text-add-2 pointer-fine:hover:text-add  border-primary'

            }`"
          @click="
            setComplexity(
              TComplexity_Enum[lvl as keyof typeof TComplexity_Enum]
            )
          "
        >
          {{ $t(`complexity_obj.${lvl.toLowerCase()}`) }}
        </button>
      </div>
    </div>

    <button
      @click="recipesStore.setFilteringBy('complexity')"
      :class="`flex items-center justify-between px-3 gap-x-2 font-semibold text-sm sm:text-base ${
        filteringBy === 'complexity' ? 'text-add' : ''
      }`"
    >
      {{ $t("byComplexity") }}
      <span
        class="flex duration-500 transition-transform"
        :class="{ 'rotate-180': filteringBy === 'complexity' }"
      >
        <i class="material-symbols-outlined">keyboard_arrow_down</i>
      </span>
    </button>
  </div>
</template>
