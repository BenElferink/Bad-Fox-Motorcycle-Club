import Link from 'next/link'
import TokenHeader from '../../components/tokens/TokenHeader'
import TokenPrerequisites from '../../components/tokens/TokenPrerequisites'
import TokenWhoEarns, { WhoCanEarn } from '../../components/tokens/TokenWhoEarns'

const TOKEN_IMAGE_SRC = '/media/tokens/cswap/token.png'
const TOKEN_POLICY_ID = '???'
const TOKEN_NAME = 'CSWAP'
const PROJECT_NAME = 'CSWAP DEX'
const WHO_CAN_EARN: WhoCanEarn = ['Bad Key']

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

      <TokenPrerequisites items={[]} />

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to earn?</h4>

        <ol className='mx-auto list-decimal list-inside'>
          <li className='text-sm'>
            Connect your wallet to the{' '}
            <Link
              href='https://app.cswap.fi/nftstaking'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              CSWAP Staking Dashboard
            </Link>
            .
          </li>
          <li className='text-sm'>Click &quot;Partner Staking&quot;, then click &quot;Stake&quot;.</li>
          <li className='text-sm'>That&apos;s it, you&apos;re accumulating.</li>
          <li className='text-sm'>Claim your tokens by clicking &quot;Harvest&quot;.</li>
        </ol>
      </div>

      <div className='w-full my-2 p-4 px-6 bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How much can be earned?</h4>

        <div className='mx-auto w-fit'>
          <p className='text-sm text-center'>
            1 ${TOKEN_NAME} per 1 (eligible) NFT,
            <br />
            every day.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page