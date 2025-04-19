import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './static/**/*.{html,js}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;