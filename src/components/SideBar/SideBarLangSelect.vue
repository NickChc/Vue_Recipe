<script setup lang="ts">
import { TLocale_Enum, useLangStore } from "@/stores/langStore";
import { storeToRefs } from "pinia";
import USFlagImage from "@/assets/images/US_Flag_Image.png";
import GEOFlagImage from "@/assets/images/GEO_Flag_Image.png";
import { ref } from "vue";

const langStore = useLangStore();
const { locale } = storeToRefs(langStore);

const dropdownOpen = ref(false);

function toggleOpen() {
  dropdownOpen.value = !dropdownOpen.value;
}

function handleLangSelect(lang: TLocale_Enum) {
  langStore.setLocale(lang);
  dropdownOpen.value = false;
}
</script>

<template>
  <div class="flex flex-col">
    <button
      class="flex items-center justify-between gap-x-6"
      @click="toggleOpen"
    >
      <div class="flex items-center gap-x-3">
        {{ locale.toUpperCase() }}
        <img
          v-if="locale === 'en'"
          :src="USFlagImage"
          alt="US flag image"
          class="w-8 aspect-video object-cover"
        />
        <img
          v-else-if="locale === 'ka'"
          :src="GEOFlagImage"
          alt="GEO flag image"
          class="w-8 aspect-video object-cover"
        />
      </div>
      <i
        :class="`material-symbols-outlined duration-300 ${
          dropdownOpen ? '-rotate-90' : 'rotate-90'
        }`"
        >chevron_right</i
      >
    </button>
    <ul
      :class="`list-none overflow-hidden mt-2 flex flex-col gap-y-1  ${
        dropdownOpen ? 'h-fit' : 'h-0'
      }`"
    >
      <li v-for="lang in $i18n.availableLocales" :key="`locale-${lang}`">
        <button
          class="bg-gray-600 w-full text-start p-1 rounded-sm"
          @click="handleLangSelect(lang as TLocale_Enum)"
        >
          {{ lang.toUpperCase() }}
        </button>
      </li>
    </ul>
    <hr class="border-1 border-gray-600 opacity-75 my-1" />
  </div>
</template>
