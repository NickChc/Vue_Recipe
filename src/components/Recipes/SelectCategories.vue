<script setup lang="ts">
import { TCategory_Enum } from "@/@types/general";

interface SelectCategoriesProps {
  categories: TCategory_Enum[];
}

const { categories } = defineProps<SelectCategoriesProps>();

const emit = defineEmits<{
  (e: "set-categories", categories: TCategory_Enum[]): void;
}>();

function emitSetCategories(categories: TCategory_Enum[]) {
  emit("set-categories", categories);
}

function selectCategory(category: TCategory_Enum) {
  if (categories?.includes(category)) {
    emitSetCategories(categories.filter((d) => d !== category));
    return;
  }

  emitSetCategories([...categories, category]);
}
</script>

<template>
  <h3 class="my-2 font-bold text-sm xs:text-base">
    {{ $t("chooseFittingCategories") }}
  </h3>
  <div>
    <button
      v-for="category in Object.values(TCategory_Enum)"
      :key="category"
      type="button"
      @click="selectCategory(category)"
      :class="`p-1 rounded-sm w-fit m-1 text-xs font-semibold active:opacity-80 ${
        categories.includes(category)
          ? 'bg-add text-primary'
          : 'bg-add-2 dark:bg-primary text-primary dark:text-secondary'
      }`"
    >
      {{ $t(`category_obj.${category.replace(/\s/g, "_")}`) }}
    </button>
  </div>
</template>
