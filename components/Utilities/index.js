// import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import useScreenSize from '../../hooks/useScreenSize'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
// import MediaWrapper from './MediaWrapper'
// import ImageLoader from '../Loader/ImageLoader'
// import Loader from '../Loader'
import styles from './Utilities.module.css'
import { BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../constants'

// const HomeKeyModel = dynamic(() => import('../models/three/glb/HomeKeyModel'), {
//   ssr: false,
//   loading,
// })

// const HomeFoxModel = dynamic(() => import('../models/three/glb/HomeFoxModel'), {
//   ssr: false,
//   loading,
// })

// const HomeMotorcycleModel = dynamic(() => import('../models/three/glb/HomeMotorcycleModel'), {
//   ssr: false,
//   loading,
// })

// const loading = () => <Loader size={100} />

const data = [
  {
    checked: true,
    chapter: 'Bad Fox (2D)',
    events: [
      {
        checked: false,
        redirectPath: `/collections/${BAD_FOX_POLICY_ID}`,
        title: 'Supply 2,042 (burn live)',
      },
      {
        checked: true,
        redirectPath: '/tokens/ada',
        title: 'Royalty Rewards',
      },
      {
        checked: true,
        redirectPath: '/tokens',
        title: 'Token Staking',
      },
    ],
    // renderMedia: (isLeft) => (
    //   <MediaWrapper isLeft={isLeft} size={150} posTop='30px'>
    //     <ImageLoader src='/media/landing/bad_fox.png' alt='fox' width={150} loaderSize={50} />
    //   </MediaWrapper>
    // ),
  },
  {
    checked: true,
    chapter: 'Bad Motorcycle (2D)',
    events: [
      {
        checked: false,
        redirectPath: `/collections/${BAD_MOTORCYCLE_POLICY_ID}`,
        title: 'Supply 1,021 (burn live)',
      },
      {
        checked: true,
        redirectPath: '/tokens/ada',
        title: 'Royalty Rewards',
      },
      {
        checked: true,
        redirectPath: '/tokens',
        title: 'Token Staking',
      },
    ],
    // renderMedia: (isLeft) => (
    //   <MediaWrapper isLeft={isLeft} size={300} posTop='70px'>
    //     <ImageLoader src='/media/landing/bad_motorcycle.png' alt='motorcycle' width={300} loaderSize={50} />
    //   </MediaWrapper>
    // ),
  },
  {
    checked: true,
    chapter: 'Bad Key',
    events: [
      {
        checked: false,
        redirectPath: `/collections/${BAD_KEY_POLICY_ID}`,
        title: 'Supply 1,979',
      },
      {
        checked: true,
        redirectPath: '/tokens/ada',
        title: 'Royalty Rewards',
      },
      {
        checked: true,
        redirectPath: '/tokens',
        title: 'Token Staking',
      },
      {
        checked: true,
        redirectPath: '/tools',
        title: 'Access to Tools',
      },
      {
        checked: true,
        redirectPath: '/reserve3d',
        title: 'Lifetime Airdrops',
      },
      {
        checked: true,
        redirectPath: '/games',
        title: 'Metaverse Benefits',
      },
    ],
    // renderMedia: (isLeft) => (
    //   <MediaWrapper isLeft={isLeft} size={300} posTop='70px'>
    //     <HomeKeyModel />
    //   </MediaWrapper>
    // ),
  },
  {
    checked: false,
    chapter: 'Bad Fox (3D)',
    events: [
      {
        checked: false,
        title: 'Supply 6,000',
      },
      {
        checked: false,
        redirectPath: '/games',
        title: 'Game/Meta Asset (avatar)',
      },
      {
        checked: false,
        redirectPath: '/wallet',
        title: 'File Custody & IP Ownership',
      },
    ],
    // renderMedia: (isLeft) => (
    //   <MediaWrapper isLeft={isLeft} size={300} posTop='0px'>
    //     <HomeFoxModel />
    //   </MediaWrapper>
    // ),
  },
  {
    checked: false,
    chapter: 'Bad Motorcycle (3D)',
    events: [
      {
        checked: false,
        title: 'Supply 3,000',
      },
      {
        checked: false,
        redirectPath: '/games',
        title: 'Game/Meta Asset (vehicle)',
      },
      {
        checked: false,
        redirectPath: '/wallet',
        title: 'File Custody & IP Ownership',
      },
    ],
    // renderMedia: (isLeft) => (
    //   <MediaWrapper isLeft={isLeft} size={300} posTop='20px'>
    //     <HomeMotorcycleModel />
    //   </MediaWrapper>
    // ),
  },
]

const Utilities = () => {
  const { isMobile } = useScreenSize()
  const router = useRouter()

  return (
    <div className='w-full my-12 text-gray-400'>
      <h1 className='mb-8 text-3xl text-center'>Collections & Utilities</h1>

      {data.map((phase, idx) => {
        const isLeft = idx % 2 !== 0

        return (
          <div
            key={phase.chapter}
            className={`relative ${styles.chapter} ${
              !isMobile ? (isLeft ? styles.leftChapter : styles.rightChapter) : styles.mobileChapter
            }`}
          >
            {phase.renderMedia ? phase.renderMedia(isLeft) : null}

            <h2 className='text-xl'>
              {phase.checked ? <CheckCircleIcon className='w-6 h-6' /> : <MinusCircleIcon className='w-6 h-6' />}
              {phase.chapter}
            </h2>

            {phase.events.map((event) => (
              <div
                key={event.title}
                className={`${styles.event} ${event.redirectPath ? styles.clickEvent : ''} ${
                  !isMobile ? (isLeft ? styles.leftEvent : styles.rightEvent) : styles.mobileEvent
                }`}
                onClick={() => {
                  if (event.redirectPath) {
                    router.push(event.redirectPath)
                  }
                }}
              >
                <h3>
                  {event.checked ? (
                    <CheckCircleIcon className='w-6 h-6' />
                  ) : (
                    <MinusCircleIcon className='w-6 h-6' />
                  )}
                  {event.title}
                </h3>
              </div>
            ))}

            {isMobile ? <br /> : null}
          </div>
        )
      })}
    </div>
  )
}

export default Utilities
