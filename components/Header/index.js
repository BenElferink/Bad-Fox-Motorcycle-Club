import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { useMint } from '../../contexts/MintContext'
import { AppBar, Avatar, IconButton } from '@mui/material'
import { MenuRounded } from '@mui/icons-material'
import Modal from '../Modal'
import BaseButton from '../BaseButton'
import ConnectWallet from '../ConnectWallet'
import OnlineIndicator from '../OnlineIndicator'
import Socials from './Socials'
import { HOME, UTILITIES, TEAM } from '../../constants/scroll-nav'
import { GITHUB_MEDIA_URL } from '../../constants/api-urls'
import styles from './Header.module.css'

export default function Header({ scrollTo = () => null }) {
  const { isMobile } = useScreenSize()
  const { isPreSaleOnline, isPublicSaleOnline } = useMint()

  const router = useRouter()
  const isHome = router.route === '/'

  const [openMobileMenu, setOpenMobileMenu] = useState(false)

  useEffect(() => {
    if (isMobile) {
      setOpenMobileMenu(false)
    }
  }, [isMobile])

  const closeMenu = () => setOpenMobileMenu(false)

  const clickHome = () => {
    if (isHome) {
      scrollTo(HOME)
    } else {
      router.push('/')
    }
    setOpenMobileMenu(false)
  }

  const clickUtilities = () => {
    scrollTo(UTILITIES)
    setOpenMobileMenu(false)
  }

  const clickTeam = () => {
    scrollTo(TEAM)
    setOpenMobileMenu(false)
  }

  const clickCatalogs = () => {
    router.push('/catalogs')
  }

  const clickMint = () => {
    if (isPreSaleOnline || isPublicSaleOnline) {
      router.push('/mint')
    } else {
      toast.error('Currently offline')
    }
  }

  useEffect(() => {
    if (isHome) {
      setTimeout(() => {
        switch (router.query.scrollTo) {
          case 'team':
            scrollTo(TEAM)
            break

          default:
            break
        }
      }, 100)
    }
  }, [isHome, router.query])

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

  return (
    <AppBar className={styles.root} position='sticky'>
      <div className='flex-row'>
        <IconButton onClick={clickHome} sx={{ margin: '1rem 1rem 1rem 0.5rem' }}>
          <Avatar
            alt=''
            src={`${GITHUB_MEDIA_URL}/logo/white_alpha.png`}
            sx={{ width: isMobile ? 55 : 69, height: isMobile ? 55 : 69 }}
          />
        </IconButton>
        <h1 style={{ fontSize: isMobile ? '1rem' : 'unset' }}>Bad Fox Motorcycle Club</h1>
      </div>

      {isMobile && !openMobileMenu ? (
        <IconButton onClick={() => setOpenMobileMenu(true)}>
          <MenuRounded style={jsStyles.burger} />
        </IconButton>
      ) : null}

      <Modal
        title=''
        onlyChildren={!isMobile}
        open={!isMobile || openMobileMenu}
        onClose={closeMenu}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
      >
        <nav className={isMobile ? 'flex-col' : 'flex-row'} style={jsStyles.nav}>
          <BaseButton label='Home' onClick={clickHome} transparent style={jsStyles.btn} />

          {isHome ? (
            <BaseButton label='Utilities' onClick={clickUtilities} transparent style={jsStyles.btn} />
          ) : null}
          {isHome ? <BaseButton label='Team' onClick={clickTeam} transparent style={jsStyles.btn} /> : null}

          <BaseButton label='Catalogs' onClick={clickCatalogs} transparent style={jsStyles.btn} />

          <OnlineIndicator online={isPreSaleOnline || isPublicSaleOnline}>
            <BaseButton label='Mint' onClick={clickMint} transparent style={jsStyles.btn} />
          </OnlineIndicator>

          {router.route !== '/mint' ? <ConnectWallet redirectOnSuccess /> : null}
          <Socials closeMenu={closeMenu} />
        </nav>
      </Modal>
    </AppBar>
  )
}
