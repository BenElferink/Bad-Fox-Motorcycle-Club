import { Fragment, useState } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { Menu, MenuItem, Typography } from '@mui/material'
import Split from './Split'
import BaseButton from '../BaseButton'

const ToolsMenu = ({ btnStyle = {}, closeMenu = () => {} }) => {
  const { isMobile } = useScreenSize()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const clickBadDrop = () => {
    window.open('https://drop.badfoxmc.com', '_blank')

    setAnchorEl(null)
    closeMenu()
  }

  if (isMobile) {
    return (
      <Fragment>
        <Split />
        <Typography variant='h6'>Tools</Typography>

        <BaseButton label='Bad Drop' onClick={clickBadDrop} transparent style={btnStyle} />
      </Fragment>
    )
  }

  return (
    <div>
      <BaseButton label='Tools' onClick={(e) => setAnchorEl(e.currentTarget)} transparent style={btnStyle} />

      <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <div>
          <MenuItem onClick={clickBadDrop} sx={{ width: 200, height: 50 }}>
            Bad Drop
          </MenuItem>
        </div>
      </Menu>
    </div>
  )
}

export default ToolsMenu
