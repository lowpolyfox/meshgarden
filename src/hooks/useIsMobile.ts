import { useState, useEffect } from 'react'

const useIsMobile = () => {
  const [ready, setReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const agentIsMobile =
        /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent)

      setIsMobile(agentIsMobile && window.screen.width < 1024)
      setReady(true)
    }

    detectDevice()

    window.addEventListener('resize', detectDevice)
    return () => {
      window.removeEventListener('resize', detectDevice)
    }
  }, [])
  return { isMobile, ready }
}

export default useIsMobile
