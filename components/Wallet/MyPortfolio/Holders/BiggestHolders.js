import dynamic from 'next/dynamic'
import { useScreenSize } from '../../../../contexts/ScreenSizeContext'
import styles from '../MyPortfolio.module.css'
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const BIGGEST_HOLDERS_COUNT = 50

const BiggestHolders = ({ holdersData, chartWidth }) => {
  const { isMobile } = useScreenSize()

  const biggestHolders = holdersData.filter((item, idx) => idx < BIGGEST_HOLDERS_COUNT)

  return (
    <div className={styles.chartWrapper}>
      <div className='flex-row'>
        <h3 style={{ margin: '0 42px 0 auto' }}>{BIGGEST_HOLDERS_COUNT} Biggest Holders</h3>
      </div>

      <ApexChart
        type='donut'
        width={chartWidth}
        series={biggestHolders.map((item) => item.count)}
        options={{
          chart: {
            id: `${BIGGEST_HOLDERS_COUNT}-biggest-holders-chart-donut`,
            type: 'donut',
            stacked: false,
            toolbar: { show: true },
            zoom: { enabled: false },
          },
          labels: biggestHolders.map((item) =>
            isMobile ? `${item.stakeKey.substring(0, 15)}...` : `${item.stakeKey.substring(0, 25)}...`
          ),
          dataLabels: { enabled: false },
          theme: { mode: 'dark' },
        }}
      />
    </div>
  )
}

export default BiggestHolders
