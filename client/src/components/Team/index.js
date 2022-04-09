import { forwardRef } from 'react'
import { Avatar, IconButton } from '@mui/material'
import { Instagram, LinkedIn } from '@mui/icons-material'
import Twitter from '../../icons/Twitter'
import { INSTAGRAM, LINKEDIN, TEAM, TWITTER } from '../../constants'
import styles from './Team.module.css'

const team = [
  {
    profileSrc: '/images/team/ben.jpeg',
    name: 'Ben Elferink',
    title: 'Lead Developer / Community Manager',
    description: 'lorem ipsum',
    socials: [
      {
        type: TWITTER,
        url: 'https://twitter.com/BenElferink',
      },
      {
        type: LINKEDIN,
        url: 'https://www.linkedin.com/in/ben-elferink-37ba251b9',
      },
    ],
  },
  {
    profileSrc: '/images/team/chris.jpg',
    name: 'Christian Mitrev',
    title: 'Artist / Head Founder / Financier',
    description: 'lorem ipsum',
    socials: [
      {
        type: INSTAGRAM,
        url: 'https://instagram.com/m__chris',
      },
    ],
  },
  {
    profileSrc: '/images/team/david.jpg',
    name: 'David Minkov',
    title: 'Lead Artist',
    description: 'lorem ipsum',
    socials: [
      {
        type: INSTAGRAM,
        url: 'https://instagram.com/david_minkov',
      },
    ],
  },
]

const Team = forwardRef((props, ref) => {
  const clickSocial = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div ref={ref} id={TEAM} className={styles.root}>
      {team.map((obj) => (
        <div key={obj.name} className={styles.card}>
          <Avatar src={obj.profileSrc} className={styles.avatar} />

          <div>
            <h4>{obj.name}</h4>
            <h6>{obj.title}</h6>
            <p>{obj.description}</p>
          </div>

          <div className={styles.socials}>
            {obj.socials.map((socObj) => (
              <IconButton key={`${obj.name}-${socObj.type}`} onClick={() => clickSocial(socObj.url)}>
                {(() => {
                  switch (socObj.type) {
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
