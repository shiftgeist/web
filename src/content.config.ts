import { glob } from 'astro/loaders'
import { defineCollection } from 'astro:content'

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
})

const dailyDriver = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/daily-driver' }),
})

export const collections = {
  portfolio,
  'daily-driver': dailyDriver,
}
