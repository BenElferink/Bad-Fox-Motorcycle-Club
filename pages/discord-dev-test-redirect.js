import { useRouter } from 'next/router'
import { useEffect } from 'react'
import ActualPageAfterDiscordRedirect from './wallet/manage/redirect'

const Page = () => {
  const router = useRouter()

  const isDevMode = process.env.NODE_ENV === 'development'

  useEffect(() => {
    if (!isDevMode) {
      router.push('/')
    }
  }, [isDevMode])

  if (!isDevMode) {
    return <div className='App' />
  }

  return <ActualPageAfterDiscordRedirect />
}

export default Page
