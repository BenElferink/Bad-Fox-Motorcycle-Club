import { useScreenSize } from '../../../../contexts/ScreenSizeContext'
import BiggestHolders from './BiggestHolders'
import AmountPerHolder from './AmountPerHolder'

const Holders = ({ chartWidth, holdersSnapshot }) => {
  const { isMobile } = useScreenSize()

  const holdersData =
    holdersSnapshot.wallets
      ?.map((item) => ({
        stakeKey: item.stakeKey,
        count: item.assets.length,
      }))
      .sort((a, b) => b.count - a.count) ?? []

  return (
    <div className={isMobile ? 'flex-col' : 'flex-row'} style={{ alignItems: 'flex-start' }}>
      <BiggestHolders holdersData={holdersData} chartWidth={chartWidth} />
      <AmountPerHolder holdersData={holdersData} chartWidth={chartWidth} />
    </div>
  )
}

export default Holders
