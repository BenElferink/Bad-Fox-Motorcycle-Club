import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import ModelChild from './ModelChild'

const HomeFoxModel = () => {
  const [flip, setFlip] = useState(false)

  return (
    <Canvas style={{ width: 450, height: 400 }} camera={{ position: [0, 0, 1], fov: 45 }}>
      <pointLight intensity={1} position={[5, 20, 15]} />
      <ambientLight intensity={0.3} color='#FFFFFF' />

      <ModelChild
        src='/media/3d/fox-4946.glb'
        scale={1.7}
        positionY={-0.3}
        animationName='All Animations'
        animateScene={(scene) => {
          // @ts-ignore
          const curr = scene.rotation.y

          if (curr >= 1) {
            setFlip(true)
          } else if (curr <= -1) {
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
