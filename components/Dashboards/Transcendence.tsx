import React, { Fragment, useCallback, useMemo, useState } from 'react'
import SaveAltRoundedIcon from '@mui/icons-material/SaveAltRounded'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import useWallet from '../../contexts/WalletContext'
import formatIpfsImageUrl from '../../functions/formatters/formatIpfsImageUrl'
import BaseButton from '../BaseButton'
import Modal from '../Modal'
import AssetCard from '../Assets/AssetCard'
import { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID, ONE_MILLION } from '../../constants'
import ImageLoader from '../Loader/ImageLoader'
import { Transaction } from '@martifylabs/mesh'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import sleep from '../../functions/sleep'

const BURN_ADDRESS =
  'addr1q8asn9zjsxetzc8l6dt0jl9h5kpsqqprtke8zvyllxdenjhcacrlq84f8xf0jctd35ep8atk3yjl3uvctgkxa7t9jvcqqx2thp'

const Transcendence = () => {
  const { isMobile } = useScreenSize()
  const { connectedManually, wallet, populatedWallet, disconnectWallet } = useWallet()

  const [selector, setSelector] = useState<'M' | 'F' | 'B' | ''>('')
  const [selectedMale, setSelectedMale] = useState<string>('')
  const [selectedFemale, setSelectedFemale] = useState<string>('')
  const [selectedBike, setSelectedBike] = useState<string>('')

  const [loadingTx, setLoadingTx] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

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
        }>(`/api/blockfrost/tx/${txHash}/status`)

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
        .sendLovelace({ address: BURN_ADDRESS }, String(5 * ONE_MILLION))
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

      toast.loading('Building transaction')
      const unsignedTx = await tx.build()

      toast.loading('Awaiting signature')
      const signedTx = await wallet?.signTx(unsignedTx)

      toast.loading('Submitting transaction')
      const txHash = await wallet?.submitTx(signedTx as string)

      toast.loading('Awaiting network confirmation')
      await txConfirmation(txHash as string)

      toast.success('Transaction submitted!')
      setSelectedMale('')
      setSelectedFemale('')
      setSelectedBike('')
    } catch (error: any) {
      console.error(error)
      toast.error(error?.message || error)

      if (error?.message?.indexOf('Not enough ADA leftover to include non-ADA assets') !== -1) {
        // [Transaction] An error occurred during build: Not enough ADA leftover to include non-ADA assets in a change address.
        setErrorMessage('TX build failed: your UTXOs are clogged, please send all your ADA & assets to yourself.')
      } else if (error?.message?.indexOf('UTxO Balance Insufficient') !== -1) {
        // [Transaction] An error occurred during build: UTxO Balance Insufficient.
        setErrorMessage('TX build failed: not enough ADA to process TX, please obtain more ADA, then try again.')
      }
    }

    setLoadingTx(false)
  }, [wallet, selectedMale, selectedFemale, selectedBike, txConfirmation, loadingTx])

  const styles = useMemo(
    () => ({
      walletSummary: {
        width: 'fit-content',
        margin: '1rem',
        textAlign: 'center' as const,
      },
      title: {
        margin: '0.5rem 0',
        fontSize: '1.3rem',
        fontWeight: 'bold',
      },
      stakeKey: {
        margin: '0.1rem 0',
        fontWeight: 'bold',
      },

      assetSelectionsWrapper: {
        width: 950,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      assetSelection: {
        width: 300,
        height: 300,
        margin: '1rem 0',
        backgroundColor: 'var(--charcoal)',
        color: 'var(--grey)',
        border: '1px dashed var(--apex-charcoal)',
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative' as const,
        cursor: 'pointer',
      },
      selectIcon: {
        width: 100,
        height: 100,
      },

      errorMessage: {
        color: 'var(--pink)',
        textAlign: 'center' as const,
        fontWeight: 'bold',
      },

      listOfAssets: {
        width: isMobile ? 'unset' : '90vw',
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      },
    }),
    []
  )

  if (connectedManually) {
    return (
      <div className='flex-col'>
        <p style={styles.errorMessage}>
          Error! You connected manually.
          <br />
          If you wish to build & sign a TX, please re-connect in a non-manual way.
        </p>

        <BaseButton
          label='Disconnect Wallet'
          onClick={disconnectWallet}
          backgroundColor='var(--apex-charcoal)'
          hoverColor='var(--brown)'
        />
      </div>
    )
  }

  return (
    <div className='flex-col'>
      <div style={styles.walletSummary}>
        <p style={styles.title}>Connected Wallet</p>
        <p style={styles.stakeKey}>
          {populatedWallet?.stakeKey.substring(0, 15)}...
          {populatedWallet?.stakeKey.substring(populatedWallet.stakeKey.length - 15)}
        </p>
        <BaseButton
          label='Disconnect'
          onClick={disconnectWallet}
          fullWidth
          backgroundColor='var(--brown)'
          hoverColor='var(--orange)'
          style={{ margin: 1 }}
        />
      </div>

      <div style={styles.assetSelectionsWrapper}>
        <div style={styles.assetSelection} onClick={() => setSelector('M')}>
          {selectedMale ? (
            populatedWallet?.assets[BAD_FOX_POLICY_ID].filter((asset) => asset.assetId === selectedMale).map(
              (asset) => (
                <div key={`selected-${asset.assetId}`} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <ImageLoader
                    src={asset.image.firebase}
                    alt={asset.displayName}
                    width={styles.assetSelection.width}
                    height={styles.assetSelection.height}
                  />
                </div>
              )
            )
          ) : (
            <Fragment>
              <SaveAltRoundedIcon style={styles.selectIcon} />
              <p>Fox (M)</p>
            </Fragment>
          )}
        </div>

        <div style={styles.assetSelection} onClick={() => setSelector('F')}>
          {selectedFemale ? (
            populatedWallet?.assets[BAD_FOX_POLICY_ID].filter((asset) => asset.assetId === selectedFemale).map(
              (asset) => (
                <div key={`selected-${asset.assetId}`} style={{ position: 'absolute', top: 0, left: 0 }}>
                  <ImageLoader
                    src={asset.image.firebase}
                    alt={asset.displayName}
                    width={styles.assetSelection.width}
                    height={styles.assetSelection.height}
                  />
                </div>
              )
            )
          ) : (
            <Fragment>
              <SaveAltRoundedIcon style={styles.selectIcon} />
              <p>Fox (F)</p>
            </Fragment>
          )}
        </div>

        <div style={styles.assetSelection} onClick={() => setSelector('B')}>
          {selectedBike ? (
            populatedWallet?.assets[BAD_MOTORCYCLE_POLICY_ID].filter(
              (asset) => asset.assetId === selectedBike
            ).map((asset) => (
              <div key={`selected-${asset.assetId}`} style={{ position: 'absolute', top: 0, left: 0 }}>
                <ImageLoader
                  src={asset.image.firebase}
                  alt={asset.displayName}
                  width={styles.assetSelection.width}
                  height={styles.assetSelection.height}
                />
              </div>
            ))
          ) : (
            <Fragment>
              <SaveAltRoundedIcon style={styles.selectIcon} />
              <p>Motorcycle</p>
            </Fragment>
          )}
        </div>
      </div>

      <div style={{ width: '100%' }}>
        <BaseButton
          label='Transcend'
          onClick={buildTx}
          disabled={
            !BURN_ADDRESS || !!errorMessage || loadingTx || !selectedMale || !selectedFemale || !selectedBike
          }
          fullWidth
          backgroundColor={
            !BURN_ADDRESS || !!errorMessage || loadingTx || !selectedMale || !selectedFemale || !selectedBike
              ? 'var(--charcoal)'
              : 'var(--brown)'
          }
          hoverColor={
            !BURN_ADDRESS || !!errorMessage || loadingTx || !selectedMale || !selectedFemale || !selectedBike
              ? 'var(--charcoal)'
              : 'var(--orange)'
          }
        />

        {errorMessage ? <p style={styles.errorMessage}>{errorMessage}</p> : null}
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
        <div className='scroll' style={styles.listOfAssets}>
          {populatedWallet?.assets[selector === 'B' ? BAD_MOTORCYCLE_POLICY_ID : BAD_FOX_POLICY_ID]
            .sort((a, b) => a.serialNumber - b.serialNumber)
            .map((asset) =>
              selector === 'B' ||
              (selector === 'M' && asset.attributes.Gender === 'Male') ||
              (selector === 'F' && asset.attributes.Gender === 'Female') ? (
                // @ts-ignore
                <AssetCard
                  key={`asset-${asset.assetId}`}
                  mainTitles={[asset.displayName]}
                  imageSrc={formatIpfsImageUrl(asset.image.ipfs, !!asset.rarityRank)}
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
              ) : null
            )}
        </div>
      </Modal>
    </div>
  )
}

export default Transcendence
