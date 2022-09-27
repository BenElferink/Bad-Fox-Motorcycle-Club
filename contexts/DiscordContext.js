import { useRouter } from 'next/router'
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ADMIN_CODE } from '../constants/api-keys'
import { BAD_FOX_POLICY_ID } from '../constants/policy-ids'

const USER_ID_KEY = 'BadFoxMC_DiscordUserID'

// init context
const DiscordContext = createContext()

// export the consumer
export function useDiscord() {
  return useContext(DiscordContext)
}

// export the provider (handle all the logic here)
export function DiscordProvider({ children }) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({})
  const [token, setToken] = useState('')
  const [userId, setUserId] = useState('')
  const [account, setAccount] = useState(null)
  const [myAssets, setMyAssets] = useState([])

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
      const accountRes = await axios.get(`/api/accounts/me?${t ? `discordToken=${t}` : `discordUserId=${id}`}`, {
        headers: { admin_code: ADMIN_CODE },
      })

      setMyAssets([])
      setAccount(accountRes.data)
      setUserId(accountRes.data.userId)
      clearError()

      try {
        if (accountRes.data?.stakeKeys?.length) {
          for (let sIdx = 0; sIdx < accountRes.data.stakeKeys.length; sIdx++) {
            const stakeKey = accountRes.data.stakeKeys[sIdx]
            const walletsRes = await axios.get(`/api/wallets/${stakeKey}`)

            setMyAssets(walletsRes.data.assets[BAD_FOX_POLICY_ID])
          }
        }
      } catch (error) {
        console.error(error)
      }
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
      await axios.post(
        `/api/accounts/mint-wallet/${walletAddress}?${
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

  return (
    <DiscordContext.Provider
      value={{
        loading,
        error,
        userId,
        account,
        myAssets,
        getAccount,
        updateAccountMintWallet,
        logout,
      }}
    >
      {children}
    </DiscordContext.Provider>
  )
}
