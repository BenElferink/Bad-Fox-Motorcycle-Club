import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper'
import useScreenSize from '../hooks/useScreenSize'
import ImageLoader from './Loader/ImageLoader'

const bikers = [
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Motorcycle%2FCollection%2F796.png?alt=media&token=7f4bb1c1-c14d-43fc-8bdd-85668cd64acf', // B #0796
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F5820.png?alt=media&token=11e16b5b-45b5-423e-a995-f769df8d2def', // M #5820
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F581.png?alt=media&token=c1c11c17-376c-4664-a0a8-cb5820971467', // F #0581
]

const gold = [
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Motorcycle%2FCollection%2F993.png?alt=media&token=4d0a2ff8-0092-4166-bae5-d70ffe92aef1', // B #0993
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F982.png?alt=media&token=c3bc3c52-beac-45d1-9970-0aa1e084c718', // M #0982
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F1263.png?alt=media&token=c29a4b3e-1a6d-470a-8baa-7e01b116326d', // F #1263
]

const astro = [
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Motorcycle%2FCollection%2F68.png?alt=media&token=c4a10274-a49e-48f7-9b0c-e3e7c0c55d00', // B #0068
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F2004.png?alt=media&token=5e1db291-40c7-4803-a794-eeb3df435c2a', // M #2004
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F2541.png?alt=media&token=420948cd-0ae4-4331-93af-fe5412d87888', // F #2541
]

const platinum = [
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Motorcycle%2FCollection%2F2022.png?alt=media&token=6dc43776-698e-469f-a515-5ee0905fc808', // B #2022
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F2850.png?alt=media&token=80f20608-814d-472d-9b07-48749356dd1d', // M #2850
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F4783.png?alt=media&token=6168f431-687f-4b2a-9f85-1c95e3bac5a4', // F #4783
]

const floyd = [
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Motorcycle%2FCollection%2F1481.png?alt=media&token=349acabb-3c61-4408-9f30-9474138c4873', // B #1481
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F4350.png?alt=media&token=929f9105-6649-4b20-86bc-1381f488319b', // M #4350
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F457.png?alt=media&token=e5df4ead-e1f9-4dc9-9d26-36b7e38654b6', // F #0457
]

const yakuza = [
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Motorcycle%2FCollection%2F946.png?alt=media&token=fec3fd58-d1dd-4380-a89e-20f507b99d94', // B #0946
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F852.png?alt=media&token=db4d6e22-1da2-42bf-89d8-ba848bf1294d', // M #0852
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F5171.png?alt=media&token=490181b4-2149-49e8-ae32-19d76999ff73', // F #5171
]

const tron = [
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Motorcycle%2FCollection%2F2309.png?alt=media&token=88dcdf03-c05c-48e6-977c-7ec891778fe5', // B #2309
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F1774.png?alt=media&token=a2e9deda-82f4-4951-b4a4-34e061ccec09', // M #1774
  'https://firebasestorage.googleapis.com/v0/b/badfoxmc-web.appspot.com/o/Bad%20Fox%2FCollection%2F4637.png?alt=media&token=766a1586-eefc-4ac4-b923-41a1560a5a7b', // F #4637
]

const data = bikers.concat(tron.concat(astro.concat(gold.concat(floyd.concat(yakuza.concat(platinum))))))

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
              width={imageSize}
              height={imageSize}
              unoptimized={false}
              style={{ borderRadius: '1rem' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default Previews
