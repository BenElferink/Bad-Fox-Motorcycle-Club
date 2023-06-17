import Link from 'next/link'
import TokenHeader from '../../components/tokens/TokenHeader'
import TokenPrerequisites from '../../components/tokens/TokenPrerequisites'
import TokenWhoEarns, { WhoCanEarn } from '../../components/tokens/TokenWhoEarns'
import PageContainer from '../../components/layout/PageContainer'

const TOKEN_IMAGE_SRC = '/media/tokens/hexo/token.png'
const TOKEN_POLICY_ID = '27eee19588c997ca54d3137f64afe55a18dfcf9062fa83a724bf2357'
const TOKEN_NAME = 'HEXO'
const PROJECT_NAME = 'Cardano Lands'
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
            Connect your wallet to the{' '}
            <Link
              href='https://cardanolands.com/staking'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              CL Staking Dashboard
            </Link>
            .
          </li>
          <li className='text-sm'>That&apos;s it, you&apos;re accumulating.</li>
          <li className='text-sm'>Connect at least once a month, or accumulation will pause.</li>
          <li className='text-sm'>
            You can claim your tokens from the{' '}
            <Link
              href='https://cardanolands.com/inventory'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              CL Token Claim Dashboard
            </Link>
            .
          </li>
        </ol>
      </div>

      <div className='w-full my-2 p-4 px-6 bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How much can be earned?</h4>

        <div className='mx-auto w-fit'>
          <p className='text-sm text-center'>
            Visit the{' '}
            <Link
              href='https://cardanolands.com/calculator'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              CL Staking Calculator
            </Link>{' '}
            to view the reward variable.
          </p>
        </div>
      </div>
    </PageContainer>
  )
}

export default Page
