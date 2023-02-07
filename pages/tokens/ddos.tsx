import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import ImageLoader from '../../components/Loader/ImageLoader'

const TOKEN_IMAGE_SRC = '/media/tokens/ddos/token.png'
const TOKEN_POLICY_ID = '2c85a478d53f0e484b852c357e56057dfd8e80a6b72ecb4daffe42e5'
const TOKEN_NAME = 'DDoS Token'
const PROJECT_NAME = 'Degen Dino orb Society'
const WHO_CAN_EARN: ('Bad Fox' | 'Bad Motorcycle' | 'Bad Key')[] = ['Bad Key']

const Page = () => {
  return (
    <div className='max-w-[800px] mx-auto px-4 flex flex-col items-center'>
      <div className='w-full my-2 flex flex-col-reverse md:flex-row items-center justify-center md:items-stretch p-4 bg-gray-400 bg-opacity-20 rounded-xl'>
        <div className='hidden md:block animate-pulse'>
          <ImageLoader src={TOKEN_IMAGE_SRC} alt='token' width={111} height={111} />
        </div>

        <div className='md:ml-4 flex flex-col justify-between'>
          <div>
            <h2 className='text-gray-200 text-xl'>{TOKEN_NAME}</h2>
            <h3 className='text-sm'>{PROJECT_NAME}</h3>
          </div>

          <div className='md:hidden mx-auto my-4 animate-pulse'>
            <ImageLoader src={TOKEN_IMAGE_SRC} alt='token' width={150} height={150} />
          </div>

          <p className='text-xs'>
            Policy ID:
            <br />
            <span className='break-all'>{TOKEN_POLICY_ID}</span>
          </p>
        </div>
      </div>

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>Who can earn?</h4>

        <ul className='mx-auto flex flex-col md:flex-row md:items-center md:justify-center'>
          <li
            className={`flex items-center text-sm ${
              WHO_CAN_EARN.includes('Bad Fox') ? 'text-[var(--online)]' : 'text-[var(--offline)]'
            }`}
          >
            {WHO_CAN_EARN.includes('Bad Fox') ? (
              <CheckCircleIcon className='w-6 h-6 ml-4 mr-1' />
            ) : (
              <XCircleIcon className='w-6 h-6 ml-4 mr-1' />
            )}
            Bad Fox
          </li>
          <li
            className={`flex items-center text-sm ${
              WHO_CAN_EARN.includes('Bad Motorcycle') ? 'text-[var(--online)]' : 'text-[var(--offline)]'
            }`}
          >
            {WHO_CAN_EARN.includes('Bad Motorcycle') ? (
              <CheckCircleIcon className='w-6 h-6 ml-4 mr-1' />
            ) : (
              <XCircleIcon className='w-6 h-6 ml-4 mr-1' />
            )}
            Bad Motorcycle
          </li>
          <li
            className={`flex items-center text-sm ${
              WHO_CAN_EARN.includes('Bad Key') ? 'text-[var(--online)]' : 'text-[var(--offline)]'
            }`}
          >
            {WHO_CAN_EARN.includes('Bad Key') ? (
              <CheckCircleIcon className='w-6 h-6 ml-4 mr-1' />
            ) : (
              <XCircleIcon className='w-6 h-6 ml-4 mr-1' />
            )}
            Bad Key
          </li>
        </ul>
      </div>

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>Prerequisites</h4>

        <div className='flex items-center justify-center'>
          <Link
            href='https://www.jpg.store/collection/52c16147514c66ad5ce74dccbd4a27e5e58c94fab31ed17d7b871218'
            target='_blank'
            rel='noopener noreferrer'
          >
            <ImageLoader
              src='/media/tokens/ddos/dino.png'
              alt='nft'
              width={150}
              height={150}
              style={{ borderRadius: '1rem' }}
            />
            <p className='mt-1 text-xs text-center'>DDoS - Dino</p>
          </Link>

          <div className='mx-2'>- OR -</div>

          <Link
            href='https://www.jpg.store/collection/a862fde1093e4618c7a664eddb43f8529116e9caa70536dfaa500550'
            target='_blank'
            rel='noopener noreferrer'
          >
            <ImageLoader
              src='/media/tokens/ddos/cosmic-medallion.gif'
              alt='nft'
              width={150}
              height={150}
              style={{ borderRadius: '1rem' }}
            />
            <p className='mt-1 text-xs text-center'>DDoS - Cosmic Medallion</p>
          </Link>
        </div>
      </div>

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to earn?</h4>

        <ol className='mx-auto list-decimal list-inside'>
          <li className='text-sm'>
            Connect your wallet to the{' '}
            <Link
              href='https://stake.ddos.design/app/stake'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              DDoS Staking Dashboard
            </Link>
            .
          </li>
          <li className='text-sm'>
            At the top of the screen, click on <i>&quot;Your wallet is not staked. Click here to stake 🥩&quot;</i>
            .
            <br />
            (after signing the TX, you will be delegating to the DDoS stake pool, <u>this is required</u>)
          </li>
          <li className='text-sm'>
            Come back later to claim your tokens from the{' '}
            <Link
              href='https://stake.ddos.design/app/token'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              DDoS Token Claim Dashboard
            </Link>
            .
          </li>
        </ol>
      </div>

      <div className='w-full my-2 p-4 px-6 bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How much can be earned?</h4>

        <div className='mx-auto w-fit'>
          <p className='text-sm text-center'>
            Visit the{' '}
            <Link
              href='https://whitepaper.ddos.design/ddos-staking-platform/for-holders/xp-counter'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              DDoS Whitepaper
            </Link>{' '}
            for a detailed description on reward calculations.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
