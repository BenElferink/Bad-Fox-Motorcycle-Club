import { useState } from 'react'
import { Avatar, IconButton } from '@mui/material'
import Twitter from '../../icons/Twitter'
import LinkedIn from '../../icons/LinkedIn'
import Instagram from '../../icons/Instagram'
import { INSTAGRAM, LINKEDIN, TWITTER } from '../../constants'
import styles from './Team.module.css'

export default function Card({ item }) {
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
      <Avatar src={item.profileSrc} className={styles.avatar} />

      <div>
        <h4>{item.name}</h4>
        <h6>{item.title}</h6>
        <p>{item.description}</p>
      </div>

      <div className={styles.socials}>
        {item.socials.map((social) => (
          <IconButton key={`${item.name}-${social.type}`} onClick={() => clickSocial(social.url)}>
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
