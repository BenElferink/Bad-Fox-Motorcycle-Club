import React, { Fragment, useCallback, useMemo, useState } from 'react'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import getDatesFromFloorData from '../../functions/charts/getDatesFromFloorData'
import getPortfolioSeries from '../../functions/charts/getPortfolioSeries'
import formatIpfsImageUrl from '../../functions/formatters/formatIpfsImageUrl'
import fromHex from '../../functions/formatters/hex/fromHex'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import AssetCard from '../Assets/AssetCard'
import BaseButton from '../BaseButton'
import Modal from '../Modal'

// TODO:
// https://towardsdev.com/chart-js-next-js-beautiful-data-driven-dashboards-how-to-create-them-fast-and-efficiently-a59e313a3153
// https://miro.medium.com/max/640/1*FuLAoztQMgX9X_TEUGRWwg.webp
// https://www.chartjs.org/docs/latest/samples/line/multi-axis.html

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Filler)

const Chart = ({
  policyId,
  pricedItems = {},
  setPricedItems = () => null,
  floorSnapshots = [],
  getPricesFromAttributes = () => null,
}) => {
  const { isMobile, screenWidth } = useScreenSize()
  const [isManagePortfolio, setIsManagePortfolio] = useState(false)

  const chartWidth = useCallback(() => {
    const maxWidth = 640
    const val = screenWidth && isMobile ? screenWidth - 50 : screenWidth && !isMobile ? screenWidth : 0
    if (val >= maxWidth) return maxWidth
    return val
  }, [screenWidth, isMobile])()

  const series = getPortfolioSeries(pricedItems, floorSnapshots)
  const categories = getDatesFromFloorData(floorSnapshots)

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
      {/* <div style={{ backgroundColor: 'whitesmoke' }}>
        <div>
          <h6 style={{ color: 'grey' }}>Sales netto</h6>
          <h4 style={{ color: 'black' }}>$306.20</h4>
          <div>
            <span style={{ color: 'red' }}>1.3%</span>
            <span style={{ color: 'red' }}>↓</span>
            <p style={{ color: 'grey' }}>than last month</p>
          </div>
        </div>

        <div>
          <Line
            width={200}
            height={100}
            options={{
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  display: false,
                },
                y: {
                  display: false,
                },
              },
              elements: {
                line: {
                  tension: 0,
                  borderWidth: 2,
                  borderColor: 'rgba(47,97,68, 1)',
                  fill: 'start',
                  backgroundColor: 'rgba(47,97,68, 0.3)',
                },
                point: {
                  radius: 0,
                  hitRadius: 0,
                },
              },
            }}
            data={{
              labels: categories,
              datasets: [
                {
                  data: series[2].data,
                },
              ],
            }}
          />
        </div>
      </div> */}

      <div style={styles.chartWrapper}>
        <Line
          width={chartWidth}
          height={chartWidth * 0.7}
          options={{
            // plugins: {
            //   legend: {
            //     display: false,
            //   },
            // },
            scales: {
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                display: false,
              },
            },
            elements: {
              line: {
                tension: 0,
                borderWidth: 2,
                fill: 'start',
                // borderColor: 'rgba(47,97,68, 1)',
                // backgroundColor: 'rgba(47,97,68, 0.3)',
              },
              point: {
                radius: 0,
                hitRadius: 0,
              },
            },
          }}
          data={{
            labels: categories,
            datasets: series,
          }}
        />

        <BaseButton
          label='Manage Portfolio'
          onClick={() => setIsManagePortfolio(true)}
          backgroundColor='var(--brown)'
          hoverColor='var(--orange)'
          fullWidth
          size='small'
          style={{ margin: 0 }}
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
                        key={`portfolio-asset-price-${assetId}`}
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
                    [
                      'Floor:',
                      <p key={`portfolio-asset-floorValue-${assetId}`} style={styles.amount}>
                        {thisFloor}
                      </p>,
                    ],
                    [
                      `Floor ${floorGainOrLoss > 0 ? 'Gain' : floorGainOrLoss < 0 ? 'Loss' : 'Gain/Loss'}:`,
                      <p key={`portfolio-asset-gainOrLoss-${assetId}`} style={styles.amount}>
                        {floorGainOrLoss}
                      </p>,
                    ],
                    [
                      'Highest Trait:',
                      <p key={`portfolio-asset-highestTraitValue-${assetId}`} style={styles.amount}>
                        {thisHighestTraitValue}
                      </p>,
                    ],
                    [
                      `Highest Trait ${
                        highestTraitGainOrLoss > 0 ? 'Gain' : highestTraitGainOrLoss < 0 ? 'Loss' : 'Gain/Loss'
                      }:`,
                      <p key={`portfolio-asset-highestTraitGainOrLoss-${assetId}`} style={styles.amount}>
                        {highestTraitGainOrLoss}
                      </p>,
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
