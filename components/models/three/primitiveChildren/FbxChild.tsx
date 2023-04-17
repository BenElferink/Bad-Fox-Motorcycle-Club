import { useLoader } from '@react-three/fiber'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

export interface FbxChildProps {
  src: string
}

const FbxChild = (props: FbxChildProps) => {
  const { src } = props
  const fbx = useLoader(FBXLoader, src)

  return <primitive object={fbx} />
}

export default FbxChild
