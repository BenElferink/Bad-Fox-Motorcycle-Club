import dynamic from 'next/dynamic'
import useScreenSize from '../../hooks/useScreenSize'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import MediaWrapper from './MediaWrapper'
import Loader from '../Loader'
import ImageLoader from '../Loader/ImageLoader'
import styles from './Utilities.module.css'

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

const data = [
  {
    complete: true,
    chapter: 'Bad Fox',
    events: [
      {
        complete: false,
        title: 'Supply 2,280',
      },
      {
        complete: true,
        title: 'Royalty Rewards',
      },
      {
        complete: true,
        title: 'Token Staking',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={150} posTop='30px'>
        <ImageLoader src='/media/landing/bad-fox.png' alt='fox' width={150} loaderSize={50} />
      </MediaWrapper>
    ),
  },
  {
    complete: true,
    chapter: 'Bad Motorcycle',
    events: [
      {
        complete: false,
        title: 'Supply 1,140',
      },
      {
        complete: true,
        title: 'Royalty Rewards',
      },
      {
        complete: true,
        title: 'Token Staking',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={300} posTop='70px'>
        <ImageLoader src='/media/landing/bad-motorcycle.png' alt='motorcycle' width={300} loaderSize={50} />
      </MediaWrapper>
    ),
  },
  {
    complete: true,
    chapter: 'Bad Key',
    events: [
      {
        complete: false,
        title: 'Supply 1,860',
      },
      {
        complete: true,
        title: 'Royalty Rewards',
      },
      {
        complete: true,
        title: 'Token Staking',
      },
      {
        complete: true,
        title: 'Access to Tools',
      },
      {
        complete: true,
        title: 'Lifetime Airdrops',
      },
      {
        complete: true,
        title: 'Metaverse Benefits',
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
        title: 'Metaverse Asset (avatar)',
      },
      {
        complete: false,
        title: 'IP Ownership & File Custody',
      },
    ],
    renderMedia: (isLeft) => (
      <MediaWrapper isLeft={isLeft} size={300} posTop='0px'>
        <HomeFoxModel />
      </MediaWrapper>
    ),
  },
]

const Utilities = () => {
  const { isMobile } = useScreenSize()

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
                className={`${styles.event} ${
                  !isMobile ? (isLeft ? styles.leftEvent : styles.rightEvent) : styles.mobileEvent
                }`}
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
