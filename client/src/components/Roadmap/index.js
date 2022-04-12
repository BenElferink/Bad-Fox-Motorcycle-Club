import { forwardRef } from 'react'
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material'
import ListItem from './LisItem'
import data from './data.json'
import { MAP } from '../../constants'
import styles from './Roadmap.module.css'
import { useScreenSize } from '../../contexts/ScreenSizeContext'

const Roadmap = forwardRef((props, ref) => {
  const { isMobile } = useScreenSize()

  return (
    <div ref={ref} id={MAP} className={styles.root}>
      <h1>Roadmap</h1>

      {data.map((phase, idx) => {
        const isLeft = idx % 2 !== 0

        return (
          <div
            key={phase.chapter}
            className={`${styles.chapter} ${!isMobile ? (isLeft ? styles.leftChapter : styles.rightChapter) : styles.mobileChapter}`}
          >
            <h2>
              {phase.complete ? <CheckCircle color='primary' /> : <RadioButtonUnchecked color='primary' />}
              {phase.chapter}
            </h2>
            {phase.events.map((event) => (
              <ListItem key={event.title} complete={event.complete} title={event.title} description={event.description} isLeft={isLeft} />
            ))}
          </div>
        )
      })}
    </div>
  )
})

export default Roadmap
