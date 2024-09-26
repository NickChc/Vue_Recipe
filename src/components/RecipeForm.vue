<script setup lang="ts">
import PlaceholderImage from "@/assets/images/Fallback_Food_Image.jpeg";
import FormInput from "@/components/FormInput.vue";
import NewIngredient from "@/components/Recipes/NewIngredient.vue";
import SelectDiets from "@/components/Recipes/SelectDiets.vue";
import SelectCategories from "@/components/Recipes/SelectCategories.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  TCategory_Enum,
  TComplexity_Enum,
  TCookingTime_Enum,
  TDiet_Enum,
  TRecipeFormValues,
} from "@/@types/general";
import Button from "@/components/Button.vue";
import FormHint from "./FormHint.vue";

const RECIPE_FORM_DATA = "recipe_form_data";
const SERVINGS = "servings";

const recipePlaceholder =
  "Toast the bread: Lightly toast both slices of rye bread. \n\nWarm the pastrami: Heat the pastrami slices in a skillet on medium heat for 2-3 minutes, until warm. \n\nAssemble the sandwich: Spread mustard on one side of each toasted slice. \n\nLayer the warm pastrami between the bread slices. Add Swiss cheese if desired. \n\nServe: Slice in half and serve with a pickle on the side. \n\nEnjoy!";

const newRecipeData = ref<TRecipeFormValues>({
  category: [],
  complexity: TComplexity_Enum.BEGINNER,
  cooking_time: TCookingTime_Enum.FIFTEEN_TO_THRITY,
  ingredients: [],
  recipe: "",
  servings: 0,
  title: "",
  diet: [],
  image: undefined,
});

const imageFile = ref<null | File>(null);

const cookingTimes = Object.keys(
  TCookingTime_Enum
) as (keyof typeof TCookingTime_Enum)[];

function handleImageUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  const image = target.files?.[0];

  if (image) {
    imageFile.value = image;
    newRecipeData.value.image = URL.createObjectURL(image);
    return;
  }
  imageFile.value = null;
  newRecipeData.value.image = undefined;
}

function setIngredients(ingredients: string[]) {
  newRecipeData.value.ingredients = ingredients;
}

function setDiets(diets?: TDiet_Enum[]) {
  newRecipeData.value.diet = diets;
}

function setCategories(categories: TCategory_Enum[]) {
  newRecipeData.value.category = categories;
}

function numberInput(newValue: string, e?: Event) {
  if (e == null) return;

  const target = e.target as HTMLInputElement;
  const lastChar = newValue[newValue.length - 1];

  if (newValue.length > 2 || isNaN(Number(lastChar)) || lastChar === " ") {
    target.value = newValue.slice(0, -1);
    return;
  }

  newRecipeData.value.servings = Number(newValue);
}

async function handleSubmit() {
  try {
    console.table(newRecipeData.value);
  } catch (err: any) {
    console.log(err.message);
  }
}

onMounted(() => {
  const savedData = localStorage.getItem(RECIPE_FORM_DATA);

  if (savedData) {
    newRecipeData.value = JSON.parse(savedData);
  }

  const autosaveInterval = setInterval(() => {
    localStorage.setItem(RECIPE_FORM_DATA, JSON.stringify(newRecipeData.value));
    localStorage.setItem(
      SERVINGS,
      JSON.stringify(newRecipeData.value.servings)
    );
  }, 5000);

  onBeforeUnmount(() => {
    clearInterval(autosaveInterval);
  });
});
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col mt-4">
    <div class="flex items-center gap-x-3 xs:text-lg xl:text-xl">
      {{ $t("optional") }} - <FormHint variation="optional" />
    </div>

    <div class="flex flex-col xl:flex-row gap-x-3">
      <input
        ref="imageInput"
        class="hidden"
        type="file"
        @input="handleImageUpload"
        accept="image/*"
      />
      <div
        class="w-full xl:min-w-[500px] aspect-video relative bg-cover mt-4 z-0 md:max-w-[500px] mb-4"
        :style="{
          backgroundImage: `url(${newRecipeData.image || PlaceholderImage})`,
        }"
        @click="$refs.imageInput.click()"
      >
        <div class="absolute right-1 -top-7">
          <FormHint variation="optional" />
        </div>
        <div
          class="absolute inset-0 z-10 backdrop-blur-sm active:brightness-75 cursor-pointer"
        ></div>
        <span
          class="text-primary cursor-pointer z-20 absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 text-3xl flex flex-col items-center"
        >
          <i class="material-symbols-outlined text-[2em]">add</i>
          <h4 class="text-base whitespace-nowrap">Add an image</h4>
        </span>
      </div>
      <div class="flex flex-col">
        <div class="mb-3">
          <FormInput
            placeholder="Pastrami sandwich"
            :label="$t('title')"
            v-model="newRecipeData.title"
          />
        </div>
        <NewIngredient
          :ingredients="newRecipeData.ingredients"
          @set-ingredients="setIngredients"
        />

        <SelectDiets :diets="newRecipeData.diet" @set-diets="setDiets" />
      </div>
    </div>

    <SelectCategories
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
      class="mt-3 p-2 text-secondary rounded-sm font-semibold outline-add"
    >
      <option :value="lvl" v-for="lvl in Object.values(TComplexity_Enum)">
        {{ $t(`complexity.${lvl}`) }}
      </option>
    </select>

    <h3
      class="mt-3 font-bold text-sm xs:text-base sm:text-lg md:text-xl xl:text-xl"
    >
      {{ $t("selectCookingTime") }}
    </h3>

    <select
      v-model="newRecipeData.cooking_time"
      class="mt-3 p-2 text-secondary rounded-sm font-semibold outline-add"
    >
      <option v-for="time in cookingTimes" :value="TCookingTime_Enum[time]">
        {{ $t(`cookingTime_obj.${time}`) }}
      </option>
    </select>

    <h3
      class="mt-3 font-bold text-sm xs:text-base sm:text-lg md:text-xl xl:text-xl"
    >
      {{ $t("describeTheRecipe") }}
    </h3>

    <textarea
      v-model="newRecipeData.recipe"
      :placeholder="recipePlaceholder"
      class="p-[0.4em] mt-3 resize-none sm:resize-y outline-add min-h-60 text-secondary"
    />

    <div class="my-6 md:mb-12">
      <FormInput
        :savedValueKey="SERVINGS"
        :label="$t('howManyServings')"
        @update:model-value="numberInput"
        placeholder="3"
      />
    </div>

    <Button variation="primary" type="submit">
      <div class="text-base md:text-xl xl:text-2xl">
        {{ $t("submit", "SUBMIT") }}
      </div>
    </Button>
  </form>
</template>
