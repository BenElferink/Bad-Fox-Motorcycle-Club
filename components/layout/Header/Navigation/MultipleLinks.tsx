import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import SingleLink, { SingleLinkProps } from './SingleLink'

export interface MultipleLinksProps {
  title: string
  links: SingleLinkProps[]
}

const MultipleLinks = (props: MultipleLinksProps) => {
  const { title, links } = props
  const [open, setOpen] = useState(false)

  return (
    <div className='relative'>
      <button
        type='button'
        onClick={() => setOpen((prev) => !prev)}
        className={
          (open ? 'bg-gray-800 md:bg-transparent md:text-white ' : '') +
          'py-2 px-3 md:p-0 w-full md:w-auto flex items-center text-start md:text-center text-sm rounded md:border-0 hover:bg-gray-700 md:hover:bg-transparent hover:text-white'
        }
      >
        {title}
        <ChevronDownIcon className={(open ? 'rotate-180' : 'rotate-0') + ' ml-1 w-4 h-4'} />
      </button>

      <div className={open ? 'block' : 'hidden'}>
        <ul
          onClick={() => setOpen(false)}
          className='md:flex md:flex-col md:items-start md:absolute md:top-12 md:right-0 md:overflow-auto md:w-40 md:p-4 md:bg-gray-900 md:border-gray-700 md:rounded-xl'
        >
          {links.map((obj) => (
            <li
              key={`link-group-${title}-item-${obj.label}`}
              className='md:py-1 bg-gray-800 md:bg-transparent rounded'
            >
              <SingleLink {...obj} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MultipleLinks
