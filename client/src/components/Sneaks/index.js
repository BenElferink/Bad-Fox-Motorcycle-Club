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
import angel from '../../images/sneaks/angel.png'
import asian from '../../images/sneaks/asian.png'
import biker from '../../images/sneaks/biker.png'
import cheese from '../../images/sneaks/cheese.png'
import kurama from '../../images/sneaks/kurama.png'
import neon from '../../images/sneaks/neon.png'
import samurai from '../../images/sneaks/samurai.png'
import snoop from '../../images/sneaks/snoop.png'
import shades from '../../images/sneaks/shades.png'

const sneaks = [cheese, shades, snoop, neon, asian, angel, samurai, biker, kurama]

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
