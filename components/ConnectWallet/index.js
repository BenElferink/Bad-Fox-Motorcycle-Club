import { Fragment, useState } from 'react'
import useWallet from '../../contexts/WalletContext'
import Modal from '../Modal'
import BaseButton from '../BaseButton'
import GlobalLoader from '../Loader/GlobalLoader'
import { TextField } from '@mui/material'
import { useRouter } from 'next/router'
import { useScreenSize } from '../../contexts/ScreenSizeContext'

export default function ConnectWallet({ modalOnly = false }) {
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
  const router = useRouter()

  const [openModal, setOpenModal] = useState(modalOnly)
  const [input, setInput] = useState('')

  const clickMainButton = () => {
    if (connected) {
      router.push('/wallet')
    } else {
      setOpenModal(true)
    }
  }

  const clickCloseModal = () => {
    setOpenModal(false)

    if (connected) {
      router.push('/wallet')
    } else if (modalOnly) {
      router.push('/')
    }
  }

  const submitManualWallet = async (event) => {
    event?.preventDefault()

    connectWalletManually(input)
    setInput('')
  }

  return (
    <Fragment>
      {!modalOnly ? (
        <BaseButton
          label={connected ? 'My Wallet' : 'Connect'}
          onClick={clickMainButton}
          backgroundColor='var(--brown)'
          hoverColor='orange'
        />
      ) : null}

      <Modal
        title={connected ? 'Wallet Connected' : 'Connect a Wallet'}
        open={openModal}
        onClose={clickCloseModal}
        style={{ maxWidth: '800px', padding: isMobile ? '1rem 2rem' : '1rem 4rem' }}
      >
        {connected ? (
          <p style={{ textAlign: 'center' }}>
            You've succesfully connected your wallet with {connectedName}:<br />
            <span style={{ fontSize: '0.9rem', color: 'var(--orange)' }}>{populatedWallet.stakeKey}</span>
          </p>
        ) : (
          <Fragment>
            <p>
              Connect a wallet to view your assets, traits, and other features such as your personal portfolio etc.
              Connecting your wallet does not require a password/signature or any contracts, it's a read-only
              process, your balance/assets are safe.
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
        )}
      </Modal>

      <GlobalLoader loading={connecting} />
    </Fragment>
  )
}
