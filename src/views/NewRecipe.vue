form
<script setup lang="ts">
import {
  TCategory_Enum,
  TComplexity_Enum,
  TCookingTime_Enum,
  TDiet_Enum,
  TRecipe,
} from "@/@types/general";
import Side_Food_Image from "@/assets/images/Side_Food_Image.jpg";
import Side_Food_Image_2 from "@/assets/images/Side_Food_Image_2.avif";
import { onBeforeUnmount, onMounted, ref } from "vue";
import PlaceholderImage from "@/assets/images/Fallback_Food_Image.jpeg";
import FormInput from "@/components/FormInput.vue";
import NewIngredient from "@/components/Recipes/NewIngredient.vue";
import SelectDiets from "@/components/Recipes/SelectDiets.vue";
import SelectCategories from "@/components/Recipes/SelectCategories.vue";

type TNewRecipeData = Omit<
  TRecipe,
  "id" | "user_id" | "rating" | "rates" | "created_at" | "author"
>;

const RECIPE_FORM_DATA = "recipe_form_data";

const newRecipeData = ref<TNewRecipeData>({
  category: [],
  complexity: TComplexity_Enum.BEGINNER,
  cooking_time: TCookingTime_Enum.FIFTEEN_TO_THRITY,
  ingredients: ["Cheeze", "Oil", "Tomatos", "Spaghetti pasta"],
  recipe: "",
  servings: 0,
  title: "",
  diet: [TDiet_Enum.DAIRY_FREE],
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

onMounted(() => {
  const savedData = localStorage.getItem(RECIPE_FORM_DATA);

  if (savedData) {
    newRecipeData.value = JSON.parse(savedData);
    console.table(newRecipeData.value);
  }

  const autosaveInterval = setInterval(() => {
    localStorage.setItem(RECIPE_FORM_DATA, JSON.stringify(newRecipeData.value));
  }, 5000);

  onBeforeUnmount(() => {
    clearInterval(autosaveInterval);
  });
});
</script>

<template>
  <div class="h-full flex">
    <div
      class="hidden sm:block h-full w-60 bg-fixed bg-cover bg-center"
      :style="{ backgroundImage: `url(${Side_Food_Image})` }"
    ></div>
    <div class="w-full h-full max-h-full p-3 pb-14 overflow-y-scroll">
      <h2 class="font-semibold">{{ $t("shareYourFavRecipe") }}</h2>
      <form class="flex flex-col mt-4">
        <input
          ref="imageInput"
          class="hidden"
          type="file"
          @input="handleImageUpload"
          accept="image/*"
        />
        <div
          class="w-full h-32 relative bg-cover mt-4 z-0 max-w-[500px] mb-4"
          :style="{
            backgroundImage: `url(${newRecipeData.image || PlaceholderImage})`,
          }"
          @click="$refs.imageInput.click()"
        >
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
        <div class="mb-3">
          <FormInput placeholder="Title" v-model="newRecipeData.title" />
        </div>
        <NewIngredient
          :ingredients="newRecipeData.ingredients"
          @set-ingredients="setIngredients"
        />

        <SelectDiets :diets="newRecipeData.diet" @set-diets="setDiets" />

        <SelectCategories
          :categories="newRecipeData.category"
          @set-categories="setCategories"
        />

        <h3 class="mt-3 font-bold text-sm xs:text-base">
          {{ $t("chooseFittingLevel") }}
        </h3>

        <select
          v-model="newRecipeData.complexity"
          class="mt-3 p-2 text-secondary rounded-sm font-semibold"
        >
          <option :value="lvl" v-for="lvl in Object.values(TComplexity_Enum)">
            {{ $t(`complexity.${lvl}`) }}
          </option>
        </select>

        <h3 class="mt-3 font-bold text-sm xs:text-base">
          {{ $t("selectCookingTime") }}
        </h3>

        <select
          v-model="newRecipeData.cooking_time"
          class="mt-3 p-2 text-secondary rounded-sm font-semibold"
        >
          <option v-for="time in cookingTimes" :value="TCookingTime_Enum[time]">
            {{ $t(`cookingTime_obj.${time}`) }}
          </option>
        </select>
      </form>
    </div>
    <div
      class="hidden sm:block h-full w-60 bg-fixed bg-right bg-cover"
      :style="{ backgroundImage: `url(${Side_Food_Image_2})` }"
    ></div>
  </div>
</template>
