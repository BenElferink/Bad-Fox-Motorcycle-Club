import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Redirect() {
  const router = useRouter()

  useEffect(() => {
    router.push(`${router.asPath}/fox`)
  }, [])

  return <div className='App' />
}
