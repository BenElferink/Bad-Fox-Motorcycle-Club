import { useState } from 'react'
import traitsData from '../../../../data/traits/fox'
import AssetCard from '../../../AssetCard'
import FoxTraitsOptions from '../../../FilterOptions/Traits/Fox'
import styles from './FoxTraitsCatalog.module.css'

const FoxTraitsCatalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('')

  return (
    <div className='flex-col'>
      <FoxTraitsOptions callbackSelectedCategory={(str) => setSelectedCategory(str)} />

      <div className={styles.traitCatalog}>
        {traitsData[selectedCategory]?.map((trait) => (
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

export default FoxTraitsCatalog
