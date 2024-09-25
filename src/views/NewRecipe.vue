form
<script setup lang="ts">
import { TComplexity_Enum, TDiet_Enum, TRecipe } from "@/@types/general";
import Side_Food_Image from "@/assets/images/Side_Food_Image.jpg";
import Side_Food_Image_2 from "@/assets/images/Side_Food_Image_2.avif";
import { ref } from "vue";
import PlaceholderImage from "@/assets/images/Fallback_Food_Image.jpeg";
import FormInput from "@/components/FormInput.vue";
import NewIngredient from "@/components/Recipes/NewIngredient.vue";
import SelectDiets from "@/components/Recipes/SelectDiets.vue";

type TNewRecipeData = Omit<
  TRecipe,
  "id" | "user_id" | "rating" | "rates" | "created_at" | "author"
>;

const newRecipeData = ref<TNewRecipeData>({
  category: [],
  complexity: TComplexity_Enum.BEGINNER,
  cooking_time: 0,
  ingredients: ["Cheeze", "Oil", "Tomatos", "Spaghetti pasta"],
  recipe: "",
  servings: 0,
  title: "",
  diet: [TDiet_Enum.DAIRY_FREE],
  image: undefined,
});

const imageFile = ref<null | File>(null);

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
</script>

<template>
  <div class="h-full flex pb-12">
    <div
      class="hidden sm:block h-full w-60 bg-fixed bg-cover bg-center"
      :style="{ backgroundImage: `url(${Side_Food_Image})` }"
    ></div>
    <div class="w-full h-full max-h-full p-3 overflow-y-auto">
      <h2 class="font-semibold">Share your favorite recipe!</h2>
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
            class="cursor-pointer z-20 absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 text-3xl flex flex-col items-center"
          >
            <i class="material-symbols-outlined text-[2em]">add</i>
            <h4 class="text-base whitespace-nowrap">Add an image</h4>
          </span>
        </div>
        <div class="mb-3">
          <FormInput
            placeholder="Title"
            @update:value="(e) => {
            const target = e.target as HTMLInputElement;
            newRecipeData.title = target.value;
          }"
          />
        </div>
        <NewIngredient
          :ingredients="newRecipeData.ingredients"
          @set-ingredients="setIngredients"
        />

        <SelectDiets :diets="newRecipeData.diet" @set-diets="setDiets" />
      </form>
    </div>
    <div
      class="hidden sm:block h-full w-60 bg-fixed bg-right bg-cover"
      :style="{ backgroundImage: `url(${Side_Food_Image_2})` }"
    ></div>
  </div>
</template>
