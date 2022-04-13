import { forwardRef } from 'react'
import { Avatar, IconButton } from '@mui/material'
import Twitter from '../../icons/Twitter'
import LinkedIn from '../../icons/LinkedIn'
import Instagram from '../../icons/Instagram'
import data from './data.json'
import { INSTAGRAM, LINKEDIN, TWITTER, TEAM } from '../../constants'
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
  const clickSocial = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div ref={ref} id={TEAM} className={styles.root}>
      {data.map(({ name, title, description, socials }) => (
        <div key={`team-${name}`} className={styles.card}>
          <Avatar src={pfp[name]} className={styles.avatar} />

          <div>
            <h4>{name}</h4>
            <h6>{title}</h6>
            <p>{description}</p>
          </div>

          <div className={styles.socials}>
            {socials.map((social) => (
              <IconButton key={`${name}-${social.type}`} onClick={() => clickSocial(social.url)}>
                {(() => {
                  switch (social.type) {
                    case TWITTER:
                      return <Twitter />
                    case LINKEDIN:
                      return <LinkedIn />
                    case INSTAGRAM:
                      return <Instagram />
                    default:
                      return null
                  }
                })()}
              </IconButton>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
})

export default Team
