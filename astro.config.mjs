// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://pgofcode.co.za',
  markdown: {
    shikiConfig: {
      themes: {
        dark: 'vitesse-dark',
        light: 'vitesse-light',
      },
      defaultColor: false,
    },
  },

  integrations: [sitemap()],
});