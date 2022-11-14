import { Fragment, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Transaction } from '@martifylabs/mesh'
import writeXlsxFile from 'write-excel-file'
import useWallet from '../../contexts/WalletContext'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import BaseButton from '../BaseButton'
import OnlineIndicator from '../OnlineIndicator'
import { ADA_SYMBOL } from '../../constants/ada'
import { EXCLUDE_ADDRESSES } from '../../constants/addresses'
import { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../constants/policy-ids'

const MILLION = 1000000
const COLLECTIONS = [
  { policyId: BAD_FOX_POLICY_ID, policyAssets: getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets') },
  { policyId: BAD_MOTORCYCLE_POLICY_ID, policyAssets: getFileForPolicyId(BAD_MOTORCYCLE_POLICY_ID, 'assets') },
]

const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(true), ms))

const AdminDashboard = () => {
  const { wallet, connectedManually, disconnectWallet } = useWallet()
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    ;(async () => {
      const lovelace = await wallet?.getLovelace()
      if (lovelace) setBalance(Math.floor(Number(lovelace) / MILLION))
    })()
  }, [wallet])

  const [transcripts, setTranscripts] = useState([{ timestamp: new Date().getTime(), msg: 'Welcome Admin' }])

  const [loading, setLoading] = useState(false)
  const [snapshotDone, setSnapshotDone] = useState(false)
  const [payoutDone, setPayoutDone] = useState(false)

  const [unlistedFoxCount, setUnlistedFoxCount] = useState(0)
  const [listedFoxCount, setListedFoxCount] = useState(0)
  const [unlistedMotorcycleCount, setUnlistedMotorcycleCount] = useState(0)
  const [listedMotorcycleCount, setListedMotorcycleCount] = useState(0)

  const [holdingWallets, setHoldingWallets] = useState([])
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

    const holders = []
    let unlistedFoxes = 0
    let unlistedMotorcycles = 0

    for (let c = 0; c < COLLECTIONS.length; c++) {
      const { policyId, policyAssets } = COLLECTIONS[c]
      addTranscript(`Collection ${c + 1} / ${COLLECTIONS.length}`, policyId)
      await sleep(500)

      for (let i = 0; i < policyAssets.length; i++) {
        const { assetId, isBurned } = policyAssets[i]
        addTranscript(`Processing ${i + 1} / ${policyAssets.length}`, assetId)

        if (!isBurned) {
          const { stakeKey, walletAddress } = await fetchOwningWallet(assetId)

          if (!EXCLUDE_ADDRESSES.includes(walletAddress)) {
            const holderIndex = holders.findIndex((item) => item.stakeKey === stakeKey)

            if (holderIndex === -1) {
              holders.push({
                stakeKey,
                addresses: [walletAddress],
                assets: {
                  [policyId]: [assetId],
                },
              })
            } else {
              if (!holders.find((item) => item.addresses.includes(walletAddress))) {
                holders[holderIndex].addresses.push(walletAddress)
              }

              if (holders[holderIndex].assets[policyId]) {
                holders[holderIndex].assets[policyId].push(assetId)
              } else {
                holders[holderIndex].assets[policyId] = [assetId]
              }
            }

            if (policyId === BAD_FOX_POLICY_ID) {
              unlistedFoxes++
              setUnlistedFoxCount((prev) => prev + 1)
            } else if (policyId === BAD_MOTORCYCLE_POLICY_ID) {
              unlistedMotorcycles++
              setUnlistedMotorcycleCount((prev) => prev + 1)
            }
          } else {
            if (policyId === BAD_FOX_POLICY_ID) {
              setListedFoxCount((prev) => prev + 1)
            } else if (policyId === BAD_MOTORCYCLE_POLICY_ID) {
              setListedMotorcycleCount((prev) => prev + 1)
            }
          }
        }
      }
    }

    setHoldingWallets(holders)

    const adaPool = balance * 0.8
    const adaPerShare = adaPool / (unlistedFoxes + unlistedMotorcycles * 2)

    setPayoutWallets(
      holders
        .map(({ stakeKey, addresses, assets }) => {
          let adaForAssets = 0
          let adaForTraits = 0

          Object.entries(assets).forEach(([policyId, policyAssets]) => {
            const collection = COLLECTIONS.find((collection) => collection.policyId === policyId)

            if (policyId === BAD_FOX_POLICY_ID) {
              adaForAssets += policyAssets.length * adaPerShare

              for (const assetId of policyAssets) {
                const { attributes } = collection.policyAssets.find((asset) => asset.assetId === assetId)

                if (attributes['Mouth'] === '(F) Crypto') {
                  adaForTraits += 10
                } else if (attributes['Mouth'] === '(M) Cash Bag') {
                  adaForTraits += 10
                } else if (attributes['Mouth'] === '(M) Clover') {
                  adaForTraits += 50
                }
              }
            } else if (policyId === BAD_MOTORCYCLE_POLICY_ID) {
              adaForAssets += policyAssets.length * adaPerShare * 2

              // for (const assetId of policyAssets) {
              //   const { attributes } = collection.policyAssets.find((asset) => asset.assetId === assetId)
              //   if (attributes['Rear'] === '(M) Ada Bag') {
              //     adaForTraits += 0
              //   }
              // }
            }
          })

          return {
            stakeKey,
            address: addresses[0],
            payout: Math.round(adaForAssets + adaForTraits),
          }
        })
        .sort((a, b) => b.payout - a.payout)
    )

    addTranscript('Done!')
    setSnapshotDone(true)
    setLoading(false)
  }, [balance])

  const payEveryone = useCallback(async () => {
    setLoading(true)

    try {
      const tx = new Transaction({ initiator: wallet })

      for (const { address, payout } of payoutWallets) {
        tx.sendLovelace(address, String(payout * MILLION))
      }

      addTranscript('Building TX')
      const unsignedTx = await tx.build()
      addTranscript('Awaiting signature')
      const signedTx = await wallet.signTx(unsignedTx)
      addTranscript('Submitting TX')
      const txHash = await wallet.submitTx(signedTx)

      addTranscript('Done!', txHash)
      setPayoutTxHash(txHash)
      setPayoutDone(true)
    } catch (error) {
      addTranscript('ERROR', error.message)
      console.error(error)
    }

    setLoading(false)
  }, [wallet, payoutWallets])

  const downloadReceipt = useCallback(async () => {
    setLoading(true)

    const data = [
      [
        {
          value: 'Wallet Address',
          fontWeight: 'bold',
        },
        {
          value: 'Stake Key',
          fontWeight: 'bold',
        },
        {
          value: 'Fox Count',
          fontWeight: 'bold',
        },
        {
          value: 'Motorcycle Count',
          fontWeight: 'bold',
        },
        {
          value: 'Payout',
          fontWeight: 'bold',
        },
      ],
    ]

    for (const { address, stakeKey, payout } of payoutWallets) {
      const holder = holdingWallets.find((holder) => holder.stakeKey === stakeKey)

      data.push([
        {
          type: String,
          value: address,
        },
        {
          type: String,
          value: stakeKey,
        },
        {
          type: Number,
          value: holder.assets[BAD_FOX_POLICY_ID]?.length || 0,
        },
        {
          type: Number,
          value: holder.assets[BAD_MOTORCYCLE_POLICY_ID]?.length || 0,
        },
        {
          type: Number,
          value: payout,
        },
      ])
    }

    try {
      await writeXlsxFile(data, {
        fileName: `BadFoxMC Royalty Distribution (${new Date().toLocaleString()}) TX[${payoutTxHash}].xlsx`,
        columns: [{ width: 100 }, { width: 60 }, { width: 25 }, { width: 25 }, { width: 25 }],
      })
    } catch (error) {
      addTranscript('ERROR', error.message)
      console.error(error)
    }

    setLoading(false)
  }, [payoutWallets, payoutTxHash])

  const syncDb = useCallback(async () => {
    setLoading(true)

    try {
      addTranscript(`Syncing ${payoutWallets.length} wallets`)
      await axios.post('/api/admin/syncDbWallets', { wallets: holdingWallets })
      addTranscript('Done!')
    } catch (error) {
      addTranscript('ERROR', error.message)
      console.error(error)
    }

    setLoading(false)
  }, [holdingWallets])

  if (connectedManually) {
    return (
      <div className='flex-col'>
        <p>
          ERROR! You connected manually, if you wish to build & sign a TX please reconnect in a non-manual way.
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
          online={!snapshotDone && !payoutDone && !loading && balance}
          title={loading ? 'processing' : !snapshotDone && !payoutDone ? 'run snapshot' : 'snapshot done'}
          placement='bottom'
          style={{ width: '20%' }}
        >
          <BaseButton
            label='Run Snapshot'
            onClick={runSnapshot}
            backgroundColor='var(--apex-charcoal)'
            hoverColor='var(--brown)'
            fullWidth
            disabled={snapshotDone || payoutDone || loading || !balance}
          />
        </OnlineIndicator>

        <OnlineIndicator
          online={snapshotDone && !loading}
          title={loading ? 'processing' : snapshotDone ? 'sync db' : 'wait for snapshot'}
          placement='bottom'
          style={{ width: '20%' }}
        >
          <BaseButton
            label='Sync DB'
            onClick={syncDb}
            backgroundColor='var(--apex-charcoal)'
            hoverColor='var(--brown)'
            fullWidth
            disabled={!snapshotDone || loading}
          />
        </OnlineIndicator>

        <OnlineIndicator
          online={snapshotDone && !payoutDone && !loading}
          title={loading ? 'processing' : snapshotDone ? 'pay everyone' : 'wait for snapshot'}
          placement='bottom'
          style={{ width: '20%' }}
        >
          <BaseButton
            label='Pay Everyone'
            onClick={payEveryone}
            backgroundColor='var(--apex-charcoal)'
            hoverColor='var(--brown)'
            fullWidth
            disabled={!snapshotDone || payoutDone || loading}
          />
        </OnlineIndicator>

        <OnlineIndicator
          online={snapshotDone && payoutDone && !loading}
          title={loading ? 'processing' : payoutDone ? 'download receipt' : 'wait for payout'}
          placement='bottom'
          style={{ width: '20%' }}
        >
          <BaseButton
            label='Download Receipt'
            onClick={downloadReceipt}
            backgroundColor='var(--apex-charcoal)'
            hoverColor='var(--brown)'
            fullWidth
            disabled={!payoutDone || loading}
          />
        </OnlineIndicator>
      </div>

      <table style={{ margin: '1rem auto', textAlign: 'center' }}>
        <thead>
          <tr>
            <th style={{ padding: '0 0.5rem' }}>Unlisted Foxes</th>
            <th style={{ padding: '0 0.5rem' }}>Listed Foxes</th>
            <th style={{ padding: '0 0.5rem' }}>Unlisted Motorcycles</th>
            <th style={{ padding: '0 0.5rem' }}>Listed Motorcycles</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{unlistedFoxCount}</td>
            <td>{listedFoxCount}</td>
            <td>{unlistedMotorcycleCount}</td>
            <td>{listedMotorcycleCount}</td>
          </tr>
        </tbody>
      </table>

      {payoutWallets.length ? (
        <table style={{ margin: '1rem auto', textAlign: 'center' }}>
          <thead>
            <tr>
              <th style={{ padding: '0 0.5rem' }}>Payout</th>
              <th style={{ padding: '0 0.5rem' }}>Stake Key</th>
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
