import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tsconfigPaths from "vite-tsconfig-paths";
import Icons from "unplugin-icons/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tsconfigPaths(), Icons()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
