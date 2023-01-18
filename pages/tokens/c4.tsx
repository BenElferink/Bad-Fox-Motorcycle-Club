import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import ImageLoader from '../../components/Loader/ImageLoader'

const TOKEN_IMAGE_SRC = '/media/tokens/c4/token.png'
const TOKEN_POLICY_ID = 'a00fdf4fb9ab6c8c2bd1533a2f14855edf12aed5ecbf96d4b5f5b939'
const TOKEN_NAME = 'C4 Token'
const PROJECT_NAME = 'Cardano Crocs Club'
const WHO_CAN_EARN: ('Bad Fox' | 'Bad Motorcycle' | 'Bad Key')[] = ['Bad Fox', 'Bad Motorcycle', 'Bad Key']

const Page = () => {
  return (
    <div className='max-w-[800px] mx-auto px-4 flex flex-col items-center'>
      <div className='w-full my-2 flex items-center justify-center md:items-stretch p-4 bg-gray-400 bg-opacity-20 rounded-xl'>
        <div className='hidden md:block animate-pulse'>
          <ImageLoader src={TOKEN_IMAGE_SRC} alt='token' width={111} height={111} />
        </div>

        <div className=' md:ml-4 flex flex-col justify-between'>
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
          <Link href='https://swamplands.cardanocrocsclub.com/swamp' target='_blank' rel='noopener'>
            <ImageLoader
              src='/media/tokens/c4/living-land.png'
              alt='nft'
              width={150}
              height={150}
              style={{ borderRadius: '1rem' }}
            />
            <p className='mt-1 text-xs text-center'>CCC - Living Land</p>
          </Link>
        </div>
      </div>

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to earn?</h4>

        {/* <ol className='mx-auto list-decimal list-inside'>
          <li className='text-sm'>
            Connect your wallet to the{' '}
            <Link href='' target='_blank' rel='noopener' className='text-blue-400'>
              CCC Staking Dashboard
            </Link>
            .
          </li>
          <li className='text-sm'>
            Come back later to claim your tokens from the{' '}
            <Link href='' target='_blank' rel='noopener' className='text-blue-400'>
              CCC Token Claim Dashboard
            </Link>
            .
          </li>
        </ol> */}

        <p className='mx-auto text-sm'>Coming soon.</p>
      </div>

      <div className='w-full my-2 p-4 px-6 bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How much can be earned?</h4>

        <div className='mx-auto w-fit'>
          <p className='text-sm text-center'>
            300 $C4 per 1 (eligible) NFT,
            <br />
            every month.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
