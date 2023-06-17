import Link from 'next/link'
import PageContainer from '../../components/layout/PageContainer'
import ImageLoader from '../../components/Loader/ImageLoader'

const Page = () => {
  return (
    <PageContainer>
      <div className='w-full my-2 p-4 flex flex-col items-center justify-center bg-gray-400 bg-opacity-20 rounded-xl'>
        <Link href='https://bajuzki.art' target='_blank' rel='noopener noreferrer'>
          <ImageLoader src='/media/games/bajuzki/logo.png' alt='' width={80} />
        </Link>

        <h6 className='mt-2 text-gray-200 text-xl'>Coming Soon™️</h6>

        <ImageLoader
          src='/media/games/bajuzki/preview_1.png'
          alt=''
          width={700}
          style={{ margin: '0.3rem 0', borderRadius: '0.5rem' }}
        />

        <ImageLoader
          src='/media/games/bajuzki/preview_2.png'
          alt=''
          width={700}
          style={{ margin: '0.3rem 0', borderRadius: '0.5rem' }}
        />
      </div>
    </PageContainer>
  )
}

export default Page
