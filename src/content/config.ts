import { z, defineCollection } from 'astro:content'

export enum POST_TYPES {
  text = 'text',
  photography = 'photography'
}

const postsCollection = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.date(),
      description: z.string().optional(),
      tags: z.array(z.string()),
      postType: z.nativeEnum(POST_TYPES),
      photos: z.array(image()).optional()
    })
})

export const collections = {
  posts: postsCollection
}
