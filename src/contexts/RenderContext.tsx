import { createContext, useState, useContext, useMemo, ReactNode, Dispatch, SetStateAction, useEffect } from 'react'

const ctxInit: {
  reRender: number
  setReRender: Dispatch<SetStateAction<number>>
  userClicked: boolean
} = {
  reRender: 0,
  setReRender: () => {},
  userClicked: false,
}

const RenderContext = createContext(ctxInit)

export const useRender = () => {
  return useContext(RenderContext)
}

export const RenderProvider = ({ children }: { children: ReactNode }) => {
  const [reRender, setReRender] = useState(ctxInit.reRender)
  const [userClicked, setUserClicked] = useState(ctxInit.userClicked)

  useEffect(() => {
    const handler = () => {
      if (!userClicked) setUserClicked(true)
    }

    window.addEventListener('click', handler)
    return () => {
      window.removeEventListener('click', handler)
    }
  }, [userClicked])

  const memoedValue = useMemo(
    () => ({
      reRender,
      setReRender,
      userClicked,
    }),
    [reRender, setReRender, userClicked]
  )

  return <RenderContext.Provider value={memoedValue}>{children}</RenderContext.Provider>
}
