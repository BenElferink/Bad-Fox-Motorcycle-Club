import { BAD_FOX_3D_POLICY_ID, BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../constants'

import badFoxAssetsFile from '../data/assets/bad-fox-2d.json'
import badMotorcycleAssetsFile from '../data/assets/bad-motorcycle-2d.json'
import badKeyAssetsFile from '../data/assets/bad-key.json'
import badFox3dAssetsFile from '../data/assets/bad-fox-3d.json'

import badFoxTraitsFile from '../data/traits/bad-fox-2d.json'
import badMotorcycleTraitsFile from '../data/traits/bad-motorcycle-2d.json'
import badFox3dTraitsFile from '../data/traits/bad-fox-3d.json'

import { PolicyId, PopulatedAsset, TraitsFile } from '../@types'

const getFileForPolicyId = (policyId: PolicyId, fileType: 'assets' | 'traits') => {
  switch (fileType) {
    case 'assets':
      return (policyId === BAD_FOX_POLICY_ID
        ? // @ts-ignore
          badFoxAssetsFile.assets || []
        : policyId === BAD_MOTORCYCLE_POLICY_ID
        ? badMotorcycleAssetsFile.assets
        : policyId === BAD_KEY_POLICY_ID
        ? badKeyAssetsFile.assets
        : policyId === BAD_FOX_3D_POLICY_ID
        ? badFox3dAssetsFile.assets
        : []) as unknown as PopulatedAsset[]

    case 'traits':
      return (
        policyId === BAD_FOX_POLICY_ID
          ? badFoxTraitsFile
          : policyId === BAD_MOTORCYCLE_POLICY_ID
          ? badMotorcycleTraitsFile
          : policyId === BAD_FOX_3D_POLICY_ID
          ? badFox3dTraitsFile
          : {}
      ) as TraitsFile

    default:
      return null
  }
}

export default getFileForPolicyId
