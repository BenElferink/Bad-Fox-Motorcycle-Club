import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import useWallet from '../../contexts/WalletContext'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import Modal from '../Modal'
import Loader from '../Loader'
import Toggle from '../Toggle'
import BaseButton from '../BaseButton'
import ClayTraitSet from '../ClayTraitSet'
import { GITHUB_MEDIA_URL } from '../../constants/api-urls'
import { BAD_FOX_POLICY_ID } from '../../constants/policy-ids'

const ClayTraits = () => {
  const { isMobile } = useScreenSize()
  const { populatedWallet } = useWallet()

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

            populatedWallet.assets[BAD_FOX_POLICY_ID].forEach((asset) => {
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
    <Fragment>
      <BaseButton
        label='$CLAY Trait Sets'
        onClick={() => setShowClayTraitSets(true)}
        imageIcon={`${GITHUB_MEDIA_URL}/utilities/clay-token.png`}
        fullWidth
        backgroundColor='var(--brown)'
        hoverColor='var(--cardano-blue)'
        style={{ margin: '0' }}
      />

      <Modal title='$CLAY Trait Sets' open={showClayTraitSets} onClose={() => setShowClayTraitSets(false)}>
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
    </Fragment>
  )
}

export default ClayTraits
