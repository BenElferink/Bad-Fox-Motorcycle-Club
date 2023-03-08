import Link from 'next/link'
import React, { Fragment } from 'react'
import ImageLoader from '../Loader/ImageLoader'

interface TokenPrerequisitesProps {
  items: {
    imageUrl: string
    purchaseUrl: string
    texts: string[]
  }[]
  multiItemType?: 'AND' | 'OR'
}

const TokenPrerequisites = (props: TokenPrerequisitesProps) => {
  const { items, multiItemType } = props

  return (
    <div className='w-full my-2 p-4 px-6 flex flex-col bg-gray-400 bg-opacity-20 rounded-xl'>
      <h4 className='mb-2 text-gray-200 text-lg text-center'>Prerequisites</h4>

      <div className='flex items-center justify-center'>
        {!items.length ? (
          <div className='mx-2'>- none -</div>
        ) : (
          items.map((item, idx1) => (
            <Fragment key={`prerequisite-${idx1}`}>
              <Link
                href={item.purchaseUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={!multiItemType ? 'mx-1' : ''}
              >
                <ImageLoader
                  src={item.imageUrl}
                  alt='nft'
                  width={150}
                  height={150}
                  style={{ borderRadius: '1rem' }}
                />
                {item.texts.map((str, idx2) => (
                  <p key={`prerequisite-${idx1}-text-${idx2}`} className='mt-1 text-xs text-center'>
                    {str}
                  </p>
                ))}
              </Link>

              {multiItemType && idx1 !== items.length - 1 ? <span className='mx-2'>- {multiItemType} -</span> : null}
            </Fragment>
          ))
        )}
      </div>
    </div>
  )
}

export default TokenPrerequisites
