import { forwardRef } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import About from '../About'
import { HOME } from '../../constants'
import styles from './Landing.module.css'

const Landing = forwardRef((props, ref) => {
  const { isMobile } = useScreenSize()

  return (
    <div ref={ref} id={HOME} className={styles.root}>
      <div className={styles.content}>
        <img className={`${styles.fox} animate__animated animate__slow animate__infinite animate__bounce`} alt='fox' src='/images/landing/fox.png' />
        {!isMobile ? <About /> : null}
      </div>
    </div>
  )
})

export default Landing
