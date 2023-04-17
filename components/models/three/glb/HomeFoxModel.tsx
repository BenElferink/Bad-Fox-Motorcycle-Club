import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import GlbChild from '../primitiveChildren/GlbChild'
import { Environment } from '@react-three/drei'

const HomeFoxModel = () => {
  const [flip, setFlip] = useState(false)

  return (
    <Canvas style={{ width: 300, height: 300 }} camera={{ position: [0, 0, 1], fov: 45 }}>
      <Environment path={'/media/3d/'} files={'env.hdr'} />
      <pointLight position={[-1, 1, 0]} intensity={0.7} />

      <GlbChild
        src='/media/3d/fox.glb'
        scale={2}
        positionY={-0.3}
        animationName='All Animations'
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

export default HomeFoxModel
