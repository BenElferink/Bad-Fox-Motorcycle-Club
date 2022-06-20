import { useScreenSize } from '../contexts/ScreenSizeContext'
import { Modal as MuiModal, IconButton, Typography, Fade } from '@mui/material'
import { CloseRounded } from '@mui/icons-material'

function Modal({ open, onClose, style = {}, title = 'Title', children, onlyChildren }) {
  const { isMobile } = useScreenSize()

  if (onlyChildren) {
    return children
  }

  return (
    <MuiModal open={open} onClose={onClose} sx={{ display: 'grid', placeItems: 'center' }}>
      <Fade in={open}>
        <div
          className='scroll'
          style={{
            cursor: 'unset',
            maxWidth: '100vw',
            minWidth: isMobile ? '100vw' : '420px',
            width: isMobile ? '100%' : 'fit-content',
            minHeight: isMobile ? '100vh' : '420px',
            maxHeight: isMobile ? '100vh' : '90vh',
            padding: '1rem',
            borderRadius: isMobile ? '0' : '1rem',
            backgroundColor: 'var(--black)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            ...style,
          }}
        >
          <IconButton sx={{ margin: '0.5rem', position: 'absolute', top: '0', right: '0', zIndex: '9' }} onClick={onClose}>
            <CloseRounded color='error' />
          </IconButton>
          {title && <Typography variant='h5'>{title}</Typography>}
          {children}
        </div>
      </Fade>
    </MuiModal>
  )
}

export default Modal
