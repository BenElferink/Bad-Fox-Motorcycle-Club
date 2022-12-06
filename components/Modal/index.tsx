import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { Modal as MuiModal, IconButton, Typography, Fade } from '@mui/material'
import { CloseRounded } from '@mui/icons-material'

function Modal({
  open = false,
  onClose,
  title,
  style = {},
  children,
  onlyChildren,
}: {
  open: boolean
  onClose?: () => void
  title?: string
  style?: React.CSSProperties
  onlyChildren?: boolean
  children: JSX.Element
}) {
  const { isMobile } = useScreenSize()

  if (onlyChildren) {
    return children
  }

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      sx={{ display: 'grid', placeItems: 'center', backdropFilter: 'blur(1rem)' }}
    >
      <Fade in={open}>
        <div
          className='scroll'
          style={{
            cursor: 'unset',
            maxWidth: '100vw',
            minWidth: isMobile ? '100vw' : '420px',
            width: isMobile ? '100%' : 'fit-content',
            minHeight: isMobile ? '100vh' : 'fit-content',
            maxHeight: isMobile ? '100vh' : '90vh',
            padding: '1rem',
            borderRadius: isMobile ? '0' : '1rem',
            backgroundColor: 'var(--charcoal)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            ...style,
          }}
        >
          {onClose ? (
            <IconButton
              sx={{ margin: '0.5rem', position: 'absolute', top: '0', right: '0', zIndex: '9' }}
              onClick={onClose}
            >
              <CloseRounded color='error' />
            </IconButton>
          ) : null}
          {title && <Typography variant='h5'>{title}</Typography>}
          {children}
        </div>
      </Fade>
    </MuiModal>
  )
}

export default Modal
