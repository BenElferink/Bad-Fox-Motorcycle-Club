import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import foxAssetsData from '../../../data/assets/fox'
import getDatesFromFloorData from '../../../functions/charts/getDatesFromFloorData'
import getPortfolioSeries from '../../../functions/charts/getPortfolioSeries'
import formatBigNumber from '../../../functions/formatters/formatBigNumber'
import Toggle from '../../Toggle'
import BaseButton from '../../BaseButton'
import Modal from '../../Modal'
import AssetCard from '../../AssetCard'
import { ADA_SYMBOL } from '../../../constants/ada'
import styles from './MyPortfolio.module.css'
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const LOCAL_STORAGE_KEY = 'BadFoxMC_AssetsPrices'

const PortfolioChart = ({ chartWidth, floorSnapshots }) => {
  const { myAssets } = useAuth()

  const [isMonth, setIsMonth] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [pricedAssets, setPricedAssets] = useState({})
  const pricedAssetsArr = Object.values(pricedAssets)

  const getValuesForAttributes = (itemAttributes) => {
    let floor = 0
    let highestTrait = 0

    Object.entries(floorSnapshots[floorSnapshots.length - 1]?.attributes ?? {}).forEach(([category, traits]) => {
      const v = traits[itemAttributes[category]]

      if (highestTrait < v) {
        highestTrait = v
      }

      if (floor === 0 || floor > v) {
        floor = v
      }
    })

    return [floor, highestTrait]
  }

  useEffect(() => {
    if (window) {
      const stored = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY))

      if (stored) {
        let toSet = {}

        Object.entries(stored).forEach(([assetId, item]) => {
          if (myAssets.find((item) => item.asset === assetId)) {
            const foundAsset = foxAssetsData.assets.find((blockfrostAsset) => blockfrostAsset.asset === assetId)

            toSet[assetId] = {
              price: item.price,
              timestamp: item.timestamp,
              attributes: foundAsset.onchain_metadata.attributes,
            }
          }
        })

        setPricedAssets(toSet)
      }
    }
  }, [])

  useEffect(() => {
    if (window && JSON.stringify(pricedAssets) !== JSON.stringify({})) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pricedAssets))
    }
  }, [pricedAssets])

  const series = getPortfolioSeries(pricedAssets, floorSnapshots, isMonth)
  const categories = getDatesFromFloorData(floorSnapshots, isMonth)

  const [totalPayed, totalFloorBalance, totalHighestTraitBalance] = (() => {
    let payedVal = 0
    let floorBalanceVal = 0
    let highestTraitBalanceVal = 0

    pricedAssetsArr.forEach(({ price, attributes }) => {
      const [thisFloor, thisHighestTraitValue] = getValuesForAttributes(attributes)

      payedVal += price
      floorBalanceVal += thisFloor
      highestTraitBalanceVal += thisHighestTraitValue
    })

    return [payedVal, floorBalanceVal, highestTraitBalanceVal]
  })()

  return (
    <div>
      <AssetCard
        mainTitles={[`Total Investment: ${ADA_SYMBOL}${formatBigNumber(totalPayed)}`]}
        subTitles={[
          `Total Balance by Floor: ${ADA_SYMBOL}${formatBigNumber(totalFloorBalance)}`,
          `Total Balance by Highest Trait: ${ADA_SYMBOL}${formatBigNumber(totalHighestTraitBalance)}`,
        ]}
        tableRows={[[`Total Assets: ${myAssets.length}`, `Total Priced Assets: ${pricedAssetsArr.length}`]]}
        noClick
        backgroundColor='var(--apex-charcoal)'
        color='var(--white)'
        style={{ margin: '0.5rem' }}
      />

      <div className={styles.chartWrapper} style={{ minHeight: chartWidth - 100 }}>
        <div className='flex-row' style={{ minHeight: '50px' }}>
          <Toggle
            labelLeft='7d'
            labelRight='30d'
            showIcons={false}
            state={{ value: isMonth, setValue: setIsMonth }}
            style={{ margin: '0 auto 0 1rem' }}
          />

          <div style={{ width: '40%', margin: '0rem 1rem 0rem auto' }}>
            <BaseButton
              label='Manage Priced Assets'
              onClick={() => setIsOpenModal(true)}
              backgroundColor='var(--brown)'
              hoverColor='var(--orange)'
              fullWidth
            />
          </div>
        </div>

        <ApexChart
          type='area'
          width={chartWidth}
          series={series}
          options={{
            chart: {
              id: 'portfolio-chart-area',
              type: 'area',
              stacked: false,
              toolbar: { show: true },
              zoom: { enabled: false },
            },
            xaxis: { categories },
            theme: { mode: 'dark' },
            colors: [
              'var(--discord-purple)',
              series[1].data[series[1].data.findIndex((num) => num !== null)] <
              series[1].data[series[1].data.length - 1]
                ? 'var(--online)'
                : 'var(--offline)',
              series[2].data[series[2].data.findIndex((num) => num !== null)] <
              series[2].data[series[2].data.length - 1]
                ? 'var(--online)'
                : 'var(--offline)',
            ],
            grid: {
              show: false,
              row: { colors: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.4)'] },
            },
          }}
        />
      </div>

      <Modal title='Manage Priced Assets' open={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <div className={`scroll ${styles.listOfAssets}`}>
          {myAssets
            .sort(
              (a, b) =>
                Number(a.onchain_metadata.name.replace('Bad Fox #', '')) -
                Number(b.onchain_metadata.name.replace('Bad Fox #', ''))
            )
            .map((item) => {
              const thisPrice = pricedAssets[item.asset]?.price

              const [thisFloor, thisHighestTraitValue] = getValuesForAttributes(item.onchain_metadata.attributes)

              const floorGainOrLoss = thisFloor - (thisPrice || thisFloor)
              const highestTraitGainOrLoss = thisHighestTraitValue - (thisPrice || thisHighestTraitValue)

              const boxShadow = thisPrice ? 'unset' : '0 0 5px 1px var(--orange)'

              return (
                <AssetCard
                  key={`asset-${item.asset}`}
                  mainTitles={[item.onchain_metadata.name]}
                  subTitles={[`Rank ${item.onchain_metadata.rank}`]}
                  imageSrc={item.onchain_metadata.image.cnftTools}
                  imageSizeDesktop={270}
                  imageSizeMobile={250}
                  noClick
                  style={{ boxShadow }}
                  tableRows={[
                    [
                      'Bought for:',
                      <input
                        placeholder='0'
                        value={thisPrice || ''}
                        onChange={(e) =>
                          setPricedAssets((prev) => ({
                            ...prev,
                            [item.asset]: {
                              timestamp: (() => {
                                const newDate = new Date()
                                newDate.setHours(0)
                                newDate.setMinutes(0)
                                newDate.setSeconds(0)
                                newDate.setMilliseconds(0)
                                return newDate.getTime()
                              })(),
                              attributes: item.onchain_metadata.attributes,
                              ...(prev[item.asset] || {}),
                              price: Number(e.target.value),
                            },
                          }))
                        }
                        className={styles.amount}
                        style={{ backgroundColor: 'var(--apex-charcoal)', boxShadow }}
                      />,
                    ],
                    ['Floor:', <p className={styles.amount}>{thisFloor}</p>],
                    [
                      `Floor ${floorGainOrLoss > 0 ? 'Gain' : floorGainOrLoss < 0 ? 'Loss' : 'Gain/Loss'}:`,
                      <p className={styles.amount}>{floorGainOrLoss}</p>,
                    ],
                    ['Highest Trait:', <p className={styles.amount}>{thisHighestTraitValue}</p>],
                    [
                      `Highest Trait ${
                        highestTraitGainOrLoss > 0 ? 'Gain' : highestTraitGainOrLoss < 0 ? 'Loss' : 'Gain/Loss'
                      }:`,
                      <p className={styles.amount}>{highestTraitGainOrLoss}</p>,
                    ],
                  ]}
                />
              )
            })}
        </div>
      </Modal>
    </div>
  )
}

export default PortfolioChart
