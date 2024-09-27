<script setup lang="ts">
import { TDiet_Enum } from "@/@types/general";
import FormHint from "@/components/FormHint.vue";

interface SelectDietsProps {
  diets?: TDiet_Enum[];
  disabled: boolean;
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
  <div class="mb-2 mt-4 flex items-center gap-x-2">
    <h3 class="font-bold text-sm xs:text-base sm:text-lg md:text-xl xl:text-xl">
      {{ $t("chooseFittingDiets") }}
    </h3>
    <FormHint variation="optional" />
  </div>
  <div>
    <button
      v-for="diet in Object.values(TDiet_Enum)"
      :key="diet"
      type="button"
      :disabled="disabled"
      @click="selectDiet(diet)"
      :class="`p-1 md:p-1.5 rounded-sm w-fit m-1 text-xs sm:text-sm lg:text-base font-semibold active:opacity-80 disabled:opacity-50 disabled:pointer-events-none ${
        diets?.includes(diet)
          ? 'bg-add text-primary'
          : 'bg-add-2 dark:bg-primary text-primary dark:text-secondary'
      }`"
    >
      {{ $t(`diet_obj.${diet.replace(/\s/g, "_")}`) }}
    </button>
  </div>
</template>
