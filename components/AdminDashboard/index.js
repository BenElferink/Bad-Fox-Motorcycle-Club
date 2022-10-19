import { Fragment, useCallback, useState } from 'react'
import axios from 'axios'
import BaseButton from '../BaseButton'
import OnlineIndicator from '../OnlineIndicator'
import { EXCLUDE_ADDRESSES } from '../../constants/addresses'
import { BAD_FOX_POLICY_ID } from '../../constants/policy-ids'
import foxAssetsFile from '../../data/assets/bad-fox.json'

const AdminDashboard = () => {
  const [transcripts, setTranscripts] = useState([{ timestamp: new Date().getTime(), msg: 'Welcome Admin' }])
  const [listedCount, setListedCount] = useState(0)
  const [unlistedCount, setUnlistedCount] = useState(0)
  const [snapshotDone, setSnapshotDone] = useState(false)
  const [payoutWallets, setPayoutWallets] = useState([])

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
    let unlistedCountForPayoutCalculation = 0
    const collectionAssets = foxAssetsFile.assets
    const holders = []

    for (let i = 0; i < collectionAssets.length; i++) {
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

    const ADA_IN_POOL = 30000
    const PERCENT_TO_GIVE = 0.8
    const HOLDERS_SHARE = ADA_IN_POOL * PERCENT_TO_GIVE
    const adaPerAsset = HOLDERS_SHARE / unlistedCountForPayoutCalculation

    setPayoutWallets(
      holders
        .map(({ stakeKey, addresses, assets }) => {
          const adaForAssets = Math.floor(assets.length * adaPerAsset)
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
  }, [])

  return (
    <div>
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
        <BaseButton
          label='Run Snapshot'
          onClick={runSnapshot}
          backgroundColor='var(--apex-charcoal)'
          hoverColor='var(--brown)'
          style={{ width: '42%' }}
        />
        <OnlineIndicator
          online={snapshotDone}
          title={snapshotDone ? 'snapshot ready' : 'wait for snapshot'}
          placement='bottom'
          style={{ width: '42%' }}
        >
          <BaseButton
            label='Pay All'
            onClick={() => alert('To be developed')}
            backgroundColor='var(--apex-charcoal)'
            hoverColor='var(--brown)'
            fullWidth
            disabled={!snapshotDone}
          />
        </OnlineIndicator>
      </div>

      <div className='flex-row' style={{ justifyContent: 'center', margin: 11 }}>
        <p style={{ margin: 11 }}>Listed: {listedCount}</p>
        <p style={{ margin: 11 }}>Unlisted: {unlistedCount}</p>
      </div>
    </div>
  )
}

export default AdminDashboard
