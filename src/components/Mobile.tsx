import { useEffect, useState } from 'react'
import type { GalleryProps } from './PhotoGallery'
import { formatMonthYear, richTextStyles } from '../utils/misc'
import List from './List'
import { useOnClickOutside } from '../hooks/useOnClickOutside'
import { photographyRoot } from '../routes'
import { cn } from '../utils/cn'
import AnimatedText from './text/AnimatedText'

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

  const { ref: menu } = useOnClickOutside<HTMLDivElement>(() =>
    setMenuOpen(false),
  )

  useEffect(() => {
    if (menuOpen || isLoading) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'scroll'
    }
  }, [menuOpen, isLoading])

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
          <button onClick={() => setMenuOpen(true)}>more</button>
        </div>
        <div className="p-5 pb-0">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">
              <AnimatedText
                text={title}
                animationTrigger={!isLoading}
                delay={300}
              />
            </h1>
            <h2 className="mb-6">
              <AnimatedText
                text={formatMonthYear(date).replace(/(\w+)\s(\d+)/, '$1, $2')}
                animationTrigger={!isLoading}
                delay={300}
              />
            </h2>
            <div
              className={cn(
                'opacity-0 transition-opacity delay-500 duration-400',
                richTextStyles,
                !isLoading && 'opacity-100',
              )}
            >
              {textBody}
            </div>
          </header>
          <section className="relative">
            {images.map((img, index) => {
              const isPortrait = portraitImages.includes(index)
              return (
                <div
                  key={img.sys.id}
                  className={cn(
                    'relative mb-5 overflow-hidden',
                    isPortrait ? 'aspect-[2/3] max-w-[58.33%]' : 'aspect-[3/2]',
                    isPortrait &&
                      portraitImages.includes(index) &&
                      (portraitImages.indexOf(index) === 0
                        ? 'mr-auto'
                        : portraitImages.indexOf(index) % 2 === 1
                          ? 'ml-auto'
                          : 'mr-auto'),
                  )}
                >
                  <img
                    src={String(img.fields.file?.url)}
                    alt={String(img.fields.title) ?? ''}
                    className="absolute inset-0 size-full cursor-pointer object-contain"
                    onLoad={(e) => {
                      const { naturalHeight, naturalWidth } = e.currentTarget
                      if (naturalHeight > naturalWidth)
                        setPortraitImages((pImages) => [...pImages, index])

                      setLoadedImages((loadedImages) => [
                        ...loadedImages,
                        String(img.fields.file?.url),
                      ])
                    }}
                  />
                </div>
              )
            })}
            <div
              className={cn(
                'fixed inset-0 z-30 size-full bg-white transition-opacity duration-400',
                isLoading
                  ? 'pointer-events-auto opacity-100'
                  : 'pointer-events-none opacity-0',
              )}
            >
              <div className="relative size-full">
                <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 lg:top-1/2 lg:-translate-y-1/2">
                  <div className="loader" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Mobile
