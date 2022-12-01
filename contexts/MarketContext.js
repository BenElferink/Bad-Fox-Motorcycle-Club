import { createContext, useContext, useState } from 'react'
import axios from 'axios'

// init context
const MarketContext = createContext()

// export the consumer
export function useMarket() {
  return useContext(MarketContext)
}

// export the provider (handle all the logic here)
export function MarketProvider({ children, policyId }) {
  const [allListed, setAllListed] = useState([])
  const [recentlyListed, setRecentlyListed] = useState([])
  const [recentlySold, setRecentlySold] = useState([])

  const fetchAndSetAllListed = async () => {
    try {
      const res = await axios.get(`/api/market/${policyId}/listed`)
      setAllListed(res.data.items)
    } catch (error) {
      console.error(error)
      setAllListed([])
    }
  }

  const fetchAndSetRecents = async ({ sold = false, page = 1 }) => {
    try {
      const { data } = await axios.get(`/api/market/${policyId}/recent?sold=${sold}&page=${page}`)
      if (sold) {
        setRecentlySold((prev) => [...prev, ...data.items])
      } else {
        setRecentlyListed((prev) => [...prev, ...data.items])
      }
    } catch (error) {
      console.error(error)
      if (sold) {
        setRecentlySold([])
      } else {
        setRecentlyListed([])
      }
    }
  }

  return (
    <MarketContext.Provider
      value={{
        policyId,
        allListed,
        recentlySold,
        recentlyListed,
        fetchAndSetRecents,
        fetchAndSetAllListed,
      }}
    >
      {children}
    </MarketContext.Provider>
  )
}
