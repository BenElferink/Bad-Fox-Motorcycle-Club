import { useEffect, useState } from 'react'
import { useMarket } from '../../../contexts/MarketContext'
import Loader from '../../Loader'
import AssetCard from '../../AssetCard'
import SideDrawer from '../../SideDrawer'
import foxTraitsJsonFile from '../../../data/traits/fox'
import styles from './RecentlySold.module.css'
import { ADA_SYMBOL } from '../../../constants/ada'
import BaseButton from '../../BaseButton'

function RecentlySold() {
  const { fetchAndSetRecentFoxes, recentlySoldFoxes } = useMarket()

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!loading || (page === 1 && !recentlySoldFoxes.length)) {
      ;(async () => {
        setLoading(true)
        await fetchAndSetRecentFoxes({ sold: true, page })
        setLoading(false)
      })()
    }
  }, [page])

  return (
    <SideDrawer
      title='Recently Sold'
      scrolledToBottomCallback={() => (!loading ? setPage((prev) => prev + 1) : null)}
    >
      <div className={styles.listOfAssets}>
        {recentlySoldFoxes.map((item, idx) => (
          <AssetCard
            key={`market-recently-sold-${item.assetId}-${idx}`}
            mainTitles={[`${ADA_SYMBOL}${item.price}`]}
            subTitles={[`Rank ${item.rank}`, item.name, `${new Date(item.date).toLocaleString()}`]}
            imageSrc={item.imageUrl}
            itemUrl={item.itemUrl}
            tableRows={Object.entries(item.attributes)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([cat, attr]) => [
                `${cat}:`,
                attr,
                cat === 'Gender'
                  ? '50%'
                  : foxTraitsJsonFile[cat === 'Skin' ? `${cat} + Tail` : cat].find(
                      (obj) => obj.label === attr.replace('(F) ', '').replace('(M) ', '').replace('(U) ', '')
                    )?.percent,
              ])}
          />
        ))}

        {loading ? <Loader /> : <BaseButton label='Load More' onClick={() => setPage((prev) => prev + 1)} />}
      </div>
    </SideDrawer>
  )
}

export default RecentlySold
