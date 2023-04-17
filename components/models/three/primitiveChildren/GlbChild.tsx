import { MutableRefObject, useEffect, useRef } from 'react'
import { useAnimations } from '@react-three/drei'
import { useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export interface GlbChildProps {
  src: string
  scale?: number
  positionX?: number
  positionY?: number
  animateScene?: (scene: MutableRefObject<null>) => void
  animationName?: string
}

const GlbChild = (props: GlbChildProps) => {
  const { src, scale = 1, positionX = 0, positionY = 0, animateScene = () => null, animationName = '' } = props

  const ref = useRef(null)
  const gltf = useLoader(GLTFLoader, src)
  const { actions } = useAnimations(gltf.animations, ref)

  gltf.scene.position.x = positionX
  gltf.scene.position.y = positionY

  useEffect(() => {
    if (animationName) {
      actions[animationName]?.play()
    }
  }, [animationName, actions])

  useFrame(() => {
    if (!ref.current) {
      return
    }

    animateScene(ref.current)
  })

  return <primitive ref={ref} object={gltf.scene} scale={scale} />
}

export default GlbChild
