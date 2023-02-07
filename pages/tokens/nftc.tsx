import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import ImageLoader from '../../components/Loader/ImageLoader'

const TOKEN_IMAGE_SRC = '/media/tokens/nftc/token.png'
const TOKEN_POLICY_ID = 'b0af30edf2c7f11465853821137e0a6ebc395cab71ee39c24127ffb4'
const TOKEN_NAME = 'NFTC'
const PROJECT_NAME = 'NFT Creative'
const WHO_CAN_EARN: ('Bad Fox' | 'Bad Motorcycle' | 'Bad Key')[] = ['Bad Fox', 'Bad Motorcycle', 'Bad Key']

const Page = () => {
  return (
    <div className='max-w-[800px] mx-auto px-4 flex flex-col items-center'>
      <div className='w-full my-2 flex items-center justify-center md:items-stretch p-4 bg-gray-400 bg-opacity-20 rounded-xl'>
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
          <div className='mx-2'>- none -</div>
        </div>
      </div>

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to earn?</h4>

        <ol className='mx-auto list-decimal list-inside'>
          <li className='text-sm'>
            Connect your wallet with{' '}
            <Link href='https://dripdropz.io/' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
              Drip Dropz
            </Link>
            .
          </li>
          <li className='text-sm'>Claim &quot;NFTC&quot; from the available tokens.</li>
          <li className='text-sm'>Repeat every epoch (5 days).</li>
        </ol>
      </div>

      <div className='w-full my-2 p-4 px-6 bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How much can be earned?</h4>

        <div className='mx-auto w-fit'>
          <p className='text-sm text-center'>
            50 $NFTC per 1 (eligible) NFT,
            <br />
            every epoch (5 days).
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
