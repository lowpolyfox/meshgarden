import React from 'react'

export function useAutoUpdatingRef<T>(input: T) {
  const ref = React.useRef<T>(input)
  ref.current = input
  return ref
}
