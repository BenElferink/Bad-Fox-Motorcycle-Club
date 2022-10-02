import { useState } from 'react'
import AssetCard from '../../Assets/AssetCard'
import TraitFilters from '../TraitFilters'
import { BAD_FOX_POLICY_ID } from '../../../constants/policy-ids'
import styles from './CollectionTraits.module.css'
import foxTraitsFile from '../../../data/traits/bad-fox.json'

const CollectionTraits = ({ policyId }) => {
  const [selectedCategory, setSelectedCategory] = useState('')

  return (
    <div className='flex-col'>
      <TraitFilters
        traitsData={policyId === BAD_FOX_POLICY_ID ? foxTraitsFile : {}}
        callbackSelectedCategory={(str) => setSelectedCategory(str)}
      />

      <div className={styles.traitCatalog}>
        {(policyId === BAD_FOX_POLICY_ID ? foxTraitsFile : {})[selectedCategory]?.map((trait) => (
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
