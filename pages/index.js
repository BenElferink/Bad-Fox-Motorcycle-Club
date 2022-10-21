import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { useScreenSize } from '../contexts/ScreenSizeContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Landing from '../components/Home/Landing'
// import CountDown from '../components/CountDown'
import About from '../components/Home/About'
import Sneaks from '../components/Home/Sneaks'
import Partnerships from '../components/Home/Partnerships'
import Utilities from '../components/Home/Utilities'
import Team from '../components/Home/Team'
import { HOME } from '../constants/scroll-nav'

const CountDown = dynamic(() => import('../components/CountDown'), { ssr: false })

export default function Page() {
  const { isTablet } = useScreenSize()
  const utilsRef = useRef(null)
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
    loopRefs('scrollTo', elemId, utilsRef.current, teamRef.current)
  }

  return (
    <div className='App flex-col'>
      <Header scrollTo={scrollTo} />
      <Landing isHome />
      <CountDown />
      {isTablet ? <About /> : null}
      <Sneaks />
      <Partnerships />
      <Utilities ref={utilsRef} />
      <Team ref={teamRef} />
      <Footer />
    </div>
  )
}
