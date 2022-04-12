import { useState } from 'react'
import { Avatar, IconButton } from '@mui/material'
import Twitter from '../../icons/Twitter'
import LinkedIn from '../../icons/LinkedIn'
import Instagram from '../../icons/Instagram'
import { INSTAGRAM, LINKEDIN, TWITTER } from '../../constants'
import styles from './Team.module.css'

export default function Card({ profileSrc, name, title, description, socials = [] }) {
  const [deg, setDeg] = useState(0)

  const doFlip = () => {
    setDeg(180)
    setTimeout(() => {
      setDeg(0)
    }, 300)
  }

  const clickSocial = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div className={styles.card} style={{ transform: `rotateY(${deg}deg)` }} onMouseEnter={doFlip}>
      <Avatar src={profileSrc} className={styles.avatar} />

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
  )
}
