import { useScreenSize } from '../../contexts/ScreenSizeContext.tsx'
import { Button } from '@mui/material'
import { useRef } from 'react'

function BaseButton({
  label = 'Button',
  type = 'button',
  onClick = (e) => console.log('click', e),
  imageIcon = '',
  icon: Icon = () => <div />,
  selected = false,
  disabled = false,
  transparent = false,
  style = {},
  className = '',
  backgroundColor = '',
  hoverColor = '',
  color = '',
  size = '',
  fullWidth = false,
}) {
  const ref = useRef(null)
  const { isMobile } = useScreenSize()

  return (
    <Button
      ref={ref}
      type={type}
      variant='contained'
      color='secondary'
      size={size ?? (isMobile ? 'medium' : 'large')}
      fullWidth={fullWidth || isMobile}
      startIcon={imageIcon ? <img src={imageIcon} alt='' width='42' height='42' /> : Icon ? <Icon /> : null}
      onClick={(e) => (disabled ? null : onClick(e))}
      className={className}
      style={{
        margin: '0.1rem',
        padding: '0.4rem 0.8rem',
        backgroundColor:
          backgroundColor || (selected ? 'var(--white)' : transparent ? 'transparent' : 'var(--black)'),
        color: color || (selected ? 'var(--black)' : 'var(--white)'),
        boxShadow: transparent ? 'none' : '',
        ...style,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      onMouseEnter={() => {
        if (hoverColor) {
          ref.current.style.backgroundColor = hoverColor
        }
      }}
      onMouseLeave={() => {
        ref.current.style.backgroundColor =
          backgroundColor || (selected ? 'var(--white)' : transparent ? 'transparent' : 'var(--black)')
      }}
    >
      {label}
    </Button>
  )
}

export default BaseButton
