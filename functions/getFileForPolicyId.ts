import { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../constants'
import badFoxAssetsFile from '../data/assets/bad-fox.json'
import badFoxTraitsFile from '../data/traits/bad-fox.json'
import badMotorcycleAssetsFile from '../data/assets/bad-motorcycle.json'
import badMotorcycleTraitsFile from '../data/traits/bad-motorcycle.json'
import { PopulatedAsset, PopulatedTrait } from '../@types'

const getFileForPolicyId = (policyId: string, fileType: 'assets' | 'traits') => {
  switch (fileType) {
    case 'assets':
      return (
        policyId === BAD_FOX_POLICY_ID
          ? // @ts-ignore
            badFoxAssetsFile?.assets || []
          : policyId === BAD_MOTORCYCLE_POLICY_ID
          ? // @ts-ignore
            badMotorcycleAssetsFile?.assets || []
          : []
      ) as PopulatedAsset[]

    case 'traits':
      return (
        policyId === BAD_FOX_POLICY_ID
          ? badFoxTraitsFile
          : policyId === BAD_MOTORCYCLE_POLICY_ID
          ? badMotorcycleTraitsFile
          : {}
      ) as Record<string, PopulatedTrait[]>

    default:
      return null
  }
}

export default getFileForPolicyId
