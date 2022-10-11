import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useMint } from '../../../contexts/MintContext'
import Section from '../../Section'
import BaseButton from '../../BaseButton'
import GlobalLoader from '../../Loader/GlobalLoader'
import { BAD_FOX_POLICY_ID } from '../../../constants/policy-ids'
import styles from './MintPortal.module.css'
import mintingListFile from '../../../data/minting-list.json'

const MintScreen = ({ maxMints = 0, mintPrice = 0, mintAddress = 'None' }) => {
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
    <div className={styles.mintModal}>
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

      <BaseButton
        label={isCopied ? 'COPIED 👍' : 'COPY MINT ADDRESS'}
        onClick={() => clickCopy(mintAddress)}
        backgroundColor='var(--discord-purple)'
      />
    </div>
  )
}

export default function MintPortal({ populatedWallet }) {
  const { isPublicSaleOnline } = useMint()

  const [fetching, setFetching] = useState(false)
  const [mintObj, setMintObj] = useState({})

  useEffect(() => {
    ;(async () => {
      setFetching(true)

      try {
        const res = await axios.get(`/api/setting/${BAD_FOX_POLICY_ID}`)

        setMintObj(res.data.mint)
      } catch (error) {
        console.error(error)
        toast.error(error.message)
      }

      setFetching(false)
    })()
  }, [])

  if (fetching) {
    return <GlobalLoader />
  }

  if (isPublicSaleOnline) {
    return (
      <Section>
        <h2>Welcome to the Public Mint!</h2>

        <MintScreen maxMints={5} mintPrice={mintObj.publicSale?.price} mintAddress={mintObj.publicSale?.address} />
      </Section>
    )
  }

  if (!mintingListFile.wallets.find(({ stakeKey }) => stakeKey === populatedWallet.stakeKey)) {
    return (
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
    )
  }

  return (
    <Section>
      <h2>Welcome to the Pre Sale!</h2>

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
