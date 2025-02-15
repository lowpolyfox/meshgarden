// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import partytown from '@astrojs/partytown'
import icon from 'astro-icon'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://www.meshgarden.space/',
  integrations: [
    react(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    icon(),
    sitemap(),
  ],

  image: {
    domains: ['images.ctfassets.net'],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
})
