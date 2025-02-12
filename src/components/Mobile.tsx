import { useEffect, useState } from 'react'
import type { GalleryProps } from './PhotoGallery'
import { formatMonthYear, richTextStyles } from '../utils/misc'
import List from './List'
import { useOnClickOutside } from '../hooks/useOnClickOutside'
import { photographyRoot } from '../routes'
import { cn } from '../utils/cn'

const Mobile = ({
  title,
  date,
  images,
  posts,
  children: description,
}: GalleryProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loadedImages, setLoadedImages] = useState<string[]>([])
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
          <h1 className="font-bold">
            <a href={photographyRoot}>Photography</a>
          </h1>
          <button onClick={() => setMenuOpen(true)}>more</button>
        </div>
        <div className="p-5 pb-0">
          <header className="mb-5">
            <h2 className="text-2xl font-bold">{title}</h2>
            <h3 className="mb-2.5">
              {formatMonthYear(date).replace(/(\w+)\s(\d+)/, '$1, $2')}
            </h3>
            <div className={cn(richTextStyles)}>{description}</div>
          </header>
          <section className="relative">
            {images.map((img) => (
              <div
                key={img.sys.id}
                className="relative mb-5 aspect-[3/2] overflow-hidden"
              >
                <img
                  src={String(img.fields.file?.url)}
                  alt={String(img.fields.title) ?? ''}
                  className="absolute inset-0 size-full cursor-pointer object-contain"
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
                'fixed inset-0 z-30 size-full bg-white transition-opacity duration-500',
                isLoading
                  ? 'pointer-events-auto opacity-100'
                  : 'pointer-events-none opacity-0',
              )}
            >
              <div className="relative size-full">
                <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2">
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
