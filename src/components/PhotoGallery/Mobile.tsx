import { useState } from 'react'
import type { GalleryProps } from '../PhotoGallery'

const Mobile = ({
  title,
  date,
  images,
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

  return (
    <div className="w-full mx-auto px-5 py-12">
      <header className="mb-12">
        <h1 className="text-2xl font-bold">{title}</h1>
        <h2 className="mb-2.5">{formattedDate}</h2>
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
  )
}

export default Mobile
