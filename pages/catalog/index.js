import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push(`${router.asPath}/traits/fox`)
  }, [])

  return <div className='App' />
}
