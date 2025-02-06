// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import partytown from '@astrojs/partytown'
import icon from 'astro-icon'

export default defineConfig({
  integrations: [
    react(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    icon(),
  ],

  image: {
    domains: ['images.ctfassets.net'],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
})
