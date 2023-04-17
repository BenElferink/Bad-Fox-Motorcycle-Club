import { Environment } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import GlbChild from '../primitiveChildren/GlbChild'

const HomeKeyModel = () => {
  return (
    <Canvas style={{ width: 300, height: 300 }} camera={{ position: [0.2, 0.2, 1], fov: 45 }}>
      <Environment path={'/media/3d/'} files={'env.hdr'} />
      <pointLight position={[-1, 1, 0]} intensity={1} />

      <GlbChild src='/media/3d/key.glb' scale={0.6} positionX={-0.2} positionY={0.1} animationName='Animation' />
    </Canvas>
  )
}

export default HomeKeyModel
