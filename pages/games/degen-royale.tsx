import Link from 'next/link'
import PageContainer from '../../components/layout/PageContainer'
import ImageLoader from '../../components/Loader/ImageLoader'
import Steam from '../../components/buttons/Steam'
import { BAD_FOX_3D_POLICY_ID } from '../../constants'

const Page = () => {
  return (
    <PageContainer>
      <div className='w-full my-2 p-4 flex flex-col items-center justify-center bg-gray-400 bg-opacity-20 rounded-xl'>
        <Link href='https://degenroyale.net' target='_blank' rel='noopener noreferrer'>
          <ImageLoader src='/media/games/degen-royale/logo.png' alt='' width={80} />
        </Link>

        <ImageLoader src='/media/games/degen-royale/preview.png' alt='' width={700} style={{ margin: '0.3rem 0', borderRadius: '0.5rem' }} />

        <div className='flex flex-wrap items-center justify-center'>
          <Steam src='https://store.steampowered.com/app/2156070/Degen_Royale' />
        </div>
      </div>

      <div className='w-full my-2 p-4 flex flex-col items-center justify-center bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>How to play?</h4>

        <ol className='mx-auto list-decimal list-inside text-sm'>
          <li>Download the game.</li>
          <li>
            Create an account on the{' '}
            <Link href='https://app.degenroyale.net' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
              Degen Royale website
            </Link>
            .
          </li>
          <li>Navigate to &quot;wallet&quot; and paste your Cardano address.</li>
          <li>Navigate to &quot;collectibles&quot; and click &quot;add from wallet&quot; to add an avatar.</li>
          <li>Start the game, and link your Degen Royale account.</li>
        </ol>
      </div>

      <div className='w-full my-2 p-4 flex flex-col items-center justify-center bg-gray-400 bg-opacity-20 rounded-xl'>
        <h4 className='mb-2 text-gray-200 text-lg text-center'>Game rules</h4>

        <div className='max-w-[80%] w-full my-2'>
          <h5 className='text-gray-200'>There are 3 types of players:</h5>
          <ul className='list-disc text-sm'>
            <li>
              <span className='text-gray-300'>Guests / Non Holders:</span> They can play with a guest avatar.
            </li>
            <li>
              <span className='text-gray-300'>3D Fox Holders:</span> These players have at least 1{' '}
              <Link
                href={`https://www.jpg.store/collection/${BAD_FOX_3D_POLICY_ID}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400'
              >
                3D Fox NFT
              </Link>
              . They can play the game using avatar #5736.
            </li>
            <li>
              <span className='text-gray-300'>3D Fox & Degen Royale Holders:</span> These players have at least 1{' '}
              <Link
                href={`https://www.jpg.store/collection/${BAD_FOX_3D_POLICY_ID}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-400'
              >
                3D Fox NFT
              </Link>
              , and at least 1{' '}
              <Link href='https://magiceden.io/marketplace/degenroyale' target='_blank' rel='noopener noreferrer' className='text-blue-400'>
                Degen Royale NFT
              </Link>
              . They can play the game using their own personal avatar.
            </li>
          </ul>
        </div>
      </div>
    </PageContainer>
  )
}

export default Page
