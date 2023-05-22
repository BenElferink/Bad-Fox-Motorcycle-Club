import Link from 'next/link'
import TokenHeader from '../../components/tokens/TokenHeader'
import TokenPrerequisites from '../../components/tokens/TokenPrerequisites'
import TokenWhoEarns, { WhoCanEarn } from '../../components/tokens/TokenWhoEarns'

const TOKEN_IMAGE_SRC = '/media/tokens/ezy/token.png'
const TOKEN_POLICY_ID = '1c1e38cfcc815d2015dbda6bee668b2e707ee3f9d038d96668fcf63c'
const TOKEN_NAME = 'EZY'
const PROJECT_NAME = 'Eggscape Club'
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
          {/* <li className='text-sm'>
            Connect your wallet to the{' '}
            <Link href='https://' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
              Staking Dashboard
            </Link>
            .
          </li>
          <li className='text-sm'>Select the NFTs you want to stake.</li>
          <li className='text-sm'>That&apos;s it, all done.</li> */}
        </ol>

        <p className='text-center text-sm'>Coming soon...</p>
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
