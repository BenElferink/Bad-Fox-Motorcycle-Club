import { useEffect, useState } from 'react'
import axios from 'axios'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import { useAuth } from '../../../contexts/AuthContext'
import Modal from '../../Modal'
import Loader from '../../Loader'
import Toggle from '../../Toggle'
import BaseButton from '../../BaseButton'
import TraitFilters from '../TraitFilters'
import AssetCard from '../../Assets/AssetCard'
import ClayTraitSet from '../../ClayTraitSet'
import { GITHUB_MEDIA_URL } from '../../../constants/api-urls'
import { BAD_FOX_POLICY_ID } from '../../../constants/policy-ids'
import styles from './MyTraits.module.css'
import foxTraitsFile from '../../../data/traits/fox'

const MyTraits = ({ policyId }) => {
  const { isMobile } = useScreenSize()
  const { myAssets } = useAuth()

  const [selectedCategory, setSelectedCategory] = useState('')
  const [showAllTraits, setShowAllTraits] = useState(false)

  const traitsFile = policyId === BAD_FOX_POLICY_ID ? foxTraitsFile : {}

  const renderTraits = () => {
    const traits = {}

    Object.entries(traitsFile).forEach(([category, attributes]) => {
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

  const [showClayTraitSets, setShowClayTraitSets] = useState(false)
  const [showAllClayTraitSets, setShowAllClayTraitSets] = useState(false)
  const [sets, setSets] = useState({})
  const [totalShares, setTotalShares] = useState(0)
  const [totalTokens, setTotalTokens] = useState(0)
  const [clayLoading, setClayLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setClayLoading(true)
      try {
        setTotalShares(0)
        setTotalTokens(0)

        const { data } = await axios.get('/api/utilities/clay')
        const mappedSets = {}

        for (const roleName in data.traitSets ?? {}) {
          const { set, shares, tokens } = data.traitSets[roleName]
          const thisSet = []
          let ownsThisSet = true
          let leastHeldTrait = 0

          for (const setItem of set) {
            const { traitCategory, traitLabel } = setItem
            let ownedTraitCount = 0

            myAssets.forEach((asset) => {
              if (asset.attributes[traitCategory] === traitLabel) {
                ownedTraitCount++
              }
            })

            thisSet.push({
              ...setItem,
              ownedTraitCount,
            })

            if (ownedTraitCount === 0) {
              ownsThisSet = false
            }

            if (ownedTraitCount < leastHeldTrait || leastHeldTrait === 0) {
              leastHeldTrait = ownedTraitCount
            }
          }

          mappedSets[roleName] = {
            ...data.traitSets[roleName],
            set: thisSet,
            ownsThisSet,
            ownedSetCount: ownsThisSet ? leastHeldTrait : 0,
          }

          if (ownsThisSet) {
            setTotalShares((prev) => prev + leastHeldTrait * shares)
            setTotalTokens((prev) => prev + leastHeldTrait * tokens)
          }
        }

        setSets(mappedSets)
      } catch (error) {
        console.error(error)
      }
      setClayLoading(false)
    })()
  }, [])

  return (
    <div className='flex-col'>
      <div>
        <TraitFilters traitsData={traitsFile} callbackSelectedCategory={(str) => setSelectedCategory(str)}>
          <div className='flex-col' style={{ margin: '0.5rem' }}>
            {!isMobile ? (showAllTraits ? 'All Traits' : 'Owned Traits') : null}
            <Toggle
              labelLeft={!isMobile ? '' : 'Owned Traits'}
              labelRight={!isMobile ? '' : 'All Traits'}
              showIcons={false}
              state={{ value: showAllTraits, setValue: setShowAllTraits }}
            />
          </div>
        </TraitFilters>

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

      <Modal title='My $CLAY Trait Sets' open={showClayTraitSets} onClose={() => setShowClayTraitSets(false)}>
        <div className='flex-col' style={{ margin: '0.5rem' }}>
          {!isMobile ? (showAllClayTraitSets ? 'All Sets' : 'Owned Sets') : null}
          <Toggle
            labelLeft={!isMobile ? '' : 'Owned Sets'}
            labelRight={!isMobile ? '' : 'All Sets'}
            showIcons={false}
            state={{ value: showAllClayTraitSets, setValue: setShowAllClayTraitSets }}
          />
          <p style={{ textAlign: 'center' }}>
            Total shares: {totalShares}
            <br />
            Total tokens: {totalTokens.toFixed(2)}
          </p>
        </div>

        {clayLoading ? (
          <Loader color='var(--white)' />
        ) : (
          Object.entries(sets)
            .filter((item) => showAllClayTraitSets || item[1].ownsThisSet)
            .sort((a, b) => b[1].shares - a[1].shares)
            .sort((a, b) => (showAllClayTraitSets ? 0 : b[1].ownedSetCount - a[1].ownedSetCount))
            .map(([roleName, { shares, tokens, possibilities, occupied, set, ownedSetCount }]) => (
              <ClayTraitSet
                key={roleName}
                title={roleName}
                textRows={[
                  `Shares: ${shares}`,
                  `Token Value: ${tokens.toFixed(2)}`,
                  `Possibilities: ${occupied} / ${possibilities}`,
                  `Owned: ${ownedSetCount} sets || ${ownedSetCount * shares} shares || ${(
                    ownedSetCount * tokens
                  ).toFixed(2)} tokens`,
                ]}
                set={set}
              />
            ))
        )}
      </Modal>
    </div>
  )
}

export default MyTraits
