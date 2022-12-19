import { useState } from 'react'
import useScreenSize from '../../hooks/useScreenSize'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { MinusCircleIcon } from '@heroicons/react/24/outline'
import styles from './Utilities.module.css'

const ListItem = ({ complete, title, description, isLeft = false }) => {
  const { isMobile } = useScreenSize()
  const [showMore, setShowMore] = useState(false)

  return (
    <div
      onClick={() => setShowMore((prev) => !prev)}
      className={`${styles.event} ${
        !isMobile ? (isLeft ? styles.leftEvent : styles.rightEvent) : styles.mobileEvent
      }`}
    >
      <h3>
        {complete ? <CheckCircleIcon className='w-6 h-6' /> : <MinusCircleIcon className='w-6 h-6' />}
        {title}
      </h3>
      {showMore ? <p>{description}</p> : null}
    </div>
  )
}

export default ListItem
