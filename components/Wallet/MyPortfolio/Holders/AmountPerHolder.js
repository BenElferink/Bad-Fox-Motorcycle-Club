import dynamic from 'next/dynamic'
import { useScreenSize } from '../../../../contexts/ScreenSizeContext'
import styles from '../MyPortfolio.module.css'
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const AmountPerHolder = ({ holdersData, chartWidth }) => {
  const { isMobile } = useScreenSize()

  const smallChartWidth = chartWidth / 2.1

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

  return (
    <div
      className={isMobile ? 'flex-col' : 'flex-row'}
      style={
        isMobile
          ? { width: '100vw', alignItems: 'center' }
          : { width: '100%', alignItems: 'flex-start', justifyContent: 'space-evenly' }
      }
    >
      <div className={styles.chartWrapper} style={isMobile ? {} : { height: `${smallChartWidth - 11}px` }}>
        <div className='flex-row'>
          <h3 style={{ margin: '0 42px 0 auto' }}>Amount per Holder (1-9)</h3>
        </div>

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
      </div>

      <div className={styles.chartWrapper} style={isMobile ? {} : { height: `${smallChartWidth - 11}px` }}>
        <div className='flex-row'>
          <h3 style={{ margin: '0 42px 0 auto' }}>Amount per Holder (10+)</h3>
        </div>

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
      </div>
    </div>
  )
}

export default AmountPerHolder
