import { useEffect, useRef, useState } from 'react'
import { useMarket } from '../../../contexts/MarketContext'
import traitsData from '../../../data/traits/fox'
import Loader from '../../Loader'
import AssetCard from '../../AssetCard'
import FoxAssetsOptions from '../../FilterOptions/Assets/Fox'
import { ADA_SYMBOL } from '../../../constants/ada'
import styles from './Listings.module.css'

const INITIAL_DISPLAY_AMOUNT = 50

function Listings() {
  const { fetchAndSetAllFoxes, allListedFoxes } = useMarket()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading) {
      ;(async () => {
        setLoading(true)
        await fetchAndSetAllFoxes()
        setLoading(false)
      })()
    }
  }, [])

  const [ascending, setAscending] = useState(true)
  const [sortByRank, setSortbyRank] = useState(false)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})

  const renderAssets = () => {
    const selected = []

    Object.entries(filters).forEach(([cat, selections]) => {
      if (selections.length) {
        selected.push([cat, selections])
      }
    })

    return allListedFoxes
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
      .filter((item) => !search || (search && item.name.indexOf(search) !== -1))
      .sort((a, b) =>
        ascending && !sortByRank
          ? a.price - b.price
          : !ascending && !sortByRank
          ? b.price - a.price
          : ascending && sortByRank
          ? a.rank - b.rank
          : !ascending && sortByRank
          ? b.rank - a.rank
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
        callbackSortByRank={(bool) => setSortbyRank(bool)}
        callbackSearch={(str) => setSearch(str)}
        callbackFilters={(obj) => setFilters(obj)}
      />

      <div className={`scroll ${styles.listOfAssets}`}>
        {filteredAssets.length ? (
          filteredAssets.map((item, idx) =>
            idx < displayNum ? (
              <AssetCard
                key={`market-listing-${item.assetId}-${idx}`}
                mainTitles={[`${ADA_SYMBOL}${item.price}`]}
                subTitles={[`Rank ${item.rank}`, item.name]}
                imageSrc={item.imageUrl}
                itemUrl={item.itemUrl}
                tableRows={Object.entries(item.attributes)
                  .sort((a, b) => a[0].localeCompare(b[0]))
                  .map(([cat, attr]) => [
                    `${cat}:`,
                    attr,
                    traitsData[cat].find((obj) => obj.onChainName === attr)?.percent,
                  ])}
              />
            ) : null
          )
        ) : (
          <p className={styles.noneListed}>None listed...</p>
        )}
      </div>

      {loading ? <Loader /> : null}
      <div ref={bottomRef} />
    </div>
  )
}

export default Listings
