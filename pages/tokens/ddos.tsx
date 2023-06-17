import Link from 'next/link'
import TokenHeader from '../../components/tokens/TokenHeader'
import TokenPrerequisites from '../../components/tokens/TokenPrerequisites'
import TokenWhoEarns, { WhoCanEarn } from '../../components/tokens/TokenWhoEarns'
import PageContainer from '../../components/layout/PageContainer'

const TOKEN_IMAGE_SRC = '/media/tokens/ddos/token.png'
const TOKEN_POLICY_ID = '2c85a478d53f0e484b852c357e56057dfd8e80a6b72ecb4daffe42e5'
const TOKEN_NAME = 'DDOS'
const PROJECT_NAME = 'Degen Dino orb Society'
const WHO_CAN_EARN: WhoCanEarn = ['Bad Key']

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

      <TokenPrerequisites
        multiItemType='OR'
        items={[
          {
            imageUrl: '/media/tokens/ddos/dino.png',
            purchaseUrl:
              'https://www.jpg.store/collection/52c16147514c66ad5ce74dccbd4a27e5e58c94fab31ed17d7b871218',
            texts: ['DDoS - Dino'],
          },
          {
            imageUrl: '/media/tokens/ddos/cosmic-medallion.gif',
            purchaseUrl:
              'https://www.jpg.store/collection/a862fde1093e4618c7a664eddb43f8529116e9caa70536dfaa500550',
            texts: ['DDoS - Cosmic Medallion'],
          },
        ]}
      />

      <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to earn?</h4>

        <ol className='mx-auto list-decimal list-inside'>
          <li className='text-sm'>
            Connect your wallet to the{' '}
            <Link
              href='https://stake.ddos.design/app/stake'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              DDoS Staking Dashboard
            </Link>
            .
          </li>
          <li className='text-sm'>
            At the top of the screen, click on <i>&quot;Your wallet is not staked. Click here to stake 🥩&quot;</i>
            .
            <br />
            (after signing the TX, you will be delegating to the DDoS stake pool, <u>this is required</u>)
          </li>
          <li className='text-sm'>
            Come back later to claim your tokens from the{' '}
            <Link
              href='https://stake.ddos.design/app/token'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              DDoS Token Claim Dashboard
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
              href='https://whitepaper.ddos.design/ddos-staking-platform/for-holders/xp-counter'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
              DDoS Whitepaper
            </Link>{' '}
            for a detailed description on reward calculations.
          </p>
        </div>
      </div>
    </PageContainer>
  )
}

export default Page
