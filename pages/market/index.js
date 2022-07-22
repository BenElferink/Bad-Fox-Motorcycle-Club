import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Market() {
  const router = useRouter()

  useEffect(() => {
    router.push(`${router.asPath}/listings`)
  }, [])

  return <div className='App' />
}
