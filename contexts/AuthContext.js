import { useRouter } from 'next/router'
import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

// init context
const AuthContext = createContext()

// export the consumer
export function useAuth() {
  return useContext(AuthContext)
}

// export the provider (handle all the logic here)
export function AuthProvider({ children }) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({})
  const [token, setToken] = useState('')
  const [account, setMember] = useState({})

  const handleError = (e) => {
    setError({
      type: e?.response?.data?.type ?? 'UNEXPECTED',
      message: e?.response?.data?.message ?? e?.message ?? 'Unexpected error!',
    })
  }

  const clearError = () => {
    setError({})
  }

  const getDiscordTokenFromQuery = () => {
    let t = ''

    if (router.asPath) {
      const query = router.asPath.split('#')[1]

      query.split('&').forEach((str) => {
        const [k, v] = str.split('=')
        if (k === 'access_token') t = v
      })
    }

    setToken(t)
    return t
  }

  const getAccountWithDiscordToken = async () => {
    const t = token || getDiscordTokenFromQuery()

    if (!t) {
      return toast.error('Could not get Discord auth token')
    }

    setLoading(true)

    try {
      const res = await axios.get(`/api/account?discordToken=${t}`)

      setMember(res.data)
      clearError()
    } catch (e) {
      handleError(e)
    }

    setLoading(false)
  }

  const updateAccountMintAddress = async (walletAddress) => {
    if (!walletAddress) {
      return toast.error('Please enter a wallet address')
    }

    if (walletAddress.indexOf('addr1') !== 0) {
      return toast.error('Please enter a valid wallet address (starts with addr1)')
    }

    setLoading(true)

    try {
      const res = await axios.post(`/api/account/mint-wallet/${walletAddress}?discordToken=${token}`)

      setMember(res.data)
      clearError()
    } catch (e) {
      handleError(e)
    }

    setLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        error,
        token,
        account,
        clearError,
        getAccountWithDiscordToken,
        updateAccountMintAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
