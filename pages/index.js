import { useRef } from 'react'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Landing from '../components/Landing'
// import CountDown from '../components/CountDown'
import About from '../components/About'
import Sneaks from '../components/Sneaks'
import Partnerships from '../components/Partnerships'
import Roadmap from '../components/Roadmap'
import Team from '../components/Team'
import { HOME } from '../constants/scroll-nav'

export default function Home() {
  const { isMobile } = useScreenSize()
  const mapRef = useRef(null)
  const teamRef = useRef(null)

  const loopRefs = (type, value, ...args) => {
    if (value === HOME) {
      window.scrollTo({ top: 0 })
    } else {
      for (let i = 0; i < args.length; i++) {
        const curr = args[i]
        if (type === 'scrollTo' && curr?.id === value) {
          curr?.scrollIntoView({ block: 'nearest' })
          break
        }
      }
    }
  }

  const scrollTo = (elemId) => {
    loopRefs('scrollTo', elemId, mapRef.current, teamRef.current)
  }

  return (
    <div className='App flex-col'>
      <Header scrollTo={scrollTo} />
      <Landing isHome />
      {/* <CountDown /> */}
      {isMobile ? <About /> : null}
      <Sneaks />
      <Partnerships />
      <Roadmap ref={mapRef} />
      <Team ref={teamRef} />
      <Footer />
    </div>
  )
}
