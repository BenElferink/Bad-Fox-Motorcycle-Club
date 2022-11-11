import { createContext, useContext, useState } from 'react'

// init context
const MintContext = createContext()

// export the consumer
export function useMint() {
  return useContext(MintContext)
}

// export the provider (handle all the logic here)
export function MintProvider({ children }) {
  const PRE_SALE_DATE_TIME = new Date('2022-11-11T07:00:00.000+00:00')
  const PUBLIC_SALE_DATE_TIME = new Date('2022-11-11T19:00:00.000+00:00')
  const SOLD_OUT = false

  const isItPreSaleTime = (d) =>
    d.getTime() >= PRE_SALE_DATE_TIME.getTime() && d.getTime() < PUBLIC_SALE_DATE_TIME.getTime()
  const isItPublicSaleTime = (d) => !SOLD_OUT && d.getTime() >= PUBLIC_SALE_DATE_TIME.getTime()

  const [isPreSaleOnline, setIsPreSaleOnline] = useState(isItPreSaleTime(new Date()))
  const [isPublicSaleOnline, setIsPublicSaleOnline] = useState(isItPublicSaleTime(new Date()))

  const triggerMintStates = () => {
    setIsPreSaleOnline(isItPreSaleTime(new Date()))
    setIsPublicSaleOnline(isItPublicSaleTime(new Date()))
  }

  return (
    <MintContext.Provider
      value={{
        PRE_SALE_DATE_TIME,
        PUBLIC_SALE_DATE_TIME,
        isPreSaleOnline,
        isPublicSaleOnline,
        triggerMintStates,
      }}
    >
      {children}
    </MintContext.Provider>
  )
}
