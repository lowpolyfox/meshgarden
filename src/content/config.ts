import { z, defineCollection } from 'astro:content'

const postsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      description: z.string().optional(),
      tags: z.array(z.string()),
      postType: z.enum(['text', 'photography']),
      photos: z.array(image()).optional()
    })
})

export const collections = {
  posts: postsCollection
}
