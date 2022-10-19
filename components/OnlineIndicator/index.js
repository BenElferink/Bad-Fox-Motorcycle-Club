import { styled } from '@mui/material/styles'
import { Badge, Avatar, Tooltip } from '@mui/material'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: 'black',
    color: 'black',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))

const OnlineBadge = styled(StyledBadge)(() => ({
  '& .MuiBadge-badge': {
    backgroundColor: 'var(--online)',
    color: 'var(--online)',
  },
}))

const OfflineBadge = styled(StyledBadge)(() => ({
  '& .MuiBadge-badge': {
    backgroundColor: 'var(--offline)',
    color: 'var(--offline)',
  },
}))

export default function OnlineIndicator({
  online = false,
  title = '',
  style = {},
  placement = 'top',
  children = <Avatar src='' alt='' />,
}) {
  return (
    <Tooltip title={title || (online ? 'online' : 'offline')} placement={placement} style={style}>
      {online ? (
        <OnlineBadge variant='dot' overlap='circular' anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
          {children}
        </OnlineBadge>
      ) : (
        <OfflineBadge variant='dot' overlap='circular' anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
          {children}
        </OfflineBadge>
      )}
    </Tooltip>
  )
}
