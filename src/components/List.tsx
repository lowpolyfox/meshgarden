import type { Entry } from 'contentful'
import type { Post } from '../lib/contentful'
import { formatMonthYear } from '../utils/misc'
import { photographyRoot } from '../routes'

interface Props {
  posts: Entry<Post>[]
  containerClassName?: string
  itemClassName?: string
}
const List = ({ posts, containerClassName, itemClassName }: Props) => {
  const currentPostSlug = window.location.pathname
    .split('/')
    .filter(Boolean)
    .pop()
  return (
    <nav className={containerClassName}>
      <ul>
        {posts.map((post) => {
          const isActive = post.fields.slug === currentPostSlug

          return (
            <li key={post.sys.id}>
              <a
                href={`${photographyRoot}/${post.fields.slug}`}
                className={`inline-block whitespace-nowrap mb-3 transition-opacity hover:opacity-75 ${itemClassName}`}
              >
                <span className={`${isActive ? 'font-semibold' : ''}`}>
                  {String(post.fields.title)}
                </span>
                <span
                  className={`block italic text-xs ${isActive ? 'font-medium' : ''}`}
                >
                  {formatMonthYear(String(post.fields.date)).replace(
                    /(\w+)\s(\d+)/,
                    '$1, $2',
                  )}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
export default List
