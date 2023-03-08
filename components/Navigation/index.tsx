import { Bars3Icon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../constants'
import MultipleLinks from './MultipleLinks'
import SingleLink from './SingleLink'

const Navigation = () => {
  const router = useRouter()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [openDropdownName, setOpenDropdownName] = useState('')

  useEffect(() => {
    if (!openDropdownName) {
      setIsNavOpen(false)
    }
  }, [openDropdownName])

  return (
    <nav className='flex items-center'>
      <button
        type='button'
        onClick={() => setIsNavOpen((prev) => !prev)}
        className='xl:hidden flex items-center p-1 mx-1 rounded-lg text-sm hover:bg-gray-700 focus:outline-none focus:ring-gray-600 focus:ring-2'
      >
        <Bars3Icon className='w-7 h-7' />
      </button>

      <div className={(isNavOpen ? 'block' : 'hidden') + ' xl:block'}>
        <ul className='flex flex-col xl:flex-row absolute right-0 xl:static overflow-auto xl:overflow-visible max-h-[80vh] xl:max-h-auto w-80 xl:w-auto mt-8 xl:mt-0 p-4 bg-gray-900 border xl:border-0 rounded-lg border-gray-700 xl:space-x-8'>
          <li
            onClick={() => {
              if (router.pathname === '/') window.scrollTo({ top: 0 })
              setIsNavOpen(false)
            }}
          >
            <SingleLink label='Home' path={'/'} />
          </li>
          <li onClick={() => setIsNavOpen(false)}>
            <SingleLink label='Team' path='/#team' />
          </li>
          <li onClick={() => setIsNavOpen(false)}>
            <SingleLink label='Merch' url='https://my-store-d34165.creator-spring.com/' />
          </li>

          <li>
            <MultipleLinks
              title='Collections'
              links={[
                { label: 'Bad Fox', path: `/collections/${BAD_FOX_POLICY_ID}` },
                { label: 'Bad Motorcycle', path: `/collections/${BAD_MOTORCYCLE_POLICY_ID}` },
                { label: 'Bad Key', path: `/collections/${BAD_KEY_POLICY_ID}` },
                { label: '3D Fox', path: '' },
                { label: '3D Motorcycle', path: '' },
                { label: 'Vox Fox', path: '' },
              ]}
              dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }}
            />
          </li>

          <li>
            <MultipleLinks
              title='Tools'
              links={[
                { label: 'Bad Drop', url: 'https://drop.badfoxmc.com' },
                { label: 'Bad Poll', url: 'https://poll.badfoxmc.com' },
                { label: 'Bad Raffle', url: '' },
              ]}
              dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }}
            />
          </li>
          <li>
            <MultipleLinks
              title='Tokens'
              links={[
                { label: 'ADA', path: '/tokens/ada' },
                { label: 'C4', path: '/tokens/c4' },
                { label: 'CHILLAZ', path: '/tokens/chillaz' },
                { label: 'CSWAP', path: '/tokens/cswap' },
                { label: 'DDOS', path: '/tokens/ddos' },
                { label: 'HEXO', path: '/tokens/hexo' },
                { label: 'MD', path: '/tokens/md' },
                { label: 'NFTC', path: '/tokens/nftc' },
                { label: 'QAK', path: '' },
                { label: 'SAFARI', path: '' },
                { label: 'SOCIETY', path: '/tokens/society' },
              ]}
              dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }}
            />
          </li>
          <li>
            <MultipleLinks
              title='Games & Metaverses'
              links={[
                { label: 'Degen Royale', path: '' },
                { label: 'OGBears', path: '' },
                { label: 'Cornucopias', path: '' },
                { label: 'Speed Throne', path: '' },
                { label: 'CardaStacks', path: '' },
                { label: 'Boss Planet', path: '' },
                { label: 'U.E (secret: preparation)', path: '' },
              ]}
              dropdownState={{ value: openDropdownName, setValue: setOpenDropdownName }}
            />
          </li>
        </ul>
      </div>

      <div className='hidden md:block'>
        <Link
          href='/wallet'
          onClick={() => window.scroll({ top: 0, left: 0 })}
          className={
            'mx-2 p-4 rounded-lg text-sm ' +
            (router.pathname === '/wallet'
              ? 'bg-gray-700 text-white'
              : 'bg-gray-900 hover:bg-gray-700 hover:text-white')
          }
        >
          Wallet
        </Link>
      </div>
    </nav>
  )
}

export default Navigation
