import Link from 'next/link'
import { GlobeAltIcon } from '@heroicons/react/24/solid'

const PlayOnWeb = (props: { src: string }) => {
  const { src } = props

  return (
    <Link
      href={src}
      target='_blank'
      rel='noopener noreferrer'
      className='w-[170px] h-[59px] m-1 rounded-lg border border-white bg-black text-white flex items-center'
    >
      <GlobeAltIcon className='w-8 h-8 ml-2 mr-1' />

      <p className='my-auto text-start text-sm'>
        Play on
        <br />
        <span className='text-lg'>WEB (browser)</span>
      </p>
    </Link>
  )
}

export default PlayOnWeb
