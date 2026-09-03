// @ts-check
import node from '@astrojs/node'
import svelte from '@astrojs/svelte'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  // Static by default; only src/pages/api/wake.ts opts into on-demand
  // rendering (via `export const prerender = false`), so a server
  // adapter is still required. Swap for @astrojs/vercel, @astrojs/netlify,
  // or @astrojs/cloudflare if you deploy somewhere other than a Node host.
  adapter: node({ mode: 'standalone' }),
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
  },
})
