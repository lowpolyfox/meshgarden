import type { Asset, Entry } from 'contentful'
import { type ReactNode } from 'react'
import type { Post } from '../lib/contentful'
import useIsMobile from '../hooks/useIsMobile'
import DesktopGallery from './PhotoGallery/Desktop'
import Mobile from './PhotoGallery/Mobile'

export interface GalleryProps {
  title: string
  date: Date
  images: Asset[]
  posts: Entry<Post>[]
  children: ReactNode
}
const PhotoGallery = (props: GalleryProps) => {
  const { ready: deviceHasBeenDetermined, isMobile } = useIsMobile()

  if (!deviceHasBeenDetermined)
    return (
      <div className="w-screen h-screen max-w-full max-h-full bg-white"></div>
    )

  if (isMobile) {
    return <Mobile {...props} />
  }
  return <DesktopGallery {...props} />
}

export default PhotoGallery
