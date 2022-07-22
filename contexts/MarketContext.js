import { createContext, useContext, useState } from 'react'
import axios from 'axios'

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
      const res = await axios.get(`/api/listings/fox`)
      setAllListedFoxes(res.data)
    } catch (error) {
      console.error(error)
      setAllListedFoxes([])
    }
  }

  const fetchAndSetRecentFoxes = async ({ sold = false, page = 1 }) => {
    try {
      const { data } = await axios.get(`/api/listings/fox/recent?sold=${sold}&page=${page}`)
      if (sold) {
        setRecentlySoldFoxes(data)
      } else {
        setRecentlyListedFoxes(data)
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
        recentlyListedFoxes,
        recentlySoldFoxes,
      }}
    >
      {children}
    </MarketContext.Provider>
  )
}
