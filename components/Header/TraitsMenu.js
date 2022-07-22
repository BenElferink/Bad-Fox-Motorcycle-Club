import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { Menu, MenuItem } from '@mui/material'
import BaseButton from '../BaseButton'
import Split from './Split'
import OnlineIndicator from '../OnlineIndicator'

const TraitsMenu = ({ btnStyle = {}, closeMenu = () => {}, setAlertMessage = () => {} }) => {
  const router = useRouter()
  const { isMobile } = useScreenSize()

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const clickTraitsCatalog = () => {
    router.push('/traits/catalog')

    setAnchorEl(null)
    closeMenu()
  }

  const clickMyTraits = () => {
    // router.push('/traits/wallet')
    setAlertMessage('This feature is coming soon')

    setAnchorEl(null)
    closeMenu()
  }

  if (isMobile) {
    return (
      <Fragment>
        <Split />

        <BaseButton label='Traits Catalog' onClick={clickTraitsCatalog} transparent />
        <OnlineIndicator online={false}>
          <BaseButton label='My Traits' onClick={clickMyTraits} style={btnStyle} />
        </OnlineIndicator>
      </Fragment>
    )
  }

  return (
    <div>
      <BaseButton label='Traits' onClick={(e) => setAnchorEl(e.currentTarget)} transparent style={btnStyle} />

      <Menu open={open} onClose={() => setAnchorEl(null)} anchorEl={anchorEl}>
        <MenuItem onClick={clickTraitsCatalog}>Traits Catalog</MenuItem>
        <OnlineIndicator online={false}>
          <MenuItem onClick={clickMyTraits}>My Traits</MenuItem>
        </OnlineIndicator>
      </Menu>
    </div>
  )
}

export default TraitsMenu
