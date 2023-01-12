import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const data = [
  {
    name: 'Cardano',
    url: 'https://cardano.org',
    logoUrl: '/media/logo/other/cardano.png',
    logoHeight: 70,
    logoWidth: 70,
  },
  {
    name: 'Mesh',
    url: 'https://meshjs.dev',
    logoUrl: '/media/logo/other/mesh.png',
    logoHeight: 70,
    logoWidth: 70,
  },
]

const Footer = () => {
  return (
    <footer className='flex flex-col items-center justify-center pt-15 pb-5 bg-black bg-opacity-50'>
      <h5 className='text-md'>powered by</h5>

      <div className='flex items-center'>
        {data.map((obj) => (
          <Link
            key={`powered-by-${obj.name}`}
            href={obj.url}
            target='_blank'
            rel='noopener'
            className='m-2 flex flex-col items-center justify-center'
          >
            <h6 className='mb-1 text-sm'>{obj.name}</h6>
            <Image
              src={obj.logoUrl}
              alt={obj.name}
              width={obj.logoWidth}
              height={obj.logoHeight}
              className='drop-shadow-footeritem'
            />
          </Link>
        ))}
      </div>
    </footer>
  )
}

export default Footer
