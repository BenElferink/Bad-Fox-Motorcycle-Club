import Image from 'next/image'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import About from '../About'
import styles from './Landing.module.css'

const Landing = ({ isHome = false, children }) => {
  const { width, isMobile } = useScreenSize()

  const imageSize = (width / 100) * 60

  return (
    <div className={styles.root}>
      {isHome ? (
        <div className={styles.content}>
          <div className={`${styles.fox} animate__animated animate__slow animate__infinite animate__bounce`}>
            {/* <Image src='/images/landing/fox.png' alt='fox' width={imageSize} height={imageSize} /> */}
            <Image
              src='https://raw.githubusercontent.com/belferink1996/bad-fox-mc-website/main/public/images/landing/fox.png'
              alt='fox'
              width={imageSize}
              height={imageSize}
            />
          </div>
          {!isMobile ? <About /> : null}
        </div>
      ) : (
        <div className={styles.content}>{children}</div>
      )}
    </div>
  )
}

export default Landing
