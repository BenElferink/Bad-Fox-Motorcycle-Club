import { OrbitControls, SpotLight } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import ModelChild from './ModelChild'

export interface FoxModelProps {
  src: string
}

const FoxModel = (props: FoxModelProps) => {
  const { src } = props
  const [rotated, setRotated] = useState(false)

  return (
    <Canvas camera={{ position: [0, 0, 1], fov: 45 }}>
      <SpotLight opacity={0.2} />
      <hemisphereLight args={['#fff', '#000', 1]} />
      <pointLight intensity={0.1} position={[0, 0, 1]} />
      {/* <directionalLight position={[0, 5, 0]} /> */}

      <OrbitControls />
      <ModelChild
        src={src}
        scale={2}
        positionY={-0.35}
        animationName='All Animations'
        animateScene={(scene) => {
          if (!rotated) {
            // @ts-ignore
            scene.rotateY(-0.2)
            setRotated(true)
          }
        }}
      />
    </Canvas>
  )
}

export default FoxModel
