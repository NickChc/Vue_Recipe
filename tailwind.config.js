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
        danger: "var(--clr-danger)",
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
      minWidth: {
        "sidebar-btn": "var(--width-sidebar-btn)",
      },
    },
  },
  plugins: [],
};
