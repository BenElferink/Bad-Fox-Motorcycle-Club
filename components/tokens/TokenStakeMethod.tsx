import React, { Fragment } from 'react'

type Method = 'Non Custodial' | 'Custodial' | 'Vaulted' | 'Drip / Claim'

interface TokenStakeMethodProps {
  method: Method
}

const TokenStakeMethod = (props: TokenStakeMethodProps) => {
  const { method } = props

  return (
    <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
      <h4 className='mb-2 text-gray-200 text-lg text-center'>Staking Method</h4>

      <div className='flex items-center justify-center'>
        <p className='text-center'>
          {method}
          {method === 'Vaulted' ? (
            <Fragment>
              <br />
              <span className='text-xs'>
                Known as a &apos;script&apos; wallet, it may conflict with other earning methods.
              </span>
            </Fragment>
          ) : null}
        </p>
      </div>
    </div>
  )
}

export default TokenStakeMethod
