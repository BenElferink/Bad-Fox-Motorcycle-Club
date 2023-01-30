import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import MusicPlayer from '../MusicPlayer'
import Navigation from '../Navigation'
import SocialIcon from '../SocialIcon'

const Header = () => {
  return (
    <header className='w-screen py-3 md:py-4 px-2 md:px-2 bg-black bg-opacity-50 flex items-center justify-between sticky top-0 z-40'>
      <div className='flex items-center'>
        <Link href='/' onClick={() => window.scroll({ top: 0, left: 0 })} className='h-16 w-16 mx-2 relative'>
          <Image
            src='/media/logo/white_alpha.png'
            alt='logo'
            priority
            fill
            sizes='5rem'
            className='object-contain rounded-full'
          />
        </Link>
      </div>

      <div className='flex items-center'>
        <MusicPlayer />
        <Navigation />

        <div className='flex items-center'>
          <SocialIcon
            network='twitter'
            url='https://twitter.com/BadFoxMC'
            color=''
            className='p-1 mx-1 rounded-lg text-sm hover:bg-gray-700 focus:outline-none focus:ring-gray-600 focus:ring-2'
          />
          <SocialIcon
            network='discord'
            url='https://discord.gg/BadFoxMC'
            color=''
            className='p-1 mx-1 rounded-lg text-sm hover:bg-gray-700 focus:outline-none focus:ring-gray-600 focus:ring-2'
          />
        </div>
      </div>
    </header>
  )
}

export default Header
