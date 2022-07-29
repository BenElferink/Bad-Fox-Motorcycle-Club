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

  // const amountPerHolders = (() => {
  //   const payload = new Array(7).fill(null)

  //   const addToPayload = (str, idx) => {
  //     if (payload[idx]) {
  //       payload[idx].wallets += 1
  //     } else {
  //       payload[idx] = {
  //         label: str,
  //         wallets: 1,
  //       }
  //     }
  //   }

  //   holdersData.forEach((item) => {
  //     if (item.count < 10) {
  //       addToPayload('1-9', 0)
  //     } else if (item.count < 20) {
  //       addToPayload('10-19', 1)
  //     } else if (item.count < 30) {
  //       addToPayload('20-29', 2)
  //     } else if (item.count < 40) {
  //       addToPayload('30-39', 3)
  //     } else if (item.count < 50) {
  //       addToPayload('40-49', 4)
  //     } else if (item.count < 100) {
  //       addToPayload('50-99', 5)
  //     } else {
  //       addToPayload('100+', 6)
  //     }
  //   })

  //   return payload
  // })()

  // const amountPerSmallHolders = (() => {
  //   const payload = new Array(9).fill(null)

  //   const addToPayload = (str, idx) => {
  //     if (payload[idx]) {
  //       payload[idx].wallets += 1
  //     } else {
  //       payload[idx] = {
  //         label: str,
  //         wallets: 1,
  //       }
  //     }
  //   }

  //   holdersData.forEach((item) => {
  //     if (item.count === 1) {
  //       addToPayload('1', 0)
  //     } else if (item.count === 2) {
  //       addToPayload('2', 1)
  //     } else if (item.count === 3) {
  //       addToPayload('3', 2)
  //     } else if (item.count === 4) {
  //       addToPayload('4', 3)
  //     } else if (item.count === 5) {
  //       addToPayload('5', 4)
  //     } else if (item.count === 6) {
  //       addToPayload('6', 5)
  //     } else if (item.count === 7) {
  //       addToPayload('7', 6)
  //     } else if (item.count === 8) {
  //       addToPayload('8', 7)
  //     } else if (item.count === 9) {
  //       addToPayload('9', 8)
  //     }
  //   })

  //   return payload
  // })()

  return (
    // <div className='flex-col'>
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

    /* <div className='flex-row'>
        <div className={styles.chartWrapper}>
          <div className='flex-row'>
            <h3 style={{ margin: '0 42px 0 auto' }}>Amount per Holder</h3>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <ApexChart
              type='pie'
              width={(() => {
                const val = windowWidth && isMobile ? windowWidth - 50 : windowWidth && !isMobile ? windowWidth : 0
                if (val >= 350) return 350
                return val
              })()}
              series={amountPerHolders.map((item) => item?.wallets)}
              options={{
                chart: {
                  id: 'amount-per-holder-chart-pie',
                  type: 'pie',
                  stacked: false,
                  toolbar: { show: true },
                  zoom: { enabled: false },
                },
                labels: amountPerHolders.map((item) => item?.label),
                dataLabels: { enabled: true },
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

        <div className={styles.chartWrapper}>
          <div className='flex-row'>
            <h3 style={{ margin: '0 42px 0 auto' }}>Amount per Small Holder</h3>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <ApexChart
              type='pie'
              width={(() => {
                const val = windowWidth && isMobile ? windowWidth - 50 : windowWidth && !isMobile ? windowWidth : 0
                if (val >= 350) return 350
                return val
              })()}
              series={amountPerSmallHolders.map((item) => item?.wallets)}
              options={{
                chart: {
                  id: 'amount-per-holder-chart-pie',
                  type: 'pie',
                  stacked: false,
                  toolbar: { show: true },
                  zoom: { enabled: false },
                },
                labels: amountPerSmallHolders.map((item) => item?.label),
                dataLabels: { enabled: true },
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
      </div>
    </div> */
  )
}

export default HoldersChart
