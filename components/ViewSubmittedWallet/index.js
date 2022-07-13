import { useDiscordAuth } from '../../contexts/DiscordAuthContext'
import Section from '../Section'
import Loader from '../Loader'
import styles from './ViewSubmittedWallet.module.css'

export default function ViewSubmittedWallet() {
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

  if (!member.roles?.isOG && !member.roles?.isWL) {
    return (
      <Section>
        <h2>You are not eligible to participate in the pre-sale.</h2>
        <p>
          Please make sure you have one of the following roles:
          <br />
          <strong>OG, Whitelist</strong>
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
        Your wallet address:
        <br />
        <span>{member?.wallet?.address ?? 'Not submitted'}</span>
      </p>
      <p className={styles.addr}>
        Your stake key:
        <br />
        <span>{member?.wallet?.stakeKey ?? 'Not submitted'}</span>
      </p>
    </Section>
  )
}
