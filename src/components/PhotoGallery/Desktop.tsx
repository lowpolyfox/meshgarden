import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { type GalleryProps } from '../PhotoGallery'
import { debounce } from '../../utils/debounce'

const NAV_WIDTH_IN_PX = 200
const VERTICAL_PADDING_IN_PX = 40
const MIN_NEXT_PHOTO_VISIBLE_PORTION_IN_PX = 80
const DEBOUNCE_TIMEOUT_IN_MS = 100

const DesktopGallery = ({
  title,
  date,
  images,
  posts,
  children: description,
}: GalleryProps) => {
  const containerElement = useRef<HTMLDivElement>(null)
  const [photoWidth, setPhotoWidth] = useState(0)
  const [photoHeight, setPhotoHeight] = useState(0)
  const [loadedImages, setLoadedImages] = useState<string[]>([])
  const isLoading = images.length !== loadedImages.length

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
    if (isLoading) return

    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }

  const formattedDate = date
    .toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    .replace(/(\w+)\s(\d+)/, '$1, $2')

  return (
    <div className="flex h-screen items-start justify-start">
      <nav
        className="min-h-screen bg-white relative"
        style={{
          width: NAV_WIDTH_IN_PX,
          paddingTop: (window.innerHeight - photoHeight) / 2,
          paddingBottom: (window.innerHeight - photoHeight) / 2,
        }}
      >
        <div className="absolute inset-5 max-h-full overflow-y-scroll scrollbar-none">
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
        </div>
      </nav>
      <section
        className={`relative h-full flex flex-1 items-center gap-5 mx-auto 
          ${isLoading ? 'overflow-x-hidden' : 'overflow-x-scroll scrollbar-none'}
        `}
        ref={containerElement}
        style={{
          paddingRight: `${MIN_NEXT_PHOTO_VISIBLE_PORTION_IN_PX}px`,
        }}
      >
        <div
          className="min-w-[360px] h-full px-5"
          style={{
            paddingTop: (window.innerHeight - photoHeight) / 2,
            paddingBottom: (window.innerHeight - photoHeight) / 2,
          }}
        >
          <h1 className="text-2xl font-bold">{title}</h1>
          <h2 className="mb-3">{formattedDate}</h2>
          {description}
        </div>
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
              onLoad={() =>
                setLoadedImages((loadedImages) => [
                  ...loadedImages,
                  String(img.fields.file?.url),
                ])
              }
            />
          </div>
        ))}
        <div
          className={`absolute inset-0 size-full z-30 bg-white transition-opacity duration-300 
            ${isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
        >
          <div className="relative size-full">
            <div className="absolute top-1/2 left-1/2 w-[45px] -translate-x-1/2 -translate-y-1/2">
              <div className="loader" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DesktopGallery
