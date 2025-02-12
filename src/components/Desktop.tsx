import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { type GalleryProps } from './PhotoGallery'
import { debounce } from '../utils/debounce'
import { formatMonthYear, richTextStyles } from '../utils/misc'
import List from './List'
import { photographyRoot } from '../routes'
import { useIsMounted } from '../hooks/useIsMounted'
import { cn } from '../utils/cn'

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
  const isMounted = useIsMounted()

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

  return (
    <div className="flex h-screen items-start justify-start">
      <aside
        className="relative min-h-screen bg-white"
        style={{
          width: NAV_WIDTH_IN_PX,
          paddingTop: (window.innerHeight - photoHeight) / 2,
          paddingBottom: (window.innerHeight - photoHeight) / 2,
        }}
      >
        <div className="scrollbar-none absolute inset-5 max-h-full overflow-y-scroll">
          <h1 className="mb-4 font-bold">
            <a
              className="relative z-[1] inline-block overflow-hidden px-0.5 transition-colors delay-[50] duration-200 after:absolute after:inset-0 after:z-[-1] after:translate-y-full after:bg-[#606C38] after:transition-transform after:duration-200 hover:text-[#FBFBFB] hover:after:translate-y-0"
              href={photographyRoot}
            >
              Photography
            </a>
          </h1>
          <List
            posts={posts}
            animatedTextConfig={{
              animationTrigger: isMounted && !isLoading,
              delay: 150,
            }}
          />
        </div>
      </aside>
      <section
        className={cn(
          'relative mx-auto flex h-full flex-1 items-center gap-5',
          isLoading ? 'overflow-x-hidden' : 'scrollbar-none overflow-x-scroll',
        )}
        ref={containerElement}
        style={{
          paddingRight: `${MIN_NEXT_PHOTO_VISIBLE_PORTION_IN_PX}px`,
        }}
      >
        <div
          className="h-full min-w-[360px] px-5"
          style={{
            paddingTop: (window.innerHeight - photoHeight) / 2,
            paddingBottom: (window.innerHeight - photoHeight) / 2,
          }}
        >
          <h1 className="text-2xl font-bold">{title}</h1>
          <h2 className="mb-3">
            {formatMonthYear(date).replace(/(\w+)\s(\d+)/, '$1, $2')}
          </h2>
          <div className={cn(richTextStyles)}>{description}</div>
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
              className="absolute inset-0 size-full cursor-pointer object-contain"
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
          className={cn(
            'absolute inset-0 z-30 size-full bg-white transition-opacity duration-200',
            isLoading
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0',
          )}
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
