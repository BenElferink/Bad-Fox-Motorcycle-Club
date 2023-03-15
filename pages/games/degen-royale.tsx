import { useEffect } from 'react'

const Page = () => {
  useEffect(() => {
    document.body.style.backgroundImage = "url('/media/games/degen-royale/bg.jpg')"

    return () => {
      document.body.style.backgroundImage = "url('/media/landing/bg.png')"
    }
  }, [])

  return (
    <div className='flex items-center justify-center'>
      <div className='w-60 h-40 mt-40 flex items-center justify-center text-gray-100 text-xl bg-gray-400 bg-opacity-50 rounded-xl border border-gray-200'>
        Coming Soon™️
      </div>
    </div>
  )
}

export default Page
