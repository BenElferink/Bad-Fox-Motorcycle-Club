import { forwardRef } from 'react'
import { Avatar, IconButton } from '@mui/material'
import Discord from '../../../icons/Discord'
import Twitter from '../../../icons/Twitter'
import LinkedIn from '../../../icons/LinkedIn'
import Instagram from '../../../icons/Instagram'
import { TEAM } from '../../../constants/scroll-nav'
import { GITHUB_MEDIA_URL } from '../../../constants/api-urls'
import { DISCORD, INSTAGRAM, LINKEDIN, TWITTER } from '../../../constants/socials'
import styles from './Team.module.css'

const Team = forwardRef((props, ref) => {
  const clickSocial = (url) => {
    window.open(url, '_blank')
  }

  return (
    <div ref={ref} id={TEAM} className={styles.root}>
      {[
        {
          name: 'Ben Elferink',
          title: 'Founder / Fullstack Developer',
          description:
            "I'm a Fullstack Developer with several years of experience, and have been involved in the cNFT space since mid-summer 2021. Aside from my personal portfolio, I have also helped build several communities at their early stages.",
          profilePicture: `${GITHUB_MEDIA_URL}/team/Ben.jpg`,
          socials: [
            {
              type: 'LINKEDIN',
              url: 'https://www.linkedin.com/in/ben-elferink-37ba251b9',
            },
            {
              type: 'TWITTER',
              url: 'https://twitter.com/BenElferink',
            },
            {
              type: 'DISCORD',
              url: 'https://discord.com/users/791763515554922507',
            },
          ],
        },
        {
          name: 'David Minkov',
          title: 'Co-Founder / Lead Artist',
          description:
            "I'm an artist from a very young age, and a graphic designer since 2020. I just dived into the cNFT space, and am very excited to work on Bad Fox MC!",
          profilePicture: `${GITHUB_MEDIA_URL}/team/David.jpg`,
          socials: [
            {
              type: 'LINKEDIN',
              url: 'https://www.linkedin.com/in/david-minkov-50187620a',
            },
            {
              type: 'INSTAGRAM',
              url: 'https://instagram.com/david_minkov',
            },
            {
              type: 'DISCORD',
              url: 'https://discord.com/users/958536998140907550',
            },
          ],
        },
        {
          name: 'Chris Mitrev',
          title: 'Artist',
          description:
            "I'm an aspiring artist, and was previously a stock/crypto trader. I helped form the team behind Bad Fox MC, and have invested in the tools required to produce our product.",
          profilePicture: `${GITHUB_MEDIA_URL}/team/Chris.jpg`,
          socials: [
            {
              type: 'INSTAGRAM',
              url: 'https://instagram.com/m__chris',
            },
            {
              type: 'TWITTER',
              url: 'https://twitter.com/ChrisMitrev',
            },
            {
              type: 'DISCORD',
              url: 'https://discord.com/users/906518144108101642',
            },
          ],
        },
        {
          name: 'Crib King (4042)',
          title: 'Community Manager',
          description:
            "I'm an artist by nature. I love to take this and that and combine them to make something even better. I've been in the crypto space since late 2020 and been in the CNFT space since inception. I know this is the place for me!",
          profilePicture: `${GITHUB_MEDIA_URL}/team/4042.png`,
          socials: [
            {
              type: 'TWITTER',
              url: 'https://twitter.com/CribKingCOM',
            },
            {
              type: 'DISCORD',
              url: 'https://discord.com/users/829116071663370250',
            },
          ],
        },
        {
          name: 'Uberman',
          title: 'Blockchain & Fullstack Developer',
          description:
            "I'm a programmer who has been minting NFT projects on cardano since September 2021. Over that time, I have been a part of many successful teams such as OGBears and Filthy Rich Horses. I love everyone who is part of the cardano community and now it feels like a small family to me.",
          profilePicture: `${GITHUB_MEDIA_URL}/team/Uberman.jpg`,
          socials: [
            {
              type: 'DISCORD',
              url: 'https://discord.com/users/458201578571038740',
            },
          ],
        },
      ].map(({ name, title, description, profilePicture, socials }) => (
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
