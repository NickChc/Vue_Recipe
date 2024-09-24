import { LANG } from "@/config/storageKeys";
import i18n from "@/i18n";
import { defineStore } from "pinia";
import { onMounted, ref, watch } from "vue";
import axios from "axios";

export enum TLocale_Enum {
  en = "en",
  ka = "ka",
}

export const useLangStore = defineStore("langStore", () => {
  const locale = ref(i18n.global.locale);

  function setLocale(lang: TLocale_Enum) {
    locale.value = lang;
  }

  watch(locale, (locale) => {
    localStorage.setItem(LANG, locale);
  });

  onMounted(async () => {
    if (localStorage.getItem(LANG)) return;

    const res = await axios.get("https://ipinfo.io/json");
    const data = res.data;
    const country = data.country as string;

    if (country.toLowerCase().includes("ge")) {
      setLocale(TLocale_Enum.ka);
    }
  });

  return { locale, setLocale };
});
