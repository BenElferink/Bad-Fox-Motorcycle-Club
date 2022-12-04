import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import About from '../About'
import { GITHUB_MEDIA_URL } from '../../../constants'
import styles from './Landing.module.css'

const Landing = ({ isHome = false, children }) => {
  const { screenWidth, isTablet } = useScreenSize()
  const [videoDone, setVideoDone] = useState(!isHome)
  const [showFemale, setShowFemale] = useState(false)

  useEffect(() => {
    setShowFemale(!!Math.round(Math.random()))
  }, [])

  const logoSize = (screenWidth / 100) * 30.5
  const bikeSize = (screenWidth / 100) * 50
  const foxSize = (screenWidth / 100) * 42

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        {isHome && !videoDone ? (
          <video
            src={`${GITHUB_MEDIA_URL}/landing/landing.mp4`}
            autoPlay
            muted
            playsInline // for mobile devices (will not auto-fullscreen on page-load)
            onEnded={() => setVideoDone(true)}
            className={styles.vid}
          />
        ) : null}

        {isHome && videoDone && !isTablet ? (
          <div className='animate__animated animate__fadeInRight' style={{ position: 'relative', zIndex: 1 }}>
            <About />
          </div>
        ) : null}

        <div className={`${videoDone ? styles.logoImage : styles.hide}`}>
          <div className='animate__animated animate__infinite animate__slower animate__pulse'>
            <Image
              src={`${GITHUB_MEDIA_URL}/logo/white_alpha.png`}
              alt='logo'
              width={logoSize}
              height={logoSize}
            />
          </div>
        </div>

        <div
          className={`${videoDone ? `${styles.bikeImage} animate__animated animate__fadeInDown` : styles.hide}`}
        >
          <Image
            src={`${GITHUB_MEDIA_URL}/landing/${showFemale ? 'f_bike.png' : 'm_bike.png'}`}
            alt='motorcycle'
            width={bikeSize}
            height={bikeSize / 1.7647}
          />
        </div>

        <div className={`${videoDone ? `${styles.foxImage} animate__animated animate__fadeInDown` : styles.hide}`}>
          <Image
            src={`${GITHUB_MEDIA_URL}/landing/${showFemale ? 'f_fox.png' : 'm_fox.png'}`}
            alt='fox'
            width={foxSize}
            height={foxSize}
          />
        </div>

        {children ? (
          <div className={`${videoDone ? 'animate__animated animate__fadeInUp' : styles.hide}`}>{children}</div>
        ) : null}
      </div>
    </div>
  )
}

export default Landing
