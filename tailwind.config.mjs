/** @type {import('tailwindcss').Config} */

import daisyui from "daisyui";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "media",
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
