import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import Section from '../../Section'
import Loader from '../../Loader'
import BaseButton from '../../BaseButton'
import styles from './SubmitWallet.module.css'

export default function SubmitWallet() {
  const { loading, error, account, updateAccountMintWallet } = useAuth()

  const [walletAddress, setWalletAddress] = useState('')
  const [forceEdit, setForceEdit] = useState(false)

  useEffect(() => {
    const v = account?.mintWallet.address

    if (v) {
      setWalletAddress(v)
    }
  }, [account])

  const clickSubmit = async () => {
    if (!walletAddress) {
      return alert('Please enter a wallet address')
    } else if (walletAddress.indexOf('addr1') !== 0) {
      return alert('Please enter a valid wallet address (starts with addr1)')
    }

    await updateAccountMintWallet(walletAddress)
    setForceEdit(false)
  }

  const clickEdit = () => {
    setForceEdit(true)
  }

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
                <p className={styles.addr}>{walletAddress}</p>
              </li>
              <br />
              <li>
                Please make sure you are sumbitting a "used" address, this issue is common with{' '}
                <strong>Eternl (CCVault)</strong> wallets, or new wallets.
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
        <h2>You are not eligible to submit a wallet address.</h2>
        <p>
          Please make sure you have one of the following roles:
          <br />
          <strong>OG</strong>
        </p>
      </Section>
    )
  }

  if (!account?.mintWallet?.address || forceEdit) {
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
        <p>Please submit your wallet address, this will be the wallet you'll be minting from!</p>
        <input
          placeholder='Your addr1...'
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          className={styles.inp}
        />
        <BaseButton label='Submit' onClick={clickSubmit} backgroundColor='var(--discord-purple)' />
      </Section>
    )
  }

  return (
    <Section>
      <h2>Done!</h2>
      <p>You have successfully submitted your wallet address.</p>
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
      <BaseButton label='Change Address' onClick={clickEdit} backgroundColor='var(--discord-purple)' />
    </Section>
  )
}
