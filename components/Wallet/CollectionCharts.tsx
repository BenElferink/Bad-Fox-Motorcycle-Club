import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Legend, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import useWallet from '../../contexts/WalletContext'
import formatBigNumber from '../../functions/formatters/formatBigNumber'
import { ADA_SYMBOL } from '../../constants'
import { FloorSnapshot, PolicyId } from '../../@types'
import { ArrowLongDownIcon, ArrowLongUpIcon } from '@heroicons/react/24/solid'

export interface CollectionChartsProps {
  policyId: PolicyId
}

type FloorResponse = {
  count: number
  items: FloorSnapshot[]
}

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Legend, Filler)

const CollectionCharts = (props: CollectionChartsProps) => {
  const { policyId } = props
  const { populatedWallet } = useWallet()
  const [floorSnapshots, setFloorSnapshots] = useState<FloorSnapshot[]>([])

  const getFloorPrices = useCallback(async () => {
    const uri = `/api/market/${policyId}/floor`
    let payload: FloorSnapshot[] = []

    try {
      const { data } = await axios.get<FloorResponse>(uri)
      payload = payload.concat(data.items)
    } catch (error) {
      console.error(error)
    }

    try {
      const { data } = await axios.get<FloorResponse>(uri + '?live=true')
      payload = payload.concat(data.items)
    } catch (error) {
      console.error(error)
    }

    setFloorSnapshots(payload)
  }, [policyId])

  useEffect(() => {
    setFloorSnapshots([])
    getFloorPrices()
  }, [getFloorPrices])

  const getAndRenderCharts = useCallback(() => {
    const numOfDataPoints = 30
    const myCollectionAssets = populatedWallet?.assets[policyId] || []
    const mutableFloorSnapshots = [...floorSnapshots]

    while (mutableFloorSnapshots.length < numOfDataPoints) {
      mutableFloorSnapshots.unshift({ timestamp: 0, policyId, attributes: {} })
    }
    while (mutableFloorSnapshots.length > numOfDataPoints) {
      mutableFloorSnapshots.shift()
    }

    const floorPayload = {
      name: 'Floor',
      data: new Array(numOfDataPoints).fill(0),
      labels: new Array(numOfDataPoints).fill(0),
      borderColor: 'rgba(183, 68, 0, 1)', // red
      backgroundColor: 'rgba(183, 68, 0, 0.4)', // red
      totalBalance: 0,
      differencePercent: 0,
      daysAgo: 0,
    }
    const highestTraitPayload = {
      name: 'Highest Trait',
      data: new Array(numOfDataPoints).fill(0),
      labels: new Array(numOfDataPoints).fill(0),
      borderColor: 'rgba(183, 68, 0, 1)', // red
      backgroundColor: 'rgba(183, 68, 0, 0.4)', // red
      totalBalance: 0,
      differencePercent: 0,
      daysAgo: 0,
    }

    if (!!floorSnapshots.length) {
      const getFloorAndTraitValues = ({
        assetId,
        floorPricesIndex,
      }: {
        assetId?: string
        floorPricesIndex?: number
      }): {
        floor: number
        highestTrait: number
      } => {
        const idx = typeof floorPricesIndex === 'number' ? floorPricesIndex : mutableFloorSnapshots.length - 1
        const floorPricesFromIndex = mutableFloorSnapshots[idx]?.attributes || {}

        let totalFloorValue = 0
        let totalHighestTraitValue = 0

        myCollectionAssets.forEach((asset) => {
          let assetFloorValue = 0
          let assetHighestTraitValue = 0

          if (!assetId || asset.assetId === assetId) {
            Object.entries(floorPricesFromIndex).forEach(([floorPricesCategory, floorPricesTraits]) => {
              const assetCategoryTraitName = asset.attributes[floorPricesCategory]
              const traitFloorValue = floorPricesTraits[assetCategoryTraitName]

              if (traitFloorValue) {
                if (traitFloorValue > assetHighestTraitValue) {
                  assetHighestTraitValue = traitFloorValue
                }

                if (traitFloorValue < assetFloorValue || assetFloorValue === 0) {
                  assetFloorValue = traitFloorValue
                }
              }
            })
          }

          totalFloorValue += assetFloorValue
          totalHighestTraitValue += assetHighestTraitValue
        })

        return {
          floor: totalFloorValue,
          highestTrait: totalHighestTraitValue,
        }
      }

      myCollectionAssets.forEach((asset) => {
        if (asset.attributes) {
          floorPayload.data = floorPayload.data.map((num, i) =>
            Math.round(num + getFloorAndTraitValues({ assetId: asset.assetId, floorPricesIndex: i }).floor)
          )

          highestTraitPayload.data = highestTraitPayload.data.map((num, i) =>
            Math.round(num + getFloorAndTraitValues({ assetId: asset.assetId, floorPricesIndex: i }).highestTrait)
          )
        }
      })

      // finalize floor object

      const floorFirstIndex = floorPayload.data.findIndex((num) => num !== 0)
      if (floorFirstIndex !== 0) {
        floorPayload.daysAgo = numOfDataPoints - floorFirstIndex
      }

      const floorFirst = floorPayload.data[floorFirstIndex]
      const floorLast = floorPayload.data[floorPayload.data.length - 1]

      const floorDifference = floorLast - floorFirst
      floorPayload.differencePercent = Number(((100 / floorFirst) * floorDifference).toFixed(2))

      if (floorDifference > 0) {
        floorPayload.borderColor = 'rgba(68, 183, 0, 1)' // green
        floorPayload.backgroundColor = 'rgba(68, 183, 0, 0.4)' // green
      }

      // finalize highest traits object

      const highestTraitFirstIndex = highestTraitPayload.data.findIndex((num) => num !== 0)
      if (highestTraitFirstIndex !== 0) {
        highestTraitPayload.daysAgo = numOfDataPoints - highestTraitFirstIndex
      }

      const highestTraitFirst = highestTraitPayload.data[highestTraitFirstIndex]
      const highestTraitLast = highestTraitPayload.data[highestTraitPayload.data.length - 1]

      const highestTraitDifference = highestTraitLast - highestTraitFirst
      highestTraitPayload.differencePercent = Number(
        ((100 / highestTraitFirst) * highestTraitDifference).toFixed(2)
      )

      if (highestTraitDifference > 0) {
        highestTraitPayload.borderColor = 'rgba(68, 183, 0, 1)' // green
        highestTraitPayload.backgroundColor = 'rgba(68, 183, 0, 0.4)' // green
      }

      // fionalize general

      const labels = mutableFloorSnapshots.map(({ timestamp }) => {
        const t = new Date(timestamp)
        const day = t.getDate()
        return day
      })

      while (labels.length < numOfDataPoints) labels.unshift(0)
      while (labels.length > numOfDataPoints) labels.shift()
      floorPayload.labels = labels
      highestTraitPayload.labels = labels

      const { floor, highestTrait } = getFloorAndTraitValues({})
      floorPayload.totalBalance = floor
      highestTraitPayload.totalBalance = highestTrait
    }

    return [floorPayload, highestTraitPayload]
  }, [policyId, populatedWallet, floorSnapshots])

  return (
    <div className='flex flex-wrap items-center justify-center'>
      {getAndRenderCharts().map(
        ({ name, data, labels, borderColor, backgroundColor, totalBalance, differencePercent, daysAgo }) => {
          const isUp = differencePercent > 0

          return (
            <div
              key={`chart-${policyId}-${name}`}
              className='relative h-56 w-64 m-1 mx-2 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700 [text-shadow:_0px_0px_2px_rgb(0_0_0_/_100%)]'
            >
              <div className='absolute top-1 right-2 z-10 text-end'>
                <h6>{name}</h6>
                <h4 className='text-2xl text-gray-200'>
                  {ADA_SYMBOL}
                  {formatBigNumber(totalBalance)}
                  {/* {formatBigNumber(totalBalance * adaInUsd)} */}
                </h4>
                <div
                  className={
                    'flex items-center text-xs ' + (isUp ? 'text-[var(--online)]' : 'text-[var(--offline)]')
                  }
                >
                  <span>{differencePercent}%</span>
                  {isUp ? <ArrowLongUpIcon className='w-4 h-4' /> : <ArrowLongDownIcon className='w-4 h-4' />}
                  <p className='text-gray-400'>than {!!daysAgo ? `${daysAgo} days ago` : 'last month'}</p>
                </div>
              </div>

              <div className='absolute bottom-0 right-0 z-0'>
                <Line
                  height={155}
                  width={255}
                  options={{
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: { display: false },
                      y: { display: false },
                    },
                    elements: {
                      line: {
                        tension: 0,
                        fill: 'start',
                        backgroundColor,
                        borderColor,
                        borderWidth: 2,
                      },
                      point: {
                        radius: 0,
                        hitRadius: 0,
                      },
                    },
                  }}
                  data={{
                    labels,
                    datasets: [{ data }],
                  }}
                />
              </div>
            </div>
          )
        }
      )}
    </div>
  )
}

export default CollectionCharts
