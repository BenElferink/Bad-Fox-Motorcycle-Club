import { useRouter } from 'next/router'
import { Fragment, useState } from 'react'
import { Menu, MenuItem } from '@mui/material'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import Split from './Split'
import BaseButton from '../BaseButton'
import { BAD_FOX_POLICY_ID } from '../../constants/policy-ids'

const CollectionsMenu = ({ btnStyle = {}, closeMenu = () => {} }) => {
  const router = useRouter()
  const { isMobile } = useScreenSize()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const clickBadFox = () => {
    router.push(`/collections/${BAD_FOX_POLICY_ID}`)

    setAnchorEl(null)
    closeMenu()
  }

  // const clickBadMotorcycle = () => {
  //   router.push(`/collection/${BAD_MOTORCYCLE_POLICY_ID}`)

  //   setAnchorEl(null)
  //   closeMenu()
  // }

  if (isMobile) {
    return (
      <Fragment>
        <Split />

        <BaseButton label='Bad Fox' onClick={clickBadFox} transparent style={btnStyle} />
        {/* <BaseButton label='Bad Motorcycle' onClick={clickBadMotorcycle} transparent style={btnStyle} /> */}
      </Fragment>
    )
  }

  return (
    <div>
      <BaseButton label='Collections' onClick={(e) => setAnchorEl(e.currentTarget)} transparent style={btnStyle} />

      <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <div>
          <MenuItem onClick={clickBadFox} sx={{ width: 200, height: 50 }}>
            Bad Fox
          </MenuItem>
        </div>
        {/* <div>
          <MenuItem onClick={clickBadMotorcycle} sx={{ width: 200, height: 50 }}>
            Bad Motorcycle
          </MenuItem>
        </div> */}
      </Menu>
    </div>
  )
}

export default CollectionsMenu
