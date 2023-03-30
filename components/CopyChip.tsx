import { ClipboardIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'

function CopyChip({ prefix, value }: { prefix?: string; value: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const clickCopy = () => {
    if (!isCopied) {
      setIsCopied(true)
      navigator.clipboard.writeText(value)
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }

  return (
    <button
      onClick={clickCopy}
      className='flex items-center max-w-72 py-2 px-4 bg-gray-900 rounded-lg border border-gray-700 hover:bg-gray-600 hover:border-gray-500 hover:text-gray-200'
    >
      <ClipboardIcon className='w-5 h-5 mr-1' />
      <p className='w-[250px] bg-transparent text-start text-sm truncate'>
        {isCopied ? (
          'Copied 👍'
        ) : (
          <Fragment>
            {prefix ? <strong>{`${prefix}: `}</strong> : null}
            {value}
          </Fragment>
        )}
      </p>
    </button>
  )
}

export default CopyChip
