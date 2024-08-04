import Loader from '.'
import Modal from '../layout/Modal'

interface GlobalLoaderProps {
  loading: boolean
}

const GlobalLoader = (props: GlobalLoaderProps) => {
  const { loading } = props

  return (
    <Modal open={loading} scrollToTop noModal className='justify-center'>
      <Loader size={250} />
    </Modal>
  )
}

export default GlobalLoader
