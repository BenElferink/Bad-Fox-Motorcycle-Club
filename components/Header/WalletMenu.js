import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { useMint } from '../../contexts/MintContext'
import { Menu, MenuItem } from '@mui/material'
import BaseButton from '../BaseButton'
import OnlineIndicator from '../OnlineIndicator'
import Split from './Split'

const WalletMenu = ({ btnStyle = {}, closeMenu = () => {}, setAlertMessage = () => {} }) => {
  const router = useRouter()
  const { isMobile } = useScreenSize()
  const { isRegisterOnline } = useMint()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const clickRegisterWallet = () => {
    if (isRegisterOnline) {
      router.push('/wallet/register')
    } else {
      setAlertMessage('Wallet registration is currently closed')
    }

    setAnchorEl(null)
    closeMenu()
  }

  const clickCheckWallet = () => {
    router.push('/wallet/check')

    setAnchorEl(null)
    closeMenu()
  }

  if (isMobile) {
    return (
      <Fragment>
        <Split />

        <OnlineIndicator online={isRegisterOnline}>
          <BaseButton label='Register Wallet' onClick={clickRegisterWallet} transparent />
        </OnlineIndicator>
        <BaseButton label='Check Wallet' onClick={clickCheckWallet} style={btnStyle} />
      </Fragment>
    )
  }

  return (
    <div>
      <BaseButton label='Wallet' onClick={(e) => setAnchorEl(e.currentTarget)} transparent style={btnStyle} />

      <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <OnlineIndicator online={isRegisterOnline}>
          <MenuItem onClick={clickRegisterWallet}>Register Wallet</MenuItem>
        </OnlineIndicator>
        <MenuItem onClick={clickCheckWallet}>Check Wallet</MenuItem>
      </Menu>
    </div>
  )
}

export default WalletMenu
