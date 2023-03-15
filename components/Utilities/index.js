import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import useScreenSize from '../../hooks/useScreenSize'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import MediaWrapper from './MediaWrapper'
import Loader from '../Loader'
import ImageLoader from '../Loader/ImageLoader'
import styles from './Utilities.module.css'
import { BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../constants'

const HomeKeyModel = dynamic(() =>
  import('../models/HomeKeyModel', {
    ssr: false,
    loading: () => <Loader size={100} />,
  })
)

const HomeFoxModel = dynamic(() =>
  import('../models/HomeFoxModel', {
    ssr: false,
    loading: () => <Loader size={100} />,
  })
)

const HomeMotorcycleModel = dynamic(() =>
  import('../models/HomeMotorcycleModel', {
    ssr: false,
    loading: () => <Loader size={100} />,
  })
)

const data = [
  {
    complete: true,
    chapter: 'Bad Fox',
    events: [
      {
        complete: false,
        redirectPath: `/collections/${BAD_FOX_POLICY_ID}`,
        title: 'Supply 2,280',
      },
      {
        complete: true,
        redirectPath: '/tokens/ada',
        title: 'Royalty Rewards',
      },
      {
        complete: true,
        redirectPath: '/tokens',
        title: 'Token Staking',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={150} posTop='30px'>
        <ImageLoader src='/media/landing/bad_fox.png' alt='fox' width={150} loaderSize={50} />
      </MediaWrapper>
    ),
  },
  {
    complete: true,
    chapter: 'Bad Motorcycle',
    events: [
      {
        complete: false,
        redirectPath: `/collections/${BAD_MOTORCYCLE_POLICY_ID}`,
        title: 'Supply 1,140',
      },
      {
        complete: true,
        redirectPath: '/tokens/ada',
        title: 'Royalty Rewards',
      },
      {
        complete: true,
        redirectPath: '/tokens',
        title: 'Token Staking',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={300} posTop='70px'>
        <ImageLoader src='/media/landing/bad_motorcycle.png' alt='motorcycle' width={300} loaderSize={50} />
      </MediaWrapper>
    ),
  },
  {
    complete: true,
    chapter: 'Bad Key',
    events: [
      {
        complete: false,
        redirectPath: `/collections/${BAD_KEY_POLICY_ID}`,
        title: 'Supply 1,860',
      },
      {
        complete: true,
        redirectPath: '/tokens/ada',
        title: 'Royalty Rewards',
      },
      {
        complete: true,
        redirectPath: '/tokens',
        title: 'Token Staking',
      },
      {
        complete: true,
        redirectPath: '/tools',
        title: 'Access to Tools',
      },
      {
        complete: true,
        title: 'Metaverse Benefits',
      },
      {
        complete: true,
        title: 'Lifetime Airdrops',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={300} posTop='70px'>
        <HomeKeyModel />
      </MediaWrapper>
    ),
  },
  {
    complete: false,
    chapter: '3D Fox',
    events: [
      {
        complete: false,
        title: 'Supply 6,000',
      },
      {
        complete: false,
        title: 'Game/Meta Asset (avatar)',
      },
      {
        complete: false,
        title: 'File Custody & IP Ownership',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={300} posTop='0px'>
        <HomeFoxModel />
      </MediaWrapper>
    ),
  },
  {
    complete: false,
    chapter: '3D Motorcycle',
    events: [
      {
        complete: false,
        title: 'Supply 3,000',
      },
      {
        complete: false,
        title: 'Game/Meta Asset (vehicle)',
      },
      {
        complete: false,
        title: 'File Custody & IP Ownership',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={300} posTop='20px'>
        <HomeMotorcycleModel />
      </MediaWrapper>
    ),
  },
]

const Utilities = () => {
  const { isMobile } = useScreenSize()
  const router = useRouter()

  return (
    <div className={`${styles.root} mt-10 text-gray-500`}>
      <h1 className='mb-5 text-3xl'>Collections & Utilities</h1>

      {data.map((phase, idx) => {
        const isLeft = idx % 2 !== 0

        return (
          <div
            key={phase.chapter}
            className={`relative ${styles.chapter} ${
              !isMobile ? (isLeft ? styles.leftChapter : styles.rightChapter) : styles.mobileChapter
            }`}
          >
            {phase.renderMedia(isLeft)}

            <h2 className='text-xl'>
              {phase.complete ? <CheckCircleIcon className='w-6 h-6' /> : <MinusCircleIcon className='w-6 h-6' />}
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
                  {event.complete ? (
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
