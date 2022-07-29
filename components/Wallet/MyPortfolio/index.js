import { useEffect, useState } from 'react'
import axios from 'axios'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import OnChainData from './OnChainData'
import FloorChart from './FloorChart'
import HoldersChart from './HoldersChart'
import PortfolioChart from './PortfolioChart'
import { FOX_POLICY_ID } from '../../../constants/policy-ids'
import styles from './MyPortfolio.module.css'

const MyPortfolio = () => {
  const { width: windowWidth, isMobile } = useScreenSize()

  const [floorData, setFloorData] = useState({
    female: [],
    male: [],
  })

  useEffect(() => {
    const getFloorForType = (type) =>
      axios
        .get(`/api/floor/${FOX_POLICY_ID}?type=${type}`)
        .then(({ data }) =>
          setFloorData((prev) => {
            const newState = { ...prev }

            data.floors.forEach(({ type, price, timestamp }) => {
              newState[type].push({ price, timestamp })
            })

            return newState
          })
        )
        .catch((error) => console.error(error))

    getFloorForType('female')
    getFloorForType('male')
  }, []) // eslint-disable-line

  const chartWidth = (() => {
    const maxWidth = 550
    const val = windowWidth && isMobile ? windowWidth - 30 : windowWidth && !isMobile ? windowWidth : 0
    if (val >= maxWidth) return maxWidth
    return val
  })()

  return (
    <div className={styles.root}>
      <div>
        <PortfolioChart chartWidth={chartWidth} floorData={floorData} />
      </div>

      <div>
        <OnChainData />
        <FloorChart chartWidth={chartWidth} floorData={floorData} />
        <HoldersChart chartWidth={chartWidth} />
      </div>
    </div>
  )
}

export default MyPortfolio
