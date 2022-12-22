import { useEffect } from 'react'
import Loader from '.'
import Modal from '../layout/Modal'

interface GlobalLoaderProps {
  loading: boolean
}

const GlobalLoader = (props: GlobalLoaderProps) => {
  const { loading } = props

  return (
    <Modal open={loading} noModal>
      <Loader size={300} />
    </Modal>
  )
}

export default GlobalLoader
