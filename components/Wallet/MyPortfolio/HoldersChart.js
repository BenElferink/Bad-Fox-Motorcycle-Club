import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import Loader from '../../Loader'
import { FOX_POLICY_ID } from '../../../constants/policy-ids'
import styles from './MyPortfolio.module.css'
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const BIGGEST_HOLDERS_COUNT = 50

const HoldersChart = ({ chartWidth }) => {
  const { isMobile } = useScreenSize()
  const [loading, setLoading] = useState(false)
  const [holdersData, setHoldersData] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`/api/holders/${FOX_POLICY_ID}`)

        setHoldersData(data)
      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    })()
  }, [])

  const biggestHolders = holdersData.filter((item, idx) => idx < BIGGEST_HOLDERS_COUNT)

  const [amountPerSmallHolders, amountPerBigHolders] = (() => {
    const smallPayload = [
      { label: '1', wallets: 0 },
      { label: '2', wallets: 0 },
      { label: '3', wallets: 0 },
      { label: '4', wallets: 0 },
      { label: '5', wallets: 0 },
      { label: '6', wallets: 0 },
      { label: '7', wallets: 0 },
      { label: '8', wallets: 0 },
      { label: '9', wallets: 0 },
    ]

    const bigPayload = [
      { label: '10-19', wallets: 0 },
      { label: '20-29', wallets: 0 },
      { label: '30-39', wallets: 0 },
      { label: '40-49', wallets: 0 },
      { label: '50-99', wallets: 0 },
      { label: '100+', wallets: 0 },
    ]

    const addToPayload = (str, size) => {
      if (size === 'small') {
        const idx = smallPayload.findIndex((item) => item.label === str)

        smallPayload[idx] = {
          label: str,
          wallets: (smallPayload[idx].wallets += 1),
        }
      } else if (size === 'big') {
        const idx = bigPayload.findIndex((item) => item.label === str)

        bigPayload[idx] = {
          label: str,
          wallets: (bigPayload[idx].wallets += 1),
        }
      }
    }

    holdersData.forEach((item) => {
      if (item.count === 1) {
        addToPayload('1', 'small')
      } else if (item.count === 2) {
        addToPayload('2', 'small')
      } else if (item.count === 3) {
        addToPayload('3', 'small')
      } else if (item.count === 4) {
        addToPayload('4', 'small')
      } else if (item.count === 5) {
        addToPayload('5', 'small')
      } else if (item.count === 6) {
        addToPayload('6', 'small')
      } else if (item.count === 7) {
        addToPayload('7', 'small')
      } else if (item.count === 8) {
        addToPayload('8', 'small')
      } else if (item.count === 9) {
        addToPayload('9', 'small')
      } else if (item.count < 20) {
        addToPayload('10-19', 'big')
      } else if (item.count < 30) {
        addToPayload('20-29', 'big')
      } else if (item.count < 40) {
        addToPayload('30-39', 'big')
      } else if (item.count < 50) {
        addToPayload('40-49', 'big')
      } else if (item.count < 100) {
        addToPayload('50-99', 'big')
      } else {
        addToPayload('100+', 'big')
      }
    })

    return [smallPayload, bigPayload]
  })()

  const smallChartWidth = chartWidth / 2.1

  return (
    <div className='flex-col'>
      <div className={styles.chartWrapper}>
        <div className='flex-row'>
          <h3 style={{ margin: '0 42px 0 auto' }}>{BIGGEST_HOLDERS_COUNT} Biggest Holders</h3>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <ApexChart
            type='donut'
            width={chartWidth}
            series={biggestHolders.map((item) => item.count)}
            options={{
              chart: {
                id: 'biggest-holders-chart-donut',
                type: 'donut',
                stacked: false,
                toolbar: { show: true },
                zoom: { enabled: false },
              },
              labels: biggestHolders.map((item) =>
                isMobile ? `${item.stakeKey.substring(0, 15)}...` : `${item.stakeKey.substring(0, 25)}...`
              ),
              dataLabels: { enabled: false },
              theme: {
                mode: 'dark',
                // monochrome: {
                //   enabled: true,
                // },
              },
            }}
          />
        )}
      </div>

      <div
        className={isMobile ? 'flex-col' : 'flex-row'}
        style={
          isMobile
            ? { width: '100vw', alignItems: 'center' }
            : { width: '100%', alignItems: 'flex-start', justifyContent: 'space-evenly' }
        }
      >
        <div className={styles.chartWrapper} style={isMobile ? {} : { margin: '0' }}>
          <div className='flex-row'>
            <h3 style={{ margin: '0 42px 0 auto' }}>Amount per Holder (1-9)</h3>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <ApexChart
              type='pie'
              width={isMobile ? chartWidth : smallChartWidth}
              series={amountPerSmallHolders.map((item) => item?.wallets)}
              options={{
                chart: {
                  id: 'amount-per-small-holder-chart-pie',
                  type: 'pie',
                  stacked: false,
                  toolbar: { show: true },
                  zoom: { enabled: false },
                },
                labels: amountPerSmallHolders.map((item) => item?.label),
                dataLabels: { enabled: true },
                theme: { mode: 'dark' },
              }}
            />
          )}
        </div>

        <div className={styles.chartWrapper} style={isMobile ? {} : { margin: '0' }}>
          <div className='flex-row'>
            <h3 style={{ margin: '0 42px 0 auto' }}>Amount per Holder (10+)</h3>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <ApexChart
              type='pie'
              width={isMobile ? chartWidth : smallChartWidth}
              series={amountPerBigHolders.map((item) => item?.wallets)}
              options={{
                chart: {
                  id: 'amount-per-big-holder-chart-pie',
                  type: 'pie',
                  stacked: false,
                  toolbar: { show: true },
                  zoom: { enabled: false },
                },
                labels: amountPerBigHolders.map((item) => item?.label),
                dataLabels: { enabled: true },
                theme: { mode: 'dark' },
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default HoldersChart
