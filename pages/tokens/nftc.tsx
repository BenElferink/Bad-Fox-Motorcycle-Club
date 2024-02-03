import Link from 'next/link'
import TokenHeader from '../../components/tokens/TokenHeader'
import TokenPrerequisites from '../../components/tokens/TokenPrerequisites'
import TokenWhoEarns, { WhoCanEarn } from '../../components/tokens/TokenWhoEarns'
import TokenStakeMethod from '../../components/tokens/TokenStakeMethod'
import PageContainer from '../../components/layout/PageContainer'

const TOKEN_IMAGE_SRC = '/media/tokens/nftc/token.png'
const TOKEN_POLICY_ID = 'b0af30edf2c7f11465853821137e0a6ebc395cab71ee39c24127ffb4'
const TOKEN_NAME = 'NFTC'
const PROJECT_NAME = 'NFT Creative'
const WHO_CAN_EARN: WhoCanEarn = ['Bad Key']

const Page = () => {
  return (
    <PageContainer>
      <TokenHeader projectName={PROJECT_NAME} tokenName={TOKEN_NAME} tokenSrc={TOKEN_IMAGE_SRC} policyId={TOKEN_POLICY_ID} />

      <TokenWhoEarns whoCanEarn={WHO_CAN_EARN} />

      <TokenStakeMethod method='Drip / Claim' />

      <TokenPrerequisites items={[]} />

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to earn?</h4>

        <ol className='mx-auto list-decimal list-inside'>
          <li className='text-sm'>
            Connect your wallet to the{' '}
            <Link href='https://nftcdrip.xyz/' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
              NFTC Claim Portal
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
            50 ${TOKEN_NAME} per 1 (eligible) NFT,
            <br />
            every epoch (5 days).
          </p>
        </div>
      </div>
    </PageContainer>
  )
}

export default Page
