import { ChevronDownIcon } from '@heroicons/react/24/solid'
import { Dispatch, SetStateAction } from 'react'
import SingleLink, { SingleLinkProps } from './SingleLink'

export interface MultipleLinksProps {
  title: string
  links: SingleLinkProps[]
  dropdownState: {
    value: string
    setValue: Dispatch<SetStateAction<string>>
  }
}

const MultipleLinks = (props: MultipleLinksProps) => {
  const { title, links, dropdownState } = props
  const open = dropdownState.value === title

  return (
    <div className='relative'>
      <button
        type='button'
        onClick={() =>
          dropdownState.setValue((prev) => {
            if (prev === title) return ''
            return title
          })
        }
        className={
          (open ? 'bg-gray-800 xl:bg-transparent xl:text-white ' : '') +
          'py-2 px-3 xl:p-0 w-full xl:w-auto flex items-center text-start xl:text-center text-sm truncate rounded xl:border-0 hover:bg-gray-700 xl:hover:bg-transparent hover:text-white'
        }
      >
        {title}
        <ChevronDownIcon className={(open ? 'rotate-180' : 'rotate-0') + ' ml-1 w-4 h-4'} />
      </button>

      <div className={open ? 'block' : 'hidden'}>
        <ul
          onClick={() => dropdownState.setValue('')}
          className='xl:flex xl:flex-col xl:items-start xl:absolute xl:top-12 xl:-left-4 xl:overflow-auto xl:w-fit xl:p-4 xl:bg-gray-900 xl:border-gray-700 xl:rounded-xl'
        >
          {links.map((obj) => (
            <li
              key={`link-group-${title}-item-${obj.label}`}
              className='xl:py-1 bg-gray-800 xl:bg-transparent rounded'
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
