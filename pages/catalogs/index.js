import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    window.location.href = '/'
  }, [])

  return <div />
}
