import { forwardRef } from 'react'
import { TEAM } from '../../constants'
import Card from './Card'
import data from './data.json'
import styles from './Team.module.css'

const Team = forwardRef((props, ref) => {
  return (
    <div ref={ref} id={TEAM} className={styles.root}>
      {data.map((item) => (
        <Card key={item.name} item={item} />
      ))}
    </div>
  )
})

export default Team
