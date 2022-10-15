import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Model from '.'

const Key = () => {
  return (
    <Canvas camera={{ position: [0, 0, 1], fov: 45 }} style={{ width: 300, height: 300 }}>
      <pointLight intensity={1} position={[-5, 15, 15]} />
      <ambientLight intensity={0.5} color='#FFFFFF' />

      <Suspense fallback={null}>
        <Model src='/files/3d-key.glb' scale={0.6} positionX={-0.2} positionY={0.1} animationName='Animation' />
      </Suspense>
    </Canvas>
  )
}

export default Key
