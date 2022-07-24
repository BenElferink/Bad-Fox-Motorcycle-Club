import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push('/catalog/traits/fox')
  }, [])

  return <div className='App' />
}
