import type { Asset, Entry } from 'contentful'
import { type ReactNode } from 'react'
import type { Post } from '../lib/contentful'
import useIsMobile from '../hooks/useIsMobile'
import DesktopGallery from './Desktop'
import MobileGallery from './Mobile'
import '../../src/styles/global.css'

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
    return <div className="h-screen max-h-full w-screen max-w-full bg-white" />

  if (isMobile) {
    return <MobileGallery {...props} />
  }
  return <DesktopGallery {...props} />
}

export default PhotoGallery
