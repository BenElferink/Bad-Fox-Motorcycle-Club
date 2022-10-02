import { useMemo, useState } from 'react'
import getFileForPolicyId from '../../../functions/getFileForPolicyId'
import TraitFilters from '../TraitFilters'
import AssetCard from '../../Assets/AssetCard'
import styles from './CollectionTraits.module.css'

const CollectionTraits = ({ policyId }) => {
  const [selectedCategory, setSelectedCategory] = useState('')

  const traitsObj = useMemo(() => getFileForPolicyId(policyId, 'traits'), [policyId])

  return (
    <div className='flex-col'>
      <TraitFilters traitsData={traitsObj} callbackSelectedCategory={(str) => setSelectedCategory(str)} />

      <div className={styles.traitCatalog}>
        {traitsObj[selectedCategory]?.map((trait) => (
          <AssetCard
            key={`trait-catalog-list-item-${trait.displayName}-${trait.gender}`}
            mainTitles={[trait.displayName]}
            imageSrc={trait.image}
            itemUrl={trait.image}
            tableRows={[
              ['Gender:', 'Count:', 'Percent:'],
              [trait.gender, trait.count, trait.percent],
            ]}
          />
        ))}
      </div>
    </div>
  )
}

export default CollectionTraits
