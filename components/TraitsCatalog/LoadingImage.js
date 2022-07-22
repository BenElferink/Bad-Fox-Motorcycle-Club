import Image from 'next/image'
import { useState } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import Loader from '../Loader'
import styles from './TraitsCatalog.module.css'

const LoadingImage = ({ src, alt }) => {
  const { isMobile } = useScreenSize()
  const [loading, setLoading] = useState(true)

  return (
    <div className={styles.traitCardImageWrapper}>
      <Image
        className={styles.traitCardImage}
        src={src}
        alt={alt}
        width={isMobile ? 250 : 300}
        height={isMobile ? 250 : 300}
        onLoadingComplete={() => setLoading(false)}
      />
      {loading ? <Loader className={styles.traitCardLoader} color='var(--black)' /> : null}
    </div>
  )
}

export default LoadingImage
