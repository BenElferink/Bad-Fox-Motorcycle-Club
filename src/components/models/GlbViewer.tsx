import { useEffect, useMemo } from 'react'

export interface GlbViewerProps {
  src: string
  freeze?: boolean
}

const GlbViewer = (props: GlbViewerProps) => {
  const { src, freeze = false } = props

  useEffect(() => {
    import('@google/model-viewer').catch(console.error)
    // https://modelviewer.dev
  }, [])

  const attributes = useMemo(
    () =>
      freeze
        ? {}
        : {
            'camera-controls': true,
            'auto-rotate': true,
            autoplay: true,
          },
    [freeze]
  )

  return (
    // @ts-ignore
    <model-viewer
      src={src}
      ios-src={src}
      alt='3D Object'
      environment-image='neutral'
      shadow-intensity='0'
      {...attributes}
      ar
      ar-status='not-presenting'
      ar-modes='webxr scene-viewer quick-look'
      // @ts-ignore
    ></model-viewer>
  )
}

export default GlbViewer
