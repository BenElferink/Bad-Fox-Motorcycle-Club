import Image from 'next/image'
import { useRef } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext.tsx'

function ProjectListItem({ name, image, onClick }) {
  const overlayRef = useRef(null)
  const { isMobile } = useScreenSize()

  const imageSize = isMobile ? 150 : 200

  const styles = {
    project: {
      margin: 5,
      position: 'relative',
      cursor: 'pointer',
    },
    projectImage: {
      borderRadius: '1rem',
    },
    projectOverlay: {
      width: imageSize,
      height: imageSize,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      color: 'var(--white)',
      borderRadius: '1rem',
      boxShadow: '0 -1.5rem 0.5rem 0 var(--brown) inset',
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'none',
    },
    projectName: {
      margin: 'calc(100% - 1.2rem) 0 0 0',
      fontSize: '0.8rem',
      textAlign: 'center',
    },
  }

  return (
    <div
      onClick={onClick}
      style={styles.project}
      onMouseEnter={() => (overlayRef.current.style.display = 'block')}
      onMouseLeave={() => (overlayRef.current.style.display = 'none')}
    >
      <Image src={image} alt={name} width={imageSize} height={imageSize} style={styles.projectImage} />
      <div ref={overlayRef} style={styles.projectOverlay}>
        <p style={styles.projectName}>{name}</p>
      </div>
    </div>
  )
}

export default ProjectListItem
