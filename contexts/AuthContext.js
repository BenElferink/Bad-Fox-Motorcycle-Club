import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import blockfrostJsonFile from '../data/assets/fox'
import { ADMIN_CODE } from '../constants/api-keys'
import { FOX_POLICY_ID } from '../constants/policy-ids'

const USER_ID_KEY = 'BadFoxMC_DiscordUserID'

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
  const [userId, setUserId] = useState('')
  const [account, setAccount] = useState(null)
  const [myAssets, setMyAssets] = useState([])
  const [lastHolderSnapshotTimestamp, setLastHolderSnapshotTimestamp] = useState(0)

  useEffect(() => {
    if (error.message) {
      toast.error(error.message)
    }
  }, [error])

  const logout = () => {
    setToken('')
    setUserId('')
    setAccount(null)
    setMyAssets([])
    window.localStorage.removeItem(USER_ID_KEY)
    router.push('/')
  }

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

  const getAccount = async () => {
    const t = token || getDiscordTokenFromQuery()
    const id = userId || account?.userId

    if (!t && !id) {
      // toast.error('Could not authorize with Discord')
      return
    }

    setLoading(true)

    try {
      const accountRes = await axios.get(`/api/account?${t ? `discordToken=${t}` : `discordUserId=${id}`}`, {
        headers: { admin_code: ADMIN_CODE },
      })

      setMyAssets([])
      setAccount(accountRes.data)
      setUserId(accountRes.data.userId)
      clearError()

      try {
        const holdersRes = await axios.get(`/api/snapshot/holders/${FOX_POLICY_ID}`)
        const holdersSnapshot = holdersRes.data.snapshots[0] ?? {}
        setLastHolderSnapshotTimestamp(holdersRes.data.snapshots[0].timestamp ?? 0)

        accountRes.data?.stakeKeys?.forEach((stakeKey) => {
          const foundHoldingWallet = holdersSnapshot.wallets?.find((item) => item.stakeKey === stakeKey)

          if (foundHoldingWallet) {
            foundHoldingWallet.assets?.forEach((assetId) => {
              setMyAssets((prev) => [...prev, blockfrostJsonFile.assets.find(({ asset }) => asset === assetId)])
            })
          }
        })
      } catch (error) {
        console.error(error)
      }
    } catch (e) {
      handleError(e)
    }

    setLoading(false)
  }

  useEffect(() => {
    // once window is loaded, get Discord user ID from local storage
    if (window) {
      const stored = window.localStorage.getItem(USER_ID_KEY)

      if (stored) {
        setUserId(stored)
      }
    }
  }, [])

  useEffect(() => {
    // once the account changes, set Discord user ID to local storage
    if (window && userId) {
      window.localStorage.setItem(USER_ID_KEY, userId)
    }

    if (userId) {
      getAccount()
    }
  }, [userId])

  const updateAccountMintWallet = async (walletAddress) => {
    if (!walletAddress) {
      return toast.error('Please enter a wallet address')
    }

    if (walletAddress.indexOf('addr1') !== 0) {
      return toast.error('Please enter a valid wallet address (starts with addr1)')
    }

    setLoading(true)

    try {
      await axios.post(
        `/api/account/mint-wallet/${walletAddress}?${token ? `discordToken=${token}` : `discordUserId=${userId}`}`,
        {},
        {
          headers: { admin_code: ADMIN_CODE },
        }
      )

      clearError()
    } catch (e) {
      handleError(e)
    }

    setLoading(false)
    await getAccount()
  }

  const addAccountStakeKey = async (walletAddressOrStakeKey) => {
    if (!walletAddressOrStakeKey) {
      return toast.error('Please enter a wallet address or stake key')
    }

    if (walletAddressOrStakeKey.indexOf('addr1') !== 0 && walletAddressOrStakeKey.indexOf('stake1') !== 0) {
      return toast.error('Please enter a valid wallet address or stake key')
    }

    setLoading(true)

    try {
      await axios.post(
        `/api/account/stake-keys/${walletAddressOrStakeKey}?${
          token ? `discordToken=${token}` : `discordUserId=${userId}`
        }`,
        {},
        {
          headers: { admin_code: ADMIN_CODE },
        }
      )

      clearError()
    } catch (e) {
      handleError(e)
    }

    setLoading(false)
    await getAccount()
  }

  const deleteAccountStakeKey = async (stakeKey) => {
    setLoading(true)

    try {
      await axios.delete(
        `/api/account/stake-keys/${stakeKey}?${token ? `discordToken=${token}` : `discordUserId=${userId}`}`,
        {
          headers: { admin_code: ADMIN_CODE },
        }
      )

      clearError()
    } catch (e) {
      handleError(e)
    }

    setLoading(false)
    await getAccount()
  }

  return (
    <AuthContext.Provider
      value={{
        loading,
        error,
        userId,
        account,
        myAssets,
        lastHolderSnapshotTimestamp,
        getAccount,
        updateAccountMintWallet,
        addAccountStakeKey,
        deleteAccountStakeKey,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
