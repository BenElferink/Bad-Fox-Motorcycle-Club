import React from 'react'
import ImageLoader from '../Loader/ImageLoader'

interface TokenHeaderProps {
  projectName: string
  tokenName: string
  tokenSrc: string
  policyId?: string
}

const TokenHeader = (props: TokenHeaderProps) => {
  const { projectName, tokenName, tokenSrc, policyId } = props

  return (
    <div className='w-full my-2 flex items-center justify-center md:items-stretch p-4 bg-gray-400 bg-opacity-20 rounded-xl'>
      <div className='hidden md:block animate-pulse'>
        <ImageLoader src={tokenSrc} alt='token' width={111} height={111} />
      </div>

      <div className='md:ml-4 flex flex-col justify-between'>
        <div>
          <h2 className='text-gray-200 text-xl'>${tokenName}</h2>
          <h3 className='text-sm'>{projectName}</h3>
        </div>

        <div className='md:hidden mx-auto my-4 animate-pulse'>
          <ImageLoader src={tokenSrc} alt='token' width={150} height={150} />
        </div>

        {policyId ? (
          <p className='text-xs'>
            Policy ID:
            <br />
            <span className='break-all'>{policyId}</span>
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default TokenHeader
