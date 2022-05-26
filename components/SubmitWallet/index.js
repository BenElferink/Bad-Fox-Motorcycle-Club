import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { useDiscordAuth } from '../../contexts/DiscordAuthContext'
import Section from '../Section'
import Loader from '../../components/Loader'
import BaseButton from '../../components/BaseButton'
import styles from './SubmitWallet.module.css'

export default function SubmitWallet() {
  const { width } = useScreenSize()
  const { loading, error, clearError, member, patchMemberWalletAddress } = useDiscordAuth()

  const [walletAddress, setWalletAddress] = useState('')
  const [forceEdit, setForceEdit] = useState(false)

  useEffect(() => {
    setWalletAddress(member?.wallet?.address ?? '')
  }, [member])

  const clickSubmit = async () => {
    if (!walletAddress) {
      return alert('Please enter a wallet address')
    } else if (walletAddress.indexOf('addr1') !== 0) {
      return alert('Please enter a valid wallet address (starts with addr1)')
    }

    await patchMemberWalletAddress(walletAddress)
    setForceEdit(false)
  }

  const clickEdit = () => {
    setForceEdit(true)
    clearError()
  }

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
                Are you using <strong>Eternl (CCVault)</strong>? If yes, you will have to sumbit a "used" address, see the example below!
              </li>
            </ol>
            <Image
              src='/images/docs/ccvault_address_issue.png'
              alt='ccvault'
              width={width > 1196 ? 1196 : 1196 / (1196 / width)}
              height={width > 1196 ? 586 : 586 / (1196 / width)}
              style={{ borderRadius: '1rem' }}
            />
            <br />
            <BaseButton label='Try Again' onClick={clickEdit} style={{ background: 'var(--discord-purple)' }} />
          </>
        ) : null}
      </Section>
    )
  }

  if (!member.roles?.isOG && !member.roles?.isWL && !member.roles?.isPublicReserve) {
    return (
      <Section>
        <h2>You are not eligible to submit a wallet address.</h2>
        <p>
          Please make sure you have one of the following roles:
          <br />
          <strong>OG, Whitelist, Public Reserve</strong>
        </p>
      </Section>
    )
  }

  if (!member?.wallet?.address || forceEdit) {
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
        <p>Please submit your wallet address, this will be the wallet you'll be minting from!</p>
        <input placeholder='Your addr1...' value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className={styles.inp} />
        <BaseButton label='Submit' onClick={clickSubmit} style={{ background: 'var(--discord-purple)' }} />
      </Section>
    )
  }

  return (
    <Section>
      <h2>Done!</h2>
      <p>You have successfully submitted your wallet address.</p>
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
      <BaseButton label='Change Address' onClick={clickEdit} style={{ background: 'var(--discord-purple)' }} />
    </Section>
  )
}
