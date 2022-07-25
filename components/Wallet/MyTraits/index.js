import { useAuth } from '../../../contexts/AuthContext'
import { useState } from 'react'
import traitsData from '../../../data/traits/fox'
import AssetCard from '../../AssetCard'
import FoxTraitsOptions from '../../FilterOptions/Traits/Fox'
import styles from './MyWalletTraits.module.css'

const MyWalletTraits = () => {
  const { myAssets } = useAuth()
  const assets = myAssets

  const [selectedCategory, setSelectedCategory] = useState('')

  const renderTraits = () => {
    const traits = {}

    Object.entries(traitsData).forEach(([category, attributes]) => {
      attributes.forEach((attributeObj) => {
        const label = attributeObj.label
        const gender = attributeObj.gender
        const prefix = gender === 'Male' ? '(M) ' : gender === 'Female' ? '(F) ' : '(U) '

        const labelCount = assets.filter(
          (item) => label === item.onchain_metadata.attributes[category].replace(prefix, '')
        ).length

        const payload = {
          ...attributeObj,
          owned: labelCount,
          count: attributeObj.count,
          percent: attributeObj.percent,
        }

        if (traits[category]) {
          traits[category].push(payload)
        } else {
          traits[category] = [payload]
        }
      })
    })

    return traits
  }

  return (
    <div className='flex-col'>
      <FoxTraitsOptions callbackSelectedCategory={(str) => setSelectedCategory(str)} />

      <div className={styles.traitCatalog}>
        {renderTraits()[selectedCategory]?.map((trait) =>
          trait.owned !== 0 ? (
            <AssetCard
              key={`trait-catalog-list-item-${trait.label}-${trait.gender}`}
              mainTitles={[trait.label]}
              subTitles={[`Owned: ${trait.owned}`]}
              imageSrc={trait.image}
              itemUrl={trait.image}
              tableRows={[
                ['Gender:', 'Count:', 'Percent:'],
                [trait.gender, trait.count, trait.percent],
              ]}
            />
          ) : null
        )}
      </div>
    </div>
  )
}

export default MyWalletTraits
