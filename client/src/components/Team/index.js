import { forwardRef } from 'react'
import { TEAM } from '../../constants'
import Card from './Card'
import data from './data.json'
import benPfp from '../../images/team/ben.jpg'
import chrisPfp from '../../images/team/chris.jpg'
import davidPfp from '../../images/team/david.jpg'
import styles from './Team.module.css'

const pfp = {
  'Ben Elferink': benPfp,
  'Christian Mitrev': chrisPfp,
  'David Minkov': davidPfp,
}

const Team = forwardRef((props, ref) => {
  return (
    <div ref={ref} id={TEAM} className={styles.root}>
      {data.map(({ name, title, description, socials }) => (
        <Card key={name} profileSrc={pfp[name]} name={name} title={title} description={description} socials={socials} />
      ))}
    </div>
  )
})

export default Team
