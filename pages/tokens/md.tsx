import Link from 'next/link'
import TokenHeader from '../../components/tokens/TokenHeader'
import TokenWhoEarns, { WhoCanEarn } from '../../components/tokens/TokenWhoEarns'

const TOKEN_IMAGE_SRC = '/media/tokens/md/token.png'
const TOKEN_POLICY_ID = '772791eb3f4b92874a49d487375a90db631988291c1a643b817668ca'
const TOKEN_NAME = 'MD'
const PROJECT_NAME = 'Mad Dog Car Club'
const WHO_CAN_EARN: WhoCanEarn = ['Bad Fox']

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
          <div className='mx-2'>- none -</div>
        </div>
      </div>

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to earn?</h4>

        <ol className='mx-auto list-decimal list-inside'>
          <li className='text-sm'>
            Connect your wallet on the{' '}
            <Link href='https://mdtoken.io/' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
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
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              MD Token Claim Dashboard
            </Link>
            .
          </li>
        </ol>
      </div>

      <div className='w-full my-2 p-4 px-6 bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How much can be earned?</h4>

        <div className='mx-auto w-fit'>
          <h5 className='text-center underline'>Ranks 1 - 1000</h5>
          <p className='text-sm text-center'>
            0.265 ${TOKEN_NAME} per 1 (eligible) NFT,
            <br />
            every day.
          </p>

          <h5 className='mt-2 text-center underline'>Ranks 1001 - 6000</h5>
          <p className='text-sm text-center'>
            0.072 ${TOKEN_NAME} per 1 (eligible) NFT,
            <br />
            every day.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
