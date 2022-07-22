import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Traits() {
  const router = useRouter()

  useEffect(() => {
    router.push(`${router.asPath}/catalog`)
  }, [])

  return <div className='App' />
}
