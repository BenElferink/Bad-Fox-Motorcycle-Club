import Image from 'next/image'
import { forwardRef } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import About from '../About'
import { HOME } from '../../constants/scroll-nav'
import styles from './Landing.module.css'

const Landing = forwardRef((props, ref) => {
  const { width, isMobile } = useScreenSize()

  const imageSize = (width / 100) * 60

  return (
    <div ref={ref} id={HOME} className={styles.root}>
      <div className={styles.content}>
        <div className={`${styles.fox} animate__animated animate__slow animate__infinite animate__bounce`}>
          <Image src='/images/landing/fox.png' alt='fox' width={imageSize} height={imageSize} />
        </div>
        {!isMobile ? <About /> : null}
      </div>
    </div>
  )
})

export default Landing
