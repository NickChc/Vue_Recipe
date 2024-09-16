<script setup lang="ts">
import { useLangStore } from "@/stores/langStore";
import { storeToRefs } from "pinia";

const langStore = useLangStore();
const { locale } = storeToRefs(langStore);
</script>

<template>
  <select
    class="hidden bg-primary dark:bg-secondary sm:block font-bold text-add p-2 cursor-pointer outline-none rounded-md"
    v-model="locale"
  >
    <option
      v-for="lang in $i18n.availableLocales"
      :key="`locale-${lang}`"
      :value="lang"
    >
      {{ lang.toUpperCase() }}
    </option>
  </select>
</template>
