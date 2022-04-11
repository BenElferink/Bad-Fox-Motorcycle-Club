import { forwardRef } from 'react'
import { TEAM } from '../../constants'
import Card from './Card'
import team from './team.json'
import styles from './Team.module.css'

const Team = forwardRef((props, ref) => {
  return (
    <div ref={ref} id={TEAM} className={styles.root}>
      {team.map((item) => (
        <Card key={item.name} item={item} />
      ))}
    </div>
  )
})

export default Team
