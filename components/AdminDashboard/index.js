import { Fragment, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Transaction } from '@martifylabs/mesh'
import useWallet from '../../contexts/WalletContext'
import BaseButton from '../BaseButton'
import OnlineIndicator from '../OnlineIndicator'
import { ADA_SYMBOL } from '../../constants/ada'
import { EXCLUDE_ADDRESSES } from '../../constants/addresses'
import { BAD_FOX_POLICY_ID } from '../../constants/policy-ids'
import foxAssetsFile from '../../data/assets/bad-fox.json'

const MILLION = 1000000

const AdminDashboard = () => {
  const { wallet } = useWallet()
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    ;(async () => {
      const lovelace = await wallet?.getLovelace()

      if (lovelace) {
        setBalance(Math.floor(Number(lovelace) / MILLION))
      }
    })()
  }, [wallet])

  const [transcripts, setTranscripts] = useState([{ timestamp: new Date().getTime(), msg: 'Welcome Admin' }])
  const [loading, setLoading] = useState(false)
  const [snapshotDone, setSnapshotDone] = useState(false)
  const [payoutDone, setPayoutDone] = useState(false)
  const [listedCount, setListedCount] = useState(0)
  const [unlistedCount, setUnlistedCount] = useState(0)
  const [payoutWallets, setPayoutWallets] = useState([])
  const [payoutTxHash, setPayoutTxHash] = useState('')

  const addTranscript = (msg, key) => {
    setTranscripts((prev) => {
      const prevCopy = [...prev]
      if (prevCopy.length >= 50) prevCopy.pop()

      return [
        {
          timestamp: new Date().getTime(),
          msg,
          key,
        },
        ...prevCopy,
      ]
    })
  }

  const fetchOwningWallet = useCallback(async (assetId) => {
    try {
      const { data } = await axios.get(`/api/admin/getWalletWithAssetId/${assetId}`)

      return data
    } catch (error) {
      addTranscript('ERROR', error.message)
      return await fetchOwningWallet(assetId)
    }
  }, [])

  const runSnapshot = useCallback(async () => {
    setLoading(true)
    let unlistedCountForPayoutCalculation = 0
    const collectionAssets = foxAssetsFile.assets
    const holders = []

    for (let i = 0; i < collectionAssets.length; i++) {
      if (i == 10) {
        break
      }
      const { assetId } = collectionAssets[i]
      addTranscript(`Processing ${i + 1} / ${collectionAssets.length}`, assetId)

      const { stakeKey, walletAddress } = await fetchOwningWallet(assetId)

      if (!EXCLUDE_ADDRESSES.includes(walletAddress)) {
        const holderIndex = holders.findIndex((item) => item.stakeKey === stakeKey)

        if (holderIndex === -1) {
          holders.push({
            stakeKey,
            addresses: [walletAddress],
            assets: [assetId],
          })
        } else {
          if (!holders.find((item) => item.addresses.includes(walletAddress))) {
            holders[holderIndex].addresses.push(walletAddress)
          }

          holders[holderIndex].assets.push(assetId)
        }

        setUnlistedCount((prev) => prev + 1)
        unlistedCountForPayoutCalculation++
      } else {
        setListedCount((prev) => prev + 1)
      }
    }

    const holdersShare = balance * 0.8
    const adaPerAsset = holdersShare / unlistedCountForPayoutCalculation

    setPayoutWallets(
      holders
        .map(({ stakeKey, addresses, assets }) => {
          const adaForAssets = assets.length * adaPerAsset
          let adaForTraits = 0

          for (const assetId of assets) {
            if (assetId.indexOf(BAD_FOX_POLICY_ID) !== -1) {
              const {
                attributes: { Mouth },
              } = collectionAssets.find((asset) => asset.assetId === assetId)

              if (Mouth === '(F) Crypto') {
                adaForTraits += 10
              } else if (Mouth === '(M) Cash Bag') {
                adaForTraits += 10
              } else if (Mouth === '(M) Clover') {
                adaForTraits += 50
              }
            }
          }

          const payout = adaForAssets + adaForTraits

          return {
            stakeKey,
            address: addresses[0],
            payout,
          }
        })
        .sort((a, b) => b.payout - a.payout)
    )

    setSnapshotDone(true)
    setLoading(false)
  }, [balance])

  const payEveryone = async () => {
    setLoading(true)

    try {
      const tx = new Transaction({ initiator: wallet })
      console.log('tx1', tx)

      for await (const { address, payout } of payoutWallets) {
        tx.sendLovelace({ address }, String(payout * MILLION))
      }
      console.log('tx2', tx)

      const unsignedTx = await tx.build()
      console.log('unsignedTx', unsignedTx)

      const signedTx = await wallet.signTx(unsignedTx)
      console.log('signedTx', signedTx)

      const txHash = await wallet.submitTx(signedTx)
      console.log('txHash', txHash)

      setPayoutTxHash(txHash)
      setPayoutDone(true)
    } catch (error) {
      console.error(error)
      console.error(error.message)
    }

    setLoading(false)
  }

  return (
    <div>
      <div className='flex-row' style={{ justifyContent: 'center' }}>
        <p>
          Balance: {ADA_SYMBOL}
          {balance}
        </p>
      </div>

      <div
        style={{
          width: '69vw',
          height: '42vh',
          margin: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--apex-charcoal)',
          border: '1px solid var(--white)',
          borderRadius: '1rem',
          display: 'flex',
          flexDirection: 'column-reverse',
          overflow: 'scroll',
        }}
      >
        {transcripts.map(({ timestamp, msg, key }) => (
          <p key={timestamp} style={{ margin: 0 }}>
            {new Date(timestamp).toLocaleTimeString()} - {msg}
            {key ? (
              <Fragment>
                <br />
                <span style={{ fontSize: '0.8rem' }}>{key}</span>
              </Fragment>
            ) : null}
          </p>
        ))}
      </div>

      <div className='flex-row' style={{ justifyContent: 'space-evenly' }}>
        <OnlineIndicator
          online={!snapshotDone && !payoutDone && !loading}
          title={loading ? 'processing' : !snapshotDone && !payoutDone ? 'run snapshot' : 'snapshot done'}
          placement='bottom'
          style={{ width: '30%' }}
        >
          <BaseButton
            label='Run Snapshot'
            onClick={runSnapshot}
            backgroundColor='var(--apex-charcoal)'
            hoverColor='var(--brown)'
            fullWidth
            disabled={snapshotDone || payoutDone || loading}
          />
        </OnlineIndicator>

        <OnlineIndicator
          online={snapshotDone && !payoutDone && !loading}
          title={loading ? 'processing' : snapshotDone ? 'pay everyone' : 'wait for snapshot'}
          placement='bottom'
          style={{ width: '30%' }}
        >
          <BaseButton
            label='Pay Everyone'
            onClick={payEveryone}
            backgroundColor='var(--apex-charcoal)'
            hoverColor='var(--brown)'
            fullWidth
            disabled={!snapshotDone || loading}
          />
        </OnlineIndicator>

        <OnlineIndicator
          online={snapshotDone && payoutDone && !loading}
          title={loading ? 'processing' : payoutDone ? 'download receipt' : 'wait for payout'}
          placement='bottom'
          style={{ width: '30%' }}
        >
          <BaseButton
            label='Download Receipt'
            onClick={() => alert('to do')}
            backgroundColor='var(--apex-charcoal)'
            hoverColor='var(--brown)'
            fullWidth
            disabled={!payoutDone || loading}
          />
        </OnlineIndicator>
      </div>

      <div className='flex-row' style={{ justifyContent: 'center', margin: 11 }}>
        <p style={{ margin: 11 }}>Listed: {listedCount}</p>
        <p style={{ margin: 11 }}>Unlisted: {unlistedCount}</p>
      </div>

      {payoutWallets.length ? (
        <table style={{ margin: '0 auto' }}>
          <thead>
            <tr>
              <th style={{ width: 100 }}>Payout</th>
              <th>Stake Key</th>
            </tr>
          </thead>
          <tbody>
            {payoutWallets.map(({ stakeKey, payout }) => (
              <tr key={stakeKey}>
                <td>
                  {ADA_SYMBOL}
                  {payout}
                </td>
                <td>{stakeKey}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

export default AdminDashboard
