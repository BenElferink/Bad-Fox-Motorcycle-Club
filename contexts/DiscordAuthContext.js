import { createContext, useContext, useState } from 'react'
import axios from 'axios'

// init context
const DiscordAuthContext = createContext()

// export the consumer
export function useDiscordAuth() {
  return useContext(DiscordAuthContext)
}

// export the provider (handle all the logic here)
export function DiscordAuthProvider({ children }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({})
  const [token, setToken] = useState('')
  const [member, setMember] = useState({})

  const clearError = () => {
    setError({})
  }

  const getMemberWithToken = async (str) => {
    const t = str ?? token

    if (t) {
      setToken(t)
      setLoading(true)

      try {
        const res = await axios.get(`/api/discord-member?token=${t}`)

        setMember(res.data)
        clearError()
      } catch (error) {
        const e = error?.response?.data ?? {
          type: 'UNEXPECTED',
          message: error?.message ?? 'Unexpected error!',
        }

        setError(e)
      }

      setLoading(false)
    }
  }

  const patchMemberWalletAddress = async (str) => {
    if (!str) {
      return alert('Please enter a wallet address')
    } else if (str.indexOf('addr1') !== 0) {
      return alert('Please enter a valid wallet address (starts with addr1)')
    }

    setLoading(true)

    try {
      const res = await axios.patch(`/api/discord-member?token=${token}`, {
        walletAddress: str,
      })

      setMember(res.data)
      clearError()
    } catch (error) {
      const e = error?.response?.data ?? {
        type: 'UNEXPECTED',
        message: error?.message ?? 'Unexpected error!',
      }

      setError(e)
    }

    setLoading(false)
  }

  return (
    <DiscordAuthContext.Provider
      value={{
        token,
        member,
        loading,
        error,
        clearError,
        getMemberWithToken,
        patchMemberWalletAddress,
      }}
    >
      {children}
    </DiscordAuthContext.Provider>
  )
}
