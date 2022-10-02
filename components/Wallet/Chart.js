import dynamic from 'next/dynamic'
import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import fromHex from '../../functions/formatters/hex/fromHex'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import formatIpfsImageUrl from '../../functions/formatters/formatIpfsImageUrl'
import getDatesFromFloorData from '../../functions/charts/getDatesFromFloorData'
import getPortfolioSeries from '../../functions/charts/getPortfolioSeries'
import Modal from '../Modal'
import Toggle from '../Toggle'
import BaseButton from '../BaseButton'
import AssetCard from '../Assets/AssetCard'

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const Chart = ({
  policyId,
  pricedItems = {},
  setPricedItems = () => null,
  floorSnapshots = [],
  getPricesFromAttributes = () => null,
}) => {
  const { isMobile, screenWidth } = useScreenSize()
  const [isMonth, setIsMonth] = useState(!isMobile)
  const [isManagePortfolio, setIsManagePortfolio] = useState(false)

  useEffect(() => {
    setIsMonth(!isMobile)
  }, [isMobile])

  const chartWidth = useCallback(() => {
    const maxWidth = 700
    const val = screenWidth && isMobile ? screenWidth - 50 : screenWidth && !isMobile ? screenWidth : 0
    if (val >= maxWidth) return maxWidth
    return val
  }, [screenWidth, isMobile])()

  const series = getPortfolioSeries(pricedItems, floorSnapshots, isMonth)
  const categories = getDatesFromFloorData(floorSnapshots, isMonth)

  const styles = {
    chartWrapper: {
      width: 'fit-content',
      margin: '0.5rem 1rem',
      padding: '1rem 0.5rem 0.2rem 0.5rem',
      backgroundColor: 'var(--apex-charcoal)',
      borderRadius: '1rem',
      cursor: 'alias',
    },
    listOfAssets: {
      width: isMobile ? 'unset' : '90vw',
      display: 'flex',
      flexFlow: 'row wrap',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    amount: {
      width: '100px',
      margin: '0',
      padding: '3px 7px',
      border: 'none',
      borderRadius: '1rem',
      color: 'var(--white)',
      fontSize: '0.7rem',
      textAlign: 'right',
    },
  }

  const assetsArr = useMemo(() => getFileForPolicyId(policyId, 'assets'), [policyId])

  return (
    <Fragment>
      <div style={styles.chartWrapper}>
        <div className='flex-row' style={{ minHeight: '50px' }}>
          <Toggle
            labelLeft='7d'
            labelRight='30d'
            showIcons={false}
            state={{ value: isMonth, setValue: setIsMonth }}
            style={{ margin: '0 auto 0 1rem', fontSize: '0.9rem' }}
          />

          <div style={{ width: '40%', margin: '0rem 1rem 0rem auto' }}>
            <BaseButton
              label='Manage Portfolio'
              onClick={() => setIsManagePortfolio(true)}
              backgroundColor='var(--brown)'
              hoverColor='var(--orange)'
              fullWidth
              size='small'
            />
          </div>
        </div>

        <ApexChart
          type='line'
          width={chartWidth}
          series={series}
          options={{
            chart: {
              id: 'portfolio-chart',
              type: 'line',
              stacked: false,
              toolbar: { show: true },
              zoom: { enabled: false },
            },
            xaxis: {
              categories,
            },
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

      <Modal title='Manage Portfolio' open={isManagePortfolio} onClose={() => setIsManagePortfolio(false)}>
        <div className='scroll' style={styles.listOfAssets}>
          {Object.entries(pricedItems)
            .sort(
              (a, b) =>
                Number(fromHex(a[0].replace(policyId, '')).split('#')[1]) -
                Number(fromHex(b[0].replace(policyId, '')).split('#')[1])
            )
            .map(([assetId, priced]) => {
              const thisAsset = assetsArr.find((asset) => asset.assetId === assetId)
              const thisPrice = priced.price
              const [thisFloor, thisHighestTraitValue] = getPricesFromAttributes(priced.attributes)

              const floorGainOrLoss = thisFloor - (thisPrice || thisFloor)
              const highestTraitGainOrLoss = thisHighestTraitValue - (thisPrice || thisHighestTraitValue)

              const boxShadow = thisPrice ? 'unset' : '0 0 5px 1px var(--orange)'

              return (
                <AssetCard
                  key={`asset-${assetId}`}
                  mainTitles={[thisAsset.displayName]}
                  subTitles={[`Rank ${thisAsset.rarityRank}`]}
                  imageSrc={formatIpfsImageUrl(thisAsset.image.ipfs, !!thisAsset.rarityRank)}
                  noClick
                  style={{ boxShadow }}
                  tableRows={[
                    [
                      'Bought for:',
                      <input
                        placeholder='0'
                        value={thisPrice || ''}
                        onChange={(e) =>
                          setPricedItems((prev) => ({
                            ...prev,
                            [assetId]: {
                              timestamp: (() => {
                                const newDate = new Date()
                                newDate.setHours(0)
                                newDate.setMinutes(0)
                                newDate.setSeconds(0)
                                newDate.setMilliseconds(0)
                                return newDate.getTime()
                              })(),
                              attributes: priced.attributes,
                              ...(prev[assetId] || {}),
                              price: Number(e.target.value),
                            },
                          }))
                        }
                        style={{ ...styles.amount, backgroundColor: 'var(--charcoal)', boxShadow }}
                      />,
                    ],
                    ['Floor:', <p style={styles.amount}>{thisFloor}</p>],
                    [
                      `Floor ${floorGainOrLoss > 0 ? 'Gain' : floorGainOrLoss < 0 ? 'Loss' : 'Gain/Loss'}:`,
                      <p style={styles.amount}>{floorGainOrLoss}</p>,
                    ],
                    ['Highest Trait:', <p style={styles.amount}>{thisHighestTraitValue}</p>],
                    [
                      `Highest Trait ${
                        highestTraitGainOrLoss > 0 ? 'Gain' : highestTraitGainOrLoss < 0 ? 'Loss' : 'Gain/Loss'
                      }:`,
                      <p style={styles.amount}>{highestTraitGainOrLoss}</p>,
                    ],
                  ]}
                />
              )
            })}
        </div>
      </Modal>
    </Fragment>
  )
}

export default Chart
