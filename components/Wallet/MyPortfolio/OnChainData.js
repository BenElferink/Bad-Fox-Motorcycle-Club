import { useEffect, useState } from 'react'
import axios from 'axios'
import AssetCard from '../../AssetCard'
import formatBigNumber from '../../../functions/formatters/formatBigNumber'
import { BINANCE_API, OPEN_CNFT_API } from '../../../constants/api-urls'
import { FOX_POLICY_ID } from '../../../constants/policy-ids'

const OnChainData = () => {
  const [onChainData, setOnChainData] = useState({})
  const [adaUsdTicker, setAdaUsdTicker] = useState('0')
  const [adaUsdChange24h, setAdaUsdChange24h] = useState('0')

  useEffect(() => {
    axios
      .get(`${OPEN_CNFT_API}/policy/${FOX_POLICY_ID}`)
      .then(({ data }) => setOnChainData(data))
      .catch((error) => console.error(error))

    axios
      .get(`${BINANCE_API}/api/v3/ticker/price?symbol=ADABUSD`)
      .then(({ data }) => setAdaUsdTicker(Number(data.price).toFixed(2)))
      .catch((error) => console.error(error))

    axios
      .get(`${BINANCE_API}/api/v3/ticker/24hr?symbol=ADABUSD`)
      .then(({ data }) => setAdaUsdChange24h(Number(data.priceChangePercent).toFixed(1)))
      .catch((error) => console.error(error))
  }, []) // eslint-disable-line

  return (
    <AssetCard
      mainTitles={[`Total Volume: ${formatBigNumber((onChainData.total_volume || 1000000) / 1000000)}`]}
      subTitles={[`ADA Price: $${adaUsdTicker}`, `ADA 24h Change: ${adaUsdChange24h}%`]}
      tableRows={[
        [
          `Supply: ${onChainData.asset_minted}`,
          `Holders: ${onChainData.asset_holders}`,
          `Total Sales: ${onChainData.total_assets_sold}`,
          `Total Transactions: ${onChainData.total_tx}`,
        ],
      ]}
      noClick
      backgroundColor='var(--apex-charcoal)'
      color='var(--white)'
      style={{ margin: '0.5rem' }}
    />
  )
}

export default OnChainData
