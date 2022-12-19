import { useEffect } from 'react'
import Loader from '.'
import Modal from '../Modal'

interface GlobalLoaderProps {
  loading: boolean
}

const GlobalLoader = (props: GlobalLoaderProps) => {
  const { loading } = props

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <Modal open={loading} noModal>
      <Loader size={300} />
    </Modal>
  )
}

export default GlobalLoader
