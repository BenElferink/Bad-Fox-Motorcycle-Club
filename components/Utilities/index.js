import { useRouter } from 'next/router'
import useScreenSize from '../../hooks/useScreenSize'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import styles from './Utilities.module.css'
import { BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../constants'

const data = [
  {
    checked: true,
    chapter: '2D Fox',
    events: [
      {
        checked: false,
        redirectPath: `/collections/${BAD_FOX_POLICY_ID}`,
        title: 'Supply 1,722',
      },
    ],
  },
  {
    checked: true,
    chapter: '2D Motorcycle',
    events: [
      {
        checked: false,
        redirectPath: `/collections/${BAD_MOTORCYCLE_POLICY_ID}`,
        title: 'Supply 861',
      },
    ],
  },
  {
    checked: true,
    chapter: 'Bad Key',
    events: [
      {
        checked: false,
        redirectPath: `/collections/${BAD_KEY_POLICY_ID}`,
        title: 'Supply 2,139',
      },
      {
        checked: true,
        redirectPath: '/tokens',
        title: 'Staking Rewards',
      },
      {
        checked: true,
        redirectPath: '/tokens/ada',
        title: 'Royalty Rewards',
      },
      {
        checked: true,
        redirectPath: 'https://labs.badfoxmc.com',
        title: 'Access to Tools',
      },
      {
        checked: true,
        redirectPath: '/reserve3d',
        title: '3D Airdrops',
      },
    ],
  },
  {
    checked: false,
    chapter: '3D Fox',
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
  },
  {
    checked: false,
    chapter: '3D Motorcycle',
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
            className={`relative ${styles.chapter} ${!isMobile ? (isLeft ? styles.leftChapter : styles.rightChapter) : styles.mobileChapter}`}
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
                    if (event.redirectPath.indexOf('http') === 0) {
                      window.open(event.redirectPath, '_blank', 'noopener noreferrer')
                    } else {
                      router.push(event.redirectPath)
                    }
                  }
                }}
              >
                <h3>
                  {event.checked ? <CheckCircleIcon className='w-6 h-6' /> : <MinusCircleIcon className='w-6 h-6' />}
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
