import type { Asset, Entry } from 'contentful'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Post } from '../lib/contentful'

const NAV_WIDTH_IN_PX = 250
interface Props {
  images: Asset[]
  posts: Entry<Post>[]
  children: ReactNode
}
const ImageCarousel = ({ images, posts, children }: Props) => {
  const containerElement = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const calculateDimensions = () => {
    if (containerElement.current) {
      const altWidth = window.innerWidth - NAV_WIDTH_IN_PX
      const altHeight = (altWidth * 2) / 3
      setHeight(altHeight)
      setWidth(altWidth)
    }
  }

  const debounce = (func: () => void, wait: number) => {
    let timeout: ReturnType<typeof setTimeout> | null = null
    return () => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(func, wait)
    }
  }

  useEffect(() => {
    calculateDimensions()
    const handleResize = debounce(() => {
      calculateDimensions()
    }, 100)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div>
      <div className="flex items-center h-screen">
        <nav
          className="h-full bg-white px-4"
          style={{
            width: NAV_WIDTH_IN_PX,
            paddingTop: (window.innerHeight - height) / 2,
          }}
        >
          <h1 className="font-bold mb-4">Analog Photography</h1>
          {posts.map((post) => {
            const formattedDate = new Date(post.fields.date as string)
              .toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })
              .replace(/(\w+)\s(\d+)/, '$1, $2')

            return (
              <a key={post.sys.id} href={`/posts/${post.fields.slug}`}>
                <span>{post.fields.title as string}</span>
                <span className="block italic text-xs">{formattedDate}</span>
              </a>
            )
          })}
        </nav>
        <section
          className="mx-auto flex gap-10 overflow-x-scroll "
          ref={containerElement}
          style={{
            width: `${width}px`,
            height: `${height}px`,
          }}
        >
          {children && <div className="min-w-[200px]">{children}</div>}
          {images.map((img) => (
            <div
              key={img.sys.id}
              className="relative overflow-hidden h-full min-w-full"
            >
              <img
                src={img.fields.file?.url as string}
                alt=""
                className="absolute inset-0 size-full object-contain"
              />
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

export default ImageCarousel
