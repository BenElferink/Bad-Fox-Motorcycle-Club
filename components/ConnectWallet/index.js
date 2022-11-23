import { Fragment, useState } from 'react'
import { TextField } from '@mui/material'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import useWallet from '../../contexts/WalletContext'
import Modal from '../Modal'
import BaseButton from '../BaseButton'
import GlobalLoader from '../Loader/GlobalLoader'

const DISCLAIMER =
  "Connecting your wallet does not require a password, signature, or interaction with smart contracts of any kind. It's a read-only process, your balance & assets are safe."

export default function ConnectWallet({
  disableManual = false,
  introText = 'Connect a wallet to view personal data etc.',
}) {
  const {
    availableWallets,
    connectWallet,
    connectWalletManually,
    connecting,
    connected,
    connectedName,
    populatedWallet,
  } = useWallet()
  const { isMobile } = useScreenSize()

  const [openModal, setOpenModal] = useState(true)
  const [input, setInput] = useState('')

  const onClose = () => {
    if (connected) {
      setOpenModal(false)
    } else {
      window.location.href = '/'
    }
  }

  const submitManualWallet = async (event) => {
    event?.preventDefault()

    connectWalletManually(input)
    setInput('')
  }

  return (
    <Fragment>
      <Modal
        title={connected ? 'Wallet Connected' : 'Connect a Wallet'}
        open={openModal}
        onClose={onClose}
        style={{ maxWidth: '800px', padding: isMobile ? '1rem 2rem' : '1rem 4rem' }}
      >
        {connected ? (
          <p style={{ textAlign: 'center' }}>
            You've succesfully connected your wallet with {connectedName}:<br />
            <span style={{ fontSize: '0.9rem', color: 'var(--online)' }}>{populatedWallet.stakeKey}</span>
          </p>
        ) : (
          <Fragment>
            <p>
              {introText}
              <br />
              <u>Disclaimer</u>: {DISCLAIMER}
            </p>

            {availableWallets.length == 0 ? (
              <p>No wallets installed</p>
            ) : (
              availableWallets.map((wallet, idx) => (
                <BaseButton
                  key={`Connect_Wallet_${wallet.name}`}
                  label={wallet.name}
                  imageIcon={wallet.icon}
                  onClick={() => connectWallet(wallet.name)}
                  disabled={connected || connecting}
                  backgroundColor={'var(--brown)'}
                  style={{
                    minWidth: '250px',
                    width: isMobile ? '85%' : '70%',
                    margin: '0.15rem auto',
                    padding: '0.5rem 1rem',
                    justifyContent: 'flex-start',
                    border: '1px solid var(--brown-75)',
                    borderRadius:
                      idx === 0 && idx === availableWallets.length - 1
                        ? '1rem'
                        : idx === 0
                        ? '1rem 1rem 0 0'
                        : idx === availableWallets.length - 1
                        ? '0 0 1rem 1rem'
                        : '0',
                  }}
                />
              ))
            )}

            {!disableManual ? (
              <Fragment>
                <h4 style={{ marginBottom: 0 }}>- OR -</h4>
                <p style={{ marginTop: 0 }}>
                  Alternatively you can connect your wallet manually by pasting your ADA Handle / Wallet Address /
                  Stake Key
                </p>

                <form
                  onSubmit={submitManualWallet}
                  style={{ width: isMobile ? '75%' : '60%', margin: '1rem', position: 'relative' }}
                >
                  <TextField
                    label='Connect Manually'
                    placeholder='$handle / addr1... / stake1...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    sx={{ width: '100%' }}
                  />
                  <BaseButton
                    type='submit'
                    label='ADD'
                    onClick={submitManualWallet}
                    disabled={connecting}
                    backgroundColor='var(--grey)'
                    hoverColor='var(--orange)'
                    fullWidth={false}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '1%',
                      transform: 'translate(0%, -50%)',
                      border: 'none',
                      fontSize: '1rem',
                      display: input ? 'unset' : 'none',
                    }}
                  />
                </form>
              </Fragment>
            ) : null}
          </Fragment>
        )}
      </Modal>

      <GlobalLoader loading={connecting} />
    </Fragment>
  )
}
