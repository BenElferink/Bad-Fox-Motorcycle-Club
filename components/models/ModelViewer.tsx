import { useEffect } from 'react'

export interface ModelViewerProps {
  src: string
  freeze?: boolean
}

const ModelViewer = (props: ModelViewerProps) => {
  const { src, freeze = false } = props

  useEffect(() => {
    import('@google/model-viewer').catch(console.error)
    // https://modelviewer.dev
  }, [])

  const attributes = freeze
    ? {}
    : {
        'camera-controls': true,
        'auto-rotate': true,
        autoplay: true,
      }

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

export default ModelViewer
