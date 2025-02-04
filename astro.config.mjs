// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  integrations: [react()],

  image: {
    domains: ['images.ctfassets.net'],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
})
