import React, { Fragment } from 'react'
import ImageLoader from '../Loader/ImageLoader'

export interface AssetCardProps {
  imageSrc: string
  title: string
  subTitles?: string[]
  onClick?: () => void
  style?: React.CSSProperties
}

const AssetCard = (props: AssetCardProps) => {
  const { imageSrc, title, subTitles, onClick, style = {} } = props

  return (
    <div
      className={
        'flex flex-col items-center truncate w-[250px] mx-2 mb-4 mt-0 bg-gray-900 hover:bg-gray-700 bg-opacity-50 hover:bg-opacity-50 rounded-xl border border-gray-800 ' +
        (!!onClick && typeof onClick === 'function' ? 'cursor-pointer' : '')
      }
      style={style}
      onClick={() => (!!onClick && typeof onClick === 'function' ? onClick() : null)}
    >
      {imageSrc ? (
        <ImageLoader
          src={imageSrc}
          alt={title}
          width={250}
          height={250}
          style={{ borderRadius: '0.5rem 0.5rem 0 0' }}
        />
      ) : null}

      <div className='w-full px-4 py-2'>
        <h5 className='text-lg'>{title}</h5>

        {subTitles && subTitles.length ? (
          <Fragment>
            <div className='h-[1px] my-2 bg-gray-400' />

            {subTitles.map((str) => (
              <h6 key={`${title}-h6-${str}`} className='text-sm'>
                {str}
              </h6>
            ))}
          </Fragment>
        ) : null}
      </div>
    </div>
  )
}

export default AssetCard
