import { Fragment, useCallback, useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { Transaction } from '@meshsdk/core'
import useWallet from '../../contexts/WalletContext'
import BadApi from '../../utils/badApi'
import sleep from '../../functions/sleep'
import formatIpfsImageUrl from '../../functions/formatters/formatIpfsImageUrl'
import WalletHero from '../Wallet/WalletHero'
import Modal from '../layout/Modal'
import ImageLoader from '../Loader/ImageLoader'
import AssetCard from '../cards/AssetCard'
import { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID, ONE_MILLION } from '../../constants'
import type { BadApiTransaction } from '../../utils/badApi'

const badApi = new BadApi()

const BURN_OPEN = false
const FOX_ADDRESS = 'addr1vytm0f6n564th94cld4xgzr0g8xp4s2j07ww33qn4x2ss6gmmdzlm'
const BIKE_ADDRESS = 'addr1v8l4qgz688jxgerq788kp3xv7qdjymchddrv3dxyug5e3pg83anxd'
const KEY_ADDRESS = 'addr1v9tce86r8v9larevjr7el7d5ua3eruz2cn4d93mqmt8w4agmy2leh'

const BurnDashboard = () => {
  const { connectedManually, connectedName, wallet, populatedWallet, disconnectWallet, removeAssetsFromWallet } =
    useWallet()

  const [selector, setSelector] = useState<'M' | 'F' | 'B' | ''>('')
  const [selectedMale, setSelectedMale] = useState<string>('')
  const [selectedFemale, setSelectedFemale] = useState<string>('')
  const [selectedBike, setSelectedBike] = useState<string>('')

  const [loadingTx, setLoadingTx] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>(
    !BURN_OPEN
      ? 'The portal is closed at the moment, please check in with our community for further announcements.'
      : ''
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
    if (!wallet || loadingTx) return
    setLoadingTx(true)

    try {
      const tx = new Transaction({ initiator: wallet })
        .sendAssets({ address: FOX_ADDRESS }, [
          {
            unit: selectedMale,
            quantity: '1',
          },
          {
            unit: selectedFemale,
            quantity: '1',
          },
        ])
        .sendAssets({ address: BIKE_ADDRESS }, [
          {
            unit: selectedBike,
            quantity: '1',
          },
        ])
        .sendLovelace({ address: KEY_ADDRESS }, String(8 * ONE_MILLION))

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

      toast.loading('Minting NFT...')
      await axios.post('/api/_dev/mint-key', { txHash })
      toast.dismiss()
      toast.success('NFT minted!')

      await removeAssetsFromWallet([selectedMale, selectedFemale, selectedBike])
      setSelectedMale('')
      setSelectedFemale('')
      setSelectedBike('')
    } catch (error: any) {
      console.error(error)
      toast.remove()
      toast.error('Woopsies!')

      if (error?.message?.indexOf('Not enough ADA leftover to include non-ADA assets') !== -1) {
        // [Transaction] An error occurred during build: Not enough ADA leftover to include non-ADA assets in a change address.
        setErrorMessage('TX build failed: your UTXOs are clogged, please send your ADA and your NFTs to yourself.')
      } else if (error?.message?.indexOf('UTxO Balance Insufficient') !== -1) {
        // [Transaction] An error occurred during build: UTxO Balance Insufficient.
        setErrorMessage('TX build failed: not enough ADA to process TX, please obtain more ADA, then try again.')
      }
    }

    setLoadingTx(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet, selectedMale, selectedFemale, selectedBike, txConfirmation, loadingTx])

  const filteredAssets = useMemo(
    () =>
      populatedWallet?.assets[selector === 'B' ? BAD_MOTORCYCLE_POLICY_ID : BAD_FOX_POLICY_ID]
        .sort((a, b) => (a?.serialNumber || 0) - (b?.serialNumber || 0))
        .filter(
          (asset) =>
            selector === 'B' ||
            (selector === 'M' && asset.attributes.Gender === 'Male') ||
            (selector === 'F' && asset.attributes.Gender === 'Female')
        ) || [],
    [populatedWallet, selector]
  )

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

      <div className='flex items-center justify-between w-[950px]'>
        <button
          type='button'
          onClick={() => setSelector('M')}
          className='relative flex flex-col items-center justify-center w-72 h-72 my-4 bg-gray-900 hover:bg-gray-700 bg-opacity-50 hover:bg-opacity-50 rounded-xl border border-gray-700 hover:border-gray-500 hover:text-gray-200'
        >
          {selectedMale ? (
            populatedWallet?.assets[BAD_FOX_POLICY_ID].filter((asset) => asset.tokenId === selectedMale).map(
              (asset) => (
                <div key={`selected-${asset.tokenId}`} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <ImageLoader
                    src={asset.image.url}
                    alt={asset.tokenName?.display as string}
                    width={288}
                    height={288}
                    style={{ borderRadius: '0.75rem' }}
                  />
                </div>
              )
            )
          ) : (
            <Fragment>
              <PhotoIcon className='w-12 h-12' />
              <p>Fox (Male)</p>
            </Fragment>
          )}
        </button>

        <button
          type='button'
          onClick={() => setSelector('F')}
          className='relative flex flex-col items-center justify-center w-72 h-72 my-4 bg-gray-900 hover:bg-gray-700 bg-opacity-50 hover:bg-opacity-50 rounded-xl border border-gray-700 hover:border-gray-500 hover:text-gray-200'
        >
          {selectedFemale ? (
            populatedWallet?.assets[BAD_FOX_POLICY_ID].filter((asset) => asset.tokenId === selectedFemale).map(
              (asset) => (
                <div key={`selected-${asset.tokenId}`} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <ImageLoader
                    src={asset.image.url}
                    alt={asset.tokenName?.display as string}
                    width={288}
                    height={288}
                    style={{ borderRadius: '0.75rem' }}
                  />
                </div>
              )
            )
          ) : (
            <Fragment>
              <PhotoIcon className='w-12 h-12' />
              <p>Fox (Female)</p>
            </Fragment>
          )}
        </button>

        <button
          type='button'
          onClick={() => setSelector('B')}
          className='relative flex flex-col items-center justify-center w-72 h-72 my-4 bg-gray-900 hover:bg-gray-700 bg-opacity-50 hover:bg-opacity-50 rounded-xl border border-gray-700 hover:border-gray-500 hover:text-gray-200'
        >
          {selectedBike ? (
            populatedWallet?.assets[BAD_MOTORCYCLE_POLICY_ID].filter(
              (asset) => asset.tokenId === selectedBike
            ).map((asset) => (
              <div key={`selected-${asset.tokenId}`} style={{ position: 'absolute', top: 0, left: 0 }}>
                <ImageLoader
                  src={asset.image.url}
                  alt={asset.tokenName?.display as string}
                  width={288}
                  height={288}
                  style={{ borderRadius: '0.75rem' }}
                />
              </div>
            ))
          ) : (
            <Fragment>
              <PhotoIcon className='w-12 h-12' />
              <p>Motorcycle</p>
            </Fragment>
          )}
        </button>
      </div>

      <div style={{ width: '100%' }}>
        <button
          type='button'
          onClick={buildTx}
          disabled={!BURN_OPEN || !!errorMessage || loadingTx || !selectedMale || !selectedFemale || !selectedBike}
          className='w-full p-4 rounded-xl disabled:bg-gray-900 bg-green-900 hover:bg-green-700 disabled:bg-opacity-50 bg-opacity-50 hover:bg-opacity-50 disabled:text-gray-700 hover:text-gray-200 disabled:border border hover:border disabled:border-gray-800 border-green-700 hover:border-green-700 disabled:cursor-not-allowed hover:cursor-pointer'
        >
          Transcend
        </button>

        {connectedName.toLowerCase() === 'eternl' ? (
          <p className='mt-2 text-center text-lg text-[var(--pink)]'>
            Eternl is known to cause problems, please consider using a single-address wallet.
          </p>
        ) : null}
        {errorMessage ? <p className='mt-2 text-center text-lg text-[var(--pink)]'>{errorMessage}</p> : null}
      </div>

      <Modal
        open={!!selector}
        onClose={() => setSelector('')}
        title={
          selector === 'B'
            ? 'Select a Motorcycle'
            : selector === 'M'
            ? 'Select a Male Fox'
            : selector === 'F'
            ? 'Select a Female Fox'
            : ''
        }
      >
        <div className='md:max-m-[90vw] m-fit flex flex-wrap items-center justify-evenly'>
          {!filteredAssets.length ? (
            <div>none</div>
          ) : (
            filteredAssets.map((asset) => (
              <AssetCard
                key={`asset-${asset.tokenId}`}
                imageSrc={formatIpfsImageUrl({
                  ipfsUri: asset.image.ipfs,
                  hasRank: !!asset.rarityRank,
                })}
                title={asset.tokenName?.display as string}
                onClick={() => {
                  selector === 'B'
                    ? setSelectedBike(asset.tokenId)
                    : selector === 'M'
                    ? setSelectedMale(asset.tokenId)
                    : selector === 'F'
                    ? setSelectedFemale(asset.tokenId)
                    : console.warn('unexpected condition')

                  setSelector('')
                }}
              />
            ))
          )}
        </div>
      </Modal>
    </div>
  )
}

export default BurnDashboard
