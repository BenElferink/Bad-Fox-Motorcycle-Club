import { useEffect, useState } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { Alert, AlertTitle, AppBar, Avatar, IconButton, Slide } from '@mui/material'
import { MenuRounded } from '@mui/icons-material'
import Modal from '../Modal'
import BaseButton from '../BaseButton'
import OnlineIndicator from '../OnlineIndicator'
import Twitter from '../../icons/Twitter'
import Discord from '../../icons/Discord'
import { HOME, MAP, SNEAK, TEAM } from '../../constants/scroll-nav'
import styles from './Header.module.css'

const mintOnline = false

export default function Header({ scrollTo }) {
  const { isMobile } = useScreenSize()
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const [showMintAlert, setShowMintAlert] = useState(false)

  useEffect(() => {
    if (isMobile) {
      setOpenMobileMenu(false)
    }
  }, [isMobile])

  useEffect(() => {
    if (showMintAlert) {
      setTimeout(() => {
        setShowMintAlert(false)
      }, 4000)
    }
  }, [showMintAlert])

  const clickMint = () => {
    if (mintOnline) {
      // TODO: add mint
    } else {
      setShowMintAlert(true)
      setOpenMobileMenu(false)
    }
  }

  const clickHome = () => {
    scrollTo(HOME)
    setOpenMobileMenu(false)
  }
  const clickSneaks = () => {
    scrollTo(SNEAK)
    setOpenMobileMenu(false)
  }
  const clickRoadmap = () => {
    scrollTo(MAP)
    setOpenMobileMenu(false)
  }
  const clickTeam = () => {
    scrollTo(TEAM)
    setOpenMobileMenu(false)
  }

  const clickTwitter = () => {
    window.open('https://twitter.com/BadFoxMC', '_blank')
    setOpenMobileMenu(false)
  }
  const clickDiscord = () => {
    window.open('https://discord.gg/badfoxmc', '_blank')
    setOpenMobileMenu(false)
  }

  const navStyle = { width: isMobile ? '100%' : 'unset', height: isMobile ? '100vh' : '100%', justifyContent: 'center' }
  const burgerStyle = { color: 'var(--white)', fontSize: '2rem' }
  const btnStyle = { width: 'fit-content', margin: isMobile ? '0.5rem' : 'unset' }
  const alertStyle = { width: 'fit-content', position: 'absolute', top: '1rem', right: '1rem', zIndex: '999' }

  return (
    <AppBar className={styles.root} position='sticky'>
      <div className='flex-row'>
        <IconButton onClick={clickHome}>
          <Avatar alt='' src='/images/logo/white_alpha.png' sx={{ width: isMobile ? 55 : 69, height: isMobile ? 55 : 69, margin: '1rem 1rem 1rem 0.5rem' }} />
        </IconButton>
        <h1 style={{ fontSize: isMobile ? '1rem' : 'unset' }}>Bad Fox Motorcycle Club</h1>
      </div>

      <Slide direction='up' in={showMintAlert} mountOnEnter unmountOnExit>
        <Alert severity='info' style={alertStyle}>
          <AlertTitle>Mint is offline</AlertTitle>
          See the roadmap for an estimated mint date
        </Alert>
      </Slide>

      {isMobile && !openMobileMenu ? (
        <IconButton onClick={() => setOpenMobileMenu(true)}>
          <MenuRounded style={burgerStyle} />
        </IconButton>
      ) : null}

      <Modal
        title=''
        hideElement={!isMobile}
        open={!isMobile || openMobileMenu}
        onClose={() => setOpenMobileMenu(false)}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <nav className={isMobile ? 'flex-col' : 'flex-row'} style={navStyle}>
          <OnlineIndicator online={mintOnline}>
            <BaseButton label='Mint' onClick={clickMint} transparent disabled={!mintOnline} style={btnStyle} />
          </OnlineIndicator>

          <BaseButton label='Home' onClick={clickHome} transparent style={btnStyle} />
          <BaseButton label='Sneaks' onClick={clickSneaks} transparent style={btnStyle} />
          <BaseButton label='Roadmap' onClick={clickRoadmap} transparent style={btnStyle} />
          <BaseButton label='Team' onClick={clickTeam} transparent style={btnStyle} />

          <div className='flex-row'>
            <IconButton onClick={clickTwitter}>
              <Twitter size={26} fill='var(--white)' />
            </IconButton>
            <IconButton onClick={clickDiscord}>
              <Discord size={26} fill='var(--white)' />
            </IconButton>
          </div>
        </nav>
      </Modal>
    </AppBar>
  )
}
