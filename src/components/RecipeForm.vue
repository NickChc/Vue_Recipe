<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import FormInput from "@/components/FormInput.vue";
import NewIngredient from "@/components/recipes/NewIngredient.vue";
import SelectDiets from "@/components/recipes/SelectDiets.vue";
import SelectCategories from "@/components/recipes/SelectCategories.vue";
import {
  TCategory_Enum,
  TComplexity_Enum,
  TCookingTime_Enum,
  TDiet_Enum,
  TRecipeFormValues,
} from "@/@types/general";
import Button from "@/components/Button.vue";
import FormHint from "@/components/FormHint.vue";
import FormError from "@/components/auth/FormError.vue";
import FieldError from "@/components/FieldError.vue";
import RecipeImageInput from "@/components/RecipeImageInput.vue";
import { useCreateRecipe } from "@/composables/useCreateRecipe";
import { RECIPE_FORM_DATA, SERVINGS } from "@/config/storageKeys";

interface RecipeFormProps {
  editRecipe?: { values: TRecipeFormValues; id: string };
}

const { editRecipe } = defineProps<RecipeFormProps>();

const newRecipeData = ref<TRecipeFormValues>({
  category: [],
  complexity: TComplexity_Enum.BEGINNER,
  cooking_time: TCookingTime_Enum.FIFTEEN_TO_THRITY,
  ingredients: [],
  recipe: "",
  servings: 0,
  title: "",
  diet: [],
  image: null,
});

const imageFile = ref<undefined | File>();

const {
  handleCreateRecipe,
  loading,
  error,
  recipePlaceholder,
  cookingTimes,
  validation: { errors, clearError, hasErrors },
} = useCreateRecipe(
  newRecipeData,
  imageFile,
  setRecipeData,
  setImageValues,
  editRecipe
);

function setIngredients(ingredients: string[]) {
  newRecipeData.value.ingredients = ingredients;
}

function setRecipeData(data: TRecipeFormValues) {
  newRecipeData.value = data;
}

function setDiets(diets?: TDiet_Enum[]) {
  newRecipeData.value.diet = diets;
}

function setImageValues({
  image,
  imgFile,
}: {
  image: string | null;
  imgFile: File | undefined;
}) {
  newRecipeData.value.image = image;
  imageFile.value = imgFile;
}

function setCategories(categories: TCategory_Enum[]) {
  newRecipeData.value.category = categories;
}

function numberInput(newValue: string, e?: Event) {
  if (e == null) return;

  const target = e.target as HTMLInputElement;
  const lastChar = newValue[newValue.length - 1];

  if (newValue === "") {
    newRecipeData.value.servings = 0;
    target.value = "";
    return;
  }

  if (newValue.length > 2 || isNaN(Number(lastChar)) || lastChar === " ") {
    target.value = newValue.slice(0, -1);
    return;
  }

  newRecipeData.value.servings = Number(newValue);
}

onMounted(() => {
  if (editRecipe?.values) {
    newRecipeData.value = JSON.parse(JSON.stringify(editRecipe.values));
  }
});

onBeforeUnmount(() => {
  localStorage.removeItem(RECIPE_FORM_DATA);
  localStorage.removeItem(SERVINGS);
});
</script>

<template>
  <form @submit.prevent="handleCreateRecipe" class="flex flex-col mt-4">
    <div class="flex items-center gap-x-3 xs:text-lg xl:text-xl">
      {{ $t("optional") }} - <FormHint variation="optional" />
    </div>

    <div class="flex flex-col xl:flex-row gap-x-3">
      <RecipeImageInput
        :loading="loading"
        :error="errors.image?.[0] || errors.imageFile?.[0]"
        :image="newRecipeData.image"
        :imageFile="imageFile"
        @set-image-values="setImageValues"
      />

      <div class="flex flex-col">
        <div class="mb-3">
          <FormInput
            :disabled="loading"
            placeholder="Pastrami sandwich"
            :label="$t('title')"
            v-model="newRecipeData.title"
            :error="errors.title?.[0]"
            @clear-error="clearError('title')"
          />
        </div>
        <NewIngredient
          :disabled="loading"
          :schemaError="errors.ingredients?.[0]"
          @clear-error="clearError('ingredients')"
          :ingredients="newRecipeData.ingredients"
          @set-ingredients="setIngredients"
        />

        <SelectDiets
          :disabled="loading"
          :diets="newRecipeData.diet"
          @set-diets="setDiets"
        />
      </div>
    </div>

    <SelectCategories
      :disabled="loading"
      :categories="newRecipeData.category"
      @set-categories="setCategories"
    />

    <h3
      class="mt-4 font-bold text-sm xs:text-base sm:text-lg md:text-xl xl:text-xl"
    >
      {{ $t("chooseFittingLevel") }}
    </h3>

    <select
      v-model="newRecipeData.complexity"
      :disabled="loading"
      class="mt-3 p-2 text-secondary rounded-sm font-semibold outline-add cursor-pointer disabled:pointer-events-none"
    >
      <option :value="lvl" v-for="lvl in Object.values(TComplexity_Enum)">
        {{ $t(`complexity.${lvl}`) }}
      </option>
    </select>

    <FieldError :error="errors.complexity?.[0]" />

    <h3
      class="mt-3 font-bold text-sm xs:text-base sm:text-lg md:text-xl xl:text-xl"
    >
      {{ $t("selectCookingTime") }}
    </h3>

    <select
      v-model="newRecipeData.cooking_time"
      :disabled="loading"
      class="mt-3 p-2 text-secondary rounded-sm font-semibold outline-add cursor-pointer disabled:pointer-events-none"
    >
      <option v-for="time in cookingTimes" :value="TCookingTime_Enum[time]">
        {{ $t(`cookingTime_obj.${time}`) }}
      </option>
    </select>

    <FieldError :error="errors.cooking_time?.[0]" />

    <h3
      class="mt-3 font-bold text-sm xs:text-base sm:text-lg md:text-xl xl:text-xl"
    >
      {{ $t("describeTheRecipe") }}
    </h3>

    <textarea
      :disabled="loading"
      @input="clearError('recipe')"
      v-model="newRecipeData.recipe"
      :placeholder="recipePlaceholder"
      class="p-[0.4em] mt-3 resize-none sm:resize-y outline-add min-h-60 text-secondary disabled:dark:text-primary disabled:bg-add-2 disabled:opacity-50"
    />

    <FieldError :error="errors.recipe?.[0]" />

    <div class="my-6 mb-12">
      <FormInput
        :disabled="loading"
        :savedValueKey="SERVINGS"
        :label="$t('howManyServings')"
        @update:modelValue="numberInput"
        placeholder="3"
        :error="errors.servings?.[0]"
        @clear-error="clearError('servings')"
      />
    </div>

    <FormError
      v-if="errors.rootError || error"
      :error="errors.rootError! || error!"
      @clear-error="
        () => {
          error = null;
          clearError('rootError');
        }
      "
    />
    <FormError v-else-if="hasErrors" :error="$t('checkErrorsAbove')" />

    <Button :loading="loading" variation="primary" type="submit">
      <div v-if="editRecipe" class="text-base md:text-xl xl:text-2xl">
        {{ loading ? $t("saving") : $t("save", "SUBMIT") }}
      </div>
      <div v-else class="text-base md:text-xl xl:text-2xl">
        {{ loading ? $t("submitting") : $t("submit", "SUBMIT") }}
      </div>
    </Button>
  </form>
</template>
