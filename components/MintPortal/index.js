import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useMint } from '../../contexts/MintContext'
import useWallet from '../../contexts/WalletContext'
import Section from '../Section'
import MintScreen from './MintScreen'
import GlobalLoader from '../Loader/GlobalLoader'
import ConnectWallet from '../ConnectWallet'
import { BAD_MOTORCYCLE_POLICY_ID } from '../../constants/policy-ids'
import styles from './MintPortal.module.css'
import mintingListFile from '../../data/minting-list.json'

export default function MintPortal() {
  const { isPreSaleOnline, isPublicSaleOnline } = useMint()
  const { connected, populatedWallet } = useWallet()

  const [fetching, setFetching] = useState(false)
  const [mintObj, setMintObj] = useState({})
  const [mintCount, setMintCount] = useState({ supply: 0, minted: 0, percent: 0 })

  useEffect(() => {
    if (isPreSaleOnline || isPublicSaleOnline) {
      ;(async () => {
        setFetching(true)

        try {
          const assetIdsRes = await axios.get(`/api/blockfrost/asset-ids?policyId=${BAD_MOTORCYCLE_POLICY_ID}`)
          const settingRes = await axios.get(`/api/setting/${BAD_MOTORCYCLE_POLICY_ID}`)

          setMintCount({
            supply: 3000,
            minted: assetIdsRes.data.count,
            percent: `${((100 / 3000) * assetIdsRes.data.count).toFixed(1)}%`,
          })
          setMintObj(settingRes.data.mint)
        } catch (error) {
          console.error(error)
          toast.error(error.message)
        }

        setFetching(false)
      })()
    }
  }, [isPreSaleOnline, isPublicSaleOnline])

  if (fetching) {
    return <GlobalLoader />
  }

  if (mintCount.minted === mintCount.supply) {
    return (
      <Section>
        <h2>Welcome to the Public Mint!</h2>
        <p>We sold out :)</p>
      </Section>
    )
  }

  if (isPublicSaleOnline) {
    return (
      <Section>
        <h2>Welcome to the Public Mint!</h2>

        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '0 0.3rem', textAlign: 'center' }}>Supply</th>
              <th style={{ padding: '0 0.3rem', textAlign: 'center' }}>Minted</th>
              <th style={{ padding: '0 0.3rem', textAlign: 'center' }}>Percent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0 0.3rem', textAlign: 'center' }}>{mintCount.supply}</td>
              <td style={{ padding: '0 0.3rem', textAlign: 'center' }}>{mintCount.minted}</td>
              <td style={{ padding: '0 0.3rem', textAlign: 'center' }}>{mintCount.percent}</td>
            </tr>
          </tbody>
        </table>

        <MintScreen maxMints={5} mintPrice={mintObj.publicSale?.price} mintAddress={mintObj.publicSale?.address} />
      </Section>
    )
  }

  if (isPreSaleOnline) {
    return !connected ? (
      <ConnectWallet
        modalOnly
        disableManual
        introText='Connect a wallet to verify your whitelisted wallet address and participate in the pre-sale of this collection.'
      />
    ) : !mintingListFile.wallets.find(({ stakeKey }) => stakeKey === populatedWallet.stakeKey) ? (
      <Section>
        <h2>Woopsies!</h2>

        <p>
          Looks like you aren't eligbile to participate in the pre sale!
          <br />
          Please try with a different wallet, or wait for the public mint.
        </p>

        <p className={styles.addr}>
          You are connected with:
          <br />
          <span>{populatedWallet.stakeKey || 'none'}</span>
        </p>
      </Section>
    ) : (
      <Section>
        <h2>Welcome to the Pre Sale!</h2>

        <table style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '0 0.3rem', textAlign: 'center' }}>Supply</th>
              <th style={{ padding: '0 0.3rem', textAlign: 'center' }}>Minted</th>
              <th style={{ padding: '0 0.3rem', textAlign: 'center' }}>Percent</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0 0.3rem', textAlign: 'center' }}>{mintCount.supply}</td>
              <td style={{ padding: '0 0.3rem', textAlign: 'center' }}>{mintCount.minted}</td>
              <td style={{ padding: '0 0.3rem', textAlign: 'center' }}>{mintCount.percent}</td>
            </tr>
          </tbody>
        </table>

        <p className={styles.addr}>
          You are connected with:
          <br />
          <span>{populatedWallet.stakeKey || 'none'}</span>
        </p>

        <MintScreen
          maxMints={
            mintingListFile.wallets.find(({ stakeKey }) => stakeKey === populatedWallet.stakeKey)?.amount || 0
          }
          mintPrice={mintObj.preSale?.price}
          mintAddress={mintObj.preSale?.address}
        />
      </Section>
    )
  }

  return <Section>Pre-sale is offline, public sale is offline, you shouldn't be here right now :)</Section>
}
