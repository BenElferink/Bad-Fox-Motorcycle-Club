import Loader from '.'
import Modal from '../Modal'

const GlobalLoader = ({ loading = true }) => {
  return (
    <Modal title='' open={loading} style={{ backgroundColor: 'transparent', outline: 'none' }}>
      <Loader />
    </Modal>
  )
}

export default GlobalLoader
