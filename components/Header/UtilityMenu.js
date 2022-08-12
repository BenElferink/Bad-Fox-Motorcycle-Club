import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import toast from 'react-hot-toast'
import { Menu, MenuItem } from '@mui/material'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import Split from './Split'
import BaseButton from '../BaseButton'
import OnlineIndicator from '../OnlineIndicator'

const UtilityMenu = ({ btnStyle = {}, closeMenu = () => {} }) => {
  const router = useRouter()
  const { isMobile } = useScreenSize()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const clickRoyalties = () => {
    router.push('/utilities/royalties')

    setAnchorEl(null)
    closeMenu()
  }

  const clickClayTokens = () => {
    toast.error('This page is coming soon')
    // router.push('/utilities/clay-tokens')

    setAnchorEl(null)
    closeMenu()
  }

  const clickBurnEvent = () => {
    router.push('/utilities/burn-event')

    setAnchorEl(null)
    closeMenu()
  }

  if (isMobile) {
    return (
      <Fragment>
        <Split />

        <BaseButton label='80% Royalties' onClick={clickRoyalties} transparent style={jsStyles.btn} />
        <OnlineIndicator online={false}>
          <BaseButton label='$CLAY Tokens' onClick={clickClayTokens} transparent style={jsStyles.btn} />
        </OnlineIndicator>
        <BaseButton label='Burn Event (+Airdrops)' onClick={clickBurnEvent} transparent style={jsStyles.btn} />
      </Fragment>
    )
  }

  return (
    <div>
      <BaseButton label='Utilities' onClick={(e) => setAnchorEl(e.currentTarget)} transparent style={btnStyle} />

      <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <div>
          <MenuItem onClick={clickRoyalties} sx={{ width: 200, height: 50 }}>
            80% Royalties
          </MenuItem>
        </div>
        <div>
          <OnlineIndicator online={false}>
            <MenuItem onClick={clickClayTokens} sx={{ width: 200, height: 50 }}>
              $CLAY Tokens
            </MenuItem>
          </OnlineIndicator>
        </div>
        <div>
          <MenuItem onClick={clickBurnEvent} sx={{ width: 200, height: 50 }}>
            Burn Event (+Airdrops)
          </MenuItem>
        </div>
      </Menu>
    </div>
  )
}

export default UtilityMenu
