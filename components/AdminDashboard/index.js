import { Fragment, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Transaction } from '@martifylabs/mesh'
import writeXlsxFile from 'write-excel-file'
import useWallet from '../../contexts/WalletContext'
import sleep from '../../functions/sleep'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import BaseButton from '../BaseButton'
import OnlineIndicator from '../OnlineIndicator'
import { ADA_SYMBOL, BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../constants'

const MILLION = 1000000
const COLLECTIONS = [
  { policyId: BAD_FOX_POLICY_ID, policyAssets: getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets') },
  { policyId: BAD_MOTORCYCLE_POLICY_ID, policyAssets: getFileForPolicyId(BAD_MOTORCYCLE_POLICY_ID, 'assets') },
]

const displayBalance = (v) => (Number(v) / MILLION).toFixed(2)

const AdminDashboard = () => {
  const { wallet, connectedManually, disconnectWallet } = useWallet()
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    ;(async () => {
      const lovelace = await wallet?.getLovelace()
      if (lovelace) setBalance(Number(lovelace))
    })()
  }, [wallet])

  const [transcripts, setTranscripts] = useState([{ timestamp: new Date().getTime(), msg: 'Welcome Admin' }])
  const [unlistedFoxCount, setUnlistedFoxCount] = useState(0)
  const [listedFoxCount, setListedFoxCount] = useState(0)
  const [unlistedMotorcycleCount, setUnlistedMotorcycleCount] = useState(0)
  const [listedMotorcycleCount, setListedMotorcycleCount] = useState(0)

  const [holdingWallets, setHoldingWallets] = useState([])
  const [payoutWallets, setPayoutWallets] = useState([])
  const [payoutTxHash, setPayoutTxHash] = useState('')

  const [loading, setLoading] = useState(false)
  const [snapshotDone, setSnapshotDone] = useState(false)
  const [payoutDone, setPayoutDone] = useState(false)

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
      const { data } = await axios.get(`/api/admin/owner?assetId=${assetId}`)

      return data
    } catch (error) {
      console.error(error)
      addTranscript('ERROR', error.message)
      return await fetchOwningWallet(assetId)
    }
  }, [])

  const runSnapshot = useCallback(async () => {
    setLoading(true)

    const holders = []
    const fetchedWallets = []
    let unlistedFoxes = 0
    let unlistedMotorcycles = 0

    for (let c = 0; c < COLLECTIONS.length; c++) {
      const { policyId, policyAssets } = COLLECTIONS[c]
      addTranscript(`Processing collection ${c + 1} / ${COLLECTIONS.length}`, policyId)
      await sleep(100)

      for (let i = 0; i < policyAssets.length; i++) {
        const { assetId, isBurned } = policyAssets[i]

        if (isBurned) {
          addTranscript(`Asset ${i + 1} / ${policyAssets.length} is burned`, assetId)
        } else {
          addTranscript(`Processing asset ${i + 1} / ${policyAssets.length}`, assetId)

          // this is to improve speed, reduce backend calls
          const foundFetchedWallet = fetchedWallets.find(
            ({ assets }) => !!assets[policyId]?.find(({ unit }) => unit === assetId)
          )

          const wallet = foundFetchedWallet || (await fetchOwningWallet(assetId))

          // this is to improve speed, reduce backend calls
          if (!foundFetchedWallet) {
            fetchedWallets.push(wallet)
          }

          const { isContract, stakeKey, walletAddress, assets } = wallet

          if (isContract) {
            if (policyId === BAD_FOX_POLICY_ID) {
              setListedFoxCount((prev) => prev + 1)
            } else if (policyId === BAD_MOTORCYCLE_POLICY_ID) {
              setListedMotorcycleCount((prev) => prev + 1)
            }
          } else {
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
          }
        }
      }
    }

    setHoldingWallets(holders)

    const lovelacePool = balance * 0.8
    const lovelacePerShare = Math.floor(lovelacePool / (unlistedFoxes + unlistedMotorcycles * 2))

    setPayoutWallets(
      holders
        .map(({ stakeKey, addresses, assets }) => {
          let lovelaceForAssets = 0
          let lovelaceForTraits = 0

          Object.entries(assets).forEach(([policyId, policyAssets]) => {
            const collection = COLLECTIONS.find((collection) => collection.policyId === policyId)

            if (policyId === BAD_FOX_POLICY_ID) {
              lovelaceForAssets += policyAssets.length * lovelacePerShare

              for (const assetId of policyAssets) {
                const { attributes } = collection.policyAssets.find((asset) => asset.assetId === assetId)
                if (attributes['Mouth'] === '(F) Crypto') {
                  lovelaceForTraits += 10 * MILLION
                } else if (attributes['Mouth'] === '(M) Cash Bag') {
                  lovelaceForTraits += 10 * MILLION
                }
              }
            } else if (policyId === BAD_MOTORCYCLE_POLICY_ID) {
              lovelaceForAssets += policyAssets.length * lovelacePerShare * 2

              for (const assetId of policyAssets) {
                const { attributes } = collection.policyAssets.find((asset) => asset.assetId === assetId)
                if (attributes['Rear'] === '(CH) Ada Bag') {
                  lovelaceForTraits += 10 * MILLION
                } else if (attributes['Rear'] === '(HB) Vault') {
                  lovelaceForTraits += 10 * MILLION
                } else if (attributes['Above'] === '(NI) Cash Bag') {
                  lovelaceForTraits += 10 * MILLION
                } else if (attributes['Anterior'] === '(VE) Piggy Savings') {
                  lovelaceForTraits += 10 * MILLION
                }
              }
            }
            // else if (policyId === BAD_KEY_POLICY_ID) {
            //   lovelaceForAssets += policyAssets.length * lovelacePerShare * 4
            // }
          })

          return {
            stakeKey,
            address: addresses[0],
            payout: lovelaceForAssets + lovelaceForTraits,
          }
        })
        .sort((a, b) => b.payout - a.payout)
    )

    addTranscript('Snapshot done!')
    setSnapshotDone(true)
    setLoading(false)
  }, [balance])

  const txConfirmation = useCallback(async (txHash) => {
    try {
      const { data } = await axios.get(`/api/admin/tx-status?txHash=${txHash}`)

      if (data.submitted) {
        return data
      } else {
        await sleep(1000)
        return await txConfirmation(txHash)
      }
    } catch (error) {
      addTranscript('ERROR', error.message)
      await sleep(1000)
      return await txConfirmation(txHash)
    }
  }, [])

  const payEveryone = useCallback(
    async (difference) => {
      setLoading(true)

      if (!difference) {
        addTranscript('Batching TXs', 'This may take a moment...')
      }

      const batchSize = difference ? Math.floor(difference * payoutWallets.length) : payoutWallets.length
      const batches = []

      for (let i = 0; i < payoutWallets.length; i += batchSize) {
        batches.push(payoutWallets.slice(i, (i / batchSize + 1) * batchSize))
      }

      try {
        for await (const [idx, batch] of batches.entries()) {
          const tx = new Transaction({ initiator: wallet })

          for (const { address, payout } of batch) {
            if (payout < MILLION) {
              const str1 = 'Cardano requires at least 1 ADA per TX.'
              const str2 = `This wallet has only ${displayBalance(payout)} ADA assigned to it:\n${address}`
              const str3 = 'Click OK if you want to increase the payout for this wallet to 1 ADA.'
              const str4 = 'Click cancel to exclude this wallet from the airdrop.'
              const str5 = 'Note: accepting will increase the total pool size.'

              if (window.confirm(`${str1}\n\n${str2}\n\n${str3}\n${str4}\n\n${str5}`)) {
                tx.sendLovelace(address, String(MILLION))
              }
            } else {
              tx.sendLovelace(address, String(payout))
            }
          }

          const unsignedTx = await tx.build()
          addTranscript(`Building TX ${idx + 1} of ${batches.length}`)
          const signedTx = await wallet.signTx(unsignedTx)
          const txHash = await wallet.submitTx(signedTx)
          addTranscript('Awaiting network confirmation', 'This may take a moment...')
          await txConfirmation(txHash)
          addTranscript('Confirmed!', txHash)

          setPayoutWallets((prev) =>
            prev.map((prevItem) =>
              batch.some(({ stakeKey }) => stakeKey === prevItem.stakeKey)
                ? {
                    ...prevItem,
                    txHash,
                  }
                : prevItem
            )
          )
        }

        addTranscript('Airdrop done!', "You can now leave the app, don't forget to download the receipt 👍")
        setPayoutDone(true)
      } catch (error) {
        console.error(error)

        if (error.message.indexOf('Maximum transaction size') !== -1) {
          // [Transaction] An error occurred during build: Maximum transaction size of 16384 exceeded. Found: 21861.
          const splitMessage = error.message.split(' ')
          const [max, curr] = splitMessage.filter((str) => !isNaN(Number(str))).map((str) => Number(str))
          // [16384, 21861]

          return await payEveryone((difference || 1) * (max / curr))
        } else {
          addTranscript('ERROR', error.message)
        }
      }

      setLoading(false)
    },
    [wallet, payoutWallets, txConfirmation]
  )

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
        {
          value: 'TX Hash',
          fontWeight: 'bold',
        },
      ],
    ]

    for (const { address, stakeKey, payout, txHash } of payoutWallets) {
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
          type: String,
          value: displayBalance(payout),
        },
        {
          type: String,
          value: txHash,
        },
      ])
    }

    try {
      await writeXlsxFile(data, {
        fileName: `BadFoxMC Royalty Distribution (${new Date().toLocaleDateString()}).xlsx`,
        columns: [{ width: 100 }, { width: 60 }, { width: 25 }, { width: 25 }, { width: 25 }, { width: 60 }],
      })
    } catch (error) {
      console.error(error)
      addTranscript('ERROR', error.message)
    }

    setLoading(false)
  }, [payoutWallets])

  const syncDb = useCallback(async () => {
    setLoading(true)

    try {
      addTranscript(`Syncing ${payoutWallets.length} wallets`)
      await axios.post('/api/admin/syncDbWallets', { wallets: holdingWallets })
      addTranscript('Done!')
    } catch (error) {
      console.error(error)
      addTranscript('ERROR', error.message)
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
          {displayBalance(balance)}
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
        {transcripts.map(({ timestamp, msg, key }, idx) => (
          <p key={`transcript_${idx}_${timestamp}`} style={{ margin: 0 }}>
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
              <th>Payout</th>
              <th>Stake Key</th>
              <th>TX Hash</th>
            </tr>
          </thead>
          <tbody>
            {payoutWallets.map(({ stakeKey, payout, txHash }) => (
              <tr key={stakeKey}>
                <td>
                  {ADA_SYMBOL}
                  {displayBalance(payout)}
                </td>
                <td style={{ padding: '0 1rem' }}>{stakeKey}</td>
                <td>{txHash}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

export default AdminDashboard
