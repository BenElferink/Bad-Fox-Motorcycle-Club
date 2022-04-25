import { useScreenSize } from '../contexts/ScreenSizeContext'
import { Button } from '@mui/material'

function BaseButton({
  label = 'Button',
  onClick = () => console.log('click'),
  icon: Icon,
  selected = false,
  disabled = false,
  transparent = false,
  style = {},
}) {
  const { isMobile } = useScreenSize()

  return (
    <Button
      variant='contained'
      color='secondary'
      size={isMobile ? 'medium' : 'large'}
      fullWidth={isMobile}
      startIcon={Icon ? <Icon /> : null}
      onClick={onClick}
      style={{
        padding: '0.4rem 0.8rem',
        backgroundColor: selected ? 'var(--white)' : transparent ? 'transparent' : 'var(--black)',
        color: selected ? 'var(--black)' : 'var(--white)',
        boxShadow: transparent ? 'none' : '',
        ...style,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </Button>
  )
}

export default BaseButton
