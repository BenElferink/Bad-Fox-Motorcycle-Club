import { Fragment } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { IconButton } from '@mui/material'
import Twitter from '../../icons/Twitter'
import Discord from '../../icons/Discord'
import Split from './Split'

const Socials = ({ closeMenu }) => {
  const { isMobile } = useScreenSize()

  const clickTwitter = () => {
    window.open('https://twitter.com/BadFoxMC', '_blank')
    closeMenu()
  }

  const clickDiscord = () => {
    window.open('https://discord.gg/badfoxmc', '_blank')
    closeMenu()
  }

  return (
    <Fragment>
      {isMobile ? <Split /> : null}

      <div className='flex-row'>
        <IconButton onClick={clickTwitter}>
          <Twitter size={26} fill='var(--white)' />
        </IconButton>
        <IconButton onClick={clickDiscord}>
          <Discord size={26} fill='var(--white)' />
        </IconButton>
      </div>
    </Fragment>
  )
}

export default Socials
