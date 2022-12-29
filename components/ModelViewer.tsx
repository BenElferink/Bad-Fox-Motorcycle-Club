import { useEffect } from 'react'

export interface ModelViewerProps {
  src: string
}

const ModelViewer = (props: ModelViewerProps) => {
  const { src } = props

  useEffect(() => {
    import('@google/model-viewer').catch(console.error)
    // https://modelviewer.dev
  }, [])

  return (
    // @ts-ignore
    <model-viewer
      src={src}
      ios-src={src}
      alt='3D File'
      environment-image='neutral'
      shadow-intensity='1'
      camera-controls
      auto-rotate
      autoplay
      ar
      ar-status='not-presenting'
      ar-modes='webxr scene-viewer quick-look'
      // @ts-ignore
    ></model-viewer>
  )
}

export default ModelViewer
