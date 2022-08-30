import { useEffect, useRef, useState } from 'react'
import foxAssetsFile from '../../../../data/assets/fox'
import traitsData from '../../../../data/traits/fox'
import AssetCard from '../../../AssetCard'
import FoxAssetsOptions from '../../../FilterOptions/Assets/Fox'
import styles from './FoxCollectionCatalog.module.css'

const INITIAL_DISPLAY_AMOUNT = 50

const FoxCollectionCatalog = () => {
  const assets = foxAssetsFile.assets

  const [ascending, setAscending] = useState(true)
  const [sortByRank, setSortByRank] = useState(true)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})

  const renderAssets = () => {
    const selected = []

    Object.entries(filters).forEach(([cat, selections]) => {
      if (selections.length) {
        selected.push([cat, selections])
      }
    })

    return assets
      .filter((asset) => {
        const matchingCategories = []

        selected.forEach(([cat, selections]) => {
          let categoryMatch = false

          if (selections.includes(asset.attributes[cat])) {
            categoryMatch = true
          }

          if (categoryMatch) {
            matchingCategories.push(cat)
          }
        })

        return matchingCategories.length === selected.length
      })
      .filter((asset) => !search || (search && asset.displayName.indexOf(search) !== -1))
      .sort((a, b) =>
        ascending && !sortByRank
          ? a.serialNumber - b.serialNumber
          : !ascending && !sortByRank
          ? b.serialNumber - a.serialNumber
          : ascending && sortByRank
          ? a.rarityRank - b.rarityRank
          : !ascending && sortByRank
          ? b.rarityRank - a.rarityRank
          : 0
      )
  }

  const [displayNum, setDisplayNum] = useState(INITIAL_DISPLAY_AMOUNT)
  const bottomRef = useRef(null)

  useEffect(() => {
    const handleScroll = (e) => {
      const { pageYOffset, innerHeight } = e.composedPath()[1]
      const isScrolledToBottom = bottomRef.current?.offsetTop <= pageYOffset + innerHeight

      if (isScrolledToBottom) {
        setDisplayNum((prev) => prev + INITIAL_DISPLAY_AMOUNT)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  const filteredAssets = renderAssets()

  return (
    <div className='flex-col'>
      <FoxAssetsOptions
        callbackAscending={(bool) => setAscending(bool)}
        callbackSortByRank={(bool) => setSortByRank(bool)}
        callbackSearch={(str) => setSearch(str)}
        callbackFilters={(obj) => setFilters(obj)}
        defaultSortByRank={true}
        noRankText='ID'
      />

      <div className={`scroll ${styles.listOfAssets}`}>
        {filteredAssets.length ? (
          filteredAssets.map((asset, idx) =>
            idx < displayNum ? (
              <AssetCard
                key={`fox-collection-${asset.assetId}-${idx}`}
                mainTitles={[asset.displayName]}
                subTitles={[`Rank ${asset.rarityRank}`]}
                imageSrc={asset.image.cnftTools}
                itemUrl={`https://jpg.store/asset/${asset.assetId}`}
                tableRows={Object.entries(asset.attributes)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([cat, attr]) => [
                    `${cat}:`,
                    attr,
                    traitsData[cat].find((trait) => trait.onChainName === attr)?.percent,
                  ])}
              />
            ) : null
          )
        ) : (
          <p className={styles.noneListed}>None exist...</p>
        )}
      </div>

      <div ref={bottomRef} />
    </div>
  )
}

export default FoxCollectionCatalog
