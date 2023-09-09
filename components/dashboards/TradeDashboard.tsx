import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { ArrowPathIcon, PhotoIcon } from '@heroicons/react/24/solid'
import { Transaction } from '@meshsdk/core'
import useWallet from '../../contexts/WalletContext'
import BadApi from '../../utils/badApi'
import { firestore } from '../../utils/firebase'
import formatIpfsImageUrl from '../../functions/formatters/formatIpfsImageUrl'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import populateAsset from '../../functions/populateAsset'
import sleep from '../../functions/sleep'
import Modal from '../layout/Modal'
import Loader from '../Loader'
import ImageLoader from '../Loader/ImageLoader'
import WalletHero from '../Wallet/WalletHero'
import AssetCard from '../cards/AssetCard'
import type { PolicyId, PopulatedAsset, PopulatedWallet, Trade } from '../../@types'
import type { BadApiTransaction } from '../../utils/badApi'
import { BAD_FOX_3D_POLICY_ID, BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID, ONE_MILLION, TRADE_APP_WALLET } from '../../constants'

const badApi = new BadApi()

const TRADE_OPEN = true

const TradeDashboard = () => {
  const { connectedManually, wallet, populatedWallet, disconnectWallet, removeAssetsFromWallet } = useWallet()

  const [tradeType, setTradeType] = useState<'1:1' | '2:1' | ''>('')
  const [selectorType, setSelectorType] = useState<'SELF:1' | 'SELF:2' | 'BANK' | ''>('')
  const [selfSelectedTokenIdOne, setSelfSelectedTokenIdOne] = useState<string>('')
  const [selfSelectedTokenIdTwo, setSelfSelectedTokenIdTwo] = useState<string>('')
  const [bankSelectedTokenId, setBankSelectedTokenId] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>(
    !TRADE_OPEN ? 'The portal is closed at the moment, please check in with our community for further announcements.' : ''
  )

  const [bankWallet, setBankWallet] = useState<PopulatedWallet | null>(null)

  useEffect(() => {
    const getBank = async () => {
      setLoading(true)

      try {
        const data = await badApi.wallet.getData(TRADE_APP_WALLET, { withTokens: true })

        const badFoxAssetsFile = getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets') as PopulatedAsset[]
        const badMotorcycleAssetsFile = getFileForPolicyId(BAD_MOTORCYCLE_POLICY_ID, 'assets') as PopulatedAsset[]
        const badKeyAssetsFile = getFileForPolicyId(BAD_KEY_POLICY_ID, 'assets') as PopulatedAsset[]
        // const badFox3dAssetsFile = getFileForPolicyId(BAD_FOX_3D_POLICY_ID, 'assets') as PopulatedAsset[]

        const filterAssetsForPolicy = (pId: string) => data.tokens?.filter(({ tokenId }) => tokenId.indexOf(pId) == 0) || []

        const payload = {
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
                      populateMintTx: true,
                    })
                  }

                  return foundAsset
                })
              )) || [],
            [BAD_FOX_3D_POLICY_ID]: [],
          },
        }

        if (tradeType && tradeType === '1:1') {
          setBankSelectedTokenId((prev) =>
            prev &&
            (!!payload.assets[BAD_FOX_POLICY_ID].find((item) => item.tokenId === prev) ||
              !!payload.assets[BAD_MOTORCYCLE_POLICY_ID].find((item) => item.tokenId === prev))
              ? prev
              : ''
          )
        } else if (tradeType && tradeType === '2:1') {
          setBankSelectedTokenId(payload.assets[BAD_KEY_POLICY_ID].sort((a, b) => (a?.mintBlockHeight || 0) - (b?.mintBlockHeight || 0))[0].tokenId)
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
  }, [tradeType])

  const self2Ds = useMemo(
    () =>
      populatedWallet?.assets[BAD_FOX_POLICY_ID].concat(populatedWallet?.assets[BAD_MOTORCYCLE_POLICY_ID]).sort(
        (a, b) => (a?.serialNumber || 0) - (b?.serialNumber || 0)
      ) || [],
    [populatedWallet?.assets]
  )

  const bank2Ds = useMemo(
    () =>
      bankWallet?.assets[BAD_FOX_POLICY_ID].concat(bankWallet?.assets[BAD_MOTORCYCLE_POLICY_ID]).sort(
        (a, b) => (a?.serialNumber || 0) - (b?.serialNumber || 0)
      ) || [],
    [bankWallet?.assets]
  )

  const bankKeys = useMemo(
    () => bankWallet?.assets[BAD_KEY_POLICY_ID].sort((a, b) => (a?.mintBlockHeight || 0) - (b?.mintBlockHeight || 0)) || [],
    [bankWallet?.assets]
  )

  const filteredAssets = useMemo(
    () => (selectorType === 'SELF:1' || selectorType === 'SELF:2' ? self2Ds : selectorType === 'BANK' ? bank2Ds : []),
    [selectorType, self2Ds, bank2Ds]
  )

  const txConfirmation = useCallback(async (_txHash: string): Promise<BadApiTransaction> => {
    try {
      const data = await badApi.transaction.getData(_txHash)

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
  }, [])

  const buildTx = useCallback(async () => {
    if (!wallet || loading) return
    setLoading(true)

    try {
      const tx = new Transaction({ initiator: wallet })
        .sendAssets(
          { address: TRADE_APP_WALLET },
          tradeType === '1:1'
            ? [
                {
                  unit: selfSelectedTokenIdOne,
                  quantity: '1',
                },
              ]
            : [
                {
                  unit: selfSelectedTokenIdOne,
                  quantity: '1',
                },
                {
                  unit: selfSelectedTokenIdTwo,
                  quantity: '1',
                },
              ]
        )
        .sendLovelace({ address: TRADE_APP_WALLET }, String(4 * ONE_MILLION))

      toast.loading('Building transaction')
      const unsignedTx = await tx.build()

      toast.dismiss()
      toast.loading('Awaiting signature')
      const signedTx = await wallet?.signTx(unsignedTx)

      toast.dismiss()
      toast.loading('Submitting transaction')
      const txHash = await wallet?.submitTx(signedTx as string)

      toast.dismiss()
      toast.loading('Awaiting network confirmation')
      await txConfirmation(txHash as string)
      toast.dismiss()
      toast.success('Transaction submitted!')

      const collection = firestore.collection('trades')

      const payload: Trade = {
        stakeKey: populatedWallet?.stakeKey as Trade['stakeKey'],
        type: tradeType as Trade['type'],
        requestedTokenId: bankSelectedTokenId,
        depositTx: txHash,
        withdrawTx: '',
      }

      toast.loading('Trading NFTs...')

      const { id: docId } = await collection.add(payload)
      await axios.post('/api/_dev/trade-in', { docId })

      toast.dismiss()
      toast.success('Trade in complete!')

      await removeAssetsFromWallet(tradeType === '1:1' ? [selfSelectedTokenIdOne] : [selfSelectedTokenIdOne, selfSelectedTokenIdTwo])

      setBankWallet((prev) => {
        if (!prev) return prev

        const payload = { ...prev.assets }

        Object.entries(payload).forEach(([policyId, assets]) => {
          payload[policyId as PolicyId] = assets.filter((asset) => asset.tokenId !== bankSelectedTokenId)
        })

        return {
          ...prev,
          assets: payload,
        }
      })

      setSelfSelectedTokenIdOne('')
      setSelfSelectedTokenIdTwo('')
      setBankSelectedTokenId('')
      setTradeType('')
    } catch (error: any) {
      console.error(error)
      toast.remove()
      toast.error('Woopsies!')

      if (error?.message?.indexOf('Not enough ADA leftover to include non-ADA assets') !== -1) {
        // [Transaction] An error occurred during build: Not enough ADA leftover to include non-ADA assets in a change address.
        setErrorMessage('TX build failed: your UTXOs are clogged, try to send all your ADA to yourself, together with the BFMC NFTs.')
      } else if (error?.message?.indexOf('UTxO Balance Insufficient') !== -1) {
        // [Transaction] An error occurred during build: UTxO Balance Insufficient.
        setErrorMessage('TX build failed: not enough ADA to process TX, please add ADA to your wallet, then try again.')
      } else {
        setErrorMessage(error?.message || error?.toString())
      }
    }

    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, populatedWallet, tradeType, selfSelectedTokenIdOne, selfSelectedTokenIdTwo, bankSelectedTokenId, txConfirmation, loading])

  if (connectedManually) {
    return (
      <div className='flex flex-col items-center'>
        <p className='pt-[5vh] text-center text-lg text-[var(--pink)]'>
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
    <div>
      <WalletHero />

      <div className='flex items-center justify-center w-full'>
        <button
          type='button'
          disabled={loading || !bank2Ds.length}
          onClick={() => {
            setTradeType('1:1')
            setSelfSelectedTokenIdOne('')
            setSelfSelectedTokenIdTwo('')
            setBankSelectedTokenId('')
          }}
          className={
            'group relative flex flex-col items-center justify-center w-72 h-72 my-4 mx-2 rounded-xl border ' +
            (tradeType === '1:1'
              ? 'bg-gray-700/50 border-gray-500 text-gray-200'
              : 'hover:text-gray-200 disabled:hover:text-gray-400 bg-gray-900/50 hover:bg-gray-700/50 disabled:bg-gray-900/50 disabled:hover:bg-gray-900/50 border-gray-700 hover:border-gray-500 disabled:border-gray-700 disabled:hover:border-gray-700')
          }
        >
          <div
            className={
              'absolute top-0 left-0 ' +
              (tradeType === '1:1' ? 'opacity-100' : !bank2Ds.length ? 'opacity-50 rounded-xl bg-red-600/70' : 'opacity-50 group-hover:opacity-100')
            }
          >
            <ImageLoader src='/media/trade/1vs1.png' alt='' width={288} height={288} style={{ borderRadius: '0.75rem' }} />
          </div>
          <span className='mr-4'>2D for 2D</span>
        </button>

        <button
          type='button'
          disabled={loading || !bankKeys.length}
          onClick={() => {
            setTradeType('2:1')
            setSelfSelectedTokenIdOne('')
            setSelfSelectedTokenIdTwo('')
            setBankSelectedTokenId(bankKeys[0].tokenId || '')
          }}
          className={
            'group relative flex flex-col items-center justify-center w-72 h-72 my-4 mx-2 rounded-xl border ' +
            (tradeType === '2:1'
              ? 'bg-gray-700/50 border-gray-500 text-gray-200'
              : 'hover:text-gray-200 disabled:hover:text-gray-400 bg-gray-900/50 hover:bg-gray-700/50 disabled:bg-gray-900/50 disabled:hover:bg-gray-900/50 border-gray-700 hover:border-gray-500 disabled:border-gray-700 disabled:hover:border-gray-700')
          }
        >
          <div
            className={
              'absolute top-0 left-0 ' +
              (tradeType === '2:1' ? 'opacity-100' : !bankKeys.length ? 'opacity-50 rounded-xl bg-red-600/70' : 'opacity-50 group-hover:opacity-100')
            }
          >
            <ImageLoader src='/media/trade/2vs1.png' alt='' width={288} height={288} style={{ borderRadius: '0.75rem' }} />
          </div>
          <span className='mr-4'>2Ds for Key</span>
        </button>
      </div>

      {tradeType ? <div className='w-1/2 h-1 mx-auto bg-gray-700 rounded-lg' /> : null}

      {tradeType === '1:1' ? (
        <div className='flex items-center justify-center w-full'>
          <button
            type='button'
            onClick={() => setSelectorType('SELF:1')}
            className='flex flex-col items-center justify-center w-72 h-72 m-2 bg-gray-900/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-gray-500 hover:text-gray-200'
          >
            {selfSelectedTokenIdOne ? (
              self2Ds
                .filter((asset) => asset.tokenId === selfSelectedTokenIdOne)
                .map((asset) => (
                  <ImageLoader
                    key={`selected-${asset.tokenId}`}
                    src={asset.image.url}
                    alt={asset.tokenName?.display as string}
                    width={288}
                    height={288}
                    style={{ borderRadius: '0.75rem' }}
                  />
                ))
            ) : (
              <Fragment>
                <PhotoIcon className='w-12 h-12' />
                <p>My 2D</p>
              </Fragment>
            )}
          </button>

          <ArrowPathIcon className='w-8 h-8 m-2 text-gray-400' />

          <button
            type='button'
            onClick={() => setSelectorType('BANK')}
            className='flex flex-col items-center justify-center w-72 h-72 m-2 bg-gray-900/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-gray-500 hover:text-gray-200'
          >
            {bankSelectedTokenId ? (
              bank2Ds
                .filter((asset) => asset.tokenId === bankSelectedTokenId)
                .map((asset) => (
                  <ImageLoader
                    key={`selected-${asset.tokenId}`}
                    src={asset.image.url}
                    alt={asset.tokenName?.display as string}
                    width={288}
                    height={288}
                    style={{ borderRadius: '0.75rem' }}
                  />
                ))
            ) : (
              <Fragment>
                <PhotoIcon className='w-12 h-12' />
                <p>2D from Treasury</p>
              </Fragment>
            )}
          </button>
        </div>
      ) : tradeType === '2:1' ? (
        <div className='flex items-center justify-center w-full'>
          <button
            type='button'
            onClick={() => setSelectorType('SELF:1')}
            className='flex flex-col items-center justify-center w-72 h-72 m-2 bg-gray-900/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-gray-500 hover:text-gray-200'
          >
            {selfSelectedTokenIdOne ? (
              self2Ds
                .filter((asset) => asset.tokenId === selfSelectedTokenIdOne)
                .map((asset) => (
                  <ImageLoader
                    key={`selected-${asset.tokenId}`}
                    src={asset.image.url}
                    alt={asset.tokenName?.display as string}
                    width={288}
                    height={288}
                    style={{ borderRadius: '0.75rem' }}
                  />
                ))
            ) : (
              <Fragment>
                <PhotoIcon className='w-12 h-12' />
                <p>My 2D (1/2)</p>
              </Fragment>
            )}
          </button>

          <button
            type='button'
            onClick={() => setSelectorType('SELF:2')}
            className='flex flex-col items-center justify-center w-72 h-72 m-2 bg-gray-900/50 hover:bg-gray-700/50 rounded-xl border border-gray-700 hover:border-gray-500 hover:text-gray-200'
          >
            {selfSelectedTokenIdTwo ? (
              self2Ds
                .filter((asset) => asset.tokenId === selfSelectedTokenIdTwo)
                .map((asset) => (
                  <ImageLoader
                    key={`selected-${asset.tokenId}`}
                    src={asset.image.url}
                    alt={asset.tokenName?.display as string}
                    width={288}
                    height={288}
                    style={{ borderRadius: '0.75rem' }}
                  />
                ))
            ) : (
              <Fragment>
                <PhotoIcon className='w-12 h-12' />
                <p>My 2D (2/2)</p>
              </Fragment>
            )}
          </button>

          <ArrowPathIcon className='w-8 h-8 m-2 text-gray-400' />

          <button
            type='button'
            disabled
            className='flex flex-col items-center justify-center w-72 h-72 m-2 bg-gray-900/50 rounded-xl border border-gray-700'
          >
            <ImageLoader src='/media/key.png' alt='key' width={288} height={288} style={{ borderRadius: '0.75rem' }} />
          </button>
        </div>
      ) : null}

      <div style={{ width: '100%' }}>
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <button
              type='button'
              disabled={
                !TRADE_OPEN ||
                !!errorMessage ||
                loading ||
                !tradeType ||
                (tradeType === '1:1' && (!selfSelectedTokenIdOne || !bankSelectedTokenId)) ||
                (tradeType === '2:1' && (!selfSelectedTokenIdOne || !selfSelectedTokenIdTwo || !bankSelectedTokenId))
              }
              onClick={buildTx}
              className='w-full p-4 rounded-xl disabled:bg-gray-900 bg-green-900 hover:bg-green-700 disabled:bg-opacity-50 bg-opacity-50 hover:bg-opacity-50 disabled:text-gray-700 hover:text-gray-200 disabled:border border hover:border disabled:border-gray-800 border-green-700 hover:border-green-700 disabled:cursor-not-allowed hover:cursor-pointer'
            >
              Trade
            </button>

            {errorMessage ? <p className='text-center text-[var(--pink)]'>{errorMessage}</p> : null}
          </Fragment>
        )}
      </div>

      <Modal
        open={!!selectorType}
        onClose={() => setSelectorType('')}
        title={'Select a 2D NFT ' + (selectorType === 'BANK' ? 'to receive' : 'to send away')}
      >
        <div className='md:max-m-[90vw] m-fit flex flex-wrap items-center justify-evenly'>
          {!filteredAssets.length ? (
            <div>none</div>
          ) : (
            filteredAssets.map((asset) => (
              <AssetCard
                key={`asset-${asset.tokenId}`}
                imageSrc={formatIpfsImageUrl(asset.image.ipfs)}
                title={asset.tokenName?.display as string}
                onClick={() => {
                  selectorType === 'SELF:1'
                    ? setSelfSelectedTokenIdOne(selfSelectedTokenIdTwo !== asset.tokenId ? asset.tokenId : '')
                    : selectorType === 'SELF:2'
                    ? setSelfSelectedTokenIdTwo(selfSelectedTokenIdOne !== asset.tokenId ? asset.tokenId : '')
                    : selectorType === 'BANK'
                    ? setBankSelectedTokenId(asset.tokenId)
                    : console.warn('unexpected condition')

                  setSelectorType('')
                }}
              />
            ))
          )}
        </div>
      </Modal>
    </div>
  )
}

export default TradeDashboard
