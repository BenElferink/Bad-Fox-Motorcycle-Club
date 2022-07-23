import { Fragment, useState } from 'react'
// import { useRouter } from 'next/router'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { Menu, MenuItem } from '@mui/material'
import BaseButton from '../BaseButton'
import Split from './Split'
import OnlineIndicator from '../OnlineIndicator'

const WalletMenu = ({ btnStyle = {}, closeMenu = () => {}, setAlertMessage = () => {} }) => {
  // const router = useRouter()
  const { isMobile } = useScreenSize()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const clickMyAssets = () => {
    // router.push('/wallet/assets')
    setAlertMessage('This feature is coming soon')

    setAnchorEl(null)
    closeMenu()
  }

  const clickMyTraits = () => {
    // router.push('/wallet/traits')
    setAlertMessage('This feature is coming soon')

    setAnchorEl(null)
    closeMenu()
  }

  const clickMyPortfolio = () => {
    // router.push('/wallet/portfolio')
    setAlertMessage('This feature is coming soon')

    setAnchorEl(null)
    closeMenu()
  }

  if (isMobile) {
    return (
      <Fragment>
        <Split />

        <OnlineIndicator online={false}>
          <BaseButton label='My Assets' onClick={clickMyAssets} transparent style={btnStyle} />
        </OnlineIndicator>
        <OnlineIndicator online={false}>
          <BaseButton label='My Traits' onClick={clickMyTraits} transparent style={btnStyle} />
        </OnlineIndicator>
        <OnlineIndicator online={false}>
          <BaseButton label='My Portfolio' onClick={clickMyPortfolio} transparent style={btnStyle} />
        </OnlineIndicator>
      </Fragment>
    )
  }

  return (
    <div>
      <BaseButton label='Wallet' onClick={(e) => setAnchorEl(e.currentTarget)} transparent style={btnStyle} />

      <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <div>
          <OnlineIndicator online={false}>
            <MenuItem onClick={clickMyAssets} sx={{ width: 200, height: 50 }}>
              My Assets
            </MenuItem>
          </OnlineIndicator>
        </div>
        <div>
          <OnlineIndicator online={false}>
            <MenuItem onClick={clickMyTraits} sx={{ width: 200, height: 50 }}>
              My Traits
            </MenuItem>
          </OnlineIndicator>
        </div>
        <div>
          <OnlineIndicator online={false}>
            <MenuItem onClick={clickMyPortfolio} sx={{ width: 200, height: 50 }}>
              My Portfolio
            </MenuItem>
          </OnlineIndicator>
        </div>
      </Menu>
    </div>
  )
}

export default WalletMenu
