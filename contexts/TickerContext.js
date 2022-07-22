import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { BINANCE_API } from '../constants/api-urls'

const TICKER_PRICE_URL = `${BINANCE_API}/api/v3/ticker/price?symbol=ADABUSD`
const TICKER_CHANGE_URL = `${BINANCE_API}/api/v3/ticker/24hr?symbol=ADABUSD`

// init context
const TickerContext = createContext()

// export the consumer
export function useTicker() {
  return useContext(TickerContext)
}

// export the provider (handle all the logic here)
export function TickerProvider({ children }) {
  const [adaUsdTicker, setAdaUsdTicker] = useState('0')
  const [adaUsdChange24h, setAdaUsdChange24h] = useState('0')

  useEffect(() => {
    axios
      .get(TICKER_PRICE_URL)
      .then(({ data }) => setAdaUsdTicker(Number(data.price).toFixed(2)))
      .catch((error) => console.error(error))

    axios
      .get(TICKER_CHANGE_URL)
      .then(({ data }) => setAdaUsdChange24h(Number(data.priceChangePercent).toFixed(1)))
      .catch((error) => console.error(error))
  }, []) // eslint-disable-line

  return (
    <TickerContext.Provider
      value={{
        adaUsdTicker,
        adaUsdChange24h,
      }}
    >
      {children}
    </TickerContext.Provider>
  )
}
