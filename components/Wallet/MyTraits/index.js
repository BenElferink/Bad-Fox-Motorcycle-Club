import { useState } from 'react'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import { useAuth } from '../../../contexts/AuthContext'
import traitsData from '../../../data/traits/fox'
import traitSetsData from '../../../data/clay-trait-sets'
import Loader from '../../Loader'
import Toggle from '../../Toggle'
import AssetCard from '../../AssetCard'
import FoxTraitsOptions from '../../FilterOptions/Traits/Fox'
import Modal from '../../Modal'
import BaseButton from '../../BaseButton'
import { GITHUB_MEDIA_URL } from '../../../constants/api-urls'
import styles from './MyWalletTraits.module.css'
import ClayTraitSet from '../../ClayTraitSet'

const MyWalletTraits = () => {
  const { isMobile } = useScreenSize()
  const { loading: authLoading, myAssets } = useAuth()

  const [selectedCategory, setSelectedCategory] = useState('')
  const [showAllTraits, setShowAllTraits] = useState(false)
  const [showClayTraitSets, setShowClayTraitSets] = useState(false)
  const [showAllClayTraitSets, setShowAllClayTraitSets] = useState(false)

  const renderTraits = () => {
    const traits = {}

    Object.entries(traitsData).forEach(([category, attributes]) => {
      attributes.forEach((attributeObj) => {
        const ownedCount = myAssets.filter((item) => item.attributes[category] === attributeObj.onChainName).length

        const payload = {
          ...attributeObj,
          owned: ownedCount,
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

  const renderClayTraits = () => {
    const mappedTraitSets = {}

    for (const roleName in traitSetsData) {
      const { share, possibilities, set } = traitSetsData[roleName]
      const thisSet = []
      let ownsThisSet = true
      let leastHeldTrait = 0

      for (const { traitCategory, traitLabel, traitCount, traitPercent, traitImage } of set) {
        let ownedTraitCount = 0

        myAssets.forEach((asset) => {
          if (asset.attributes[traitCategory] === traitLabel) {
            ownedTraitCount++
          }
        })

        thisSet.push({
          traitCategory,
          traitLabel,
          traitCount,
          traitPercent,
          traitImage,
          ownedTraitCount,
        })

        if (ownedTraitCount === 0) {
          ownsThisSet = false
        }

        if (ownedTraitCount < leastHeldTrait || leastHeldTrait === 0) {
          leastHeldTrait = ownedTraitCount
        }
      }

      mappedTraitSets[roleName] = {
        share,
        possibilities,
        set: thisSet,
        ownsThisSet,
        ownedSetCount: ownsThisSet ? leastHeldTrait : 0,
      }
    }

    return mappedTraitSets
  }

  return (
    <div className='flex-col'>
      <div>
        <FoxTraitsOptions callbackSelectedCategory={(str) => setSelectedCategory(str)}>
          <div className='flex-col' style={{ margin: '0.5rem' }}>
            {!isMobile ? (showAllTraits ? 'All Traits' : 'Owned Traits') : null}
            <Toggle
              labelLeft={!isMobile ? '' : 'Owned Traits'}
              labelRight={!isMobile ? '' : 'All Traits'}
              showIcons={false}
              state={{ value: showAllTraits, setValue: setShowAllTraits }}
            />
          </div>
        </FoxTraitsOptions>
        <BaseButton
          label='My $CLAY Trait Sets'
          onClick={() => setShowClayTraitSets(true)}
          imageIcon={`${GITHUB_MEDIA_URL}/utilities/clay-token.png`}
          style={{ margin: '0' }}
          backgroundColor='var(--brown)'
          hoverColor='var(--cardano-blue)'
          fullWidth
        />
      </div>

      <div className={styles.traitCatalog}>
        {renderTraits()[selectedCategory]?.map((trait) =>
          showAllTraits || trait.owned !== 0 ? (
            <AssetCard
              key={`trait-catalog-list-item-${trait.displayName}-${trait.gender}`}
              mainTitles={[trait.displayName]}
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

      <Modal title='My $CLAY Trait Sets' open={showClayTraitSets} onClose={() => setShowClayTraitSets(false)}>
        <div className='flex-col' style={{ margin: '0.5rem' }}>
          {!isMobile ? (showAllClayTraitSets ? 'All Sets' : 'Owned Sets') : null}
          <Toggle
            labelLeft={!isMobile ? '' : 'Owned Sets'}
            labelRight={!isMobile ? '' : 'All Sets'}
            showIcons={false}
            state={{ value: showAllClayTraitSets, setValue: setShowAllClayTraitSets }}
          />
        </div>
        {Object.entries(renderClayTraits())
          .filter((item) => showAllClayTraitSets || item[1].ownsThisSet)
          .sort((a, b) => b[1].share - a[1].share)
          .sort((a, b) => (showAllClayTraitSets ? 0 : b[1].ownedSetCount - a[1].ownedSetCount))
          .map(([roleName, { share, possibilities, set, ownedSetCount }]) => (
            <ClayTraitSet
              key={roleName}
              title={roleName}
              textRows={[`Token Share: ${share}`, `Possibilities: ${possibilities}`, `Owned: ${ownedSetCount}`]}
              set={set}
            />
          ))}
      </Modal>
    </div>
  )
}

export default MyWalletTraits
