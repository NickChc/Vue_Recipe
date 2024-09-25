/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: ["./index.html", "./src/**/*.{js.ts.jsx,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--clr-primary)",
        secondary: "var(--clr-secondary)",
        add: "var(--clr-add)",
        "add-2": "var(--clr-add-2)",
        danger: "var(--clr-danger)",
        "danger-dark": "var(--clr-danger-dark)",
        success: "var(--clr-success)",
      },
      fontFamily: {
        roboto: "var(--font-roboto)",
        merri: "var(--font-merri)",
      },
      screens: {
        xs: "280px",
      },
      width: {
        "sidebar-btn": "var(--width-sidebar-btn)",
      },
      height: {
        "header-sm": "var(--height-header-sm)",
        "header-lg": "var(--height-header-lg)",
      },
      minWidth: {
        "sidebar-btn": "var(--width-sidebar-btn)",
      },
      animation: {
        "pulse-2": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-3": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-3/2": "spin 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};
