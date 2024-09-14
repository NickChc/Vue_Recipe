<script setup lang="ts">
import { useLangStore } from "@/stores/langStore";
import { storeToRefs } from "pinia";

const langStore = useLangStore();
const { locale } = storeToRefs(langStore);
</script>

<template>
  <select v-model="locale">
    <option
      v-for="lang in $i18n.availableLocales"
      :key="`locale-${lang}`"
      :value="lang"
    >
      {{ lang.toUpperCase() }}
    </option>
  </select>
  {{ locale }}
</template>
