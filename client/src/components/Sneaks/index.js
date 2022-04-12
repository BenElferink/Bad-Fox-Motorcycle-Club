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
import cheese from '../../images/sneaks/cheese.png'
import neon from '../../images/sneaks/neon.png'
import snoop from '../../images/sneaks/snoop.png'
import angel from '../../images/sneaks/angel.png'
import samurai from '../../images/sneaks/samurai.png'
import kurama from '../../images/sneaks/kurama.png'

const sneaks = [cheese, neon, snoop, angel, samurai, kurama]

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
