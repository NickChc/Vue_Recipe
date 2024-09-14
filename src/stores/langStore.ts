import { LANG } from "@/config/storageKeys";
import i18n from "@/i18n";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export enum TLocale_Enum {
  en = "en",
  ka = "ka",
}

export const useLangStore = defineStore("langStore", () => {
  const locale = ref(i18n.global.locale);

  function toggleLocale(lang: TLocale_Enum) {
    locale.value = lang;
  }

  watch(locale, (locale) => {
    localStorage.setItem(LANG, locale);
  });

  return { locale, toggleLocale };
});
