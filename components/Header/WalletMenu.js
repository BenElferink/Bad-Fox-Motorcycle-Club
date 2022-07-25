import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import toast from 'react-hot-toast'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { Menu, MenuItem } from '@mui/material'
import Split from './Split'
import BaseButton from '../BaseButton'
import OnlineIndicator from '../OnlineIndicator'

const WalletMenu = ({ btnStyle = {}, closeMenu = () => {} }) => {
  const router = useRouter()
  const { isMobile } = useScreenSize()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const clickManageWallets = () => {
    router.push('/wallet/manage')

    setAnchorEl(null)
    closeMenu()
  }

  const clickMyAssets = () => {
    router.push('/wallet/assets')

    setAnchorEl(null)
    closeMenu()
  }

  const clickMyTraits = () => {
    router.push('/wallet/traits')

    setAnchorEl(null)
    closeMenu()
  }

  const clickMyPortfolio = () => {
    // router.push('/wallet/portfolio')
    toast.error('This feature is coming soon')

    setAnchorEl(null)
    closeMenu()
  }

  if (isMobile) {
    return (
      <Fragment>
        <Split />

        <BaseButton label='Manage Wallets' onClick={clickManageWallets} transparent style={btnStyle} />
        <BaseButton label='My Assets' onClick={clickMyAssets} transparent style={btnStyle} />
        <BaseButton label='My Traits' onClick={clickMyTraits} transparent style={btnStyle} />
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
          <MenuItem onClick={clickManageWallets} sx={{ width: 200, height: 50 }}>
            Manage Wallets
          </MenuItem>
        </div>
        <div>
          <MenuItem onClick={clickMyAssets} sx={{ width: 200, height: 50 }}>
            My Assets
          </MenuItem>
        </div>
        <div>
          <MenuItem onClick={clickMyTraits} sx={{ width: 200, height: 50 }}>
            My Traits
          </MenuItem>
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
