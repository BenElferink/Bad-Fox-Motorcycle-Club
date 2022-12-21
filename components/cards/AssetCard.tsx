import Image from 'next/image'
import React, { Fragment } from 'react'
import useScreenSize from '../../hooks/useScreenSize'
import ImageLoader from '../Loader/ImageLoader'

export interface AssetCardProps {
  isBurned?: boolean
  title: string
  imageSrc: string
  tiedImageSrcs?: { src: string; name: string }[]
  subTitles?: string[]
  onClick?: () => void
  style?: React.CSSProperties
}

const AssetCard = (props: AssetCardProps) => {
  const { isBurned, title, imageSrc, tiedImageSrcs, subTitles, onClick, style = {} } = props
  const { isMobile } = useScreenSize()

  return (
    <div
      onClick={() => (!!onClick && typeof onClick === 'function' ? onClick() : null)}
      className={
        (!!onClick && typeof onClick === 'function' ? 'cursor-pointer' : '') +
        ' flex flex-col-reverse md:flex-row mx-2 mb-4 mt-0 bg-gray-900 hover:bg-gray-700 bg-opacity-50 hover:bg-opacity-50 rounded-xl border border-gray-800'
      }
    >
      <div className='relative flex flex-col items-center truncate w-[250px]' style={style}>
        <ImageLoader
          src={imageSrc}
          alt={title}
          width={250}
          height={250}
          style={{ borderRadius: '0.5rem 0.5rem 0 0' }}
        />
        {isBurned ? (
          <div className='absolute top-0 left-0 z-10 flex items-center justify-center w-[250px] h-[250px] bg-gray-900 bg-opacity-50'>
            <Image src='/media/fire.gif' alt='BURNED' width={150} height={150} />
          </div>
        ) : null}

        <div className='w-full px-4 py-2'>
          <h5 className='text-lg'>{title}</h5>

          {subTitles && subTitles.length ? (
            <Fragment>
              <div className='h-[1px] my-2 bg-gray-400' />

              {subTitles.map((str) =>
                str ? (
                  <h6 key={`${title}-h6-${str}`} className='text-sm'>
                    {str}
                  </h6>
                ) : null
              )}
            </Fragment>
          ) : null}
        </div>
      </div>

      {!!tiedImageSrcs?.length ? (
        <div className='flex md:flex-col-reverse items-center justify-center md:justify-start'>
          {tiedImageSrcs.map((file, idx) => (
            <div key={`tied-img-${file.name}`} className='w-[84px] md:w-[111px]' style={style}>
              <ImageLoader
                src={file.src}
                alt={file.name}
                width={isMobile ? 84 : 111}
                height={isMobile ? 84 : 111}
                style={{
                  borderRadius: isMobile
                    ? idx === 0
                      ? '0.5rem 0 0 0'
                      : idx === tiedImageSrcs.length - 1
                      ? '0 0.5rem 0 0'
                      : '0'
                    : idx === 0
                    ? '0 0 0.5rem 0'
                    : idx === tiedImageSrcs.length - 1
                    ? '0 0.5rem 0 0'
                    : '0',
                }}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default AssetCard
