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

  const [floorData, setFloorData] = useState({
    female: [],
    male: [],
  })

  useEffect(() => {
    const getFloorForType = async (type, isLive) => {
      try {
        const { data } = await axios.get(`/api/floor/${FOX_POLICY_ID}${isLive ? '/live' : ''}?type=${type}`)

        setFloorData((prev) => {
          const newState = { ...prev }

          data.floors.forEach(({ type, price, timestamp }) => {
            newState[type].push({ price, timestamp })
          })

          return newState
        })
      } catch (error) {
        console.error(error)
      }
    }

    ;(async () => {
      await getFloorForType('female')
      await getFloorForType('male')
      await getFloorForType('female', 'LIVE')
      await getFloorForType('male', 'LIVE')
    })()
  }, []) // eslint-disable-line

  const chartWidth = (() => {
    const maxWidth = 550
    const val = windowWidth && isMobile ? windowWidth - 30 : windowWidth && !isMobile ? windowWidth : 0
    if (val >= maxWidth) return maxWidth
    return val
  })()

  return (
    <div className={styles.root}>
      <div className={styles.wrap}>
        <div>
          <PortfolioChart chartWidth={chartWidth} floorData={floorData} />
        </div>

        <div>
          <OnChainData />
          <FloorChart chartWidth={chartWidth} floorData={floorData} />
        </div>
      </div>

      <div>
        <Holders chartWidth={chartWidth} />
      </div>
    </div>
  )
}

export default MyPortfolio
