<script setup lang="ts">
import { TDiet_Enum } from "@/@types/general";

interface SelectDietsProps {
  diets?: TDiet_Enum[];
}

const { diets } = defineProps<SelectDietsProps>();

const emit = defineEmits<{
  (e: "set-diets", diets?: TDiet_Enum[]): void;
}>();

function emitSetDeits(diets?: TDiet_Enum[]) {
  emit("set-diets", diets);
}

function selectDiet(diet: TDiet_Enum) {
  if (diets == null) {
    emitSetDeits([diet]);
    return;
  }

  if (diets?.includes(diet)) {
    emitSetDeits(diets.filter((d) => d !== diet));
    return;
  }

  emitSetDeits([...diets, diet]);
}
</script>

<template>
  <h3 class="my-2 font-bold">{{ $t("chooseFittingDiets") }}</h3>
  <div>
    <button
      v-for="diet in Object.values(TDiet_Enum)"
      :key="diet"
      type="button"
      @click="selectDiet(diet)"
      :class="`p-1 rounded-sm w-fit m-1 text-xs font-semibold active:opacity-80 ${
        diets?.includes(diet)
          ? 'bg-add text-primary'
          : 'bg-add-2 dark:bg-primary text-primary dark:text-secondary'
      }`"
    >
      {{ $t(`diet_obj.${diet.replace(/\s/g, "_")}`) }}
    </button>
  </div>
</template>
