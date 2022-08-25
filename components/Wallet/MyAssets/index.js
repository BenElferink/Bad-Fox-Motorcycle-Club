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

          if (selections.includes(item.onchain_metadata.attributes[cat])) {
            categoryMatch = true
          }

          if (categoryMatch) {
            matchingCategories.push(cat)
          }
        })

        return matchingCategories.length === selected.length
      })
      .filter((item) => !search || (search && item.onchain_metadata.name.indexOf(search) !== -1))
      .sort((a, b) =>
        ascending && !sortByRank
          ? Number(a.onchain_metadata.name.replace('Bad Fox #', '')) -
            Number(b.onchain_metadata.name.replace('Bad Fox #', ''))
          : !ascending && !sortByRank
          ? Number(b.onchain_metadata.name.replace('Bad Fox #', '')) -
            Number(a.onchain_metadata.name.replace('Bad Fox #', ''))
          : ascending && sortByRank
          ? a.onchain_metadata.rank - b.onchain_metadata.rank
          : !ascending && sortByRank
          ? b.onchain_metadata.rank - a.onchain_metadata.rank
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
                key={`fox-collection-${item.asset}-${idx}`}
                mainTitles={[item.onchain_metadata.name]}
                subTitles={[`Rank ${item.onchain_metadata.rank}`]}
                imageSrc={item.onchain_metadata.image.cnftTools}
                itemUrl={`https://jpg.store/asset/${item.asset}`}
                tableRows={Object.entries(item.onchain_metadata.attributes)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([cat, attr]) => [
                    `${cat}:`,
                    attr,
                    cat === 'Gender' ? '50%' : traitsData[cat].find((obj) => obj.onChainName === attr)?.percent,
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
