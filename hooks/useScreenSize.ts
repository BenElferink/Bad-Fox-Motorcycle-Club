import { useEffect, useMemo, useState } from 'react'

const useScreenSize = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const payload = useMemo(
    () => ({
      screenWidth: windowDimensions.width,
      screenHeight: windowDimensions.height,
      isMobile: windowDimensions.width ? windowDimensions.width < 768 : true,
    }),
    [windowDimensions]
  )

  return payload
}

export default useScreenSize
