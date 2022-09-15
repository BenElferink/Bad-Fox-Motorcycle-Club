import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import Split from './Split'
import BaseButton from '../BaseButton'

const UtilitiesMenu = ({ btnStyle = {}, closeMenu = () => {} }) => {
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
    router.push('/utilities/clay-tokens')

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

        <BaseButton label='80% Royalties' onClick={clickRoyalties} transparent style={btnStyle} />
        <BaseButton label='$CLAY Tokens' onClick={clickClayTokens} transparent style={btnStyle} />
        <BaseButton label='Burn Event (+Airdrops)' onClick={clickBurnEvent} transparent style={btnStyle} />
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
          <MenuItem onClick={clickClayTokens} sx={{ width: 200, height: 50 }}>
            $CLAY Tokens
          </MenuItem>
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

export default UtilitiesMenu
