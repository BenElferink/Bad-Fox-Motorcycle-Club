import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import useScreenSize from '../hooks/useScreenSize'
import Loader from './Loader'

const CountDown = dynamic(() => import('./CountDown'), { ssr: false, loading: () => <Loader size={50} /> })

const About = () => {
  return (
    <div className='my-4 mx-2 md:mx-10 max-w-2xl lg:max-w-lg text-gray-300'>
      <h1 className='text-xl mb-4'>About The Club:</h1>
      <p className='text-xs'>
        Bad Fox Motorcycle Club is a large collective of NFT fans who are working to innovate on what is possible
        with a Web3 brand. We do diverse forms of fund redistributions, integrations into various games/metaverses,
        and we develop tools that benefit everyone on Cardano.
      </p>

      <div className='max-w-[330px] mt-10 mx-auto lg:mx-0 flex flex-col items-center'>
        <CountDown callbackMintStarted={() => null} />

        <div className='w-full lg:w-fit'>
          <Link
            href='https://badfoxmc.ada-anvil.io/'
            // target='_blank'
            rel='noopener noreferrer'
            className='w-full lg:w-60 my-2 p-4 flex items-center justify-center text-sm text-center rounded-xl bg-green-900 hover:bg-green-700 bg-opacity-50 hover:bg-opacity-50 hover:text-gray-200 disabled:border border hover:border border-green-700 hover:border-green-700'
          >
            Mint&nbsp;&nbsp;&nbsp;(&nbsp;
            <Image src='/media/logo/other/adaanvil.png' alt='ADA Anvil logo' width={55} height={55} />
            &nbsp;)
          </Link>
        </div>

        {/* <div className='w-full lg:w-fit'>
          <Link
            href='/sneak3d'
            className='w-full lg:w-60 my-2 p-4 block text-sm text-center rounded-xl bg-green-900 hover:bg-green-700 bg-opacity-50 hover:bg-opacity-50 hover:text-gray-200 disabled:border border hover:border border-green-700 hover:border-green-700'
          >
            3D Sneak Peeks
          </Link>
          <Link
            href='/reserve3d'
            className='w-full lg:w-60 my-2 p-4 block text-sm text-center rounded-xl bg-green-900 hover:bg-green-700 bg-opacity-50 hover:bg-opacity-50 hover:text-gray-200 disabled:border border hover:border border-green-700 hover:border-green-700'
          >
            3D Reservation
          </Link>
        </div> */}
      </div>
    </div>
  )
}

const Landing = () => {
  const { screenWidth } = useScreenSize()

  const [showFemale, setShowFemale] = useState(false)
  const [logoSize, setLogoSize] = useState(1)
  const [foxSize, setFoxSize] = useState(1)
  const [bikeSize, setBikeSize] = useState(1)

  useEffect(() => {
    setShowFemale(!!Math.round(Math.random()))
  }, [])

  useEffect(() => {
    setLogoSize((screenWidth / 100) * 30.5)
    setFoxSize((screenWidth / 100) * 42)
    setBikeSize((screenWidth / 100) * 50)
  }, [screenWidth])

  return (
    <Fragment>
      <div id='home' className='relative w-screen h-[75vh] md:h-[90vh]'>
        <div className='relative z-10'>
          <div className='hidden lg:block animate__animated animate__fadeInRight'>
            <About />
          </div>
        </div>

        <div className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10'>
          <div className='animate__animated animate__infinite animate__slower animate__pulse'>
            <Image
              src='/media/logo/white_alpha.png'
              alt='logo'
              priority
              width={logoSize}
              height={logoSize}
              className='drop-shadow-landinglogo'
            />
          </div>
        </div>

        <div className='absolute bottom-0 right-0'>
          <div className='animate__animated animate__fadeInDown'>
            <Image
              src={`/media/landing/${showFemale ? 'f_fox.png' : 'm_fox.png'}`}
              alt='fox'
              priority
              width={foxSize}
              height={foxSize}
            />
          </div>
        </div>

        <div className='absolute bottom-0 left-0'>
          <div className='animate__animated animate__fadeInDown'>
            <Image
              src={`/media/landing/${showFemale ? 'f_bike.png' : 'm_bike.png'}`}
              alt='motorcycle'
              priority
              width={bikeSize}
              height={bikeSize / 1.7647}
            />
          </div>
        </div>
      </div>

      <div className='lg:hidden animate__animated animate__fadeInRight'>
        <About />
      </div>
    </Fragment>
  )
}

export default Landing
