import { forwardRef } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import { SNEAK } from '../../constants'
import styles from './Sneaks.module.css'
import 'swiper/css'
import 'swiper/css/navigation'

const sneaks = [
  '/images/sneaks/angel.png',
  '/images/sneaks/samurai.png',
  '/images/sneaks/neon.png',
  '/images/sneaks/snoop.png',
  '/images/sneaks/kurama.png',
  '/images/sneaks/cheese.png',
]

const Sneaks = forwardRef((props, ref) => {
  const { isMobile, width } = useScreenSize()

  const slidesPerView = Math.floor((width * 0.9) / (isMobile ? 300 : 350))

  return (
    <div ref={ref} id={SNEAK} className={styles.root}>
      <Swiper modules={[Navigation]} navigation loop slidesPerView={slidesPerView}>
        {sneaks.map((str) => (
          <SwiperSlide key={str}>
            <img src={str} className={styles.img} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
})

export default Sneaks
