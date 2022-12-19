import useScreenSize from '../../hooks/useScreenSize'

const MediaWrapper = ({ children, size = 100, isLeft = false, posTop = '0px' }) => {
  const { isMobile } = useScreenSize()

  return (
    <div
      style={
        isMobile
          ? { width: 'fit-content', margin: '0 auto' }
          : {
              width: size,
              position: 'absolute',
              top: posTop,
              right: isLeft ? (-420 - size) / 2 : 'unset',
              left: isLeft ? 'unset' : (-420 - size) / 2,
              zIndex: 1,
            }
      }
    >
      {children}
    </div>
  )
}

export default MediaWrapper
