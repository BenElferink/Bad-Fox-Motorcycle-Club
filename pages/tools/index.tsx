import Link from 'next/link'
import ImageLoader from '../../components/Loader/ImageLoader'
import { navTools } from '../../components/Navigation'

const Page = () => {
  return (
    <div>
      <div className='max-w-[690px] mx-auto flex justify-center flex-wrap'>
        {navTools.map(({ label, url }) =>
          url ? (
            <Link key={`token_${label}`} scroll={false} href={url} target='_blank' rel='noopener noreferrer'>
              <div className='w-44 h-44 m-2 py-6 flex flex-col justify-between rounded-xl bg-gray-400 hover:bg-gray-200 bg-opacity-20 hover:bg-opacity-20 hover:text-gray-200'>
                <div className='flex items-center justify-center animate-pulse'>
                  <ImageLoader
                    src={`/media/tools/${label.replace('Bad ', '').toLowerCase()}.png`}
                    alt='emoji'
                    width={100}
                    height={100}
                  />
                </div>
                <h3 className='text-center text-sm'>{label}</h3>
              </div>
            </Link>
          ) : null
        )}
      </div>
    </div>
  )
}

export default Page
