import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import type { APIContext } from 'astro'
import { BLOG_ROUTE } from '../routes'

export async function GET(context: APIContext) {
  const blog = await getCollection('posts')

  return rss({
    title: 'meshgarden, by Alan Maldonado',
    description: 'Blog by Alan Maldonado',
    site: 'https://www.meshgarden.space',
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      link: `${BLOG_ROUTE}/${post.slug}`
    }))
  })
}
