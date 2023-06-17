import Link from 'next/link'
import TokenHeader from '../../components/tokens/TokenHeader'
import TokenPrerequisites from '../../components/tokens/TokenPrerequisites'
import TokenWhoEarns, { WhoCanEarn } from '../../components/tokens/TokenWhoEarns'
import PageContainer from '../../components/layout/PageContainer'

const TOKEN_IMAGE_SRC = '/media/tokens/md/token.png'
const TOKEN_POLICY_ID = '772791eb3f4b92874a49d487375a90db631988291c1a643b817668ca'
const TOKEN_NAME = 'MD'
const PROJECT_NAME = 'Mad Dog Car Club'
const WHO_CAN_EARN: WhoCanEarn = ['Bad Fox', 'Bad Motorcycle', 'Bad Key']

const Page = () => {
  return (
    <PageContainer>
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
            Connect your wallet on the{' '}
            <Link href='https://mdtoken.io/' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
              MD Token Website
            </Link>
            .
          </li>
          <li className='text-sm'>
            Navigate to the &quot;staking&quot; tab, and click &quot;accumulate rewards&quot;.
            <br />
            (if you get new NFTs afterwards, you will have to click &quot;refresh&quot; on the wallet page)
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
          <p className='text-sm text-center'>
            0.1 ${TOKEN_NAME} per 1 (eligible) NFT,
            <br />
            every day.
          </p>
        </div>
      </div>
    </PageContainer>
  )
}

export default Page
