import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import blockfrostJsonFile from '../data/assets/fox'
import { FOX_POLICY_ID } from '../constants/policy-ids'

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
  const [account, setAccount] = useState({})
  const [myAssets, setMyAssets] = useState([])

  useEffect(() => {
    account.portfolioWallets?.forEach((wallet) => {
      wallet.assets[FOX_POLICY_ID]?.forEach((assetId) => {
        setMyAssets((prev) => [...prev, blockfrostJsonFile.assets.find(({ asset }) => asset === assetId)])
      })
    })
  }, [account])

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

      query?.split('&').forEach((str) => {
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

      setMyAssets([])
      setAccount(res.data)
      clearError()
    } catch (e) {
      handleError(e)
    }

    setLoading(false)
  }

  const updateAccountMintWallet = async (walletAddress) => {
    if (!walletAddress) {
      return toast.error('Please enter a wallet address')
    }

    if (walletAddress.indexOf('addr1') !== 0) {
      return toast.error('Please enter a valid wallet address (starts with addr1)')
    }

    setLoading(true)

    try {
      await axios.post(`/api/account/mint-wallet/${walletAddress}?discordToken=${token}`)

      clearError()
    } catch (e) {
      handleError(e)
    }

    setLoading(false)
    await getAccountWithDiscordToken()
  }

  const addAccountPortfolioWallet = async (walletAddressOrStakeKey) => {
    if (!walletAddressOrStakeKey) {
      return toast.error('Please enter a wallet address or stake key')
    }

    if (walletAddressOrStakeKey.indexOf('addr1') !== 0 && walletAddressOrStakeKey.indexOf('stake1') !== 0) {
      return toast.error('Please enter a valid wallet address or stake key')
    }

    setLoading(true)

    try {
      await axios.post(`/api/account/portfolio-wallets/${walletAddressOrStakeKey}?discordToken=${token}`)

      clearError()
    } catch (e) {
      handleError(e)
    }

    setLoading(false)
    await getAccountWithDiscordToken()
  }

  const deleteAccountPortfolioWallet = async (stakeKey) => {
    setLoading(true)

    try {
      await axios.delete(`/api/account/portfolio-wallets/${stakeKey}?discordToken=${token}`)

      clearError()
    } catch (e) {
      handleError(e)
    }

    setLoading(false)
    await getAccountWithDiscordToken()
  }

  const syncAccountPortfolioWallets = async () => {
    setLoading(true)

    try {
      await axios.delete(`/api/account/portfolio-wallets/sync?discordToken=${token}`)

      clearError()
    } catch (e) {
      handleError(e)
    }

    setLoading(false)
    await getAccountWithDiscordToken()
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        error,
        token,
        account,
        myAssets,
        clearError,
        getAccountWithDiscordToken,
        updateAccountMintWallet,
        addAccountPortfolioWallet,
        deleteAccountPortfolioWallet,
        syncAccountPortfolioWallets,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
