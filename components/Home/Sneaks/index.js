import Image from 'next/image'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper'
import { GITHUB_MEDIA_URL } from '../../../constants/api-urls'
import styles from './Sneaks.module.css'

const Sneaks = () => {
  const { isMobile, screenWidth } = useScreenSize()

  const imageSize = isMobile ? 300 : 350
  const slidesPerView = Math.floor((screenWidth * 0.9) / imageSize)

  return (
    <div className={styles.root}>
      <Swiper
        modules={[Navigation, Pagination]}
        loop
        navigation
        pagination={{ type: 'bullets' }}
        slidesPerView={slidesPerView}
      >
        {[
          `${GITHUB_MEDIA_URL}/previews/2119.jpg`,
          `${GITHUB_MEDIA_URL}/previews/1774.jpg`,
          `${GITHUB_MEDIA_URL}/previews/4087.jpg`,
          `${GITHUB_MEDIA_URL}/previews/0960.jpg`,
          `${GITHUB_MEDIA_URL}/previews/4157.jpg`,
          `${GITHUB_MEDIA_URL}/previews/1482.jpg`,
          `${GITHUB_MEDIA_URL}/previews/0895.jpg`,
          `${GITHUB_MEDIA_URL}/previews/0258.jpg`,
          `${GITHUB_MEDIA_URL}/previews/1813.jpg`,
          `${GITHUB_MEDIA_URL}/previews/1780.jpg`,
          `${GITHUB_MEDIA_URL}/previews/0461.jpg`,
          `${GITHUB_MEDIA_URL}/previews/4946.jpg`,
        ].map((str) => (
          <SwiperSlide key={str}>
            <Image src={str} alt='' width={imageSize} height={imageSize} className={styles.img} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Sneaks
