import { forwardRef } from 'react'
import { Avatar, IconButton } from '@mui/material'
import Twitter from '../../icons/Twitter'
import LinkedIn from '../../icons/LinkedIn'
import Instagram from '../../icons/Instagram'
import { INSTAGRAM, LINKEDIN, TEAM, TWITTER } from '../../constants'
import styles from './Team.module.css'

const team = [
  {
    profileSrc: '/images/team/ben.jpeg',
    name: 'Ben Elferink',
    title: 'Lead Developer / Community Manager',
    description:
      "I'm a Fullstack Developer with 3 years of experience, and have been involved in the CNFT space for almost a year now. I'm have helped build several communities at their early stages.",
    socials: [
      {
        type: LINKEDIN,
        url: 'https://www.linkedin.com/in/ben-elferink-37ba251b9',
      },
      {
        type: TWITTER,
        url: 'https://twitter.com/BenElferink',
      },
    ],
  },
  {
    profileSrc: '/images/team/david.jpg',
    name: 'David Minkov',
    title: 'Lead Artist',
    description:
      'I have 2 years of experience in graphic design, and am an artist from a very young age. I just dived into the CNFT space, and am very excited to work on Bad Fox MC!',
    socials: [
      {
        type: LINKEDIN,
        url: 'https://www.linkedin.com/in/david-minkov-50187620a',
      },
      {
        type: INSTAGRAM,
        url: 'https://instagram.com/david_minkov',
      },
    ],
  },
  {
    profileSrc: '/images/team/chris.jpg',
    name: 'Christian Mitrev',
    title: 'Head Founder / Artist / Financier',
    description:
      "I'm an artist with 2 years of experience, and am a stock/crypto trader with 3 years of experience. I formed the team and initial idea behind Bad Fox MC!",
    socials: [
      // https://www.facebook.com/chris.mitrav
      {
        type: INSTAGRAM,
        url: 'https://instagram.com/m__chris',
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
