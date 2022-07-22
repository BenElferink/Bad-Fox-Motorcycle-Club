import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { useMint } from '../../contexts/MintContext'
import { Alert, AlertTitle, AppBar, Avatar, IconButton, Menu, MenuItem, Slide } from '@mui/material'
import { MenuRounded } from '@mui/icons-material'
import Modal from '../Modal'
import BaseButton from '../BaseButton'
import OnlineIndicator from '../OnlineIndicator'
import Twitter from '../../icons/Twitter'
import Discord from '../../icons/Discord'
import { HOME, MAP, TEAM } from '../../constants/scroll-nav'
import styles from './Header.module.css'

export default function Header({ scrollTo = () => null }) {
  const { isMobile } = useScreenSize()
  const { isRegisterOnline } = useMint()

  const router = useRouter()
  const isHome = router.asPath === '/'

  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  useEffect(() => {
    if (isMobile) {
      setOpenMobileMenu(false)
    }
  }, [isMobile])

  useEffect(() => {
    if (alertMessage) {
      setTimeout(() => {
        setAlertMessage('')
      }, 5000)
    }
  }, [alertMessage])

  const clickHome = () => {
    if (isHome) {
      scrollTo(HOME)
    } else {
      router.push('/')
    }
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

  const clickTraits = () => {
    router.push('/traits')
    setOpenMobileMenu(false)
  }

  const clickMarket = () => {
    router.push('/market')
    setOpenMobileMenu(false)
  }

  const clickRegisterWallet = () => {
    if (isRegisterOnline) {
      router.push('/wallet/register')
    } else {
      setAlertMessage('Wallet registration is currently closed')
    }
    setOpenMobileMenu(false)
  }

  const clickCheckWallet = () => {
    router.push('/wallet/check')
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

  const jsStyles = {
    nav: {
      width: isMobile ? '100%' : 'unset',
      height: isMobile ? '100vh' : '100%',
      justifyContent: 'center',
    },
    burger: {
      color: 'var(--white)',
      fontSize: '2rem',
    },
    btn: {
      width: 'fit-content',
      margin: isMobile ? '0.5rem' : 'unset',
    },
    alert: {
      width: 'fit-content',
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      zIndex: '999',
    },
  }

  const WalletMenu = () => {
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)

    if (isMobile) {
      return (
        <Fragment>
          <OnlineIndicator online={isRegisterOnline}>
            <BaseButton label='Register' onClick={clickRegisterWallet} transparent />
          </OnlineIndicator>
          <BaseButton label='Check' onClick={clickCheckWallet} style={jsStyles.btn} />
        </Fragment>
      )
    }

    return (
      <div>
        <BaseButton
          label='Wallet'
          onClick={(e) => setAnchorEl(e.currentTarget)}
          transparent
          style={jsStyles.btn}
        />

        <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
          <OnlineIndicator online={isRegisterOnline}>
            <MenuItem onClick={clickRegisterWallet}>Register</MenuItem>
          </OnlineIndicator>
          <MenuItem onClick={clickCheckWallet}>Check</MenuItem>
        </Menu>
      </div>
    )
  }

  const Socials = () => (
    <div className='flex-row'>
      <IconButton onClick={clickTwitter}>
        <Twitter size={26} fill='var(--white)' />
      </IconButton>
      <IconButton onClick={clickDiscord}>
        <Discord size={26} fill='var(--white)' />
      </IconButton>
    </div>
  )

  return (
    <AppBar className={styles.root} position='sticky'>
      <div className='flex-row'>
        <IconButton onClick={clickHome}>
          <Avatar
            alt=''
            src='/images/logo/white_alpha.png'
            sx={{ width: isMobile ? 55 : 69, height: isMobile ? 55 : 69, margin: '1rem 1rem 1rem 0.5rem' }}
          />
        </IconButton>
        <h1 style={{ fontSize: isMobile ? '1rem' : 'unset' }}>Bad Fox Motorcycle Club</h1>
      </div>

      <Slide direction='up' in={Boolean(alertMessage)} mountOnEnter unmountOnExit>
        <Alert severity='info' style={jsStyles.alert}>
          <AlertTitle>Woopsies!</AlertTitle>
          {alertMessage}
        </Alert>
      </Slide>

      {isMobile && !openMobileMenu ? (
        <IconButton onClick={() => setOpenMobileMenu(true)}>
          <MenuRounded style={jsStyles.burger} />
        </IconButton>
      ) : null}

      <Modal
        title=''
        onlyChildren={!isMobile}
        open={!isMobile || openMobileMenu}
        onClose={() => setOpenMobileMenu(false)}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      >
        <nav className={isMobile ? 'flex-col' : 'flex-row'} style={jsStyles.nav}>
          <BaseButton label='Home' onClick={clickHome} transparent style={jsStyles.btn} />

          {isHome ? <BaseButton label='Roadmap' onClick={clickRoadmap} transparent style={jsStyles.btn} /> : null}
          {isHome ? <BaseButton label='Team' onClick={clickTeam} transparent style={jsStyles.btn} /> : null}

          <BaseButton label='Market' onClick={clickMarket} transparent style={jsStyles.btn} />
          <BaseButton label='Traits' onClick={clickTraits} transparent style={jsStyles.btn} />

          {/* <WalletMenu /> */}
          <Socials />
        </nav>
      </Modal>
    </AppBar>
  )
}
