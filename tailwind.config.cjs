/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    // If using SvelteKit, also add:
    "./node_modules/daisyui/dist/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["dark"],
    // Optionally include others: themes: ["dark", "light", "cupcake", ...]
  },
};
