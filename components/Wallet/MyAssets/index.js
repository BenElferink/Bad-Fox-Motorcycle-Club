import { useAuth } from '../../../contexts/AuthContext'
import { useEffect, useRef, useState } from 'react'
import traitsData from '../../../data/traits/fox'
import Loader from '../../Loader'
import AssetCard from '../../AssetCard'
import FoxAssetsOptions from '../../FilterOptions/Assets/Fox'
import styles from './MyWalletAssets.module.css'

const INITIAL_DISPLAY_AMOUNT = 50

const MyWalletAssets = () => {
  const { loading: authLoading, myAssets } = useAuth()

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

    return myAssets
      .filter((item) => {
        const matchingCategories = []

        selected.forEach(([cat, selections]) => {
          let categoryMatch = false

          if (selections.includes(item.attributes[cat])) {
            categoryMatch = true
          }

          if (categoryMatch) {
            matchingCategories.push(cat)
          }
        })

        return matchingCategories.length === selected.length
      })
      .filter((item) => !search || (search && item.displayName.indexOf(search) !== -1))
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
          filteredAssets.map((item, idx) =>
            idx < displayNum ? (
              <AssetCard
                key={`fox-collection-${item.assetId}-${idx}`}
                mainTitles={[item.displayName]}
                subTitles={[`Rank ${item.rarityRank}`]}
                imageSrc={item.image.cnftTools}
                itemUrl={`https://jpg.store/asset/${item.assetId}`}
                tableRows={Object.entries(item.attributes)
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

      {authLoading ? <Loader /> : null}
      <div ref={bottomRef} />
    </div>
  )
}

export default MyWalletAssets
