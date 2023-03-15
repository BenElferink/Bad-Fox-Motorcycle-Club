import Link from 'next/link'
import ImageLoader from '../../components/Loader/ImageLoader'
import { navTokens } from '../../components/Navigation'

const Page = () => {
  return (
    <div>
      <div className='max-w-[690px] mx-auto flex justify-center flex-wrap'>
        {navTokens.map(({ label, path }) =>
          path ? (
            <Link key={`token_${label}`} scroll={false} href={path}>
              <div className='w-44 h-44 m-2 py-6 flex flex-col justify-between rounded-xl bg-gray-400 hover:bg-gray-200 bg-opacity-20 hover:bg-opacity-20 hover:text-gray-200'>
                <div className='flex items-center justify-center animate-pulse'>
                  <ImageLoader
                    src={`/media/tokens/${label.toLowerCase()}/token.png`}
                    alt='token'
                    width={label === 'CSWAP' ? 80 : 100}
                    height={label === 'CSWAP' ? 80 : 100}
                  />
                </div>
                <h3 className='text-center text-sm'>${label}</h3>
              </div>
            </Link>
          ) : null
        )}
      </div>
    </div>
  )
}

export default Page
