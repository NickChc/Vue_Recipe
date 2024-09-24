<script setup lang="ts">
import Side_Food_Image from "@/assets/images/Side_Food_Image.jpg";
import Side_Food_Image_2 from "@/assets/images/Side_Food_Image_2.avif";
</script>

<template>
  <div class="h-full flex">
    <div
      class="hidden sm:block h-full w-60 bg-fixed bg-cover bg-center"
      :style="{ backgroundImage: `url(${Side_Food_Image})` }"
    ></div>
    <div class="w-full max-h-full overflow-y-auto">
      <!-- FORM HERE -->
    </div>
    <div
      class="hidden sm:block h-full w-60 bg-fixed bg-right bg-cover"
      :style="{ backgroundImage: `url(${Side_Food_Image_2})` }"
    ></div>
  </div>
</template>
