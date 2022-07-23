import { useState } from 'react'
import { IconButton } from '@mui/material'
import {
  ArrowForwardIosRounded as ArrowRightIcon,
  ArrowBackIosRounded as ArrowLeftIcon,
} from '@mui/icons-material'
import styles from './SideDrawer.module.css'

const SideDrawer = ({ title = 'Title', children }) => {
  const [open, setOpen] = useState(false)

  const clickArrow = () => setOpen((prev) => !prev)

  return (
    <aside className={`${styles.root} ${open ? styles.open : !open ? styles.closed : ''}`}>
      <div className={styles.arrowBtnWrap}>
        <IconButton className={styles.arrowBtn} onClick={clickArrow}>
          {open ? <ArrowLeftIcon /> : <ArrowRightIcon />}
        </IconButton>
      </div>

      <div className={`scroll ${styles.content}`}>
        <h3 className={styles.title}>{title}</h3>
        {children}
      </div>
    </aside>
  )
}

export default SideDrawer
