<script setup lang="ts">
import FormInput from "@/components/FormInput.vue";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

interface NewIngredientProps {
  ingredients: string[];
  schemaError?: string;
}

const newIngredient = ref("");

const { ingredients, schemaError } = defineProps<NewIngredientProps>();

const error = ref<null | string>(schemaError || null);

watch(
  () => schemaError,
  (err) => {
    console.log(schemaError);
    error.value = err || null;
  }
);

const { t } = useI18n();

const emit = defineEmits<{
  (e: "set-ingredients", ingredients: string[]): void;
  (e: "clear-error"): void;
}>();

function emitSetIngredients(ingredients: string[]) {
  emit("set-ingredients", ingredients);
}

function emitClearError() {
  emit("clear-error");
}

function addIngredient(e: Event) {
  if (ingredients.length > 99) {
    error.value = t("tooManyIngredients");
    return;
  }

  const event = e as KeyboardEvent;
  if (event.key === "Enter") {
    e.preventDefault();
    const value = newIngredient.value.trim();

    if (ingredients.includes(value)) {
      error.value = t(`ingredientAlreadyThere`);
      return;
    }

    if (!value) {
      error.value = t("emptyField");
      return;
    }

    emitSetIngredients([...ingredients, value]);
    newIngredient.value = "";
    (e.target as HTMLInputElement).value = "";
  }
}
</script>

<template>
  <FormInput
    :label="$t('addIngredients')"
    :hint="!!newIngredient.trim() ? $t('pressEnterForIngredient') : ''"
    placeholder="4 oz pastrami"
    v-model="newIngredient"
    @keyboard="addIngredient"
    :error="error"
    @clear-error="
      () => {
        error = null;
        emitClearError();
      }
    "
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
