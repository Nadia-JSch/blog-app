import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const til = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/til' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const codingNotes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/coding-notes' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { til, 'coding-notes': codingNotes };
