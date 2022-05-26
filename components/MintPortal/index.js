import { useDiscordAuth } from '../../contexts/DiscordAuthContext'
import Section from '../Section'
import Loader from '../Loader'
// import BaseButton from '../BaseButton'
import styles from './MintPortal.module.css'

export default function MintPortal() {
  const { loading, error, member } = useDiscordAuth()

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

  if (!member.roles?.isOG && !member.roles?.isWL && !member.roles?.isPublicReserve) {
    return (
      <Section>
        <h2>You are not eligible to mint.</h2>
        <p>
          Please make sure you have one of the following roles:
          <br />
          <strong>OG, Whitelist, Public Reserve</strong>
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
          {member.roles?.isPublicReserve ? 'Public Reserve, ' : null}
        </strong>
      </p>
      <p className={styles.addr}>
        Your Wallet Address:
        <br />
        <span>{member.wallet?.address}</span>
      </p>
      <p className={styles.addr}>
        Your Stake Key:
        <br />
        <span>{member.wallet?.stakeKey}</span>
      </p>
      {/* <BaseButton label='Submit' onClick={clickSubmit} style={{ background: 'var(--discord-purple)' }} /> */}
    </Section>
  )
}
