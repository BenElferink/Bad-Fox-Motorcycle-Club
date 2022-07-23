import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { useMint } from '../../contexts/MintContext'
import { Menu, MenuItem } from '@mui/material'
import BaseButton from '../BaseButton'
import OnlineIndicator from '../OnlineIndicator'
import Split from './Split'

const MintMenu = ({ btnStyle = {}, closeMenu = () => {}, setAlertMessage = () => {} }) => {
  const router = useRouter()
  const { isMobile } = useScreenSize()
  const { isRegisterOnline, isPreSaleOnline, isPublicSaleOnline } = useMint()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const clickCheckWallet = () => {
    router.push('/mint/check-wallet')

    setAnchorEl(null)
    closeMenu()
  }

  const clickRegisterWallet = () => {
    if (isRegisterOnline) {
      router.push('/mint/register-wallet')
    } else {
      setAlertMessage('Wallet registration is currently closed')
    }

    setAnchorEl(null)
    closeMenu()
  }

  const clickMint = () => {
    if (isPreSaleOnline || isPublicSaleOnline) {
      router.push('/mint')
    } else {
      setAlertMessage('Mint is offline')
    }

    setAnchorEl(null)
    closeMenu()
  }

  if (isMobile) {
    return (
      <Fragment>
        <Split />

        <BaseButton label='Check Wallet' onClick={clickCheckWallet} style={btnStyle} />
        <OnlineIndicator online={isRegisterOnline}>
          <BaseButton label='Register Wallet' onClick={clickRegisterWallet} transparent />
        </OnlineIndicator>
        <OnlineIndicator online={isPreSaleOnline || isPublicSaleOnline}>
          <BaseButton label='Mint' onClick={clickMint} transparent />
        </OnlineIndicator>
      </Fragment>
    )
  }

  return (
    <div>
      <BaseButton label='Mint' onClick={(e) => setAnchorEl(e.currentTarget)} transparent style={btnStyle} />

      <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <div>
          <MenuItem onClick={clickCheckWallet} sx={{ width: 200, height: 50 }}>
            Check Wallet
          </MenuItem>
        </div>
        <div>
          <OnlineIndicator online={isRegisterOnline}>
            <MenuItem onClick={clickRegisterWallet} sx={{ width: 200, height: 50 }}>
              Register Wallet
            </MenuItem>
          </OnlineIndicator>
        </div>
        <div>
          <OnlineIndicator online={isPreSaleOnline || isPublicSaleOnline}>
            <MenuItem onClick={clickMint} sx={{ width: 200, height: 50 }}>
              Mint
            </MenuItem>
          </OnlineIndicator>
        </div>
      </Menu>
    </div>
  )
}

export default MintMenu
