import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  draft: z.boolean().optional(),
});

const til = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/til' }),
  schema: postSchema,
});

const codingNotes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/coding-notes' }),
  schema: postSchema,
});

const thoughts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/thoughts' }),
  schema: postSchema.extend({
    image: z.string().optional(),
  }),
});

const experiments = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experiments' }),
  schema: postSchema,
});

export const collections = { til, 'coding-notes': codingNotes, thoughts, experiments };
