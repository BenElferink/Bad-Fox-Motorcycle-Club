import { useEffect, useRef, useState } from 'react'
import { useScreenSize } from './contexts/ScreenSizeContext'
import Header from './components/Header'
import Landing from './components/Landing'
import About from './components/About'
import { HOME } from './constants'

export default function App() {
  const { isMobile } = useScreenSize()
  const [scrolledTo, setScrolledTo] = useState(HOME)
  const landingRef = useRef(null)
  const teamRef = useRef(null)
  const mapRef = useRef(null)

  const loopRefs = (type, value, ...args) => {
    for (let i = 0; i < args.length; i++) {
      const r = args[i]

      if (type === 'scrollTo' && r?.id === value) {
        r?.scrollIntoView()
        setScrolledTo(value)
        break
      } else if (type === 'scrolledTo' && r?.offsetTop <= value) {
        setScrolledTo(r?.id)
        break
      }
    }
  }

  useEffect(() => {
    const handler = (e) => {
      const { pageYOffset, innerHeight } = e.path[1]
      const distance = pageYOffset + innerHeight
      loopRefs('scrolledTo', distance, mapRef.current, teamRef.current, landingRef.current)
    }

    window.addEventListener('scroll', handler)
    return () => {
      window.removeEventListener('scroll', handler)
    }
  }, [])

  const scrollTo = (elemId) => {
    loopRefs('scrollTo', elemId, mapRef.current, teamRef.current, landingRef.current)
  }

  return (
    <div className='App flex-col'>
      <Header scrollTo={scrollTo} scrolledTo={scrolledTo} />
      <Landing ref={landingRef} />
      {isMobile ? <About /> : null}
    </div>
  )
}
