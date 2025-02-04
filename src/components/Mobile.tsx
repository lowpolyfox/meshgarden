import { useEffect, useState } from 'react'
import type { GalleryProps } from './PhotoGallery'

const Mobile = ({
  title,
  date,
  images,
  posts,
  children: description,
}: GalleryProps) => {
  const [loadedImages, setLoadedImages] = useState<string[]>([])
  const isLoading = images.length !== loadedImages.length

  const formattedDate = date
    .toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
    .replace(/(\w+)\s(\d+)/, '$1, $2')

  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    if (menuOpen && document.body.style.overflow !== 'hidden') {
      document.body.style.overflow = 'hidden'
    } else if (!menuOpen && document.body.style.overflow === 'hidden') {
      document.body.style.overflow = 'scroll'
    }
  }, [menuOpen])

  return (
    <div
      className={`relative w-full overflow-hidden ${menuOpen && 'max-h-screen'}`}
    >
      <aside
        className={`min-w-[85%] min-h-full max-h-screen absolute bg-slate-50 transition-[left] duration-300 ${menuOpen ? 'left-0' : 'left-[-85%]'}`}
      >
        <div className="relative size-full overflow-y-auto scrollbar-none p-5">
          <button
            className="absolute top-2.5 right-5"
            onClick={() => setMenuOpen(false)}
          >
            less
          </button>
          <nav>
            <ul>
              {posts.map((post) => {
                const formattedDate = new Date(String(post.fields.date))
                  .toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })
                  .replace(/(\w+)\s(\d+)/, '$1, $2')

                return (
                  <li key={post.sys.id}>
                    <a
                      href={`/posts/${post.fields.slug}`}
                      className="inline-block mb-3"
                    >
                      <span>{String(post.fields.title)}</span>
                      <span className="block italic text-xs">
                        {formattedDate}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>
      <div
        className={`relative min-w-screen transition-[left] duration-300 ${menuOpen ? 'left-[85%]' : 'left-0'}`}
      >
        <div className="px-5 py-2.5 flex items-center justify-between">
          <h1 className="font-bold">Photography</h1>
          <button onClick={() => setMenuOpen(true)}>more</button>
        </div>
        <div className="p-5 pb-0">
          <header className="mb-5">
            <h2 className="text-2xl font-bold">{title}</h2>
            <h3 className="mb-2.5">{formattedDate}</h3>
            {description}
          </header>
          <section className="relative">
            {images.map((img) => (
              <div
                key={img.sys.id}
                className="relative overflow-hidden aspect-[3/2] mb-5"
              >
                <img
                  src={String(img.fields.file?.url)}
                  alt={String(img.fields.title) ?? ''}
                  className="absolute inset-0 size-full object-contain cursor-pointer"
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
              className={`absolute inset-0 size-full z-30 bg-white transition-opacity duration-500 
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
      </div>
    </div>
  )
}

export default Mobile
