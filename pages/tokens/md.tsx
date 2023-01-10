import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import ImageLoader from '../../components/Loader/ImageLoader'

const TOKEN_IMAGE_SRC = '/media/tokens/md/token.png'
const TOKEN_POLICY_ID = '772791eb3f4b92874a49d487375a90db631988291c1a643b817668ca'
const TOKEN_NAME = 'MD Token'
const PROJECT_NAME = 'Mad Dog Car Club'
const WHO_CAN_EARN: ('Bad Fox' | 'Bad Motorcycle' | 'Bad Key')[] = ['Bad Fox']

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
            {TOKEN_POLICY_ID}
          </p>
        </div>
      </div>

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>Who can earn?</h4>

        <ul className='flex items-center justify-center'>
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
            Connect your wallet on the{' '}
            <Link href='https://mdtoken.io/' target='_blank' rel='noopener' className='text-blue-400'>
              MD Token Website
            </Link>
            .
          </li>
          <li className='text-sm'>
            Navigate to the &quot;accumulate&quot; tab, and click &quot;accumulate rewards&quot;.
            <br />
            (if you get new NFTs afterwards, you will have to click &quot;sync/refresh&quot; on your wallet page)
          </li>
          <li className='text-sm'>
            Come back later to claim your tokens from the{' '}
            <Link
              href='https://mdtoken.io/collect-rewards'
              target='_blank'
              rel='noopener'
              className='text-blue-400'
            >
              MD Token Claim Dashboard
            </Link>
            .
          </li>
        </ol>
      </div>
    </div>
  )
}

export default Page
