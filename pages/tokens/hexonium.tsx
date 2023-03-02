import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Page = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace('/tokens/hexo')
  }, [router])

  return <div />
}

export default Page
