import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function MarketListingsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.push('/market')
  }, [])

  return <div className='App' />
}
