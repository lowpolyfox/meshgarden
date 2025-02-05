import * as React from 'react'
import { useAutoUpdatingRef } from './useAutoUpdatingRef'

type OnClickOutsideFunc = (event: Event) => void
export function useOnClickOutside<T extends HTMLElement>(
  onClickOutsideFunc: OnClickOutsideFunc,
  skip?: boolean,
) {
  const ref = React.useRef<T>(null)

  const callbackRef = useAutoUpdatingRef(onClickOutsideFunc)

  React.useEffect(() => {
    if (skip) return
    const listener = (event: Event) => {
      if (!callbackRef.current) return
      // Do nothing if clicking ref's element or descendent elements
      if (
        !ref.current ||
        (event.target && ref.current.contains(event.target as HTMLElement))
      ) {
        return
      }
      callbackRef.current(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [callbackRef, ref, skip])
  return { ref }
}
