import { THEME } from "@/config/storageKeys";
import { defineStore } from "pinia";
import { onMounted, ref, watch } from "vue";

export const useThemeStore = defineStore("themeStore", () => {
  const isDark = ref(false);

  function toggleTheme() {
    isDark.value = !isDark.value;
  }

  function setIsDark(isDarkMode: boolean) {
    if (isDarkMode) {
      document.body.classList.add("dark");
      localStorage.setItem(THEME, "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.removeItem(THEME);
    }
  }

  watch(isDark, (isDarkMode) => {
    setIsDark(isDarkMode);
  });

  onMounted(() => {
    const savedTheme = localStorage.getItem(THEME);
    if (savedTheme) {
      setIsDark(true);
      isDark.value = true;
    }
  });

  return { isDark, toggleTheme };
});
