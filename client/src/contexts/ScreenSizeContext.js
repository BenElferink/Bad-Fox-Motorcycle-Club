import { createContext, useContext, useEffect, useState } from 'react'

// init context
const ScreenSizeContext = createContext()

// export the consumer
export function useScreenSize() {
  return useContext(ScreenSizeContext)
}

// export the provider (handle all the logic here)
export function ScreenSizeProvider({ children }) {
  const [{ width, height }, setWindowDimensions] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    const handler = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handler()

    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  const isMobile = width ? width <= 768 : true
  const isDesktop = width ? width >= 1440 : false

  return <ScreenSizeContext.Provider value={{ width, height, isMobile, isDesktop }}>{children}</ScreenSizeContext.Provider>
}
