import { useEffect, useRef, useState } from 'react'
import { useScreenSize } from './contexts/ScreenSizeContext'
import Header from './components/Header'
import Landing from './components/Landing'
import About from './components/About'
import Sneaks from './components/Sneaks'
import Team from './components/Team'
import { HOME } from './constants'

export default function App() {
  const { isMobile } = useScreenSize()
  const landingRef = useRef(null)
  const sneakRef = useRef(null)
  const mapRef = useRef(null)
  const teamRef = useRef(null)

  const loopRefs = (type, value, ...args) => {
    if (value === HOME) {
      window.scrollTo({ top: 0 })
    } else {
      for (let i = 0; i < args.length; i++) {
        const curr = args[i]
        if (type === 'scrollTo' && curr?.id === value) {
          curr?.scrollIntoView()
          break
        }
      }
    }
  }

  const scrollTo = (elemId) => {
    loopRefs('scrollTo', elemId, sneakRef.current, mapRef.current, landingRef.current, teamRef.current)
  }

  return (
    <div className='App flex-col'>
      <Header scrollTo={scrollTo} />
      <Landing ref={landingRef} />
      {isMobile ? <About /> : null}
      <Sneaks ref={sneakRef} />
      <Team ref={teamRef} />
    </div>
  )
}
