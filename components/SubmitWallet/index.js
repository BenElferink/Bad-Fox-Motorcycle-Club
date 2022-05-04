import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Loader from '../../components/Loader'
import BaseButton from '../../components/BaseButton'
import styles from './SubmitWallet.module.css'

export default function SubmitWallet() {
  const router = useRouter()
  const { asPath } = router

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Discord member not found')
  const [journeySuccess, setJourneySuccess] = useState(false)

  const [token, setToken] = useState('')
  const [member, setMember] = useState({})
  const [walletAddress, setWalletAddress] = useState('')

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
          setErrorMessage('')
          if (res.data.wallet?.address) {
            setWalletAddress(res.data.wallet.address)
          }
        } catch (error) {
          setErrorMessage(error?.response?.data?.message ?? error?.message ?? 'Unexpected error!')
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
      setErrorMessage('')
      setJourneySuccess(true)
    } catch (error) {
      setErrorMessage(error?.response?.data?.message ?? error?.message ?? 'Unexpected error!')
    }

    setLoading(false)
  }

  return (
    <section className={`${styles.root} flex-col`}>
      {journeySuccess ? (
        <>
          <h2>Done!</h2>
          <p>
            You have successfully submitted your wallet address.
            <br />
            <br />
            Your Wallet Address:
            <br />
            <span>{member.wallet?.address}</span>
            <br />
            <br />
            Your Stake Key:
            <br />
            <span>{member.wallet?.stakeKey}</span>
          </p>
        </>
      ) : loading ? (
        <>
          <h2>Please wait a moment...</h2>
          <Loader />
        </>
      ) : errorMessage ? (
        <>
          <h2>An error occurred:</h2>
          <p>{errorMessage}</p>
        </>
      ) : (
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
              <BaseButton
                label='Submit'
                onClick={clickSubmit}
                style={{
                  background: 'var(--discord-purple)',
                }}
              />
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
      )}
    </section>
  )
}
