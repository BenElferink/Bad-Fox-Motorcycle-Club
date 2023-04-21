import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import FbxChild from '../primitiveChildren/FbxChild'

export interface TPoseModelProps {
  src: string
  withControls?: boolean
}

const TPoseModel = (props: TPoseModelProps) => {
  const { src, withControls = false } = props

  return (
    <Canvas camera={{ position: [0, 15, 50], fov: 45 }}>
      <ambientLight intensity={2}/>
      <pointLight position={[0, 100, 0]} intensity={3} />
      <pointLight position={[0, -100, 0]} intensity={3} />
      {withControls ? <OrbitControls /> : null}

      <FbxChild src={src} />
    </Canvas>
  )
}

export default TPoseModel
