import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export interface PartnerProjectProps {
  name: string
  url: string
  logoUrl: string
  className?: string
}

const PartnerProject = (props: PartnerProjectProps) => {
  const { name, url, logoUrl, className } = props
  const [clickCount, setClickCount] = useState(0)
  const [showWord, setShowWord] = useState(false)

  if (name === 'Unbounded Earth') {
    return (
      <button
        type='button'
        onClick={() => {
          if (clickCount < 69) {
            setClickCount((prev) => prev + 1)
          } else if (!showWord) {
            setShowWord(true)
          } else if (clickCount >= 69 && showWord) {
            window.open(url, '_blank', 'noopener')
          }
        }}
        className={'w-20 h-10 my-6 mx-6 flex flex-col items-center justify-center relative ' + className}
      >
        <Image src={logoUrl} alt={name} fill sizes='5rem' className='object-contain' />
        <h6 className='absolute -bottom-7 text-xs whitespace-nowrap'>
          {name}
          {clickCount ? ` (${clickCount})` : null}
          {showWord ? (
            <span className='absolute -bottom-4 left-0'>
              <u>Secret</u>: preparation
            </span>
          ) : null}
        </h6>
      </button>
    )
  }

  return (
    <Link
      href={url}
      target='_blank'
      rel='noopener'
      className={'w-20 h-10 my-6 mx-6 flex flex-col items-center justify-center relative ' + className}
    >
      <Image src={logoUrl} alt='logo' fill sizes='5rem' className='object-contain' />
      <h6 className='absolute -bottom-7 text-xs whitespace-nowrap'>{name}</h6>
    </Link>
  )
}

export default PartnerProject
