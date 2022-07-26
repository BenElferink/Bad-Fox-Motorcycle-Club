import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import traitsData from '../../../data/traits/fox'
import Loader from '../../Loader'
import Toggle from '../../Toggle'
import AssetCard from '../../AssetCard'
import FoxTraitsOptions from '../../FilterOptions/Traits/Fox'
import styles from './MyWalletTraits.module.css'

const MyWalletTraits = () => {
  const { loading: authLoading, myAssets } = useAuth()
  const assets = myAssets

  const [showAll, setShowAll] = useState(false)
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
      <FoxTraitsOptions callbackSelectedCategory={(str) => setSelectedCategory(str)}>
        <div className='flex-col' style={{ margin: '0.5rem' }}>
          {showAll ? 'Display All Traits' : 'Display Owned Traits'}
          <Toggle
            labelLeft={''}
            labelRight={''}
            showIcons={false}
            state={{ value: showAll, setValue: setShowAll }}
          />
        </div>
      </FoxTraitsOptions>

      <div className={styles.traitCatalog}>
        {renderTraits()[selectedCategory]?.map((trait) =>
          showAll || trait.owned !== 0 ? (
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

      {authLoading ? <Loader /> : null}
    </div>
  )
}

export default MyWalletTraits
