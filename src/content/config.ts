import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    author: z.string(),
    image: z.string().optional(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
  })
});

export const collections = {
  blog
};