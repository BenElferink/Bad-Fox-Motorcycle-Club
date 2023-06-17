import Link from 'next/link'
import PageContainer from '../../components/layout/PageContainer'
import ImageLoader from '../../components/Loader/ImageLoader'
import { GlobeAltIcon } from '@heroicons/react/24/solid'

const Page = () => {
  return (
    <PageContainer>
      <div className='w-full my-2 p-4 flex flex-col items-center justify-center bg-gray-400 bg-opacity-20 rounded-xl'>
        <Link href='https://ogbears.com' target='_blank' rel='noopener noreferrer'>
          <ImageLoader src='/media/games/ogbears/logo.png' alt='' width={200} />
        </Link>

        <ImageLoader
          src='/media/games/ogbears/preview_1.png'
          alt=''
          width={700}
          style={{ margin: '0.5rem 0', borderRadius: '0.5rem' }}
        />

        <div className='flex flex-wrap items-center justify-center'>
          <Link
            href='https://apps.apple.com/il/app/motopaws/id6448412252'
            target='_blank'
            rel='noopener noreferrer'
            className='m-1'
          >
            <img src='/media/app-store.png' width={170} />
          </Link>

          <Link
            href='https://play.google.com/store/apps/details?id=com.ogverse.motopaws'
            target='_blank'
            rel='noopener noreferrer'
            className='m-1'
          >
            <img src='/media/google-play.png' width={170} />
          </Link>

          <Link
            href='https://www.ogverse.io/motopaws'
            target='_blank'
            rel='noopener noreferrer'
            className='w-[170px] h-[59px] m-1 rounded-lg border border-white bg-black text-white flex items-center'
          >
            <GlobeAltIcon className='w-8 h-8 mx-1' />

            <p className='my-auto text-start text-sm'>
              Play it on
              <br />
              <span className='text-lg'>WEB (browser)</span>
            </p>
          </Link>
        </div>
      </div>

      <div className='w-full my-2 p-4 flex flex-col items-center justify-center bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to play?</h4>

        <ol className='mx-auto list-decimal list-inside text-sm'>
          <li>Download the app.</li>
          <li>
            Connect your wallet using the{' '}
            <Link
              href='https://ogbears.com/connect'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-400'
            >
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
          <h5 className='text-gray-200'>There are 3 types of players:</h5>
          <ul className='list-disc text-sm'>
            <li>
              <span className='text-gray-300'>Guests:</span> No wallet connection. They can play all tracks with a
              bear but their score won't be posted to the leader boards. So they won't be able to win any rewards
              as well.
            </li>
            <li>
              <span className='text-gray-300'>Non Holders:</span> These players do not hold a bear, a 3d fox or
              other partner projects. Their score is not posted and they are not eligible for rewards.
            </li>
            <li>
              <span className='text-gray-300'>3D Fox / OG Bear Holders:</span> These players have connected their
              wallets and have atleast one eligible NFT. They can play the game and record their scores + win
              rewards.
            </li>
          </ul>
        </div>

        <div className='max-w-[80%] w-full my-2'>
          <h5 className='text-gray-200'>Rewards:</h5>
          <ul className='list-disc text-sm'>
            <li>Rewards can be for any number of places on the leaderboard.</li>
            <li>
              Rewards are tied to a season. Every season can have multiple different rewards (NFTs, tokens,
              whitelist spots etc.)
            </li>
            <li>Eventually the rewards will be replaced with OGBears's $SALMON token.</li>
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

        <div className='max-w-[80%] w-full my-2'>
          <h5 className='text-gray-200'>Profile and Avatars:</h5>
          <ul className='list-disc text-sm'>
            <li>Once you are connected, you can edit your display name and your PFP.</li>
            <li>If you select a 3D Fox PFP, a fox is spawned in-game. A bear will be spawned by default.</li>
            <li>Personal avatars will be supported in the next game update.</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  )
}

export default Page
