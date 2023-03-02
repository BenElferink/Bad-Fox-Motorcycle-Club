import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import React from 'react'

export type WhoCanEarn = ('Bad Fox' | 'Bad Motorcycle' | 'Bad Key')[]

interface TokenWhoEarnsProps {
  whoCanEarn: WhoCanEarn
}

const TokenWhoEarns = (props: TokenWhoEarnsProps) => {
  const { whoCanEarn } = props

  return (
    <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
      <h4 className='mb-2 text-gray-200 text-lg text-center'>Who can earn?</h4>

      <ul className='mx-auto flex flex-col md:flex-row md:items-center md:justify-center'>
        <li
          className={`flex items-center text-sm ${
            whoCanEarn.includes('Bad Fox') ? 'text-[var(--online)]' : 'text-[var(--offline)]'
          }`}
        >
          {whoCanEarn.includes('Bad Fox') ? (
            <CheckCircleIcon className='w-6 h-6 ml-4 mr-1' />
          ) : (
            <XCircleIcon className='w-6 h-6 ml-4 mr-1' />
          )}
          Bad Fox
        </li>

        <li
          className={`flex items-center text-sm ${
            whoCanEarn.includes('Bad Motorcycle') ? 'text-[var(--online)]' : 'text-[var(--offline)]'
          }`}
        >
          {whoCanEarn.includes('Bad Motorcycle') ? (
            <CheckCircleIcon className='w-6 h-6 ml-4 mr-1' />
          ) : (
            <XCircleIcon className='w-6 h-6 ml-4 mr-1' />
          )}
          Bad Motorcycle
        </li>

        <li
          className={`flex items-center text-sm ${
            whoCanEarn.includes('Bad Key') ? 'text-[var(--online)]' : 'text-[var(--offline)]'
          }`}
        >
          {whoCanEarn.includes('Bad Key') ? (
            <CheckCircleIcon className='w-6 h-6 ml-4 mr-1' />
          ) : (
            <XCircleIcon className='w-6 h-6 ml-4 mr-1' />
          )}
          Bad Key
        </li>
      </ul>
    </div>
  )
}

export default TokenWhoEarns
