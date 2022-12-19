import Image from 'next/image'
import { useState } from 'react'
import Loader from '.'

export interface ImageLoaderProps {
  src: string
  alt: string
  width?: number
  height?: number
  style?: React.CSSProperties
}

const ImageLoader = (props: ImageLoaderProps) => {
  const { src = '', alt = '', width = 100, height = 100, style = {} } = props
  const [loading, setLoading] = useState(true)

  return (
    <div className='relative z-10' style={style}>
      {loading ? (
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10'>
          <Loader size={Math.min(width, height) * 0.7} />
        </div>
      ) : null}

      <Image
        src={src}
        alt={alt}
        onLoadingComplete={() => setLoading(false)}
        width={width}
        height={height}
        style={style}
      />
    </div>
  )
}

export default ImageLoader
