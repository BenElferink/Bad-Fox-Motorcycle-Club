import React, { Fragment, useCallback, useMemo, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Transaction } from '@meshsdk/core'
import useWallet from '../../contexts/WalletContext'
import { PhotoIcon } from '@heroicons/react/24/solid'
import Modal from '../layout/Modal'
import ImageLoader from '../Loader/ImageLoader'
import WalletHero from '../Wallet/WalletHero'
import AssetCard from '../cards/AssetCard'
import sleep from '../../functions/sleep'
import formatIpfsImageUrl from '../../functions/formatters/formatIpfsImageUrl'
import { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID, ONE_MILLION } from '../../constants'

const BURN_ADDRESS =
  'addr1qyn6t3nwhasa8gslcs6mj4qay78d3ufm7val0pz0uh3gy8dsf86vnnyx9qhjvka6etzkjpw82lz25vjfexnd9a6l08tqymvfqp'

const BurnDashboard = () => {
  const { connectedManually, connectedName, wallet, populatedWallet, disconnectWallet, removeAssetsFromWallet } =
    useWallet()

  const [selector, setSelector] = useState<'M' | 'F' | 'B' | ''>('')
  const [selectedMale, setSelectedMale] = useState<string>('')
  const [selectedFemale, setSelectedFemale] = useState<string>('')
  const [selectedBike, setSelectedBike] = useState<string>('')

  const [loadingTx, setLoadingTx] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>(
    !BURN_ADDRESS
      ? 'The portal is closed at the moment, please check in with our community for further announcements.'
      : ''
  )

  const txConfirmation = useCallback(
    async (
      txHash: string
    ): Promise<{
      txHash: string
      submitted: boolean
    }> => {
      try {
        const { data } = await axios.get<{
          txHash: string
          submitted: boolean
        }>(`/api/transaction/${txHash}/status`)

        if (data.submitted) {
          return data
        } else {
          await sleep(1000)
          return await txConfirmation(txHash)
        }
      } catch (error) {
        console.error(error)

        await sleep(1000)
        return await txConfirmation(txHash)
      }
    },
    []
  )

  const buildTx = useCallback(async () => {
    if (!BURN_ADDRESS || loadingTx) return
    setLoadingTx(true)

    try {
      const tx = new Transaction({ initiator: wallet })
        .sendLovelace({ address: BURN_ADDRESS }, String(4 * ONE_MILLION))
        .sendAssets({ address: BURN_ADDRESS }, [
          {
            unit: selectedMale,
            quantity: '1',
          },
          {
            unit: selectedFemale,
            quantity: '1',
          },
          {
            unit: selectedBike,
            quantity: '1',
          },
        ])

      let toastId = toast.loading('Building transaction')
      const unsignedTx = await tx.build()
      toast.dismiss(toastId)

      toastId = toast.loading('Awaiting signature')
      const signedTx = await wallet?.signTx(unsignedTx)
      toast.dismiss(toastId)

      toastId = toast.loading('Submitting transaction')
      const txHash = await wallet?.submitTx(signedTx as string)
      toast.dismiss(toastId)

      toastId = toast.loading('Awaiting network confirmation')
      await txConfirmation(txHash as string)
      toast.dismiss(toastId)

      toast.success('Transaction submitted!')
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
  }, [wallet, selectedMale, selectedFemale, selectedBike, txConfirmation, loadingTx])

  const filteredAssets = useMemo(
    () =>
      populatedWallet?.assets[selector === 'B' ? BAD_MOTORCYCLE_POLICY_ID : BAD_FOX_POLICY_ID]
        .sort((a, b) => a.serialNumber - b.serialNumber)
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
        <p className='pt-[15vh] text-center text-lg text-[var(--pink)]'>
          Error! You connected manually.
          <br />
          If you wish to build & sign a TX, please re-connect in a non-manual way.
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
            populatedWallet?.assets[BAD_FOX_POLICY_ID].filter((asset) => asset.assetId === selectedMale).map(
              (asset) => (
                <div key={`selected-${asset.assetId}`} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <ImageLoader
                    src={asset.image.firebase}
                    alt={asset.displayName}
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
            populatedWallet?.assets[BAD_FOX_POLICY_ID].filter((asset) => asset.assetId === selectedFemale).map(
              (asset) => (
                <div key={`selected-${asset.assetId}`} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <ImageLoader
                    src={asset.image.firebase}
                    alt={asset.displayName}
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
              (asset) => asset.assetId === selectedBike
            ).map((asset) => (
              <div key={`selected-${asset.assetId}`} style={{ position: 'absolute', top: 0, left: 0 }}>
                <ImageLoader
                  src={asset.image.firebase}
                  alt={asset.displayName}
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
          disabled={
            !BURN_ADDRESS || !!errorMessage || loadingTx || !selectedMale || !selectedFemale || !selectedBike
          }
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
                key={`asset-${asset.assetId}`}
                imageSrc={formatIpfsImageUrl(asset.image.ipfs, !!asset.rarityRank)}
                title={asset.displayName}
                onClick={() => {
                  selector === 'B'
                    ? setSelectedBike(asset.assetId)
                    : selector === 'M'
                    ? setSelectedMale(asset.assetId)
                    : selector === 'F'
                    ? setSelectedFemale(asset.assetId)
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
