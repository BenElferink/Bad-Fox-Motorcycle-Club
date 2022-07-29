import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import Modal from '../../Modal'
import Toggle from '../../Toggle'
import BaseButton from '../../BaseButton'
import AssetCard from '../../AssetCard'
import styles from './MyPortfolio.module.css'
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const LOCAL_STORAGE_KEY = 'BadFoxMC_AssetsPrices'

const PortfolioChart = ({ chartWidth, floorData }) => {
  const { myAssets } = useAuth()

  const [isMonth, setIsMonth] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [assetPrices, setAssetPrices] = useState({})

  useEffect(() => {
    if (window) {
      const stored = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY))

      if (stored) {
        setAssetPrices(stored)
      }
    }
  }, [])

  useEffect(() => {
    if (window && JSON.stringify(assetPrices) !== JSON.stringify({})) {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(assetPrices))
    }
  }, [assetPrices])

  return (
    <div className='flex-col'>
      <h1>👇🏼 COMING SOON ! 👇🏼</h1>

      <div className={styles.chartWrapper}>
        <div className='flex-row'>
          <Toggle
            labelLeft='7d'
            labelRight='30d'
            showIcons={false}
            state={{ value: isMonth, setValue: setIsMonth }}
            style={{ margin: '0 auto 0 42px' }}
          />

          <h3 style={{ margin: '0 42px 0 auto' }}>My Portfolio</h3>
        </div>

        <ApexChart
          type='line'
          width={chartWidth}
          series={
            [] /* Object.entries(floorData).map(([type, arr]) => {
            const payload = {
              name: type,
              data: arr.map((obj) => obj.price),
            }

            if (isMonth) {
              while (payload.data.length < 30) payload.data.unshift(null)
              while (payload.data.length > 30) payload.data.shift()
            } else {
              while (payload.data.length < 7) payload.data.unshift(null)
              while (payload.data.length > 7) payload.data.shift()
            }

            return payload
          }) */
          }
          options={{
            chart: {
              id: 'floor-chart-lines',
              type: 'line',
              stacked: false,
              toolbar: { show: true },
              zoom: { enabled: false },
            },
            xaxis: {
              categories: [] /* (() => {
                const dates = Object.values(floorData)[0].map((obj) => {
                  if (obj.timestamp === 'LIVE') return obj.timestamp

                  const timestamp = new Date(obj.timestamp)
                  const month = timestamp.getMonth()
                  const day = timestamp.getDate()

                  return `${month + 1}/${day}`
                })

                if (isMonth) {
                  while (dates.length < 30) dates.unshift(0)
                  while (dates.length > 30) dates.shift()
                } else {
                  while (dates.length < 7) dates.unshift(0)
                  while (dates.length > 7) dates.shift()
                }

                return dates
              })(), */,
            },
            theme: { mode: 'dark' },
            colors: ['#ffb6e7', '#b6dbff'],
            grid: {
              show: false,
              row: { colors: ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.4)'] },
            },
          }}
        />
      </div>

      <div style={{ width: '90%' }}>
        <BaseButton
          label='Manage Asset Prices'
          onClick={() => setIsOpenModal(true)}
          backgroundColor='var(--brown)'
          hoverColor='var(--orange)'
          fullWidth
          style={{ margin: '0 auto 0.5rem auto' }}
        />
      </div>

      <h1>👆🏼 COMING SOON ! 👆🏼</h1>

      <Modal title='Manage Asset Prices' open={isOpenModal} onClose={() => setIsOpenModal(false)}>
        <div className={`scroll ${styles.listOfAssets}`}>
          {myAssets.map((item) => {
            const thisPrice = assetPrices[item.asset]?.price

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
                onClick={() => {}}
                style={{ boxShadow }}
                tableRows={[
                  [
                    'Bought for:',
                    <input
                      placeholder='0'
                      value={thisPrice || ''}
                      onChange={(e) =>
                        setAssetPrices((prev) => ({
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
