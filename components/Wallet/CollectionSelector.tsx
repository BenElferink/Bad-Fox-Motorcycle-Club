import React from 'react'
import useWallet from '../../contexts/WalletContext'
import ImageLoader from '../Loader/ImageLoader'
import projectsFile from '../../data/projects.json'
import { PolicyId } from '../../@types'
import { LockClosedIcon } from '@heroicons/react/24/outline'

export interface CollectionSelectorProps {
  onSelected: (_policyId: PolicyId) => void
}

const CollectionSelector = (props: CollectionSelectorProps) => {
  const { onSelected } = props
  const { populatedWallet } = useWallet()

  return (
    <div className='flex flex-wrap items-center justify-center'>
      {Object.entries(populatedWallet?.assets || {}).map(([policyId, assets]) => {
        const proj = projectsFile.find((proj) => proj.policyId === policyId && !!proj.collections)
        if (!proj) return null

        const imageSrc = proj.image
        const title = proj.name
        const ownsThisCollection = !!assets.length

        return (
          <button
            key={`project-${proj.policyId}`}
            type='button'
            onClick={() => {
              if (ownsThisCollection) {
                onSelected(proj.policyId as PolicyId)
              }
            }}
            className={
              'relative flex flex-col items-center w-[200px] m-1 mx-2 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700  ' +
              (ownsThisCollection
                ? 'hover:bg-gray-700 hover:bg-opacity-50 hover:border-gray-500 hover:text-white'
                : 'cursor-not-allowed')
            }
          >
            <ImageLoader
              src={imageSrc}
              alt={title}
              width={200}
              height={200}
              style={{ borderRadius: '0.75rem 0.75rem 0 0' }}
            />
            <h6 className='w-full m-1 text-center text-lg font-light truncate'>{title}</h6>

            <div
              className={
                ownsThisCollection
                  ? 'hidden'
                  : 'w-full h-full absolute top-0 left-0 z-20 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-xl'
              }
            >
              <LockClosedIcon className='w-3/4 h-3/4 text-gray-200' />
            </div>
          </button>
        )
      })}
    </div>
  )
}

export default CollectionSelector
