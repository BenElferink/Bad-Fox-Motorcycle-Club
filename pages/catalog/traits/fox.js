import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { BAD_FOX_POLICY_ID } from '../../../constants/policy-ids'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.push(`/traits/${BAD_FOX_POLICY_ID}`)
  }, [])

  return <div className='App' />
}
