import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Transaction } from '@martifylabs/mesh'
import { useMint } from '../../../contexts/MintContext'
import useWallet from '../../../contexts/WalletContext'
import ConnectWallet from '../../ConnectWallet'
import Section from '../../Section'
import BaseButton from '../../BaseButton'
import GlobalLoader from '../../Loader/GlobalLoader'
import { BAD_MOTORCYCLE_POLICY_ID } from '../../../constants/policy-ids'
import styles from './MintPortal.module.css'
import mintingListFile from '../../../data/minting-list.json'

const ManualMint = ({ mintAddress }) => {
  const [isCopied, setIsCopied] = useState(false)

  const clickCopy = (value) => {
    if (!isCopied) {
      setIsCopied(true)
      navigator.clipboard.writeText(value)
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }

  return (
    <BaseButton
      label={isCopied ? 'COPIED 👍' : 'COPY MINT ADDRESS'}
      onClick={() => clickCopy(mintAddress)}
      backgroundColor='var(--discord-purple)'
    />
  )
}

const SignMint = ({ maxMints, mintPrice, mintAddress }) => {
  const { connected, connectedManually, disconnectWallet, wallet } = useWallet()
  const [building, setBuilding] = useState(false)

  const clickSign = async (amount) => {
    setBuilding(true)

    try {
      const tx = new Transaction({ initiator: wallet })
      tx.sendLovelace(mintAddress, String(mintPrice * amount * 1000000))

      toast.loading('Building TX', { duration: 2000 })
      const unsignedTx = await tx.build()
      toast.loading('Awaiting signature', { duration: 2000 })
      const signedTx = await wallet.signTx(unsignedTx)
      toast.loading('Submitting TX', { duration: 2000 })
      const txHash = await wallet.submitTx(signedTx)

      toast.success(`Success! ${txHash}`, { duration: 4000 })
    } catch (error) {
      toast.error(error.message, { duration: 4000 })
      console.error(error)
    }

    setBuilding(false)
  }

  return !connected ? (
    <ConnectWallet modalOnly disableManual introText='Connect a wallet to mint your NFTs.' />
  ) : (
    <Fragment>
      {!connectedManually ? (
        new Array(maxMints)
          .fill(null)
          .map((v, i) => (
            <BaseButton
              key={`mint-option-${i}`}
              label={`${i + 1}x cNFT = ₳${mintPrice * (i + 1)}`}
              onClick={() => clickSign(i + 1)}
              backgroundColor='var(--discord-purple)'
              disabled={building}
            />
          ))
      ) : (
        <div className={styles.mintModalDevision}>
          ERROR! You connected manually, if you wish to build & sign a TX please reconnect in a non-manual way.
          <BaseButton label={'DISCONNECT'} onClick={disconnectWallet} backgroundColor='var(--discord-purple)' />
        </div>
      )}
    </Fragment>
  )
}

const MintScreen = ({ maxMints = 0, mintPrice = 0, mintAddress = 'None' }) => {
  const [mode, setMode] = useState('')

  return (
    <div className={styles.mintModal}>
      {mode === 'MANUAL' ? (
        <Fragment>
          <div className={styles.mintModalDevision}>
            <h4>
              You can mint up to {maxMints} NFTs for ₳{mintPrice} each.
            </h4>
            <p className='flex-col'>
              {new Array(maxMints).fill(null).map((v, i) => (
                <span key={`mint-option-${i}`}>
                  {i + 1}x cNFT = ₳{mintPrice * (i + 1)}
                </span>
              ))}
            </p>
          </div>

          <ManualMint mintAddress={mintAddress} />
          <BaseButton label='GO BACK' onClick={() => setMode('')} backgroundColor='var(--discord-purple)' />
        </Fragment>
      ) : mode === 'SIGN TX' ? (
        <Fragment>
          <div className={styles.mintModalDevision}>
            <h4>
              You can mint up to {maxMints} NFTs for ₳{mintPrice} each.
            </h4>
          </div>

          <SignMint maxMints={maxMints} mintPrice={mintPrice} mintAddress={mintAddress} />
          <BaseButton label='GO BACK' onClick={() => setMode('')} backgroundColor='var(--discord-purple)' />
        </Fragment>
      ) : (
        <Fragment>
          <div className={styles.mintModalDevision}>
            <h4>
              You can mint up to {maxMints} NFTs for ₳{mintPrice} each.
            </h4>
            <p>Please choose a minting method:</p>
          </div>

          <BaseButton label='MANUAL' onClick={() => setMode('MANUAL')} backgroundColor='var(--discord-purple)' />
          <BaseButton label='SIGN TX' onClick={() => setMode('SIGN TX')} backgroundColor='var(--discord-purple)' />
        </Fragment>
      )}
    </div>
  )
}

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
