import { forwardRef } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper'
import { SNEAK } from '../../constants'
import styles from './Sneaks.module.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './swiper-overrides.css'

const sneaks = [
  '/images/sneaks/cheese.png',
  '/images/sneaks/neon.png',
  '/images/sneaks/snoop.png',
  '/images/sneaks/angel.png',
  '/images/sneaks/samurai.png',
  '/images/sneaks/kurama.png',
]

const Sneaks = forwardRef((props, ref) => {
  const { isMobile, width } = useScreenSize()

  const slidesPerView = Math.floor((width * 0.9) / (isMobile ? 300 : 350))

  return (
    <div ref={ref} id={SNEAK} className={styles.root}>
      <Swiper modules={[Navigation, Pagination]} loop navigation pagination={{ type: 'bullets' }} slidesPerView={slidesPerView}>
        {sneaks.map((str) => (
          <SwiperSlide key={str}>
            <img src={str} alt='' className={styles.img} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
})

export default Sneaks
