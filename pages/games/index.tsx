import Link from 'next/link'
import ImageLoader from '../../components/Loader/ImageLoader'
import { navGames } from '../../components/Navigation'

const Page = () => {
  return (
    <div>
      <div className='max-w-[800px] mx-auto flex justify-center flex-wrap'>
        {navGames.map(({ label, path }) =>
          path ? (
            <Link key={`token_${label}`} scroll={false} href={path}>
              <div className='relative w-60 h-44 m-2 flex flex-col justify-center rounded-xl bg-gray-400 hover:bg-gray-200 bg-opacity-20 hover:bg-opacity-20 hover:text-gray-200'>
                <div className='flex items-center justify-center animate-pulse'>
                  <ImageLoader
                    src={`/media/${path.charAt(0) === '/' ? path.slice(1) : path}/logo.png`}
                    alt='token'
                    width={label === 'Degen Royale' ? 110 : 200}
                    height={label === 'Degen Royale' ? 110 : 50}
                    style={label === 'Degen Royale' ? { marginBottom: '0.5rem' } : {}}
                  />
                </div>
                <h3 className='absolute bottom-2 left-1/2 -translate-x-1/2 text-center text-sm'>{label}</h3>
              </div>
            </Link>
          ) : null
        )}
      </div>
    </div>
  )
}

export default Page
