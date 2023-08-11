import Link from 'next/link'
import TokenHeader from '../../components/tokens/TokenHeader'
import TokenWhoEarns, { WhoCanEarn } from '../../components/tokens/TokenWhoEarns'
import formatBigNumber from '../../functions/formatters/formatBigNumber'
import PageContainer from '../../components/layout/PageContainer'
import { ADA_SYMBOL } from '../../constants'

const TOKEN_IMAGE_SRC = '/media/tokens/ada/token.png'
const TOKEN_NAME = 'ADA'
const PROJECT_NAME = 'Cardano'
const WHO_CAN_EARN: WhoCanEarn = ['2D Fox', '2D Motorcycle', 'Bad Key']

const Page = () => {
  return (
    <PageContainer>
      <TokenHeader projectName={PROJECT_NAME} tokenName={TOKEN_NAME} tokenSrc={TOKEN_IMAGE_SRC} />
      <TokenWhoEarns whoCanEarn={WHO_CAN_EARN} />

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to earn?</h4>

        <p className='mx-auto text-sm text-center'>
          Simply hold your NFTs.
          <br />
          No need to make a submission/claim!
          <br />
          (airdrop via{' '}
          <Link href='https://labs.badfoxmc.com/airdrops' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
            Bad Labs
          </Link>
          )
        </p>
      </div>

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>When is the payout?</h4>

        <p className='mx-auto text-sm text-center'>
          Every time the{' '}
          <Link href='https://pool.pm/$bfmc_royalty' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
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
            <li>20% - team wallet</li>
          </ul>

          <p className='mt-2 text-sm'>&quot;80% base rewards&quot; are divided by {formatBigNumber(12000)} shares as following:</p>
          <ul className='ml-2 text-xs list-disc list-inside'>
            <li>1x shares - Bad Fox</li>
            <li>2x shares - Bad Motorcycle</li>
            <li>4x shares - Bad Key</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  )
}

export default Page
