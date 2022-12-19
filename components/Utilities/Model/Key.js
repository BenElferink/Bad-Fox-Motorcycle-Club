import { Canvas } from '@react-three/fiber'
import Model from '.'

const Key = () => {
  return (
    <Canvas style={{ width: 300, height: 300 }} camera={{ position: [0.2, 0.2, 1], fov: 45 }}>
      <pointLight intensity={0.75} position={[0, 15, 15]} />
      <ambientLight intensity={0.5} color='#FFFFFF' />

      <Model src='/media/3d/key.glb' scale={0.6} positionX={-0.2} positionY={0.1} animationName='Animation' />
    </Canvas>
  )
}

export default Key
