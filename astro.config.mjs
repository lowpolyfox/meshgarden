// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'

import vercel from '@astrojs/vercel'

export default defineConfig({
  integrations: [react(), tailwind()],

  image: {
    domains: ['images.ctfassets.net'],
  },

  adapter: vercel(),
})
