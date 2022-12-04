import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import axios from 'axios'
import { JpgListedItem, JpgRecentItem } from '../@types'

interface ContextValue {
  policyId: string
  allListed: JpgListedItem[]
  recentlySold: JpgRecentItem[]
  recentlyListed: JpgRecentItem[]
  fetchAndSetRecents: (options: { sold?: boolean; page?: number }) => Promise<void>
  fetchAndSetAllListed: () => Promise<void>
}

const MarketContext = createContext<ContextValue>({
  policyId: '',
  allListed: [],
  recentlySold: [],
  recentlyListed: [],
  fetchAndSetRecents: async (_options) => {},
  fetchAndSetAllListed: async () => {},
})

// export the consumer
export function useMarket() {
  return useContext(MarketContext)
}

// export the provider (handle all the logic here)
export function MarketProvider({ children, policyId }: { children: JSX.Element; policyId: string }) {
  const [allListed, setAllListed] = useState<JpgListedItem[]>([])
  const [recentlyListed, setRecentlyListed] = useState<JpgRecentItem[]>([])
  const [recentlySold, setRecentlySold] = useState<JpgRecentItem[]>([])

  const fetchAndSetAllListed = useCallback(async () => {
    const uri = `/api/market/${policyId}/listed`

    try {
      const res = await axios.get<{ count: number; items: JpgListedItem[] }>(uri)
      setAllListed(res.data.items)
    } catch (error) {
      console.error(error)
      setAllListed([])
    }
  }, [policyId])

  const fetchAndSetRecents = useCallback(
    async ({ sold = false, page = 1 }) => {
      const uri = `/api/market/${policyId}/recent?sold=${sold}&page=${page}`

      try {
        const { data } = await axios.get<{ count: number; items: JpgRecentItem[] }>(uri)
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
    },
    [policyId]
  )

  const payload = useMemo(
    () => ({
      policyId,
      allListed,
      recentlySold,
      recentlyListed,
      fetchAndSetRecents,
      fetchAndSetAllListed,
    }),
    [policyId, allListed, recentlySold, recentlyListed, fetchAndSetRecents, fetchAndSetAllListed]
  )

  return <MarketContext.Provider value={payload}>{children}</MarketContext.Provider>
}
