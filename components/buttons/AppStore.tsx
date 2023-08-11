import Link from 'next/link'
import Image from 'next/image'

const AppStore = (props: { src: string }) => {
  const { src } = props

  return (
    <Link href={src} target='_blank' rel='noopener noreferrer' className='m-1'>
      <Image src='/media/games/app-store.png' alt='' width={170} height={59} />
    </Link>
  )
}

export default AppStore
