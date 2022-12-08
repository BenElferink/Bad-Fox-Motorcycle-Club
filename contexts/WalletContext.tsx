import { createContext, useState, useContext, useMemo, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { BrowserWallet, Wallet } from '@martifylabs/mesh'
import getFileForPolicyId from '../functions/getFileForPolicyId'
import { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../constants'
import { PopulatedAsset, PopulatedWallet } from '../@types'

interface LocalStorageConnectedWallet {
  walletProvider: string
  stakeKey: string
}

interface ContextValue {
  availableWallets: Wallet[]
  connectWallet: (_walletName: string) => Promise<void>
  connectWalletManually: (_walletIdentifier: string) => Promise<void>
  disconnectWallet: () => void
  connecting: boolean
  connected: boolean
  connectedName: string
  connectedManually: boolean
  wallet: BrowserWallet | null
  populatedWallet: PopulatedWallet | null
}

const WalletContext = createContext<ContextValue>({
  availableWallets: [],
  connectWallet: async (_walletName: string) => {},
  connectWalletManually: async (_walletIdentifier: string) => {},
  disconnectWallet: () => {},
  connecting: false,
  connected: false,
  connectedManually: false,
  connectedName: '',
  wallet: null,
  populatedWallet: null,
})

export default function useWallet() {
  return useContext(WalletContext)
}

export const WalletProvider = ({ children }: { children: JSX.Element }) => {
  const [availableWallets, setAvailableWallets] = useState<Wallet[]>([])
  const [wallet, setWallet] = useState<BrowserWallet | null>(null)
  const [populatedWallet, setPopulatedWallet] = useState<PopulatedWallet | null>(null)

  useEffect(() => {
    setAvailableWallets(BrowserWallet.getInstalledWallets())
  }, [])

  const [connecting, setConnecting] = useState<boolean>(false)
  const [connected, setConnected] = useState<boolean>(false)
  const [connectedName, setConnectedName] = useState<string>('')
  const [connectedManually, setConnectedManually] = useState<boolean>(false)

  const connectWallet = async (_walletName: string) => {
    if (connecting) return
    setConnecting(true)

    try {
      const _wallet = await BrowserWallet.enable(_walletName)

      if (_wallet) {
        const stakeKeys = await _wallet.getRewardAddresses()
        const walletAddress = await _wallet.getChangeAddress()

        const badFoxAssets =
          ((await _wallet.getPolicyIdAssets(BAD_FOX_POLICY_ID))?.map(({ unit }) =>
            (getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets') as PopulatedAsset[]).find(
              (asset) => asset.assetId === unit
            )
          ) as PopulatedAsset[]) || []

        const badMotorcycleAssets =
          ((await _wallet.getPolicyIdAssets(BAD_MOTORCYCLE_POLICY_ID))?.map(({ unit }) =>
            (getFileForPolicyId(BAD_MOTORCYCLE_POLICY_ID, 'assets') as PopulatedAsset[]).find(
              (asset) => asset.assetId === unit
            )
          ) as PopulatedAsset[]) || []

        setPopulatedWallet({
          stakeKey: stakeKeys[0],
          walletAddress,
          assets: {
            [BAD_FOX_POLICY_ID]: badFoxAssets,
            [BAD_MOTORCYCLE_POLICY_ID]: badMotorcycleAssets,
          },
          ownsAssets: !!badFoxAssets.length || !!badMotorcycleAssets.length,
        })

        setWallet(_wallet)
        setConnectedName(_walletName)
        setConnected(true)
        setConnectedManually(false)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }

    setConnecting(false)
  }

  const connectWalletManually = async (_walletIdentifier: string) => {
    if (connecting) return
    setConnecting(true)

    try {
      if (_walletIdentifier) {
        const { data } = await axios.get<PopulatedWallet>(`/api/wallet/${_walletIdentifier}`)
        if (data) {
          setPopulatedWallet(data)
          setConnectedName('Blockfrost')
          setConnected(true)
          setConnectedManually(true)
        }
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }

    setConnecting(false)
  }

  const disconnectWallet = () => {
    setWallet(null)
    setPopulatedWallet(null)
    setConnecting(false)
    setConnected(false)
    setConnectedName('')
    setConnectedManually(false)
    window.localStorage.removeItem('connected-wallet')
  }

  useEffect(() => {
    if (connected && populatedWallet) {
      const payload: LocalStorageConnectedWallet = {
        walletProvider: connectedName,
        stakeKey: populatedWallet.stakeKey,
      }

      window.localStorage.setItem('connected-wallet', JSON.stringify(payload))
    }
  }, [connected])

  useEffect(() => {
    if (window.location.pathname === '/wallet' || window.location.pathname === '/transcend') {
      const storageItem = window.localStorage.getItem('connected-wallet')

      if (storageItem) {
        const connectedWallet: LocalStorageConnectedWallet = JSON.parse(storageItem)

        if (connectedWallet.walletProvider === 'Blockfrost') {
          connectWalletManually(connectedWallet.stakeKey)
        } else {
          connectWallet(connectedWallet.walletProvider)
        }
      }
    }
  }, [])

  const payload = useMemo(
    () => ({
      availableWallets,
      connectWallet,
      connectWalletManually,
      disconnectWallet,
      connecting,
      connected,
      connectedName,
      connectedManually,
      populatedWallet,
      wallet,
    }),
    [availableWallets, connecting, connected, populatedWallet, wallet]
  )

  return <WalletContext.Provider value={payload}>{children}</WalletContext.Provider>
}
