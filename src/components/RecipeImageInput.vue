<script setup lang="ts">
import PlaceholderImage from "@/assets/images/Fallback_Food_Image.jpeg";
import FormHint from "@/components/FormHint.vue";
import FieldError from "@/components/FieldError.vue";

interface RecipeImageInputProps {
  loading: boolean;
  image: string | null;
  imageFile: File | undefined;
  error?: string;
}

const { loading, error, image, imageFile } =
  defineProps<RecipeImageInputProps>();

const emit = defineEmits<{
  (
    e: "set-image-values",
    values: { image: string | null; imgFile: File | undefined }
  ): void;
}>();

function setImageValues(image: string | null, imageFile: File | undefined) {
  emit("set-image-values", { image, imgFile: imageFile });
}

function handleImageUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  const image = target.files?.[0];

  if (image) {
    setImageValues(URL.createObjectURL(image), image);
    return;
  }

  setImageValues(null, undefined);
}
</script>

<template>
  <input
    :disabled="loading"
    ref="imageInput"
    class="hidden"
    type="file"
    @input="handleImageUpload"
    accept="image/*"
  />
  <div
    class="w-full xl:min-w-[500px] aspect-video relative mt-4 z-0 md:max-w-[500px] bg-no-repeat bg-fixed bg-cover mb-4"
    :class="loading ? 'opacity-75 pointer-events-none' : ''"
    :style="{
      backgroundImage: `url(${image || PlaceholderImage})`,
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
      <h4 class="text-base whitespace-nowrap">
        {{ image ? $t("changeTheImage") : $t("addAnImage") }}
      </h4>
    </span>
    <div class="absolute left-3 top-full">
      <FieldError v-if="error" :error="error" />
      <div v-else-if="imageFile">{{ imageFile.name }}</div>
    </div>
  </div>
</template>
