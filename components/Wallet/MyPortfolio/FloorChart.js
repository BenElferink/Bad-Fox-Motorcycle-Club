import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import getDatesFromFloorData from '../../../functions/charts/getDatesFromFloorData'
import getFloorSeries from '../../../functions/charts/getFloorSeries'
import Toggle from '../../Toggle'
import styles from './MyPortfolio.module.css'
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const FloorChart = ({ chartWidth, floorData }) => {
  const [isMonth, setIsMonth] = useState(false)

  return (
    <div className={styles.chartWrapper}>
      <div className='flex-row' style={{ minHeight: '50px' }}>
        <Toggle
          labelLeft='7d'
          labelRight='30d'
          showIcons={false}
          state={{ value: isMonth, setValue: setIsMonth }}
          style={{ margin: '0 auto 0 1rem' }}
        />

        <h3 style={{ margin: '0 1rem 0 auto' }}>Floor Prices</h3>
      </div>

      <ApexChart
        type='line'
        width={chartWidth}
        series={getFloorSeries(floorData, isMonth)}
        options={{
          chart: {
            id: 'floor-chart-lines',
            type: 'line',
            stacked: false,
            toolbar: { show: true },
            zoom: { enabled: false },
          },
          xaxis: {
            categories: getDatesFromFloorData(floorData, isMonth),
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
  )
}

export default FloorChart
