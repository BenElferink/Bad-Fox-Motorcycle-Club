import Link from 'next/link'
import ImageLoader from '../../components/Loader/ImageLoader'
import TokenHeader from '../../components/tokens/TokenHeader'
import TokenWhoEarns, { WhoCanEarn } from '../../components/tokens/TokenWhoEarns'

const TOKEN_IMAGE_SRC = '/media/tokens/c4/token.png'
const TOKEN_POLICY_ID = 'a00fdf4fb9ab6c8c2bd1533a2f14855edf12aed5ecbf96d4b5f5b939'
const TOKEN_NAME = 'C4'
const PROJECT_NAME = 'Cardano Crocs Club'
const WHO_CAN_EARN: WhoCanEarn = ['Bad Fox', 'Bad Motorcycle', 'Bad Key']

const Page = () => {
  return (
    <div className='max-w-[800px] mx-auto px-4 flex flex-col items-center'>
      <TokenHeader
        projectName={PROJECT_NAME}
        tokenName={TOKEN_NAME}
        tokenSrc={TOKEN_IMAGE_SRC}
        policyId={TOKEN_POLICY_ID}
      />
      <TokenWhoEarns whoCanEarn={WHO_CAN_EARN} />

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>Prerequisites</h4>

        <div className='flex items-center justify-center'>
          <Link href='https://swamplands.cardanocrocsclub.com/swamp' target='_blank' rel='noopener noreferrer'>
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
            <Link href='' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
              CCC Staking Dashboard
            </Link>
            .
          </li>
          <li className='text-sm'>
            Come back later to claim your tokens from the{' '}
            <Link href='' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
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
            300 ${TOKEN_NAME} per 1 (eligible) NFT,
            <br />
            every month.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
