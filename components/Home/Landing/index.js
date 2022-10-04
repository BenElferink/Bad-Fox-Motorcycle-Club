import Image from 'next/image'
import { useState } from 'react'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import About from '../About'
import { GITHUB_MEDIA_URL } from '../../../constants/api-urls'
import styles from './Landing.module.css'

const showFemale = !!Math.round(Math.random())

const Landing = ({ isHome = false, children }) => {
  const { screenWidth, isTablet } = useScreenSize()
  const [displayGraphics, setDisplayGraphics] = useState(!isHome)

  const logoSize = (screenWidth / 100) * 30.5
  const bikeSize = (screenWidth / 100) * 50
  const foxSize = (screenWidth / 100) * 42

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {isHome && !displayGraphics ? (
          <video
            src={`${GITHUB_MEDIA_URL}/landing/landing.mp4`}
            autoPlay
            muted
            playsInline // for mobile devices (will not auto-fullscreen on page-load)
            onEnded={() => setDisplayGraphics(true)}
            className={styles.vid}
          />
        ) : null}

        {isHome && displayGraphics && !isTablet ? (
          <div className='animate__animated animate__fadeInRight' style={{ position: 'relative', zIndex: 1 }}>
            <About />
          </div>
        ) : null}

        <div className={`${displayGraphics ? styles.logoImage : styles.hide}`}>
          <div className='animate__animated animate__infinite animate__slower animate__pulse'>
            <Image src={`${GITHUB_MEDIA_URL}/logo/white_alpha.png`} width={logoSize} height={logoSize} />
          </div>
        </div>

        <div
          className={`${
            displayGraphics ? `${styles.bikeImage} animate__animated animate__fadeInDown` : styles.hide
          }`}
        >
          <Image
            src={`${GITHUB_MEDIA_URL}/landing/${showFemale ? 'f_bike.png' : 'm_bike.png'}`}
            width={bikeSize}
            height={bikeSize / 1.7647}
          />
        </div>

        <div
          className={`${
            displayGraphics ? `${styles.foxImage} animate__animated animate__fadeInDown` : styles.hide
          }`}
        >
          <Image
            src={`${GITHUB_MEDIA_URL}/landing/${showFemale ? 'f_fox.png' : 'm_fox.png'}`}
            width={foxSize}
            height={foxSize}
          />
        </div>

        {children ? (
          <div className={`${displayGraphics ? 'animate__animated animate__fadeInUp' : styles.hide}`}>
            {children}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Landing
