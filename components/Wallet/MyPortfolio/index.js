import { useEffect, useState } from 'react'
import axios from 'axios'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import PortfolioChart from './PortfolioChart'
import OnChainData from './OnChainData'
import FloorChart from './FloorChart'
import Holders from './Holders'
import { BAD_FOX_POLICY_ID } from '../../../constants/policy-ids'
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
  const [wallets, setWallets] = useState([])

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(`/api/snapshots/floor-prices/${BAD_FOX_POLICY_ID}`)

        setFloorSnapshots(data.snapshots)
      } catch (error) {
        console.error(error)
      }
    })()
  }, []) // eslint-disable-line

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get('/api/wallets')

        setWallets(data.wallets)
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
        <Holders chartWidth={chartWidth} wallets={wallets} />
      </div>
    </div>
  )
}

export default MyPortfolio
