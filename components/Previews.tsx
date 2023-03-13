import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper'
import useScreenSize from '../hooks/useScreenSize'
import ImageLoader from './Loader/ImageLoader'

const data = [
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FAvatar%20Renders%2FBad%20Fox%20%230001.png?alt=media&token=a2c93fc5-b83a-4a57-a2e9-5c27e0609408',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FAvatar%20Renders%2FBad%20Fox%20%230002.png?alt=media&token=72aa6c8e-623b-4b49-abff-059c36d58c12',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FAvatar%20Renders%2FBad%20Fox%20%230003.png?alt=media&token=b45cce9d-1a99-4b42-8de3-31585fa342b7',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FAvatar%20Renders%2FBad%20Fox%20%230004.png?alt=media&token=1bb7ad2c-c179-48a6-a2ae-e18b703542d0',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FAvatar%20Renders%2FBad%20Fox%20%230005.png?alt=media&token=b0ff3bad-bcf8-49a2-8680-99b0e74d366b',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FAvatar%20Renders%2FBad%20Fox%20%230006.png?alt=media&token=92c69a49-f722-4724-8355-be7293fc0820',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FAvatar%20Renders%2FBad%20Fox%20%230007.png?alt=media&token=bd3ac325-e8a6-4719-88a2-140987db6e93',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FAvatar%20Renders%2FBad%20Fox%20%230008.png?alt=media&token=b39f4f59-d506-44eb-a9e6-fab6e578f661',
]

const Previews = () => {
  const { isMobile, screenWidth } = useScreenSize()
  const [imageSize, setImageSize] = useState(isMobile ? 280 : 330)

  useEffect(() => {
    setImageSize(isMobile ? 280 : 330)
  }, [isMobile])

  return (
    <div className='my-10 lg:mt-28 w-full'>
      <Swiper
        modules={[Autoplay, Navigation]}
        loop
        navigation
        slidesPerView={Math.floor((screenWidth * 0.95) / imageSize)}
        autoplay={{
          delay: 1700,
          reverseDirection: false,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          stopOnLastSlide: false,
        }}
      >
        {data.map((str) => (
          <SwiperSlide key={str}>
            <ImageLoader src={str} alt='' width={imageSize} height={imageSize} style={{ borderRadius: '1rem' }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Previews
