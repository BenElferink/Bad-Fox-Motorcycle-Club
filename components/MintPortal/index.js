import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDiscordAuth } from '../../contexts/DiscordAuthContext'
import { useMint } from '../../contexts/MintContext'
import Section from '../Section'
import Modal from '../Modal'
import Loader from '../Loader'
import BaseButton from '../BaseButton'
import { FOX_POLICY_ID } from '../../constants/policy-ids'
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

      <div className={styles.mintModalDevision}>
        <h4>Mint address:</h4>
        {loading ? <Loader /> : <span>{isCopied ? 'Copied 👍' : mintAddress}</span>}
      </div>

      <BaseButton label='COPY ADDRESS' onClick={() => clickCopy(mintAddress)} style={{ background: 'var(--discord-purple)' }} />
    </div>
  )
}

export default function MintPortal() {
  const { loading, error, member } = useDiscordAuth()
  const { isPublicSaleOnline } = useMint()

  const [openModal, setOpenModal] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [mintObj, setMintObj] = useState({})

  useEffect(() => {
    ;(async () => {
      setFetching(true)

      try {
        const res = await axios.get(`/api/mint-address/${FOX_POLICY_ID}`)

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

        <MintScreen role='Public' maxMints={3} mintPrice={62} mintAddress={mintObj.publicAddress} loading={fetching} />
      </Section>
    )
  }

  if (!member.roles?.isOG && !member.roles?.isWL) {
    return (
      <Section>
        <h2>You are not eligible to mint.</h2>
        <p>
          Please make sure you have one of the following roles:
          <br />
          <strong>OG, Whitelist</strong>
        </p>
      </Section>
    )
  }

  if (!member?.wallet?.address || !member?.wallet?.stakeKey) {
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
      <h2>Welcome {member.username}!</h2>

      <p>
        You have the following roles:
        <br />
        <strong>
          {member.roles?.isOG ? 'OG, ' : null}
          {member.roles?.isWL ? 'Whitelist, ' : null}
        </strong>
      </p>

      <p className={styles.addr}>
        Your (registered) wallet address:
        <br />
        <span>{member.wallet?.address}</span>
      </p>
      <p className={styles.addr}>
        Your (collected) stake key:
        <br />
        <span>{member.wallet?.stakeKey}</span>
      </p>

      <BaseButton label='MINT NOW' onClick={() => setOpenModal(true)} style={{ background: 'var(--discord-purple)' }} />

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={`${member.roles?.isOG ? 'OG' : member.roles?.isWL ? 'Whitelist' : 'Error'} Mint`}
        style={{ background: 'var(--brown)' }}
      >
        {member.roles?.isOG ? (
          <MintScreen role='OG' maxMints={3} mintPrice={42} mintAddress={mintObj.ogAddress} loading={fetching} />
        ) : member.roles?.isWL ? (
          <MintScreen role='WL' maxMints={2} mintPrice={52} mintAddress={mintObj.wlAddress} loading={fetching} />
        ) : (
          <div className={styles.mintModal}>You're not supposed to be here.</div>
        )}
      </Modal>
    </Section>
  )
}
