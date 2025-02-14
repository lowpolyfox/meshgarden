import type { Entry } from 'contentful'
import type { Post } from '../lib/contentful'
import { formatMonthYear } from '../utils/misc'
import { photographyRoot } from '../routes'
import AnimatedText, { type AnimatedTextProps } from './text/AnimatedText'
import { cn } from '../utils/cn'

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
                className={cn(
                  'mb-3 inline-block whitespace-nowrap transition-opacity hover:opacity-75',
                  itemClassName,
                )}
              >
                <span className={cn(isActive && 'font-semibold')}>
                  <AnimatedText
                    text={String(post.fields.title)}
                    {...animatedTextConfig}
                  />
                </span>
                <span
                  className={cn(
                    'block text-xs italic',
                    isActive && 'font-medium',
                  )}
                >
                  <AnimatedText text={date} {...animatedTextConfig} />
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
