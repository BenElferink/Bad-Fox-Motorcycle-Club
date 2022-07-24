import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { Menu, MenuItem } from '@mui/material'
import BaseButton from '../BaseButton'
import Split from './Split'

const CatalogMenu = ({ btnStyle = {}, closeMenu = () => {}, setAlertMessage = () => {} }) => {
  const router = useRouter()
  const { isMobile } = useScreenSize()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const clickFoxCollection = () => {
    router.push('/catalog/collection/fox')

    setAnchorEl(null)
    closeMenu()
  }

  const clickFoxTraits = () => {
    router.push('/catalog/traits/fox')

    setAnchorEl(null)
    closeMenu()
  }

  if (isMobile) {
    return (
      <Fragment>
        <Split />

        <BaseButton label='Fox Collection' onClick={clickFoxCollection} style={btnStyle} />
        <BaseButton label='Fox Traits' onClick={clickFoxTraits} transparent />
      </Fragment>
    )
  }

  return (
    <div>
      <BaseButton label='Catalogs' onClick={(e) => setAnchorEl(e.currentTarget)} transparent style={btnStyle} />

      <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <div>
          <MenuItem onClick={clickFoxCollection} sx={{ width: 200, height: 50 }}>
            Fox Collection
          </MenuItem>
        </div>
        <div>
          <MenuItem onClick={clickFoxTraits} sx={{ width: 200, height: 50 }}>
            Fox Traits
          </MenuItem>
        </div>
      </Menu>
    </div>
  )
}

export default CatalogMenu
