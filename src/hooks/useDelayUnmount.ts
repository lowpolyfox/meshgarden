import { useEffect, useState } from 'react'

interface Props {
  isMounted: boolean
  delayTimeInMs: number
}
function useDelayUnmount({ isMounted, delayTimeInMs }: Props) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>
    if (isMounted && !shouldRender) {
      setShouldRender(true)
    } else if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), delayTimeInMs)
    }
    return () => clearTimeout(timeoutId)
  }, [isMounted, delayTimeInMs, shouldRender])

  return shouldRender
}

export default useDelayUnmount
