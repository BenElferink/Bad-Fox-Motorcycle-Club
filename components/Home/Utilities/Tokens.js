import { useEffect, useState } from 'react'

const Tokens = ({ srcs = [], size = 0 }) => {
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setSlideIndex((prev) => (prev < srcs.length - 1 ? prev + 1 : 0)), 1500)
    return () => clearInterval(interval)
  }, [])

  return srcs.map((src, idx) =>
    idx === slideIndex ? (
      <img
        key={`media_${src}`}
        src={src}
        alt=''
        width={size}
        height={size}
        className={`animate__animated animate__fadeIn`}
        style={{ borderRadius: '1rem' }}
      />
    ) : null
  )
}

export default Tokens
