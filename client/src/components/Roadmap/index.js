import { forwardRef } from 'react'
import { MAP } from '../../constants'
import styles from './Roadmap.module.css'

const Roadmap = forwardRef((props, ref) => {
  return (
    <div ref={ref} id={MAP} className={styles.root}>
      Roadmap will be here..!
    </div>
  )
})

export default Roadmap
