import Link from 'next/link'
import { Fragment } from 'react'
import ImageLoader from '../Loader/ImageLoader'

export interface TraitCardProps {
  imageSrc: string
  title: string
  tableRows?: string[][]
}

const TraitCard = (props: TraitCardProps) => {
  const { imageSrc = '', title = '', tableRows = [] } = props

  return (
    <div className='flex flex-col items-center text-center truncate w-[250px] m-1 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-800'>
      {imageSrc ? (
        <Link href={imageSrc} target='_blank' rel='noopener'>
          <ImageLoader
            src={imageSrc}
            alt={title}
            width={250}
            height={250}
            style={{ borderRadius: '0.5rem 0.5rem 0 0' }}
          />
        </Link>
      ) : null}

      <div className='w-full px-4 py-2'>
        <h6 className='text-lg'>{title}</h6>

        {tableRows && tableRows.length ? (
          <Fragment>
            <div className='h-[1px] my-2 bg-gray-400' />

            <table className='w-full border-collapse text-xs font-light'>
              <tbody>
                {tableRows.map((row, idx) => (
                  <tr key={`${title}-tr-${idx}`}>
                    {row.map((str) => (
                      <td key={`${title}-tr-${idx}-td-${str}`}>{str}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Fragment>
        ) : null}
      </div>
    </div>
  )
}

export default TraitCard
