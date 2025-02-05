import type { Entry } from 'contentful'
import type { Post } from '../lib/contentful'
import { formatMonthYear } from '../utils/misc'

interface Props {
  posts: Entry<Post>[]
}
const List = ({ posts }: Props) => {
  const currentPostSlug = window.location.pathname
    .split('/')
    .filter(Boolean)
    .pop()
  return (
    <nav>
      <ul>
        {posts.map((post) => {
          const isActive = post.fields.slug === currentPostSlug

          return (
            <li key={post.sys.id}>
              <a
                href={`/posts/${post.fields.slug}`}
                className="inline-block mb-3 transition-opacity hover:opacity-75"
              >
                <span className={`${isActive && 'font-semibold'}`}>
                  {String(post.fields.title)}
                </span>
                <span className="block italic text-xs">
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
