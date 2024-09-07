import { createContext, useState, useContext, useMemo, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { BrowserWallet, Wallet } from '@meshsdk/core'
import badLabsApi from '../utils/badLabsApi'
import getFileForPolicyId from '../functions/getFileForPolicyId'
import populateAsset from '../functions/populateAsset'
import { BAD_FOX_3D_POLICY_ID, BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../constants'
import type { PolicyId, PopulatedAsset, PopulatedWallet } from '../@types'

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
  removeAssetsFromWallet: (_assetIds: string[]) => void
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
  removeAssetsFromWallet: (_assetIds: string[]) => {},
})

export default function useWallet() {
  return useContext(WalletContext)
}

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
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
        const stakeKey = stakeKeys[0]

        const walletAddress = await _wallet.getChangeAddress()
        const { tokens } = await badLabsApi.wallet.getData(stakeKey, { withTokens: true })

        const badFoxAssetsFile = getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets') as PopulatedAsset[]
        const badMotorcycleAssetsFile = getFileForPolicyId(BAD_MOTORCYCLE_POLICY_ID, 'assets') as PopulatedAsset[]
        const badKeyAssetsFile = getFileForPolicyId(BAD_KEY_POLICY_ID, 'assets') as PopulatedAsset[]
        const badFox3dAssetsFile = getFileForPolicyId(BAD_FOX_3D_POLICY_ID, 'assets') as PopulatedAsset[]

        const filterAssetsForPolicy = (pId: string) => tokens?.filter(({ tokenId }) => tokenId.indexOf(pId) == 0) || []

        setPopulatedWallet({
          stakeKey,
          walletAddress,
          assets: {
            [BAD_FOX_POLICY_ID]:
              (await Promise.all(
                filterAssetsForPolicy(BAD_FOX_POLICY_ID)?.map(async ({ tokenId }) => {
                  const foundAsset = badFoxAssetsFile.find((asset) => asset.tokenId === tokenId)

                  if (!foundAsset) {
                    return await populateAsset({
                      assetId: tokenId,
                      policyId: BAD_FOX_POLICY_ID,
                      withRanks: true,
                    })
                  }

                  return foundAsset
                })
              )) || [],
            [BAD_MOTORCYCLE_POLICY_ID]:
              (await Promise.all(
                filterAssetsForPolicy(BAD_MOTORCYCLE_POLICY_ID)?.map(async ({ tokenId }) => {
                  const foundAsset = badMotorcycleAssetsFile.find((asset) => asset.tokenId === tokenId)

                  if (!foundAsset) {
                    return await populateAsset({
                      assetId: tokenId,
                      policyId: BAD_MOTORCYCLE_POLICY_ID,
                      withRanks: true,
                    })
                  }

                  return foundAsset
                })
              )) || [],
            [BAD_KEY_POLICY_ID]:
              (await Promise.all(
                filterAssetsForPolicy(BAD_KEY_POLICY_ID)?.map(async ({ tokenId }) => {
                  const foundAsset = badKeyAssetsFile.find((asset) => asset.tokenId === tokenId)

                  if (!foundAsset) {
                    return await populateAsset({
                      assetId: tokenId,
                      policyId: BAD_KEY_POLICY_ID,
                      withRanks: true,
                    })
                  }

                  return foundAsset
                })
              )) || [],
            [BAD_FOX_3D_POLICY_ID]:
              (await Promise.all(
                filterAssetsForPolicy(BAD_FOX_3D_POLICY_ID)?.map(async ({ tokenId }) => {
                  const foundAsset = badFox3dAssetsFile.find((asset) => asset.tokenId === tokenId)

                  if (!foundAsset) {
                    return await populateAsset({
                      assetId: tokenId,
                      policyId: BAD_FOX_3D_POLICY_ID,
                      withRanks: false,
                    })
                  }

                  return foundAsset
                })
              )) || [],
          },
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
        const data = await badLabsApi.wallet.getData(_walletIdentifier, { withTokens: true })

        const badFoxAssetsFile = getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets') as PopulatedAsset[]
        const badMotorcycleAssetsFile = getFileForPolicyId(BAD_MOTORCYCLE_POLICY_ID, 'assets') as PopulatedAsset[]
        const badKeyAssetsFile = getFileForPolicyId(BAD_KEY_POLICY_ID, 'assets') as PopulatedAsset[]
        const badFox3dAssetsFile = getFileForPolicyId(BAD_FOX_3D_POLICY_ID, 'assets') as PopulatedAsset[]

        const filterAssetsForPolicy = (pId: string) => data.tokens?.filter(({ tokenId }) => tokenId.indexOf(pId) == 0) || []

        setPopulatedWallet({
          stakeKey: data.stakeKey,
          walletAddress: data.addresses[0].address,
          assets: {
            [BAD_FOX_POLICY_ID]:
              (await Promise.all(
                filterAssetsForPolicy(BAD_FOX_POLICY_ID)?.map(async ({ tokenId }) => {
                  const foundAsset = badFoxAssetsFile.find((asset) => asset.tokenId === tokenId)

                  if (!foundAsset) {
                    return await populateAsset({
                      assetId: tokenId,
                      policyId: BAD_FOX_POLICY_ID,
                      withRanks: true,
                    })
                  }

                  return foundAsset
                })
              )) || [],
            [BAD_MOTORCYCLE_POLICY_ID]:
              (await Promise.all(
                filterAssetsForPolicy(BAD_MOTORCYCLE_POLICY_ID)?.map(async ({ tokenId }) => {
                  const foundAsset = badMotorcycleAssetsFile.find((asset) => asset.tokenId === tokenId)

                  if (!foundAsset) {
                    return await populateAsset({
                      assetId: tokenId,
                      policyId: BAD_MOTORCYCLE_POLICY_ID,
                      withRanks: true,
                    })
                  }

                  return foundAsset
                })
              )) || [],
            [BAD_KEY_POLICY_ID]:
              (await Promise.all(
                filterAssetsForPolicy(BAD_KEY_POLICY_ID)?.map(async ({ tokenId }) => {
                  const foundAsset = badKeyAssetsFile.find((asset) => asset.tokenId === tokenId)

                  if (!foundAsset) {
                    return await populateAsset({
                      assetId: tokenId,
                      policyId: BAD_KEY_POLICY_ID,
                      withRanks: true,
                    })
                  }

                  return foundAsset
                })
              )) || [],
            [BAD_FOX_3D_POLICY_ID]:
              (await Promise.all(
                filterAssetsForPolicy(BAD_FOX_3D_POLICY_ID)?.map(async ({ tokenId }) => {
                  const foundAsset = badFox3dAssetsFile.find((asset) => asset.tokenId === tokenId)

                  if (!foundAsset) {
                    return await populateAsset({
                      assetId: tokenId,
                      policyId: BAD_FOX_3D_POLICY_ID,
                      withRanks: false,
                    })
                  }

                  return foundAsset
                })
              )) || [],
          },
        })

        setConnectedName('Blockfrost')
        setConnected(true)
        setConnectedManually(true)
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

  // useEffect(() => {
  //   if (!connected) {
  //     const connectPaths = ['/wallet', '/trade']

  //     if (connectPaths.includes(window.location.pathname)) {
  //       const storageItem = window.localStorage.getItem('connected-wallet')

  //       if (storageItem) {
  //         const connectedWallet: LocalStorageConnectedWallet = JSON.parse(storageItem)

  //         if (connectedWallet.walletProvider === 'Blockfrost') {
  //           connectWalletManually(connectedWallet.stakeKey)
  //         } else {
  //           connectWallet(connectedWallet.walletProvider)
  //         }
  //       }
  //     }
  //   }
  // }, [])

  const removeAssetsFromWallet = (_assetIds: string[]) => {
    if (connecting) return
    setConnecting(true)

    try {
      if (wallet) {
        setPopulatedWallet((prev) => {
          if (!prev) return prev

          const payload = { ...prev.assets }

          Object.entries(payload).forEach(([policyId, assets]) => {
            payload[policyId as PolicyId] = assets.filter((asset) => !_assetIds.includes(asset.tokenId))
          })

          return {
            ...prev,
            assets: payload,
          }
        })
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message)
    }

    setConnecting(false)
  }

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
      removeAssetsFromWallet,
    }),
    [availableWallets, connecting, connected, populatedWallet, wallet, removeAssetsFromWallet]
  )

  return <WalletContext.Provider value={payload}>{children}</WalletContext.Provider>
}
