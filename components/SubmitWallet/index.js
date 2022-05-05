import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import Loader from '../../components/Loader'
import BaseButton from '../../components/BaseButton'
import styles from './SubmitWallet.module.css'

export default function SubmitWallet() {
  const router = useRouter()
  const { asPath } = router

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({})

  const [token, setToken] = useState('')
  const [member, setMember] = useState({})
  const [walletAddress, setWalletAddress] = useState('')
  const [forceEdit, setForceEdit] = useState(false)

  useEffect(() => {
    setWalletAddress(member?.wallet?.address ?? '')
  }, [member])

  const getMember = async (path) => {
    const query = path.split('#')[1]

    if (query) {
      let t = ''

      query.split('&').forEach((str) => {
        const [k, v] = str.split('=')
        if (k === 'access_token') t = v
      })

      if (t) {
        setToken(t)
        setLoading(true)

        try {
          const res = await axios.get(`/api/member?token=${t}`)

          setMember(res.data)
          setError({})
        } catch (error) {
          const e = error?.response?.data ?? {
            type: 'UNEXPECTED',
            message: error?.message ?? 'Unexpected error!',
          }

          setError(e)
        }

        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (asPath) getMember(asPath)
  }, [asPath])

  const clickSubmit = async () => {
    if (!walletAddress) {
      return alert('Please enter a wallet address')
    } else if (walletAddress.indexOf('addr1') !== 0) {
      return alert('Please enter a valid wallet address (starts with addr1)')
    }

    setLoading(true)

    try {
      const res = await axios.patch(`/api/member?token=${token}`, {
        walletAddress,
      })

      setMember(res.data)
      setError({})
      setForceEdit(false)
    } catch (error) {
      const e = error?.response?.data ?? {
        type: 'UNEXPECTED',
        message: error?.message ?? 'Unexpected error!',
      }

      setError(e)
    }

    setLoading(false)
  }

  const clickEdit = () => {
    setForceEdit(true)
    setError({})
  }

  const { width, isMobile } = useScreenSize()

  return (
    <section className={`${styles.root} flex-col`}>
      {loading ? (
        <>
          <h2>Please wait a moment...</h2>
          <Loader />
        </>
      ) : error.type && error.message ? (
        <>
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
        </>
      ) : !member?.wallet?.address || forceEdit ? (
        <>
          <h2>Welcome {member.username}!</h2>
          {member.roles?.isOG || member.roles?.isWL || member.roles?.isPublicReserve ? (
            <>
              <p>
                You have the following roles:
                <br />
                <strong>
                  {member.roles?.isOG ? 'OG Fox, ' : null}
                  {member.roles?.isWL ? 'WL Fox, ' : null}
                  {member.roles?.isPublicReserve ? 'Public Reserve, ' : null}
                </strong>
              </p>
              <p>Please submit your wallet address, this will be the wallet you'll be minting from!</p>
              <input placeholder='Your addr1...' value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} className={styles.inp} />
              <BaseButton label='Submit' onClick={clickSubmit} style={{ background: 'var(--discord-purple)' }} />
            </>
          ) : (
            <p>
              Unfortunately you are not eligible to submit a wallet address.
              <br />
              Please make sure you have one of the following roles:
              <br />
              <strong>OG Fox, WL Fox, Public Reserve</strong>
            </p>
          )}
        </>
      ) : (
        <>
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
        </>
      )}
    </section>
  )
}
