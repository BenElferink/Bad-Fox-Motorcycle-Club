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
    width: 0,
    height: 0,
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

  const isMobile = width ? width < 768 : true

  return <ScreenSizeContext.Provider value={{ width, height, isMobile }}>{children}</ScreenSizeContext.Provider>
}
