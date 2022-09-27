import { createContext, useContext } from 'react'
import useWindowDimensions from '../hooks/useWindowDimensions'

// init context
const ScreenSizeContext = createContext()

// export the consumer
export function useScreenSize() {
  return useContext(ScreenSizeContext)
}

// export the provider (handle all the logic here)
export function ScreenSizeProvider({ children }) {
  const { width, height } = useWindowDimensions()

  const isMobile = width ? width < 768 : true

  return (
    <ScreenSizeContext.Provider value={{ screenWidth: width, screenHeight: height, isMobile }}>
      {children}
    </ScreenSizeContext.Provider>
  )
}
