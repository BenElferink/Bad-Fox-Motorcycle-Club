import Link from 'next/link'
import PageContainer from '../../components/layout/PageContainer'
import ImageLoader from '../../components/Loader/ImageLoader'
import AppStore from '../../components/buttons/AppStore'
import GooglePlay from '../../components/buttons/GooglePlay'
import { BAD_FOX_3D_POLICY_ID } from '../../constants'
// import PlayOnWeb from '../../components/buttons/PlayOnWeb'

const Page = () => {
  return (
    <PageContainer>
      <div className='w-full my-2 p-4 flex flex-col items-center justify-center bg-gray-400 bg-opacity-20 rounded-xl'>
        <Link href='https://ogbears.com' target='_blank' rel='noopener noreferrer'>
          <ImageLoader src='/media/games/ogbears/logo.png' alt='' width={200} />
        </Link>

        <ImageLoader src='/media/games/ogbears/preview_1.png' alt='' width={700} style={{ margin: '0.5rem 0', borderRadius: '0.5rem' }} />

        <div className='flex flex-wrap items-center justify-center'>
          <AppStore src='https://apps.apple.com/il/app/motopaws/id6448412252' />
          <GooglePlay src='https://play.google.com/store/apps/details?id=com.ogverse.motopaws' />
          {/* <PlayOnWeb src='https://www.ogverse.io/motopaws' /> */}
        </div>
      </div>

      <div className='w-full my-2 p-4 flex flex-col items-center justify-center bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to play?</h4>

        <ol className='mx-auto list-decimal list-inside text-sm'>
          <li>Download the app.</li>
          <li>
            Connect your wallet using the{' '}
            <Link href='https://ogbears.com/connect' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
              OGB website
            </Link>
            .
          </li>
          <li>
            In the app, tap on the PFP and <u>select a 3D Fox</u>.
          </li>
          <li>Start playing!</li>
        </ol>
      </div>

      <div className='w-full my-2 p-4 flex flex-col items-center justify-center bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>Game rules</h4>

        <div className='max-w-[80%] w-full my-2'>
          <h5 className='text-gray-200'>There are 2 types of players:</h5>
          <ul className='list-disc text-sm'>
            <li>
              <span className='text-gray-300'>Guests / Non Holders:</span> They can play, but their score won&apos;t be posted to the leader boards,
              and they won&apos;t be able to win any rewards.
            </li>
            <li>
              <span className='text-gray-300'>3D Fox / OGBear Holders:</span> These players have at least 1{' '}
              <Link
                href={`https://www.jpg.store/collection/${BAD_FOX_3D_POLICY_ID}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400'
              >
                3D Fox NFT
              </Link>{' '}
              or at least 1{' '}
              <Link
                href='https://www.jpg.store/collection/a23836ef3b4d0ad3ed1c28bd30e754e208ae7ea0a23e809354d67e0d'
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400'
              >
                OGBears NFT
              </Link>
              . They can play the game and record their scores + win rewards.
            </li>
          </ul>
        </div>

        <div className='max-w-[80%] w-full my-2'>
          <h5 className='text-gray-200'>Profile and Avatars:</h5>
          <ul className='list-disc text-sm'>
            <li>Once you are connected, you can edit your display name and your PFP.</li>
            <li>If you select a 3D Fox PFP, a fox is spawned in-game. A bear will be spawned by default.</li>
            <li>Personal avatars will be supported in a future game update.</li>
          </ul>
        </div>

        <div className='max-w-[80%] w-full my-2'>
          <h5 className='text-gray-200'>Rewards:</h5>
          <ul className='list-disc text-sm'>
            <li>Rewards can be for any number of places on the leaderboard.</li>
            <li>Rewards are tied to a season. Every season can have multiple different rewards (NFTs, tokens, whitelist spots etc.)</li>
            <li>Eventually the rewards will be replaced with OGBears&apos;s $SALMON token.</li>
            <li>Rewards will need to be distributed manually at 1st.</li>
          </ul>
        </div>

        <div className='max-w-[80%] w-full my-2'>
          <h5 className='text-gray-200'>Seasons:</h5>
          <ul className='list-disc text-sm'>
            <li>A season is a time-based competition model.</li>
            <li>Season start & end date can be setup from the back-end.</li>
            <li>Season rewards can be setup from the back-end.</li>
            <li>Season partners can be changed from the back-end, we can play against other communities.</li>
            <li>Each season will have its own leaderboards and rewards.</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  )
}

export default Page
