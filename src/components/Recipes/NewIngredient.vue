<script setup lang="ts">
import FormInput from "@/components/FormInput.vue";
import { ref } from "vue";

const newIngredient = ref("");

const { ingredients } = defineProps<{ ingredients: string[] }>();

const emit = defineEmits<{
  (e: "set-ingredients", ingredients: string[]): void;
}>();

function emitSetIngredients(ingredients: string[]) {
  emit("set-ingredients", ingredients);
}

function addIngredient(e: Event) {
  const event = e as KeyboardEvent;
  if (event.key === "Enter") {
    const value = newIngredient.value.trim();

    if (!!value) {
      emitSetIngredients([...ingredients, value]);
      newIngredient.value = "";
    }
  }
}
</script>

<template>
  <FormInput
    :label="$t('addIngredients')"
    :hint="!!newIngredient.trim() ? $t('pressSpaceForIngredient') : ''"
    placeholder="4 oz pastrami"
    v-model="newIngredient"
    @keyobard="addIngredient"
  />
  <ul class="list-none mt-1 sm:mt-2 lg:mt-3 max-h-24 overflow-y-auto">
    <li
      v-for="ingredient in ingredients"
      :key="ingredient"
      class="inline-block"
    >
      <button
        type="button"
        class="ingredient-remove p-1 md:p-1.5 opacity-80 hover:opacity-100 rounded-sm bg-add-2 m-1 flex items-center gap-x-1 text-primary text-xs sm:text-sm lg:text-base"
        @click="emitSetIngredients(ingredients.filter((i) => i !== ingredient))"
      >
        {{ ingredient }} <i class="material-symbols-outlined text-xs">close</i>
      </button>
    </li>
  </ul>
</template>
