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
      const input = e.target as HTMLInputElement;

      emitSetIngredients([...ingredients, value]);
      newIngredient.value = "";
      input.value = "";
    }
  }
}

function ingredientChange(e: Event) {
  const target = e.target as HTMLInputElement;

  newIngredient.value = target.value;
}
</script>

<template>
  <FormInput
    :hint="!!newIngredient.trim() ? $t('pressSpaceForIngredient') : ''"
    placeholder="Add ingredients"
    @update:value="ingredientChange"
    @keyobard="addIngredient"
  />
  <ul class="list-none mt-1 sm:mt-2 lg:mt-3">
    <li
      v-for="ingredient in ingredients"
      :key="ingredient"
      class="inline-block"
    >
      <button
        type="button"
        class="ingredient-remove p-1 opacity-80 hover:opacity-100 rounded-sm bg-add-2 m-1 flex items-center gap-x-1 text-primary text-xs"
        @click="emitSetIngredients(ingredients.filter((i) => i !== ingredient))"
      >
        {{ ingredient }} <i class="material-symbols-outlined text-xs">close</i>
      </button>
    </li>
  </ul>
</template>
