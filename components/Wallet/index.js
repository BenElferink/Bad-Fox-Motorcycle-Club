import { Fragment, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import useWallet from '../../contexts/WalletContext'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { jpgStore } from '../../utils/jpgStore'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import formatBigNumber from '../../functions/formatters/formatBigNumber'
import ProjectListItem from '../ProjectListItem'
import ClayTraits from './ClayTraits'
import Chart from './Chart'
import WalletAssets from '../Assets/WalletAssets'
import { ADA_SYMBOL } from '../../constants/ada'
import { BINANCE_API } from '../../constants/api-urls'
import { BAD_FOX_POLICY_ID } from '../../constants/policy-ids'
import projectsFile from '../../data/projects.json'

const Wallet = () => {
  const { populatedWallet } = useWallet()
  const { isMobile } = useScreenSize()

  const appendBuyPriceToAssets = useCallback(async (policyId) => {
    const toSet = {}
    const oldStored = JSON.parse(window.localStorage.getItem('BadFoxMC_AssetsPrices'))
    const stored = JSON.parse(
      window.localStorage.getItem(`wallet-portfolio-${populatedWallet.stakeKey}-${policyId}`)
    )

    for await (const { assetId } of populatedWallet.assets[policyId]) {
      const asset = getFileForPolicyId(policyId, 'assets').find((asset) => asset.assetId === assetId)

      if (stored) {
        const storedAsset = stored[assetId]
        toSet[assetId] = {
          price: storedAsset ? storedAsset.price : 0,
          timestamp: storedAsset ? storedAsset.timestamp : 0,
          attributes: asset.attributes,
        }
      } else {
        let txHistory = {
          price: 0,
          timestamp: 0,
        }

        try {
          txHistory = await jpgStore.getAssetPurchasePrice(assetId)
        } catch (error) {
          console.error(error)
        }

        if (!txHistory.price && !txHistory.timestamp) {
          if (oldStored) {
            const oldStoredAsset = oldStored[assetId]
            if (oldStoredAsset) {
              txHistory.price = oldStoredAsset.price
              txHistory.timestamp = oldStoredAsset.timestamp
            }
          }
        }

        toSet[assetId] = {
          price: txHistory.price,
          timestamp: txHistory.timestamp,
          attributes: asset.attributes,
        }
      }
    }

    window.localStorage.removeItem('BadFoxMC_AssetsPrices')
    return toSet
  }, [])

  const [selectedPolicyId, setSelectedPolicyId] = useState('')
  const [pricedItems, setPricedItems] = useState({})
  const [floorSnapshots, setFloorSnapshots] = useState([])

  useEffect(() => {
    if (selectedPolicyId) {
      ;(async () => {
        try {
          const { data } = await axios.get(`/api/snapshots/floor-prices/${selectedPolicyId}`)

          setFloorSnapshots(data.snapshots)
        } catch (error) {
          console.error(error)
        }

        const priced = await appendBuyPriceToAssets(selectedPolicyId)
        setPricedItems(priced)
      })()
    }
  }, [selectedPolicyId, appendBuyPriceToAssets])

  useEffect(() => {
    if (window && selectedPolicyId && JSON.stringify(pricedItems) !== JSON.stringify({})) {
      window.localStorage.setItem(
        `wallet-portfolio-${populatedWallet.stakeKey}-${selectedPolicyId}`,
        JSON.stringify(pricedItems)
      )
    }
  }, [selectedPolicyId, pricedItems])

  const getPricesFromAttributes = useCallback(
    (assetAttributes) => {
      let floor = 0
      let highestTrait = 0

      Object.entries(floorSnapshots[floorSnapshots.length - 1]?.attributes ?? {}).forEach(([category, traits]) => {
        const v = traits[assetAttributes[category]]

        if (highestTrait < v) {
          highestTrait = v
        }

        if (floor === 0 || floor > v) {
          floor = v
        }
      })

      return [floor, highestTrait]
    },
    [floorSnapshots]
  )

  const [totalPayed, totalFloorBalance, totalHighestTraitBalance] = useCallback(() => {
    let payedVal = 0
    let floorBalanceVal = 0
    let highestTraitBalanceVal = 0

    Object.values(pricedItems).forEach(({ price, attributes }) => {
      const [thisFloor, thisHighestTraitValue] = getPricesFromAttributes(attributes)

      payedVal += price
      floorBalanceVal += thisFloor
      highestTraitBalanceVal += thisHighestTraitValue
    })

    return [payedVal, floorBalanceVal, highestTraitBalanceVal]
  }, [pricedItems, getPricesFromAttributes])()

  const [royaltyData, setRoyaltyData] = useState({
    adaInWallet: 0,
    adaInVolume: 0,
  })

  useEffect(() => {
    if (selectedPolicyId) {
      ;(async () => {
        try {
          const res = await axios.get(
            `/api/utilities/royalties/${selectedPolicyId === BAD_FOX_POLICY_ID ? 'fox' : 'error'}`
          )

          setRoyaltyData(res.data)
        } catch (error) {
          console.error(error.message)
        }
      })()
    }
  }, [selectedPolicyId])

  const [adaUsdTicker, setAdaUsdTicker] = useState(0)
  const [adaUsdChange24h, setAdaUsdChange24h] = useState(0)

  useEffect(() => {
    axios
      .get(`${BINANCE_API}/api/v3/ticker/price?symbol=ADABUSD`)
      .then(({ data }) => setAdaUsdTicker(Number(data.price).toFixed(2)))
      .catch((error) => console.error(error))

    axios
      .get(`${BINANCE_API}/api/v3/ticker/24hr?symbol=ADABUSD`)
      .then(({ data }) => setAdaUsdChange24h(Number(data.priceChangePercent).toFixed(1)))
      .catch((error) => console.error(error))
  }, [])

  const styles = {
    topRow: {
      // width: '100vw',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: !isMobile && selectedPolicyId ? 'space-between' : 'center',
    },
    topRowInner: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: !isMobile && selectedPolicyId ? 'flex-end' : 'center',
    },
    walletSummary: {
      width: selectedPolicyId ? 'unset' : '100%',
      margin: '0 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: selectedPolicyId ? 'flex-start' : 'center',
    },
    summarySection: {
      margin: '0.5rem 0',
    },
    sectionTitle: {
      textAlign: selectedPolicyId ? 'start' : 'center',
    },
    stakeKey: {
      margin: '0 0 0.5rem 0',
      fontSize: '1.1rem',
      fontWeight: 'bold',
    },
    priceSummary: {
      margin: '0.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
    },
    priceSection: {
      flex: 1,
      margin: '1rem 0',
      padding: '0 1.5rem 1rem',
      backgroundColor: 'var(--apex-charcoal)',
      borderRadius: '1rem',
    },
    priceTable: {
      margin: 0,
      borderCollapse: 'collapse',
    },
  }

  return (
    <div>
      <div style={styles.topRow}>
        <div style={styles.walletSummary}>
          <div style={styles.summarySection}>
            <h2 style={styles.sectionTitle}>My Wallet</h2>
            <p style={styles.stakeKey}>
              {populatedWallet.stakeKey.substring(0, 15)}...
              {populatedWallet.stakeKey.substring(populatedWallet.stakeKey.length - 15)}
            </p>
            {populatedWallet.assets[BAD_FOX_POLICY_ID].length ? <ClayTraits /> : null}
          </div>

          <div style={styles.summarySection}>
            <h2 style={styles.sectionTitle}>Owned Collections</h2>
            <div
              className='flex-row'
              style={{
                flexWrap: 'wrap',
                justifyContent: selectedPolicyId && populatedWallet.ownsAssets ? 'unset' : 'center',
              }}
            >
              {populatedWallet.ownsAssets
                ? Object.entries(populatedWallet.assets).map(([policyId, assets]) => {
                    if (!assets.length) return null
                    const proj = projectsFile.find((proj) => proj.policyId === policyId && proj.walletPortfolio)

                    return proj ? (
                      <ProjectListItem
                        key={`owned-collections-${policyId}`}
                        name={proj.name}
                        image={proj.image}
                        onClick={() => {
                          if (selectedPolicyId !== policyId) {
                            setSelectedPolicyId(policyId)
                            setPricedItems({})
                            setFloorSnapshots([])
                          }
                        }}
                      />
                    ) : null
                  })
                : 'None 🥺'}
            </div>
          </div>
        </div>

        {selectedPolicyId ? (
          <div style={styles.topRowInner}>
            <Chart
              policyId={selectedPolicyId}
              pricedItems={pricedItems}
              setPricedItems={setPricedItems}
              floorSnapshots={floorSnapshots}
              getPricesFromAttributes={getPricesFromAttributes}
            />

            <div style={styles.priceSummary}>
              <div style={styles.priceSection}>
                <h2>ADA Ticker</h2>
                <table style={styles.priceTable}>
                  <tbody>
                    <tr>
                      <td>Price in USD&nbsp;</td>
                      <td>${adaUsdTicker}</td>
                    </tr>
                    <tr>
                      <td>Change in 24h&nbsp;</td>
                      <td>{adaUsdChange24h}%</td>
                    </tr>
                  </tbody>
                </table>

                {royaltyData.adaInVolume && royaltyData.adaInWallet ? (
                  <Fragment>
                    <h2>Collection Royalties</h2>
                    <table style={styles.priceTable}>
                      <tbody>
                        <tr>
                          <td>Total Volume&nbsp;</td>
                          <td>{formatBigNumber(royaltyData.adaInVolume)}</td>
                        </tr>
                        <tr>
                          <td>Royalties in Wallet&nbsp;</td>
                          <td>{formatBigNumber(royaltyData.adaInWallet)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </Fragment>
                ) : null}
              </div>

              <div style={styles.priceSection}>
                <h2>Portfolio Balance</h2>
                <table style={styles.priceTable}>
                  <tbody>
                    <tr>
                      <td>Investment&nbsp;</td>
                      <td>
                        {ADA_SYMBOL}
                        {formatBigNumber(totalPayed)}
                      </td>
                      <td>(${formatBigNumber(totalPayed * adaUsdTicker)})</td>
                    </tr>
                    <tr>
                      <td>Highest trait&nbsp;</td>
                      <td>
                        {ADA_SYMBOL}
                        {formatBigNumber(totalHighestTraitBalance)}
                      </td>
                      <td>(${formatBigNumber(totalHighestTraitBalance * adaUsdTicker)})</td>
                    </tr>
                    <tr>
                      <td>Floor&nbsp;</td>
                      <td>
                        {ADA_SYMBOL}
                        {formatBigNumber(totalFloorBalance)}
                      </td>
                      <td>(${formatBigNumber(totalFloorBalance * adaUsdTicker)})</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {selectedPolicyId ? <WalletAssets policyId={selectedPolicyId} /> : null}
    </div>
  )
}

export default Wallet
