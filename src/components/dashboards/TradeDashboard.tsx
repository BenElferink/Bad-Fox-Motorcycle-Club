import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { Asset, keepRelevant, Transaction } from '@meshsdk/core'
import useWallet from '../../contexts/WalletContext'
import badLabsApi from '../../utils/badLabsApi'
import { firestore } from '../../utils/firebase'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import populateAsset from '../../functions/populateAsset'
import Loader from '../Loader'
import WalletHero from '../Wallet/WalletHero'
import type { PopulatedAsset, PopulatedWallet, Trade } from '../../@types'
import type { BadLabsApiTransaction } from '../../utils/badLabsApi'
import {
  BAD_FOX_3D_POLICY_ID,
  BAD_FOX_POLICY_ID,
  BAD_KEY_POLICY_ID,
  BAD_MOTORCYCLE_POLICY_ID,
  ONE_MILLION,
  TRADE_APP_WALLET,
  TREASURY_WALLET,
} from '../../constants'

const TRADE_OPEN = true

const sleep = (ms: number) => new Promise((resolve) => setTimeout(() => resolve(true), ms))
const txConfirmation = async (_txHash: string): Promise<BadLabsApiTransaction> => {
  try {
    const data = await badLabsApi.transaction.getData(_txHash)

    if (data.block) {
      return data
    } else {
      await sleep(1000)
      return await txConfirmation(_txHash)
    }
  } catch (error: any) {
    const errMsg = error?.response?.data || error?.message || error?.toString() || 'UNKNOWN ERROR'

    if (errMsg === `The requested component has not been found. ${_txHash}`) {
      await sleep(1000)
      return await txConfirmation(_txHash)
    } else {
      throw new Error(errMsg)
    }
  }
}

const TradeDashboard = () => {
  const { connectedManually, wallet, populatedWallet, disconnectWallet, removeAssetsFromWallet } = useWallet()

  const [bankWallet, setBankWallet] = useState<PopulatedWallet | null>(null)
  const [amountToSend, setAmountToSend] = useState(0)
  const [amountToGet, setAmountToGet] = useState(0)

  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>(
    !TRADE_OPEN ? 'The portal is closed at the moment, please check in with our community for further announcements.' : ''
  )

  const bank3Ds = useMemo(() => bankWallet?.assets[BAD_FOX_3D_POLICY_ID] || [], [bankWallet?.assets])
  const self2Ds = useMemo(
    () => populatedWallet?.assets[BAD_FOX_POLICY_ID].concat(populatedWallet?.assets[BAD_MOTORCYCLE_POLICY_ID]) || [],
    [populatedWallet?.assets]
  )

  useEffect(() => {
    const getBank = async () => {
      setLoading(true)

      try {
        const data = await badLabsApi.wallet.getData(TRADE_APP_WALLET, { withTokens: true })
        const badFox3dAssetsFile = getFileForPolicyId(BAD_FOX_3D_POLICY_ID, 'assets') as PopulatedAsset[]
        const filterAssetsForPolicy = (pId: string) => data.tokens?.filter(({ tokenId }) => tokenId.indexOf(pId) == 0) || []

        const payload = {
          stakeKey: data.stakeKey,
          walletAddress: data.addresses[0].address,
          assets: {
            [BAD_FOX_POLICY_ID]: [],
            [BAD_MOTORCYCLE_POLICY_ID]: [],
            [BAD_KEY_POLICY_ID]: [],
            [BAD_FOX_3D_POLICY_ID]:
              (await Promise.all(
                filterAssetsForPolicy(BAD_FOX_3D_POLICY_ID)?.map(
                  async ({ tokenId }) =>
                    badFox3dAssetsFile.find((asset) => asset.tokenId === tokenId) ||
                    (await populateAsset({
                      assetId: tokenId,
                      policyId: BAD_FOX_3D_POLICY_ID,
                    }))
                )
              )) || [],
          },
        }

        setBankWallet(payload)
      } catch (error: any) {
        console.error(error)
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    getBank()

    const interval = setInterval(getBank, 1000 * 60)
    return () => clearInterval(interval)
  }, [])

  const buildTx = useCallback(async () => {
    if (!wallet) return
    setLoading(true)

    const payload: Trade = {
      stakeKey: populatedWallet?.stakeKey as Trade['stakeKey'],
      depositAmount: amountToSend,
      depositTx: '',
      withdrawAmount: amountToGet,
      withdrawTx: '',
    }

    const collection = firestore.collection('trades')
    const { id: docId } = await collection.add(payload)

    const assetsToSend: Asset[] = []

    for (let i = 0; i < amountToSend; i++) {
      assetsToSend.push({
        unit: self2Ds[i].tokenId,
        quantity: '1',
      })
    }

    try {
      const tx = new Transaction({ initiator: wallet })
        .setTxInputs(keepRelevant(new Map(assetsToSend.map((x) => [x.unit, x.quantity])), await wallet.getUtxos()))
        .sendAssets({ address: TREASURY_WALLET }, assetsToSend)
        .sendLovelace({ address: TRADE_APP_WALLET }, String(amountToSend * ONE_MILLION))

      toast.dismiss()
      toast.loading('Building transaction')
      const unsignedTx = await tx.build()

      toast.dismiss()
      toast.loading('Awaiting signature')
      const signedTx = await wallet?.signTx(unsignedTx)

      toast.dismiss()
      toast.loading('Submitting transaction')
      const txHash = await wallet?.submitTx(signedTx as string)

      payload['depositTx'] = txHash
      await collection.doc(docId).update(payload)

      toast.dismiss()
      toast.loading('Awaiting network confirmation')

      await txConfirmation(txHash as string)
      removeAssetsFromWallet(assetsToSend.map((x) => x.unit))

      toast.dismiss()
      toast.success('Transaction submitted,\nTrade-in complete!')

      try {
        await axios.post('/api/trade', { docId })
      } catch (error) {}
    } catch (error: any) {
      console.error(error)

      toast.dismiss()
      toast.error('Woopsies!')

      setErrorMessage(error?.message || error?.toString())
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, populatedWallet?.stakeKey, self2Ds])

  if (connectedManually) {
    return (
      <div className='flex flex-col items-center'>
        <p className='pt-[5vh] text-center text-lg text-red-400'>
          Error! You connected manually.
          <br />
          Please re-connect in a non-manual way.
        </p>

        <button
          onClick={disconnectWallet}
          className='p-1 px-2 mt-2 bg-red-900 hover:bg-red-700 bg-opacity-50 hover:bg-opacity-50 rounded-xl border border-red-900 hover:border-red-700 text-base hover:text-gray-200'
        >
          Disconnect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className='w-[90%]'>
      <WalletHero />

      <div className='my-12 flex flex-col items-center'>
        <div className='w-[45%] flex flex-col items-center'>
          <h5 className='text-center text-xl text-gray-200'>2D Trade-Ins</h5>
          <p className='my-2 text-center text-sm'>
            In an attempt to further remove any remaining 2D NFTs from criculation, we offer you this trade-in program.
          </p>
          <ul className='text-center text-sm list-disc'>
            <li>Every 2D earns you a 3D (1-to-1)</li>
            <li>Selecting 3x will give you +1 EXTRA</li>
            <li>Selecting 5x will give you +2 EXTRA</li>
            <li>Selections are done at random</li>
          </ul>
        </div>

        <div className='relative w-[75%] my-8'>
          <label htmlFor='range-input' className='sr-only'>
            Amount of 2Ds to send:
          </label>
          <input
            id='range-input'
            type='range'
            value={amountToSend}
            // disabled={!bank3Ds.length || !self2Ds.length}
            onChange={(e) => {
              const avl = bank3Ds.length
              const l = self2Ds.length
              const n = Number(e.target.value)

              if (n > avl) {
                toast.dismiss()
                toast.error(`Cannot select ${n},\nThere are ${avl} available assets!`)
              } else if (n > l) {
                toast.dismiss()
                toast.error(`Cannot select ${n},\nYou have ${l} assets!`)
              } else {
                setAmountToSend(n)
                if (n === 5) {
                  setAmountToGet(n + 2)
                } else if (n >= 3) {
                  setAmountToGet(n + 1)
                } else {
                  setAmountToGet(n)
                }
              }
            }}
            min={0}
            max={5}
            step={1}
            className='w-full h-2 bg-gray-500/10 accent-blue-400 rounded-lg cursor-pointer'
          />
          <span className='text-sm text-gray-500 dark:text-gray-400 absolute start-0 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6'>0</span>
          <span className='text-sm text-gray-500 dark:text-gray-400 absolute start-[20%] -translate-x-1/2 rtl:translate-x-1/2 -bottom-6'>
            Min (1)
          </span>
          <span className='text-sm text-gray-500 dark:text-gray-400 absolute start-[40%] -translate-x-1/2 rtl:translate-x-1/2 -bottom-6'>2</span>
          <span className='text-sm text-gray-500 dark:text-gray-400 absolute start-[60%] -translate-x-1/2 rtl:translate-x-1/2 -bottom-6'>3</span>
          <span className='text-sm text-gray-500 dark:text-gray-400 absolute start-[80%] -translate-x-1/2 rtl:translate-x-1/2 -bottom-6'>4</span>
          <span className='text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6'>Max (5)</span>
        </div>

        <table className='mt-4'>
          <thead>
            <tr>
              <th className='px-4'>Available 3Ds</th>
              <th className='px-4'>2Ds to Send</th>
              <th className='px-4'>3Ds to Get</th>
            </tr>
          </thead>
          <tbody>
            <tr className='text-center'>
              <td className={bank3Ds.length ? 'text-green-400' : 'text-red-400'}>{bank3Ds.length}</td>
              <td>{amountToSend}</td>
              <td>{amountToGet}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className='w-full'>
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <button
              type='button'
              disabled={!TRADE_OPEN || !!errorMessage || loading || !bank3Ds.length || !amountToSend}
              onClick={buildTx}
              className='w-full p-4 rounded-xl disabled:bg-gray-900 bg-blue-900/50 hover:bg-blue-700/50 disabled:bg-opacity-50 disabled:text-gray-700 hover:text-gray-200 disabled:border border hover:border disabled:border-gray-800 border-blue-700 hover:border-blue-700 disabled:cursor-not-allowed hover:cursor-pointer'
            >
              Trade
            </button>

            {errorMessage ? <p className='m-2 text-center text-red-400'>{errorMessage}</p> : null}
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default TradeDashboard
