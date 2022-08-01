import { useScreenSize } from '../../../../contexts/ScreenSizeContext'
import holdersSnapshotData from '../../../../data/snapshots/holders'
import BiggestHolders from './BiggestHolders'
import AmountPerHolder from './AmountPerHolder'

const Holders = ({ chartWidth }) => {
  const { isMobile } = useScreenSize()

  const holdersData = holdersSnapshotData.wallets
    .map((item) => ({
      stakeKey: item.stakeKey,
      count: item.counts.foxCount,
    }))
    .sort((a, b) => b.count - a.count)

  return (
    <div className={isMobile ? 'flex-col' : 'flex-row'} style={{ alignItems: 'flex-start' }}>
      <BiggestHolders holdersData={holdersData} chartWidth={chartWidth} />
      <AmountPerHolder holdersData={holdersData} chartWidth={chartWidth} />
    </div>
  )
}

export default Holders
