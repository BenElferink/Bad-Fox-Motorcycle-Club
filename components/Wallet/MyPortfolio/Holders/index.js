import { useScreenSize } from '../../../../contexts/ScreenSizeContext'
import BiggestHolders from './BiggestHolders'
import AmountPerHolder from './AmountPerHolder'
import { FOX_POLICY_ID } from '../../../../constants/policy-ids'
import { EXCLUDE_ADDRESSES } from '../../../../constants/addresses'

const Holders = ({ chartWidth, wallets }) => {
  const { isMobile } = useScreenSize()

  const holdersData =
    wallets
      ?.filter((item) => !item.addresses.some((addr) => EXCLUDE_ADDRESSES.includes(addr)))
      ?.map((item) => ({
        stakeKey: item.stakeKey,
        count: item.assets[FOX_POLICY_ID]?.length,
      }))
      .sort((a, b) => b.count - a.count) ?? []

  return (
    <div className={isMobile ? 'flex-col' : 'flex-row'} style={{ alignItems: isMobile ? 'center' : 'flex-start' }}>
      <BiggestHolders holdersData={holdersData} chartWidth={chartWidth} />
      <AmountPerHolder holdersData={holdersData} chartWidth={chartWidth} />
    </div>
  )
}

export default Holders
