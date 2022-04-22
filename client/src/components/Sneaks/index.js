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
import biker from '../../images/sneaks/biker.png'
import cheese from '../../images/sneaks/cheese.png'
import kurama from '../../images/sneaks/kurama.png'
import neon from '../../images/sneaks/neon.png'
import samurai from '../../images/sneaks/samurai.png'
import male from '../../images/sneaks/_base_m.png'
import scouter from '../../images/sneaks/_prot_f_cyborg_pink.png'
import khaleesi from '../../images/sneaks/f_khaleesi.png'
import wonderWoman from '../../images/sneaks/f_wonder_woman_v1.png'
import zombie from '../../images/sneaks/f_zombie.png'

const sneaks = [male, cheese, angel, khaleesi, wonderWoman, samurai, neon, zombie, scouter, kurama, biker]

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
