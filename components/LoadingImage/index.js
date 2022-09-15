import Image from 'next/image'
import { useState } from 'react'
import Loader from '../Loader'
import styles from './LoadingImage.module.css'

const LoadingImage = ({
  width = 100,
  height = 100,
  src = '',
  alt = img,
  loaderColor = 'var(--white)',
  style = {},
}) => {
  const [loading, setLoading] = useState(true)

  return (
    <div className={styles.wrapper}>
      <Image
        className={styles.img}
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoadingComplete={() => setLoading(false)}
        style={style}
      />
      {loading ? <Loader className={styles.loader} color={loaderColor} /> : null}
    </div>
  )
}

export default LoadingImage
