import { z, defineCollection } from "astro:content";

const postsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

export const collections = {
  posts: postsCollection,
};
