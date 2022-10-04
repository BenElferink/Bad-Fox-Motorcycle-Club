import { useState } from 'react'
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import styles from './Roadmap.module.css'

export default function ListItem({ complete, title, description, isLeft = false }) {
  const { isMobile } = useScreenSize()
  const [showMore, setShowMore] = useState(false)

  const click = () => {
    setShowMore((prev) => !prev)
  }

  return (
    <div onClick={click} className={`${styles.event} ${!isMobile ? (isLeft ? styles.leftEvent : styles.rightEvent) : styles.mobileEvent}`}>
      <h3>
        {complete ? <CheckCircle color='primary' /> : <RadioButtonUnchecked color='primary' />}
        {title}
      </h3>
      {showMore ? <p>{description}</p> : null}
    </div>
  )
}
