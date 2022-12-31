import { Fragment, useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Transaction } from '@meshsdk/core'
import writeXlsxFile from 'write-excel-file'
import useWallet from '../../contexts/WalletContext'
import sleep from '../../functions/sleep'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import {
  ADA_SYMBOL,
  BAD_FOX_POLICY_ID,
  BAD_KEY_POLICY_ID,
  BAD_MOTORCYCLE_POLICY_ID,
  ONE_MILLION,
} from '../../constants'
import { OwningWallet, PolicyId, PopulatedAsset } from '../../@types'

const COLLECTIONS = [
  {
    policyId: BAD_FOX_POLICY_ID as PolicyId,
    policyAssets: getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets') as PopulatedAsset[],
  },
  {
    policyId: BAD_MOTORCYCLE_POLICY_ID as PolicyId,
    policyAssets: getFileForPolicyId(BAD_MOTORCYCLE_POLICY_ID, 'assets') as PopulatedAsset[],
  },
  {
    policyId: BAD_KEY_POLICY_ID as PolicyId,
    policyAssets: getFileForPolicyId(BAD_KEY_POLICY_ID, 'assets') as PopulatedAsset[],
  },
]

type Holder = {
  stakeKey: string
  addresses: string[]
  assets: {
    [BAD_FOX_POLICY_ID]?: string[]
    [BAD_MOTORCYCLE_POLICY_ID]?: string[]
    [BAD_KEY_POLICY_ID]?: string[]
  }
}

type Payout = {
  stakeKey: string
  address: string
  payout: number
  txHash?: string
}

type TxStatus = {
  txHash: string
  submitted: boolean
}

type SpreadsheetObject = {
  value: string | number
  type?: StringConstructor | NumberConstructor
  fontWeight?: string
}

type Transcript = {
  timestamp: number
  msg: string
  key?: string
}

const displayBalance = (v: number | string) => (Number(v) / ONE_MILLION).toFixed(2)

const AdminDashboard = () => {
  const { wallet, connectedManually, disconnectWallet } = useWallet()
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    ;(async () => {
      const lovelace = await wallet?.getLovelace()
      if (lovelace) setBalance(Number(lovelace))
    })()
  }, [wallet])

  const [transcripts, setTranscripts] = useState<Transcript[]>([
    { timestamp: new Date().getTime(), msg: 'Welcome Admin' },
  ])
  const [counts, setCounts] = useState({
    unlisted: { fox: 0, motorcycle: 0, key: 0 },
    listed: { fox: 0, motorcycle: 0, key: 0 },
  })

  const [holdingWallets, setHoldingWallets] = useState<Holder[]>([])
  const [payoutWallets, setPayoutWallets] = useState<Payout[]>([])

  const [loading, setLoading] = useState(false)
  const [snapshotDone, setSnapshotDone] = useState(false)
  const [payoutDone, setPayoutDone] = useState(false)

  const addTranscript = (msg: string, key?: string) => {
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

  const fetchOwningWallet = useCallback(async (assetId: string): Promise<OwningWallet> => {
    try {
      const { data } = await axios.get<OwningWallet>(`/api/blockfrost/asset/${assetId}/owner`)

      return data
    } catch (error: any) {
      console.error(error)
      addTranscript('ERROR', error.message)
      return await fetchOwningWallet(assetId)
    }
  }, [])

  const runSnapshot = useCallback(async () => {
    setLoading(true)

    const holders: Holder[] = []
    const fetchedWallets: OwningWallet[] = []
    let unlistedFoxes = 0
    let unlistedMotorcycles = 0
    let unlistedKeys = 0

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

          const { isContract, stakeKey, walletAddress } = wallet

          if (isContract) {
            if (policyId === BAD_FOX_POLICY_ID) {
              setCounts((prev) => ({
                ...prev,
                listed: { ...prev.listed, fox: prev.listed.fox + 1 },
              }))
            } else if (policyId === BAD_MOTORCYCLE_POLICY_ID) {
              setCounts((prev) => ({
                ...prev,
                listed: { ...prev.listed, motorcycle: prev.listed.motorcycle + 1 },
              }))
            } else if (policyId === BAD_KEY_POLICY_ID) {
              setCounts((prev) => ({
                ...prev,
                listed: { ...prev.listed, key: prev.listed.key + 1 },
              }))
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

              if (Array.isArray(holders[holderIndex].assets[policyId])) {
                holders[holderIndex].assets[policyId]?.push(assetId)
              } else {
                holders[holderIndex].assets[policyId] = [assetId]
              }
            }

            if (policyId === BAD_FOX_POLICY_ID) {
              unlistedFoxes++
              setCounts((prev) => ({
                ...prev,
                unlisted: { ...prev.unlisted, fox: prev.unlisted.fox + 1 },
              }))
            } else if (policyId === BAD_MOTORCYCLE_POLICY_ID) {
              unlistedMotorcycles++
              setCounts((prev) => ({
                ...prev,
                unlisted: { ...prev.unlisted, motorcycle: prev.unlisted.motorcycle + 1 },
              }))
            } else if (policyId === BAD_KEY_POLICY_ID) {
              unlistedKeys++
              setCounts((prev) => ({
                ...prev,
                unlisted: { ...prev.unlisted, key: prev.unlisted.key + 1 },
              }))
            }
          }
        }
      }
    }

    setHoldingWallets(holders)

    const lovelacePool = balance * 0.8
    const lovelacePerShare = Math.floor(
      lovelacePool / (unlistedFoxes + unlistedMotorcycles * 2 + unlistedKeys * 4)
    )

    setPayoutWallets(
      holders
        .map(({ stakeKey, addresses, assets }) => {
          let lovelaceForAssets = 0
          let lovelaceForTraits = 0

          Object.entries(assets).forEach(([policyId, policyAssets]) => {
            const collection = COLLECTIONS.find((collection) => collection.policyId === policyId)

            if (collection) {
              if (policyId === BAD_FOX_POLICY_ID) {
                lovelaceForAssets += policyAssets.length * lovelacePerShare

                for (const assetId of policyAssets) {
                  const { attributes } = collection.policyAssets.find(
                    (asset) => asset.assetId === assetId
                  ) as PopulatedAsset

                  if (attributes['Mouth'] === '(F) Crypto') {
                    lovelaceForTraits += 10 * ONE_MILLION
                  } else if (attributes['Mouth'] === '(M) Cash Bag') {
                    lovelaceForTraits += 10 * ONE_MILLION
                  }
                }
              } else if (policyId === BAD_MOTORCYCLE_POLICY_ID) {
                lovelaceForAssets += policyAssets.length * lovelacePerShare * 2

                for (const assetId of policyAssets) {
                  const { attributes } = collection.policyAssets.find(
                    (asset) => asset.assetId === assetId
                  ) as PopulatedAsset

                  if (attributes['Rear'] === '(CH) Ada Bag') {
                    lovelaceForTraits += 10 * ONE_MILLION
                  } else if (attributes['Rear'] === '(HB) Vault') {
                    lovelaceForTraits += 10 * ONE_MILLION
                  } else if (attributes['Above'] === '(NI) Cash Bag') {
                    lovelaceForTraits += 10 * ONE_MILLION
                  } else if (attributes['Anterior'] === '(VE) Piggy Savings') {
                    lovelaceForTraits += 10 * ONE_MILLION
                  }
                }
              } else if (policyId === BAD_KEY_POLICY_ID) {
                lovelaceForAssets += policyAssets.length * lovelacePerShare * 4
              }
            }
          })

          return {
            stakeKey,
            address: addresses[0],
            payout: Math.floor(lovelaceForAssets + lovelaceForTraits),
            txHash: '',
          }
        })
        .sort((a, b) => b.payout - a.payout)
    )

    addTranscript('Snapshot done!')
    setSnapshotDone(true)
    setLoading(false)
  }, [COLLECTIONS, balance, fetchOwningWallet])

  const txConfirmation = useCallback(async (txHash: string): Promise<TxStatus> => {
    try {
      const { data } = await axios.get<TxStatus>(`/api/blockfrost/tx/${txHash}/status`)

      if (data.submitted) {
        return data
      } else {
        await sleep(1000)
        return await txConfirmation(txHash)
      }
    } catch (error: any) {
      addTranscript('ERROR', error.message)
      await sleep(1000)
      return await txConfirmation(txHash)
    }
  }, [])

  const payEveryone = useCallback(
    async (difference?: number): Promise<any> => {
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
            if (payout < ONE_MILLION) {
              const str1 = 'Cardano requires at least 1 ADA per TX.'
              const str2 = `This wallet has only ${displayBalance(payout)} ADA assigned to it:\n${address}`
              const str3 = 'Click OK if you want to increase the payout for this wallet to 1 ADA.'
              const str4 = 'Click cancel to exclude this wallet from the airdrop.'
              const str5 = 'Note: accepting will increase the total pool size.'

              if (window.confirm(`${str1}\n\n${str2}\n\n${str3}\n${str4}\n\n${str5}`)) {
                tx.sendLovelace({ address }, String(ONE_MILLION))
              }
            } else {
              tx.sendLovelace({ address }, String(payout))
            }
          }

          const unsignedTx = await tx.build()
          addTranscript(`Building TX ${idx + 1} of ${batches.length}`)
          const signedTx = (await wallet?.signTx(unsignedTx)) as string
          const txHash = (await wallet?.submitTx(signedTx)) as string
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
      } catch (error: any) {
        console.error(error)

        if (error.message.indexOf('Maximum transaction size') !== -1) {
          // [Transaction] An error occurred during build: Maximum transaction size of 16384 exceeded. Found: 21861.
          const splitMessage: string[] = error.message.split(' ')
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

    const data: SpreadsheetObject[][] = [
      [
        {
          value: 'Payout',
          fontWeight: 'bold',
        },
        {
          value: 'Stake Key',
          fontWeight: 'bold',
        },
        {
          value: 'TX Hash',
          fontWeight: 'bold',
        },
      ],
    ]

    for (const { stakeKey, payout, txHash } of payoutWallets) {
      data.push([
        {
          type: String,
          value: displayBalance(payout),
        },
        {
          type: String,
          value: stakeKey,
        },
        {
          type: String,
          value: txHash || '',
        },
      ])
    }

    try {
      await writeXlsxFile<SpreadsheetObject>(data, {
        fileName: `BadFoxMC Royalty Distribution (${new Date().toLocaleDateString()}).xlsx`,
        // @ts-ignore
        columns: [{ width: 100 }, { width: 60 }, { width: 25 }, { width: 25 }, { width: 25 }, { width: 60 }],
      })
    } catch (error: any) {
      console.error(error)
      addTranscript('ERROR', error.message)
    }

    setLoading(false)
  }, [payoutWallets])

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
    <div className='w-3/4 mx-auto flex flex-col items-center'>
      <div className='overflow-y-auto flex flex-col-reverse w-full h-[42vh] py-2 px-4 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700'>
        {transcripts.map(({ timestamp, msg, key }, idx) => (
          <p key={`transcript_${idx}_${timestamp}`}>
            {new Date(timestamp).toLocaleTimeString()} - {msg}
            {key ? (
              <Fragment>
                <br />
                <span className='text-xs'>{key}</span>
              </Fragment>
            ) : null}
          </p>
        ))}
      </div>

      <div className='w-full flex flex-wrap items-center justify-evenly'>
        <button
          type='button'
          onClick={runSnapshot}
          disabled={!balance || snapshotDone || loading}
          className='grow m-1 p-4 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:bg-opacity-50 disabled:border-gray-800 disabled:text-gray-700 rounded-xl bg-green-900 hover:bg-green-700 bg-opacity-50 hover:bg-opacity-50 hover:text-gray-200 disabled:border border hover:border border-green-700 hover:border-green-700 hover:cursor-pointer'
        >
          Run Snapshot
        </button>
        <button
          type='button'
          onClick={() => payEveryone()}
          disabled={!snapshotDone || payoutDone || loading}
          className='grow m-1 p-4 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:bg-opacity-50 disabled:border-gray-800 disabled:text-gray-700 rounded-xl bg-green-900 hover:bg-green-700 bg-opacity-50 hover:bg-opacity-50 hover:text-gray-200 disabled:border border hover:border border-green-700 hover:border-green-700 hover:cursor-pointer'
        >
          Pay Everyone
        </button>
        <button
          type='button'
          onClick={downloadReceipt}
          disabled={!payoutDone || loading}
          className='grow m-1 p-4 disabled:cursor-not-allowed disabled:bg-gray-900 disabled:bg-opacity-50 disabled:border-gray-800 disabled:text-gray-700 rounded-xl bg-green-900 hover:bg-green-700 bg-opacity-50 hover:bg-opacity-50 hover:text-gray-200 disabled:border border hover:border border-green-700 hover:border-green-700 hover:cursor-pointer'
        >
          Download Receipt
        </button>
      </div>

      <div className='flex flex-col items-center'>
        <p className='my-2'>
          Balance: {ADA_SYMBOL}
          {displayBalance(balance)}
        </p>

        <table className='my-2'>
          <thead>
            <tr>
              <th className='text-start'>Assets</th>
              <th className='px-1 text-start'>Unlisted</th>
              <th className='px-1 text-start'>Listed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='text-start'>Bad Fox</td>
              <td className='text-center'>{counts.unlisted.fox}</td>
              <td className='text-center'>{counts.listed.fox}</td>
            </tr>
            <tr>
              <td className='text-start'>Bad Motorcycle</td>
              <td className='text-center'>{counts.unlisted.motorcycle}</td>
              <td className='text-center'>{counts.listed.motorcycle}</td>
            </tr>
            <tr>
              <td className='text-start'>Bad Key</td>
              <td className='text-center'>{counts.unlisted.key}</td>
              <td className='text-center'>{counts.listed.key}</td>
            </tr>
          </tbody>
        </table>

        {payoutWallets.length ? (
          <table className='my-2'>
            <thead>
              <tr>
                <th className='text-center'>Payout</th>
                <th className='text-center'>Stake Key</th>
                <th className='text-center'>TX Hash</th>
              </tr>
            </thead>
            <tbody>
              {payoutWallets.map(({ stakeKey, payout, txHash }) => (
                <tr key={stakeKey}>
                  <td className='text-start'>
                    {ADA_SYMBOL}
                    {displayBalance(payout)}
                  </td>
                  <td className='px-2 text-start'>{stakeKey}</td>
                  <td className='text-start'>{txHash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  )
}

export default AdminDashboard
