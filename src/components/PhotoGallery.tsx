import type { Asset, Entry } from 'contentful'
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from 'react'
import type { Post } from '../lib/contentful'
import { debounce } from '../utils/debounce'

const NAV_WIDTH_IN_PX = 240
const VERTICAL_PADDING_IN_PX = 40
const MIN_NEXT_PHOTO_VISIBLE_PORTION_IN_PX = 80
const DEBOUNCE_TIMEOUT_IN_MS = 100
interface Props {
  images: Asset[]
  posts: Entry<Post>[]
  children: ReactNode
}
const PhotoGallery = ({ images, posts, children }: Props) => {
  const containerElement = useRef<HTMLDivElement>(null)
  const [photoWidth, setPhotoWidth] = useState(0)
  const [photoHeight, setPhotoHeight] = useState(0)

  const calculatePhotoDimensions = () => {
    if (containerElement.current) {
      const maxHeight = window.innerHeight - VERTICAL_PADDING_IN_PX
      const viewportWidth = window.innerWidth

      let width =
        containerElement.current.offsetWidth -
        MIN_NEXT_PHOTO_VISIBLE_PORTION_IN_PX
      let height = (width * 2) / 3

      if (height > maxHeight) {
        height = maxHeight
        width = (height * 3) / 2
      }

      if (width > viewportWidth) {
        width = viewportWidth
        height = (width * 2) / 3
      }

      setPhotoHeight(height)
      setPhotoWidth(width)
    }
  }

  useEffect(() => {
    calculatePhotoDimensions()
    const handleResize = debounce(() => {
      calculatePhotoDimensions()
    }, DEBOUNCE_TIMEOUT_IN_MS)

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleImageClick = (event: MouseEvent<HTMLImageElement>) => {
    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }
  return (
    <div className="flex h-screen">
      <nav
        className="min-h-full bg-white px-4"
        style={{
          width: NAV_WIDTH_IN_PX,
          paddingTop: (window.innerHeight - photoHeight) / 2,
          paddingBottom: (window.innerHeight - photoHeight) / 2,
        }}
      >
        <h1 className="font-bold mb-4">Photography</h1>
        {posts.map((post) => {
          const formattedDate = new Date(String(post.fields.date))
            .toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })
            .replace(/(\w+)\s(\d+)/, '$1, $2')

          return (
            <a
              key={post.sys.id}
              href={`/posts/${post.fields.slug}`}
              className="block mb-3"
            >
              <span>{String(post.fields.title)}</span>
              <span className="block italic text-xs">{formattedDate}</span>
            </a>
          )
        })}
      </nav>
      <section
        className="mx-auto flex gap-5 overflow-x-scroll flex-1 h-full items-center"
        ref={containerElement}
        style={{
          paddingRight: `${MIN_NEXT_PHOTO_VISIBLE_PORTION_IN_PX}px`,
        }}
      >
        {children && (
          <div
            className="min-w-[360px] h-full "
            style={{
              paddingTop: (window.innerHeight - photoHeight) / 2,
              paddingBottom: (window.innerHeight - photoHeight) / 2,
            }}
          >
            {children}
          </div>
        )}
        {images.map((img) => (
          <div
            key={img.sys.id}
            className="relative overflow-hidden"
            style={{
              minWidth: `${photoWidth}px`,
              width: `${photoWidth}px`,
              height: `${photoHeight}px`,
            }}
          >
            <img
              src={String(img.fields.file?.url)}
              alt={String(img.fields.title) ?? ''}
              className="absolute inset-0 size-full object-contain cursor-pointer"
              onClick={handleImageClick}
            />
          </div>
        ))}
      </section>
    </div>
  )
}

export default PhotoGallery
