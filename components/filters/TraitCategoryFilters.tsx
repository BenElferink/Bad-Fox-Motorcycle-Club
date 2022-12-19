import { ChevronDownIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'
import { TraitsFile } from '../../@types'

export interface TraitCategoryFiltersProps {
  traitsData: TraitsFile
  callbackSelectedCategory: (category: string) => void
}

const TraitCategoryFilters = (props: TraitCategoryFiltersProps) => {
  const { traitsData = {}, callbackSelectedCategory = () => {} } = props
  const [selectedCategory, setSelectedCategory] = useState('Skin')
  const [openDropdown, setOpenDropdown] = useState(false)

  useEffect(() => {
    callbackSelectedCategory(selectedCategory)
  }, [selectedCategory])

  return (
    <div className='w-full my-4 flex justify-center relative'>
      <button
        type='button'
        onClick={() => setOpenDropdown((prev) => !prev)}
        className='md:hidden w-2/3 p-3 flex items-center justify-between rounded-lg bg-gray-900 hover:bg-gray-700 hover:text-white border border-gray-700 hover:border-gray-500'
      >
        <span>Change Category</span>
        <ChevronDownIcon className={(openDropdown ? 'rotate-180' : 'rotate-0') + ' ml-1 w-4 h-4'} />
      </button>

      <div
        className={
          (openDropdown ? 'flex' : 'hidden md:flex') +
          ' flex-col md:flex-row items-center md:justify-center w-2/3 md:w-full p-3 md:p-0 rounded-lg bg-gray-900 md:bg-transparent border md:border-0 border-gray-700 absolute md:static top-14 z-20'
        }
      >
        {Object.entries(traitsData)
          .sort((a, b) => a[0][0].localeCompare(b[0][0]))
          .map(([category, traits]) =>
            category !== 'Gender' && category !== 'Model' ? (
              <button
                key={`category-${category}`}
                type='button'
                onClick={() => {
                  setSelectedCategory(category)
                  setOpenDropdown(false)
                }}
                className={
                  'flex items-center justify-between w-full md:w-fit md:mx-1 py-1 md:p-3 rounded-xl md:bg-gray-900 md:hover:bg-gray-700 text-sm hover:text-white ' +
                  (selectedCategory === category ? 'text-white' : '')
                }
              >
                <span className='mr-1'>{category}</span>
                <span className='ml-1'>[{traits.length}]</span>
              </button>
            ) : null
          )}
      </div>
    </div>
  )
}

export default TraitCategoryFilters
