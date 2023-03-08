import Link from 'next/link'
import TokenHeader from '../../components/tokens/TokenHeader'
import TokenPrerequisites from '../../components/tokens/TokenPrerequisites'
import TokenWhoEarns, { WhoCanEarn } from '../../components/tokens/TokenWhoEarns'

const TOKEN_IMAGE_SRC = '/media/tokens/chillaz/token.png'
const TOKEN_POLICY_ID = '41d6d9f45fd530d713a9ff306c42934fca3794348990bad8ca976fd6'
const TOKEN_NAME = 'CHILLAZ'
const PROJECT_NAME = 'The Chillaz'
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

      <TokenPrerequisites
        items={[
          {
            imageUrl: '/media/tokens/chillaz/blockchillaz.png',
            purchaseUrl:
              'https://www.jpg.store/collection/61643a27e4e897e4c8b05d4df0e723b98a852d173a23c966e988addc',
            texts: ['BlockChillaz', '1 = stake 5 NFT(s)'],
          },
        ]}
      />

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to earn?</h4>

        <ol className='mx-auto list-decimal list-inside'>
          <li className='text-sm'>
            Go to{' '}
            <Link
              href='https://utility.chainchillaz.io/staking'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              The Chillaz Staking Dashboard
            </Link>
            .
          </li>
          <li className='text-sm'>
            If you&apos;re visiting for the 1st time, you&apos;ll need to register an email account.
          </li>
          <li className='text-sm'>Login with your acocunt, and connect your wallet.</li>
          <li className='text-sm'>
            Navigate to the &quot;unstaked&quot; tab, click &quot;select all&quot;, and start staking.
          </li>
          <li className='text-sm'>Come back later to claim your tokens.</li>
        </ol>
      </div>

      <div className='w-full my-2 p-4 px-6 bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How much can be earned?</h4>

        <div className='mx-auto w-fit'>
          <p className='text-sm text-center'>
            8.4 ${TOKEN_NAME} per 1 (eligible) NFT,
            <br />
            every week.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page
