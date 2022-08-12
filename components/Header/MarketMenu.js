import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import Split from './Split'
import BaseButton from '../BaseButton'

const MarketMenu = ({ btnStyle = {}, closeMenu = () => {} }) => {
  const router = useRouter()
  const { isMobile } = useScreenSize()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const clickFoxMarket = () => {
    router.push('/market/fox')

    setAnchorEl(null)
    closeMenu()
  }

  if (isMobile) {
    return (
      <Fragment>
        <Split />

        <BaseButton label='Fox Market' onClick={clickFoxMarket} transparent style={btnStyle} />
      </Fragment>
    )
  }

  return (
    <div>
      <BaseButton label='Markets' onClick={(e) => setAnchorEl(e.currentTarget)} transparent style={btnStyle} />

      <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <div>
          <MenuItem onClick={clickFoxMarket} sx={{ width: 200, height: 50 }}>
            Fox Market
          </MenuItem>
        </div>
      </Menu>
    </div>
  )
}

export default MarketMenu
