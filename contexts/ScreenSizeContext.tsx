import { createContext, useContext, useEffect, useMemo, useState } from 'react'

interface ContextValue {
  screenWidth: number
  screenHeight: number
  isMobile: boolean
  isTablet: boolean
}

const ScreenSizeContext = createContext<ContextValue>({
  screenWidth: 0,
  screenHeight: 0,
  isMobile: true,
  isTablet: true,
})

// export the consumer
export function useScreenSize() {
  return useContext(ScreenSizeContext)
}

// export the provider (handle all the logic here)
export function ScreenSizeProvider({ children }: { children: JSX.Element }) {
  // const mountRef = useRef(true)
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const handleResize = () => {
      // if (mountRef.current)
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      // mountRef.current = false
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const payload = useMemo(
    () => ({
      screenWidth: windowDimensions.width,
      screenHeight: windowDimensions.height,
      isMobile: windowDimensions.width ? windowDimensions.width < 768 : true,
      isTablet: windowDimensions.width ? windowDimensions.width < 992 : true,
    }),
    [windowDimensions]
  )

  return <ScreenSizeContext.Provider value={payload}>{children}</ScreenSizeContext.Provider>
}
