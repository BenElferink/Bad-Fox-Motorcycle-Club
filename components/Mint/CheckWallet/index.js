import { useAuth } from '../../../contexts/AuthContext'
import Section from '../../Section'
import Loader from '../../Loader'
import styles from './CheckWallet.module.css'

export default function CheckWallet() {
  const { loading, error, account } = useAuth()

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

  return (
    <Section>
      <h2>Welcome {account?.username}!</h2>
      <p>
        You have the following (mint) roles:
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
    </Section>
  )
}
