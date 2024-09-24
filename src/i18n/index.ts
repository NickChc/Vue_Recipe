import { createI18n } from "vue-i18n";
import en from "@/translations/en.json";
import ka from "@/translations/ka.json";
import { LANG } from "@/config/storageKeys";

type MessageSchema = typeof en | typeof ka;

export default createI18n<[MessageSchema], "en" | "ka">({
  locale: localStorage.getItem(LANG) || "en",
  fallbackLocale: "en",
  legacy: false,
  messages: {
    en,
    ka,
  },
});
