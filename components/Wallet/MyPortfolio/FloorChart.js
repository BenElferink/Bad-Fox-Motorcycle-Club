import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { FormControl, MenuItem, Select } from '@mui/material'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import getFloorSeries from '../../../functions/charts/getFloorSeries'
import getDatesFromFloorData from '../../../functions/charts/getDatesFromFloorData'
import Toggle from '../../Toggle'
import styles from './MyPortfolio.module.css'
import traitsData from '../../../data/traits/fox'
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

const TRAIT_CATEGORIES = Object.keys(traitsData)
  .map((cat) => cat)
  .sort((a, b) => a.localeCompare(b))

const FloorChart = ({ chartWidth, floorSnapshots }) => {
  const { isMobile } = useScreenSize()

  const [isMonth, setIsMonth] = useState(!isMobile)
  const [selectedCategory, setSelectedCategory] = useState('Gender')

  useEffect(() => {
    setIsMonth(!isMobile)
  }, [isMobile])

  return (
    <div className={styles.chartWrapper} style={{ minHeight: chartWidth - 100 }}>
      <div className='flex-row' style={{ minHeight: '50px' }}>
        <Toggle
          labelLeft='7d'
          labelRight='30d'
          showIcons={false}
          state={{ value: isMonth, setValue: setIsMonth }}
          style={{ margin: '0 auto 0 1rem' }}
        />

        <FormControl sx={{ margin: '0 1rem 0 auto', width: 150 }}>
          <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            {TRAIT_CATEGORIES.map((cat) => (
              <MenuItem key={`category-${cat}`} value={cat} sx={{ justifyContent: 'space-between' }}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <ApexChart
        type='line'
        width={chartWidth}
        series={getFloorSeries(floorSnapshots, isMonth, selectedCategory)}
        options={{
          chart: {
            id: 'floor-chart-lines',
            type: 'line',
            stacked: false,
            toolbar: { show: true },
            zoom: { enabled: false },
          },
          xaxis: {
            categories: getDatesFromFloorData(floorSnapshots, isMonth),
          },
          theme: { mode: 'dark' },
          colors: selectedCategory === 'Gender' ? ['#ffb6e7', '#b6dbff'] : undefined,
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
