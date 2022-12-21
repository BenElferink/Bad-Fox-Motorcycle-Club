import { Bars3Icon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../../../constants'
import MultipleLinks from './MultipleLinks'
import SingleLink from './SingleLink'

const Navigation = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <nav>
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        className='md:hidden flex items-center p-1 mx-1 rounded-lg text-sm hover:bg-gray-700 focus:outline-none focus:ring-gray-600 focus:ring-2'
      >
        <Bars3Icon className='w-7 h-7' />
      </button>

      <div className={(open ? 'block' : 'hidden') + ' md:block'}>
        <ul className='flex flex-col md:flex-row absolute right-0 md:static overflow-auto md:overflow-visible max-h-[80vh] md:max-h-auto w-9/12 md:w-auto mt-6 md:mt-0 p-4 bg-gray-900 border md:border-0 rounded-lg border-gray-700 md:space-x-8'>
          <li
            onClick={() => {
              if (router.pathname === '/') window.scrollTo({ top: 0 })
              setOpen(false)
            }}
          >
            <SingleLink label='Home' path={'/'} />
          </li>
          <li onClick={() => setOpen(false)}>
            <SingleLink label='Team' path='/#team' />
          </li>

          <li>
            <MultipleLinks
              title='Collections'
              links={[
                { label: 'Bad Fox', path: `/collections/${BAD_FOX_POLICY_ID}` },
                { label: 'Bad Motorcycle', path: `/collections/${BAD_MOTORCYCLE_POLICY_ID}` },
                { label: 'Bad Key', path: `/collections/${BAD_KEY_POLICY_ID}` },
              ]}
            />
          </li>
          <li>
            <MultipleLinks
              title='Traits'
              links={[
                { label: 'Bad Fox', path: `/traits/${BAD_FOX_POLICY_ID}` },
                { label: 'Bad Motorcycle', path: `/traits/${BAD_MOTORCYCLE_POLICY_ID}` },
              ]}
            />
          </li>

          {/* <li>
            <MultipleLinks title='Metaverses' links={[{ label: 'TBA', path: '/' }]} />
          </li> */}

          <li>
            <MultipleLinks title='Tools' links={[{ label: 'Bad Drop', url: 'https://drop.badfoxmc.com' }]} />
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
