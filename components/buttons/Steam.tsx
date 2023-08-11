import Link from 'next/link'
import Image from 'next/image'

const Steam = (props: { src: string }) => {
  const { src } = props

  return (
    <Link
      href={src}
      target='_blank'
      rel='noopener noreferrer'
      className='w-[170px] h-[59px] m-1 rounded-lg border border-white bg-black text-white flex items-center'
    >
      <Image src='/media/games/steam.svg' alt='' width={170} height={59} className='rounded-lg' />
    </Link>
  )
}

export default Steam
