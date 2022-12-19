import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    if (router.query.policyId) {
      window.location.href = `/traits/${router.query.policyId}`
    }
  }, [router])

  return <div />
}
