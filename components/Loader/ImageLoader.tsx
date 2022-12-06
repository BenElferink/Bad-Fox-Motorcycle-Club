import Image from 'next/image'
import { useState } from 'react'
import Loader from '.'

const ImageLoader = ({
  width = 100,
  height = 100,
  loaderSize,
  src = '',
  alt = '',
  style = {},
}: {
  width?: number
  height?: number
  loaderSize?: number
  src: string
  alt: string
  style?: {}
}) => {
  const [loading, setLoading] = useState(true)

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {loading ? (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: -1,
          }}
        >
          <Loader size={loaderSize} />
        </div>
      ) : null}

      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoadingComplete={() => setLoading(false)}
        style={{
          backgroundColor: 'transparent',
          border: '1px solid var(--black)',
          borderRadius: '1rem',
          ...style,
        }}
      />
    </div>
  )
}

export default ImageLoader
