import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper'
import useScreenSize from '../hooks/useScreenSize'
import ImageLoader from './Loader/ImageLoader'

const data = [
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FCollection%2FPNG%2FBad%20Fox%20%230001.png?alt=media&token=7e12cbf2-daa7-45c9-96f7-a3c2478ea817',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FCollection%2FPNG%2FBad%20Fox%20%230002.png?alt=media&token=e039b296-9f05-4b44-bbe0-c6197f75a35f',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FCollection%2FPNG%2FBad%20Fox%20%230003.png?alt=media&token=7d24b949-b8b3-479d-b998-d03aad59c675',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FCollection%2FPNG%2FBad%20Fox%20%230004.png?alt=media&token=08095e54-69f2-477f-aa63-68870bd9034e',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FCollection%2FPNG%2FBad%20Fox%20%230005.png?alt=media&token=4ed3b1c1-5df7-4519-bd2c-260cde3234c0',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FCollection%2FPNG%2FBad%20Fox%20%230006.png?alt=media&token=33c865f7-d751-455b-ba7a-23dc2112409d',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FCollection%2FPNG%2FBad%20Fox%20%230007.png?alt=media&token=f5039505-a075-4383-9372-e7ff68ff060d',
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/3D%20Fox%2FCollection%2FPNG%2FBad%20Fox%20%230008.png?alt=media&token=4babf9fc-2792-4399-8981-dc7d847ef12b',
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
            <ImageLoader
              src={str}
              alt=''
              optimized
              width={imageSize}
              height={imageSize}
              style={{ borderRadius: '1rem' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Previews
