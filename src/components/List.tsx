import type { Entry } from 'contentful'
import type { Post } from '../lib/contentful'
import { formatMonthYear } from '../utils/misc'
import { photographyRoot } from '../routes'
import AnimatedText, { type AnimatedTextProps } from './text/AnimatedText'

interface Props {
  posts: Entry<Post>[]
  containerClassName?: string
  itemClassName?: string
  animatedTextConfig: Pick<AnimatedTextProps, 'animationTrigger' | 'delay'>
}
const List = ({
  posts,
  containerClassName,
  itemClassName,
  animatedTextConfig,
}: Props) => {
  const currentPostSlug = window.location.pathname
    .split('/')
    .filter(Boolean)
    .pop()

  return (
    <nav className={containerClassName}>
      <ul>
        {posts.map((post) => {
          const isActive = post.fields.slug === currentPostSlug
          const date = formatMonthYear(String(post.fields.date)).replace(
            /(\w+)\s(\d+)/,
            '$1, $2',
          )

          return (
            <li key={post.sys.id}>
              <a
                href={`${photographyRoot}/${post.fields.slug}`}
                className={`inline-block whitespace-nowrap mb-3 transition-opacity hover:opacity-75 ${itemClassName}`}
              >
                <span className={`${isActive ? 'font-semibold' : ''}`}>
                  <AnimatedText
                    text={String(post.fields.title)}
                    {...animatedTextConfig}
                  />
                </span>
                <span
                  className={`block italic text-xs ${isActive ? 'font-medium' : ''}`}
                >
                  <AnimatedText
                    text={date}
                    delay={100}
                    {...animatedTextConfig}
                  />
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
