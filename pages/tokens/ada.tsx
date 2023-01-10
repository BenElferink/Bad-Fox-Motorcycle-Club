import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import ImageLoader from '../../components/Loader/ImageLoader'
import { ADA_SYMBOL } from '../../constants'
import formatBigNumber from '../../functions/formatters/formatBigNumber'

const TOKEN_IMAGE_SRC = '/media/tokens/ada.webp'
const TOKEN_NAME = 'ADA'
const PROJECT_NAME = 'Cardano'
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
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to earn?</h4>

        <p className='mx-auto text-sm text-center'>
          Simply hold your NFTs.
          <br />
          No need to make a submission/claim!
          <br />
          (airdrop via{' '}
          <Link href='https://drop.badfoxmc.com' target='_blank' rel='noopener' className='text-blue-400'>
            Bad Drop
          </Link>
          )
        </p>
      </div>

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>When is the payout?</h4>

        <p className='mx-auto text-sm text-center'>
          Every time the{' '}
          <Link href='https://pool.pm/$bfmc_royalty' target='_blank' rel='noopener' className='text-blue-400'>
            royalty wallet
          </Link>{' '}
          reaches {ADA_SYMBOL}
          {formatBigNumber(50000)}.
        </p>
      </div>

      <div className='w-full my-2 p-4 px-6 bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How much can be earned?</h4>

        <div className='mx-auto w-fit'>
          <p className='text-sm'>Holders get almost 90% from the royalty pool.</p>
          <ul className='ml-2 text-xs list-disc list-inside'>
            <li>80% - base rewards</li>
            <li>{formatBigNumber(5000)} - bonus rewards</li>
            <li>leftovers - team wallet</li>
          </ul>

          <p className='mt-2 text-sm'>
            &quot;80% base rewards&quot; are divided by {formatBigNumber(12000)} shares as following:
          </p>
          <ul className='ml-2 text-xs list-disc list-inside'>
            <li>1x shares - Bad Fox</li>
            <li>2x shares - Bad Motorcycle</li>
            <li>4x shares - Bad Key</li>
          </ul>

          <p className='mt-2 text-sm'>
            &quot;{formatBigNumber(5000)} bonus rewards&quot; are earned by holding some special traits.
            <br />
            Each trait earns {ADA_SYMBOL}10 with every distribution, they can stack.
          </p>
          <ul className='ml-2 text-xs list-disc list-inside'>
            <li>Bad Fox - Mouth: (F) Crypto</li>
            <li>Bad Fox - Mouth: (M) Cash Bag</li>
            <li>Bad Motorcycle - Anterior: (VE) Piggy Savings</li>
            <li>Bad Motorcycle - Above: (NI) Cash Bag</li>
            <li>Bad Motorcycle - Rear: (CH) Ada Bag</li>
            <li>Bad Motorcycle - Rear: (HB) Vault</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Page
