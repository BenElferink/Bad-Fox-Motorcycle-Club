import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import ModelChild from './ModelChild'
import { Environment } from '@react-three/drei'

const HomeMotorcycleModel = () => {
  const [flip, setFlip] = useState(false)

  return (
    <Canvas style={{ width: 300, height: 200 }} camera={{ position: [0, 0, 1], fov: 45 }}>
      <Environment path={'/media/3d/'} files={'env.hdr'} />
      <pointLight position={[-1, 1, 0]} intensity={0.7} />

      <ModelChild
        src='/media/3d/motorcycle.glb'
        scale={0.4}
        positionY={-0.3}
        positionX={0.05}
        animateScene={(scene) => {
          // @ts-ignore
          const curr = scene.rotation.y

          if (curr >= 0.7) {
            setFlip(true)
          } else if (curr <= -0.7) {
            setFlip(false)
          }

          if (flip) {
            // @ts-ignore
            scene.rotation.y -= 0.01
          } else {
            // @ts-ignore
            scene.rotation.y += 0.01
          }
        }}
      />
    </Canvas>
  )
}

export default HomeMotorcycleModel
