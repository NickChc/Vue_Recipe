import { defineStore } from "pinia";
import { useDark, useToggle } from "@vueuse/core";
import { onMounted, watch } from "vue";

export const useThemeStore = defineStore("themeStore", () => {
  const isDark = useDark();
  const toggle = useToggle(isDark);

  function toggleTheme(isDarkMode: boolean) {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }

  watch(isDark, (isDark) => {
    toggleTheme(isDark);
  });

  onMounted(() => {
    toggleTheme(isDark.value);
  });

  return { isDark, toggle };
});
