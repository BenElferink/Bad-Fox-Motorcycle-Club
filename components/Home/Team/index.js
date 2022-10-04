import { forwardRef } from 'react'
import { Avatar, IconButton } from '@mui/material'
import Discord from '../../../icons/Discord'
import Twitter from '../../../icons/Twitter'
import LinkedIn from '../../../icons/LinkedIn'
import Instagram from '../../../icons/Instagram'
import { TEAM } from '../../../constants/scroll-nav'
import { DISCORD, INSTAGRAM, LINKEDIN, TWITTER } from '../../../constants/socials'
import data from '../../../data/team.json'
import styles from './Team.module.css'

const Team = forwardRef((props, ref) => {
  const clickSocial = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div ref={ref} id={TEAM} className={styles.root}>
      {data.map(({ name, title, description, profilePicture, socials }) => (
        <div key={`team-${name}`} className={styles.card}>
          <Avatar src={profilePicture} className={styles.avatar} />

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
                    case DISCORD:
                      return <Discord />
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
