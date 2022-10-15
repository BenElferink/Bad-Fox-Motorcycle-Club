import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Model from '.'

const Male = () => {
  return (
    <Canvas camera={{ position: [0, 0, 1], fov: 45 }} style={{ width: 300, height: 300 }}>
      <pointLight intensity={1} position={[10, 10, 10]} />
      <ambientLight intensity={1.5} color='#FFFFFF' />

      <Suspense fallback={null}>
        <Model
          src='/files/3d-male.glb'
          scale={2}
          animateScene={(scene) => {
            scene.rotation.y += 0.015
          }}
        />
      </Suspense>
    </Canvas>
  )
}

export default Male
