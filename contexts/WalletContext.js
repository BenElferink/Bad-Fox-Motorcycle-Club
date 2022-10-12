import React, { createContext, useState, useContext, useMemo, useEffect } from 'react'
import { BrowserWallet } from '@martifylabs/mesh'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import getFileForPolicyId from '../functions/getFileForPolicyId'
import { BAD_FOX_POLICY_ID } from '../constants/policy-ids'

// https://mesh.martify.io/apis/browserwallet

const WalletContext = createContext({
  getAvailableWallets: () => {},
  connectWallet: async (walletName) => {},
  connecting: false,
  wallet: {},
  connected: false,
  connectedName: '',
})

export default function useWallet() {
  return useContext(WalletContext)
}

export const WalletProvider = ({ children }) => {
  const [availableWallets, setAvailableWallets] = useState([])
  const [wallet, setWallet] = useState({})
  const [populatedWallet, setPopulatedWallet] = useState({})

  useEffect(() => {
    setAvailableWallets(BrowserWallet.getInstalledWallets())
  }, [])

  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [connectedName, setConnectedName] = useState('')

  const connectWallet = async (_walletName) => {
    if (connecting) return
    setConnecting(true)

    try {
      const _wallet = await BrowserWallet.enable(_walletName)
      if (_wallet) {
        const stakeKeys = await _wallet.getRewardAddresses()
        const walletAddress = await _wallet.getChangeAddress()

        const badFoxAssets =
          (await _wallet.getPolicyIdAssets(BAD_FOX_POLICY_ID))?.map(({ unit }) =>
            getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets').find((asset) => asset.assetId === unit)
          ) || []

        setPopulatedWallet({
          stakeKey: stakeKeys[0],
          walletAddress,
          assets: {
            [BAD_FOX_POLICY_ID]: badFoxAssets,
          },
          ownsAssets: !!badFoxAssets.length,
        })

        setWallet(_wallet)
        setConnectedName(_walletName)
        setConnected(true)
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }

    setConnecting(false)
  }

  const connectWalletManually = async (_walletIdentifier) => {
    if (connecting) return
    setConnecting(true)

    try {
      if (_walletIdentifier) {
        const { data } = await axios.get(`/api/wallets/${_walletIdentifier}`)
        if (data) {
          setPopulatedWallet({
            ...data,
            ownsAssets: (() => {
              let bool = false
              Object.values(data.assets).forEach((assets) => {
                if (!bool) {
                  bool = !!assets.length
                }
              })
              return bool
            })(),
          })
          setConnectedName('Blockfrost')
          setConnected(true)
        }
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }

    setConnecting(false)
  }

  const memoedValue = useMemo(
    () => ({
      availableWallets,
      connectWallet,
      connectWalletManually,
      connecting,
      connected,
      connectedName,
      populatedWallet,
    }),
    [availableWallets, connecting, connected, populatedWallet]
  )

  return <WalletContext.Provider value={memoedValue}>{children}</WalletContext.Provider>
}
