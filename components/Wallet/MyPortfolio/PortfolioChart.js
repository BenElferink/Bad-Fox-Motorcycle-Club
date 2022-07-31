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

const PortfolioChart = ({ chartWidth, floorData }) => {
  const { myAssets } = useAuth()

  const [isMonth, setIsMonth] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [pricedAssets, setPricedAssets] = useState({})
  const pricedAssetsArr = Object.values(pricedAssets)

  useEffect(() => {
    if (window) {
      const stored = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY))

      if (stored) {
        let toSet = {}

        Object.entries(stored).forEach(([assetId, item]) => {
          if (myAssets.find((item) => item.asset === assetId)) {
            if (item.gender) {
              toSet[assetId] = item
            } else {
              toSet[assetId] = {
                ...item,
                gender: foxAssetsData.assets
                  .find((blockfrostAsset) => blockfrostAsset.asset === assetId)
                  .onchain_metadata.attributes.Gender.toLowerCase(),
              }
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

  const series = getPortfolioSeries(pricedAssets, floorData, isMonth)
  const categories = getDatesFromFloorData(floorData, isMonth)

  const [totalPayed, totalBalance] = (() => {
    let payedVal = 0
    let balanceVal = 0

    pricedAssetsArr.forEach(({ gender, price }) => {
      payedVal += price
      balanceVal += floorData[gender][floorData[gender].length - 1]?.price ?? 0
    })

    return [payedVal, balanceVal]
  })()

  return (
    <div>
      <AssetCard
        mainTitles={[`Total Balance: ${ADA_SYMBOL}${formatBigNumber(totalBalance)}`]}
        subTitles={[`Total Investement: ${ADA_SYMBOL}${formatBigNumber(totalPayed)}`]}
        tableRows={[[`Total Assets: ${myAssets.length}`, `Total Priced Assets: ${pricedAssetsArr.length}`]]}
        noClick
        backgroundColor='var(--apex-charcoal)'
        color='var(--white)'
        style={{ margin: '0.5rem' }}
      />

      <div className={styles.chartWrapper}>
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
              series[0].data[series[0].data.findIndex((num) => num !== null)] <
              series[0].data[series[0].data.length - 1]
                ? 'var(--online)'
                : 'var(--offline)',
              'var(--discord-purple)',
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
          {myAssets.map((item) => {
            const thisPrice = pricedAssets[item.asset]?.price

            const thisFloor =
              item.onchain_metadata.attributes.Gender === 'Female'
                ? floorData.female[floorData.female.length - 1]?.price
                : floorData.male[floorData.male.length - 1]?.price

            const gainOrLoss = thisFloor - (thisPrice || thisFloor)

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
                            gender: item.onchain_metadata.attributes.Gender.toLowerCase(),
                            ...(prev[item.asset] || {}),
                            price: Number(e.target.value),
                          },
                        }))
                      }
                      className={styles.amount}
                      style={{ backgroundColor: 'var(--apex-charcoal)', boxShadow }}
                    />,
                  ],
                  ['Floor price:', <p className={styles.amount}>{thisFloor}</p>],
                  [
                    gainOrLoss > 0 ? 'Gain:' : gainOrLoss < 0 ? 'Loss:' : 'Gain/Loss:',
                    <p className={styles.amount}>{gainOrLoss}</p>,
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
