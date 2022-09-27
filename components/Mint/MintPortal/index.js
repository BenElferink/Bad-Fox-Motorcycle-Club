import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDiscord } from '../../../contexts/DiscordContext'
import { useMint } from '../../../contexts/MintContext'
import Section from '../../Section'
import Modal from '../../Modal'
import Loader from '../../Loader'
import BaseButton from '../../BaseButton'
import { BAD_FOX_POLICY_ID } from '../../../constants/policy-ids'
import styles from './MintPortal.module.css'

const MintScreen = ({ role = 'None', maxMints = 0, mintPrice = 0, mintAddress = 'None', loading = false }) => {
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
          {role} can mint up to {maxMints} NFTs for ₳{mintPrice} each.
        </h4>
        <ul>
          {new Array(maxMints).fill(null).map((v, i) => (
            <li key={`mint-option-${i}`}>
              Mint {i + 1} NFTs - send ₳{mintPrice * (i + 1)}
            </li>
          ))}
        </ul>
      </div>

      <BaseButton
        label={isCopied ? 'COPIED 👍' : 'COPY MINT ADDRESS'}
        onClick={() => clickCopy(mintAddress)}
        backgroundColor='var(--discord-purple)'
      />
    </div>
  )
}

export default function MintPortal() {
  const { loading, error, account } = useDiscord()
  const { isPublicSaleOnline } = useMint()

  const [openModal, setOpenModal] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [mintObj, setMintObj] = useState({})

  useEffect(() => {
    ;(async () => {
      setFetching(true)

      try {
        const res = await axios.get(`/api/mint-address/${BAD_FOX_POLICY_ID}`)

        setMintObj(res.data)
      } catch (error) {
        console.error(error)
      }

      setFetching(false)
    })()
  }, [])

  if (loading) {
    return (
      <Section>
        <h2>Please wait a moment...</h2>
        <Loader />
      </Section>
    )
  }

  if (error.type && error.message) {
    return (
      <Section>
        <h2>An error occurred:</h2>
        <p>{error.message}</p>
      </Section>
    )
  }

  if (isPublicSaleOnline) {
    return (
      <Section>
        <h2>Public Mint</h2>

        <MintScreen
          role='Public'
          maxMints={mintObj.pub?.amount}
          mintPrice={mintObj.pub?.price}
          mintAddress={mintObj.pub?.address}
          loading={fetching}
        />
      </Section>
    )
  }

  if (!account?.roles?.isOG) {
    return (
      <Section>
        <h2>You are not eligible to mint.</h2>
        <p>
          Please make sure you have one of the following roles:
          <br />
          <strong>OG</strong>
        </p>
      </Section>
    )
  }

  if (!account?.mintWallet?.address || !account?.mintWallet?.stakeKey) {
    return (
      <Section>
        <h2>You are not eligible to mint.</h2>
        <p>
          You did not submit your wallet address.
          <br />
          You can try your luck during the public sale.
        </p>
      </Section>
    )
  }

  return (
    <Section>
      <h2>Welcome {account?.username}!</h2>

      <p>
        You have the following roles:
        <br />
        <strong>
          {account?.roles?.isOG ? 'OG, ' : null}
          {!account?.roles?.isOG ? 'None' : null}
        </strong>
      </p>

      <p className={styles.addr}>
        Your (registered) wallet address:
        <br />
        <span>{account?.mintWallet?.address || 'Not submitted'}</span>
      </p>
      <p className={styles.addr}>
        Your (collected) stake key:
        <br />
        <span>{account?.mintWallet?.stakeKey || 'Not submitted'}</span>
      </p>

      <BaseButton label='MINT NOW' onClick={() => setOpenModal(true)} backgroundColor='var(--discord-purple)' />

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={`${account?.roles.isOG ? 'OG' : 'Error'} Mint`}
        style={{ background: 'var(--brown)' }}
      >
        {account?.roles.isOG ? (
          <MintScreen
            role='OG'
            maxMints={mintObj.og?.amount}
            mintPrice={mintObj.og?.price}
            mintAddress={mintObj.og?.address}
            loading={fetching}
          />
        ) : (
          <div className={styles.mintModal}>You're not supposed to be here.</div>
        )}
      </Modal>
    </Section>
  )
}
