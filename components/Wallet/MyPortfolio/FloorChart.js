import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import Toggle from '../../Toggle'
import styles from './MyPortfolio.module.css'
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const FloorChart = ({ chartWidth, floorData }) => {
  const [isMonth, setIsMonth] = useState(false)

  return (
    <div className={styles.chartWrapper}>
      <div className='flex-row'>
        <Toggle
          labelLeft='7d'
          labelRight='30d'
          showIcons={false}
          state={{ value: isMonth, setValue: setIsMonth }}
          style={{ margin: '0 auto 0 42px' }}
        />

        <h3 style={{ margin: '0 42px 0 auto' }}>Floor Prices</h3>
      </div>

      <ApexChart
        type='line'
        width={chartWidth}
        series={Object.entries(floorData).map(([type, arr]) => {
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
        })}
        options={{
          chart: {
            id: 'floor-chart-lines',
            type: 'line',
            stacked: false,
            toolbar: { show: true },
            zoom: { enabled: false },
          },
          xaxis: {
            categories: (() => {
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
            })(),
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
