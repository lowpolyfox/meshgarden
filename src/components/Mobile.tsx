import { useEffect, useState } from 'react'
import type { GalleryProps } from './PhotoGallery'
import { formatMonthYear, richTextStyles } from '../utils/misc'
import List from './List'
import { useOnClickOutside } from '../hooks/useOnClickOutside'
import { photographyRoot } from '../routes'
import { cn } from '../utils/cn'
import AnimatedText from './text/AnimatedText'
import useDelayUnmount from '../hooks/useDelayUnmount'

const Mobile = ({
  title,
  date,
  images,
  posts,
  children: textBody,
}: GalleryProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loadedImages, setLoadedImages] = useState<string[]>([])
  const [portraitImages, setPortraitImages] = useState<number[]>([])
  const isLoading = images.length !== loadedImages.length
  const shouldRenderLoader = useDelayUnmount({
    isMounted: isLoading,
    delayTimeInMs: 240,
  })

  const [lightbox, setLightbox] = useState<{
    open: boolean
    imageIndex: number
    loading?: boolean
  }>({ open: false, imageIndex: -1 })
  const shouldRenderLightbox = useDelayUnmount({
    isMounted: lightbox.open,
    delayTimeInMs: 240,
  })

  const { ref: menu } = useOnClickOutside<HTMLDivElement>(() =>
    setMenuOpen(false),
  )

  useEffect(() => {
    if (menuOpen || lightbox.open || isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'scroll'
    }
  }, [menuOpen, lightbox.open, isLoading])

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        menuOpen && 'max-h-screen',
      )}
    >
      <aside
        ref={menu}
        className={cn(
          'absolute max-h-screen min-h-full min-w-[85%] bg-[#606C38] transition-[left] duration-300',
          menuOpen ? 'left-0' : 'left-[-85%]',
        )}
      >
        <div className="scrollbar-none relative size-full overflow-y-auto p-5">
          <a
            className="absolute top-2.5 left-5 text-[#FBFBFB] underline"
            href={photographyRoot}
          >
            go back
          </a>
          <button
            className="absolute top-2.5 right-5 text-[#FBFBFB]"
            onClick={() => setMenuOpen(false)}
          >
            less
          </button>
          <List
            containerClassName="pt-7"
            itemClassName="text-[#FBFBFB]"
            posts={posts}
            animatedTextConfig={{ animationTrigger: menuOpen, delay: 300 }}
          />
        </div>
      </aside>
      <div
        className={cn(
          'relative min-w-screen transition-[left] duration-300',
          menuOpen ? 'left-[85%]' : 'left-0',
        )}
      >
        <div className="flex items-center justify-between px-5 py-2.5">
          <p className="font-bold">
            <a href={photographyRoot}>Photography</a>
          </p>
          <button onClick={() => setMenuOpen(true)} disabled={isLoading}>
            more
          </button>
        </div>
        <div className="p-5 pb-0">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">
              <AnimatedText
                text={title}
                animationTrigger={!isLoading}
                delay={240}
              />
            </h1>
            <h2 className="mb-6">
              <AnimatedText
                text={formatMonthYear(date).replace(/(\w+)\s(\d+)/, '$1, $2')}
                animationTrigger={!isLoading}
                delay={240}
              />
            </h2>
            <div
              className={cn(
                'opacity-100 transition-opacity delay-360 duration-240',
                richTextStyles,
                isLoading && 'opacity-0',
              )}
            >
              {textBody}
            </div>
          </header>
          <section
            className={cn(
              'flex flex-col opacity-100 transition-opacity delay-480 duration-240',
              isLoading && 'opacity-0',
            )}
          >
            {images.map((img, index) => {
              const isPortrait = portraitImages.includes(index)
              return (
                <button
                  key={img.sys.id}
                  onClick={() =>
                    setLightbox({
                      open: true,
                      imageIndex: index,
                      loading: true,
                    })
                  }
                >
                  <img
                    src={String(img.fields.file?.url)}
                    alt={String(img.fields.title) ?? ''}
                    className={cn(
                      'mb-5',
                      isPortrait
                        ? 'aspect-[2/3] max-w-[58.33%]'
                        : 'aspect-[3/2]',
                      isPortrait &&
                        (portraitImages.indexOf(index) === 0
                          ? 'mr-auto'
                          : portraitImages.indexOf(index) % 2 === 1
                            ? 'ml-auto'
                            : 'mr-auto'),
                    )}
                    onLoad={(e) => {
                      const { naturalHeight, naturalWidth } = e.currentTarget
                      if (naturalHeight > naturalWidth) {
                        setPortraitImages((pImages) =>
                          [...pImages, index].sort((a, b) => a - b),
                        )
                      }
                      setLoadedImages((loadedImages) => [
                        ...loadedImages,
                        String(img.fields.file?.url),
                      ])
                    }}
                  />
                </button>
              )
            })}
          </section>
        </div>
      </div>
      {shouldRenderLightbox && (
        <div
          className={cn(
            'fixed inset-0 z-30 size-full bg-white/80',
            lightbox.open
              ? 'animate-[fade-in_240ms_ease-in] backdrop-blur-md'
              : 'animate-[fade-out_240ms_ease-in] opacity-0',
          )}
        >
          <div className="relative flex size-full flex-col justify-center">
            <div className="mb-auto w-full px-5 py-2.5">
              <button
                onClick={() =>
                  setLightbox((prev) => ({ ...prev, open: false }))
                }
                disabled={isLoading}
                className="float-right"
              >
                close
              </button>
            </div>
            <button
              onClick={(e) => {
                if (e.pageX > window.innerWidth / 2) {
                  setLightbox((prev) => ({
                    ...prev,
                    imageIndex:
                      lightbox.imageIndex !== images.length - 1
                        ? lightbox.imageIndex + 1
                        : 0,
                    loading: true,
                  }))
                } else {
                  setLightbox((prev) => ({
                    ...prev,
                    imageIndex:
                      lightbox.imageIndex !== 0
                        ? lightbox.imageIndex - 1
                        : images.length - 1,
                    loading: true,
                  }))
                }
              }}
              disabled={lightbox.loading}
              className="mb-auto size-full"
            >
              <img
                src={String(images[lightbox.imageIndex].fields.file?.url)}
                alt={`${title} - image ${lightbox.imageIndex} of ${images.length}`}
                onLoad={() => {
                  setLightbox((prev) => ({ ...prev, loading: false }))
                }}
              />
            </button>
          </div>
        </div>
      )}
      {shouldRenderLoader && (
        <div
          className={cn(
            'fixed inset-0 z-30 size-full bg-white transition-opacity duration-600',
            isLoading ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div className="relative size-full">
            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2">
              <div className="loader" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Mobile
