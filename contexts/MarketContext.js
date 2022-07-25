import { createContext, useContext, useState } from 'react'
import axios from 'axios'
import { FOX_POLICY_ID } from '../constants/policy-ids'

// init context
const MarketContext = createContext()

// export the consumer
export function useMarket() {
  return useContext(MarketContext)
}

// export the provider (handle all the logic here)
export function MarketProvider({ children }) {
  const [allListedFoxes, setAllListedFoxes] = useState([])
  const [recentlyListedFoxes, setRecentlyListedFoxes] = useState([])
  const [recentlySoldFoxes, setRecentlySoldFoxes] = useState([])

  const fetchAndSetAllFoxes = async () => {
    try {
      const res = await axios.get(`/api/market/${FOX_POLICY_ID}`)
      setAllListedFoxes(res.data)
    } catch (error) {
      console.error(error)
      setAllListedFoxes([])
    }
  }

  const fetchAndSetRecentFoxes = async ({ sold = false, page = 1 }) => {
    try {
      const { data } = await axios.get(`/api/market/${FOX_POLICY_ID}/recent?sold=${sold}&page=${page}`)
      if (sold) {
        setRecentlySoldFoxes((prev) => [...prev, ...data])
      } else {
        setRecentlyListedFoxes((prev) => [...prev, ...data])
      }
    } catch (error) {
      console.error(error)
      if (sold) {
        setRecentlySoldFoxes([])
      } else {
        setRecentlyListedFoxes([])
      }
    }
  }

  return (
    <MarketContext.Provider
      value={{
        fetchAndSetAllFoxes,
        fetchAndSetRecentFoxes,
        allListedFoxes,
        recentlySoldFoxes,
        recentlyListedFoxes,
      }}
    >
      {children}
    </MarketContext.Provider>
  )
}
