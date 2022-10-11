import { useEffect, useState } from 'react'
import { useDiscord } from '../../../contexts/DiscordContext'
import Section from '../../Section'
import Loader from '../../Loader'
import BaseButton from '../../BaseButton'
import styles from './SubmitWallet.module.css'

export default function SubmitWallet() {
  const { loading, error, account, updateAccountMintWallet, logout } = useDiscord()

  const [inp, setInp] = useState('')
  const [forceEdit, setForceEdit] = useState(false)

  const clickEdit = () => {
    setInp('')
    setForceEdit(true)
  }

  const clickSubmit = async () => {
    if (!inp) {
      return alert('Please enter a wallet address')
    } else if (inp.indexOf('addr1') !== 0) {
      return alert('Please enter a valid wallet address (starts with addr1)')
    }

    await updateAccountMintWallet(inp)
    setForceEdit(false)
  }

  useEffect(() => {
    const v = account?.mintWallet.address
    if (v) setInp(v)
  }, [account])

  if (loading) {
    return (
      <Section>
        <h2>Please wait a moment...</h2>
        <Loader />
      </Section>
    )
  }

  if (error.type && error.message && !forceEdit) {
    return (
      <Section>
        <h2>An error occurred:</h2>
        <p>{error.message}</p>
        {error.type === 'WALLET_ERROR' ? (
          <>
            <ol>
              <li>
                Is your wallet address correct?
                <br />
                <p className={styles.addr}>{inp}</p>
              </li>
              <br />
              <li>
                Please make sure you are sumbitting a "used" address, this issue is common with{' '}
                <strong>Eternl (CCVault)</strong> wallets, or wallets that had no input/output transactions yet.
              </li>
            </ol>
            <br />
            <BaseButton label='Try Again' onClick={clickEdit} backgroundColor='var(--discord-purple)' />
          </>
        ) : null}
      </Section>
    )
  }

  if (!account?.roles?.isOG) {
    return (
      <Section>
        <h2>Hey {account?.username}!</h2>
        <p>
          You aren't eligible to submit a wallet address.
          <br />
          Please make sure you have one of the following roles:
          <br />
          <strong>OG,</strong>
        </p>
        <BaseButton label='Logout' onClick={() => logout('/mint')} backgroundColor='var(--discord-purple)' />
      </Section>
    )
  }

  if (!account?.mintWallet?.address || forceEdit) {
    return (
      <Section>
        <h2>Hey {account?.username}!</h2>
        <p>
          You have the following (mint) roles:
          <br />
          <strong>
            {account?.roles?.isOG ? 'OG, ' : null}
            {!account?.roles?.isOG ? 'None' : null}
          </strong>
        </p>
        <p>Please submit your wallet address, this will be the wallet you'll be minting from!</p>
        <input
          placeholder='Your addr1...'
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          className={styles.inp}
        />
        <BaseButton label='Submit' onClick={clickSubmit} backgroundColor='var(--discord-purple)' />
      </Section>
    )
  }

  return (
    <Section>
      <h2>Done!</h2>
      <p>You have successfully submitted your wallet address</p>
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

      <BaseButton
        label='Change Address'
        onClick={clickEdit}
        backgroundColor='var(--discord-purple)'
        style={{ margin: '0.2rem' }}
      />
      <BaseButton
        label='Logout'
        onClick={() => logout()}
        backgroundColor='var(--discord-purple)'
        style={{ margin: '0.2rem' }}
      />
    </Section>
  )
}
