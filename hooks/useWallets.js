import { useEffect, useReducer, useState } from 'react'
import toast from 'react-hot-toast'
import blockfrostJsonFile from '../data/assets/fox'
import getStakeKeyFromWalletAddress from '../functions/blockfrost/getStakeKeyFromWalletAddress'
import getAssetsFromStakeKey from '../functions/blockfrost/getAssetsFromStakeKey'
import { FOX_POLICY_ID } from '../constants/policy-ids'

const ADD_WALLET = 'ADD_WALLET'
const SET_WALLETS = 'SET_WALLETS'
const DELETE_WALLET = 'DELETE_WALLET'

const STORAGE_KEY = 'BadFoxMC_MyWallets'

const walletsReducer = (state = [], action) => {
  switch (action.type) {
    case SET_WALLETS:
      return action.payload

    case ADD_WALLET:
      return [action.payload, ...state]

    case DELETE_WALLET:
      const copyState = [...state]
      return copyState.filter((item) => item.stakeKey !== action.payload)

    default:
      return state
  }
}

const useWallets = () => {
  const [myWallets, dispatch] = useReducer(walletsReducer, [])
  const [myFoxes, setMyFoxes] = useState([])

  useEffect(() => {
    // once window is loaded, get wallets from local storage,
    // and if an array is found set it to the state
    if (window) {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY))

      if (stored && Array.isArray(stored)) {
        dispatch({
          type: SET_WALLETS,
          payload: stored,
        })
      }
    }
  }, [window])

  useEffect(() => {
    // once the wallets change, set them to local storage
    if (window) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(myWallets))
    }
  }, [window, myWallets])

  useEffect(() => {
    setMyFoxes([])

    myWallets.forEach((wallet) => {
      wallet.assets.forEach((assetId) => {
        const blockfrostAsset = blockfrostJsonFile.assets.find(({ asset }) => asset === assetId)

        setMyFoxes((prev) => [...prev, blockfrostAsset])
      })
    })
  }, [myWallets])

  const addWallet = async (str) => {
    const walletAddress = String(str)

    if (walletAddress.indexOf('addr1') !== 0) {
      toast.error('Address is invalid')
      return
    }

    let stakeKey = ''

    try {
      stakeKey = await getStakeKeyFromWalletAddress(walletAddress)
    } catch (error) {
      if (error?.response?.status == 400) {
        toast.error('Could not find the stake key of this wallet address')
      } else if (error?.response?.status == 403) {
        toast.error('Blockfrost API key is maxed out today')
      } else {
        toast.error('Failed to get data from the Blockchain')
        console.error(error)
      }
    }

    if (!stakeKey) {
      toast.error('Stake key not found')
      return
    }

    try {
      if (myWallets.find((item) => item.stakeKey === stakeKey)) {
        toast.info('This wallet is already added')
        return
      }

      const assets = await getAssetsFromStakeKey(stakeKey, FOX_POLICY_ID)
      const payload = {
        stakeKey,
        assets,
      }

      dispatch({ type: ADD_WALLET, payload })
      toast.success('Succesfully got data from the Blockchain')
    } catch (error) {
      console.error(error)
      toast.error(`Failed to get data from the Blockchain ${error?.response?.status}`)
    }
  }

  const deleteWallet = (stakeKey) => {
    if (window.confirm('Are you sure you want to delete this wallet?')) {
      dispatch({ type: DELETE_WALLET, payload: stakeKey })
    }
  }

  const syncWallets = async () => {
    const syncedWallets = await Promise.all(
      myWallets.map(async (item) => {
        try {
          const assets = await getAssetsFromStakeKey(item.stakeKey, FOX_POLICY_ID)
          const payload = {
            stakeKey: item.stakeKey,
            assets,
          }

          return payload
        } catch (error) {
          console.error(error)
          toast.error(`Failed to get data from the Blockchain ${error?.response?.status}`)

          return item
        }
      })
    )

    dispatch({ type: SET_WALLETS, payload: syncedWallets })
    toast.success('Succesfully synced wallets with the Blockchain')
  }

  return {
    myWallets,
    myFoxes,
    addWallet,
    deleteWallet,
    syncWallets,
  }
}

export default useWallets
