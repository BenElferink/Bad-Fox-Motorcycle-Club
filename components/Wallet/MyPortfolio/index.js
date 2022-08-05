import { useEffect, useState } from 'react'
import axios from 'axios'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import PortfolioChart from './PortfolioChart'
import OnChainData from './OnChainData'
import FloorChart from './FloorChart'
import Holders from './Holders'
import { FOX_POLICY_ID } from '../../../constants/policy-ids'
import styles from './MyPortfolio.module.css'

const MyPortfolio = () => {
  const { width: windowWidth, isMobile } = useScreenSize()

  const chartWidth = (() => {
    const maxWidth = 550
    const val = windowWidth && isMobile ? windowWidth - 30 : windowWidth && !isMobile ? windowWidth : 0
    if (val >= maxWidth) return maxWidth
    return val
  })()

  const [floorSnapshots, setFloorSnapshots] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(`/api/floor/${FOX_POLICY_ID}/snapshots`)

        setFloorSnapshots(data.snapshots)
      } catch (error) {
        console.error(error)
      }
    })()
  }, []) // eslint-disable-line

  return (
    <div className={styles.root}>
      <div className={styles.wrap}>
        <div>
          <PortfolioChart chartWidth={chartWidth} floorSnapshots={floorSnapshots} />
        </div>

        <div>
          <OnChainData />
          <FloorChart chartWidth={chartWidth} floorSnapshots={floorSnapshots} />
        </div>
      </div>

      <div>
        <Holders chartWidth={chartWidth} />
      </div>
    </div>
  )
}

export default MyPortfolio
