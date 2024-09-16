<script setup lang="ts">
import { TLocale_Enum, useLangStore } from "@/stores/langStore";
import { storeToRefs } from "pinia";
import USFlagImage from "@/assets/images/US_Flag_Image.png";
import GEOFlagImage from "@/assets/images/GEO_Flag_Image.png";
import { nextTick, ref } from "vue";

const langStore = useLangStore();
const { locale } = storeToRefs(langStore);

const dropdownOpen = ref(false);
const langList = ref<null | HTMLUListElement>(null);

function toggleOpen() {
  if (!dropdownOpen.value && langList.value) {
    langList.value.style.height = "auto";
    const fullheight = langList.value.scrollHeight + "px";
    langList.value.style.height = "0";

    langList.value.offsetHeight;

    nextTick(() => {
      if (langList.value == null) return;

      langList.value.style.height = fullheight;
    });
  } else if (langList.value) {
    langList.value.style.height = langList.value.scrollHeight + "px";
    nextTick(() => {
      if (langList.value) langList.value.style.height = "0";
    });
  }

  dropdownOpen.value = !dropdownOpen.value;
}

function handleLangSelect(lang: TLocale_Enum) {
  langStore.setLocale(lang);
  toggleOpen();
}
</script>

<template>
  <div class="flex flex-col w-full">
    <button
      class="flex items-center justify-between gap-x-6 w-[95%] outline-none mx-auto"
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
      ref="langList"
      class="list-none overflow-hidden mt-2 flex flex-col gap-y-1 h-0 duration-300 transition-[height]"
    >
      <li v-for="lang in $i18n.availableLocales" :key="`locale-${lang}`">
        <button
          :class="`bg-add-2 w-full flex items-center justify-between p-1 rounded-sm ${
            locale === lang ? 'opacity-75 text-primary pointer-events-none' : ''
          }`"
          @click="handleLangSelect(lang as TLocale_Enum)"
        >
          {{ lang.toUpperCase() }}
          <span v-if="locale === lang" class="text-xs">current</span>
        </button>
      </li>
    </ul>
    <hr class="border-1 border-gray-600 opacity-75 my-1" />
  </div>
</template>

<style>
.open {
  height: auto;
}
</style>
