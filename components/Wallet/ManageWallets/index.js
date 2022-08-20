import { useState } from 'react'
import { TextField } from '@mui/material'
import { CloudSync as SyncIcon, DeleteForever as DeleteIcon } from '@mui/icons-material'
import { useAuth } from '../../../contexts/AuthContext'
import BaseButton from '../../BaseButton'
import Loader from '../../Loader'
import styles from './ManageWallets.module.css'

const ManageWallets = () => {
  const {
    loading: authLoading,
    account,
    addAccountStakeKey,
    syncAccountPortfolioWallets,
    deleteAccountStakeKey,
  } = useAuth()

  const stakeKeys = account?.stakeKeys ?? []

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!loading) {
      setLoading(true)
      await addAccountStakeKey(input)
      setLoading(false)
      setInput('')
    }
  }

  const handleClickSync = async () => {
    if (!loading) {
      setLoading(true)
      await syncAccountPortfolioWallets()
      setLoading(false)
    }
  }

  const handleClickDelete = async (stakeKey) => {
    if (!loading) {
      if (window.confirm('Are you sure you want to delete this wallet?')) {
        setLoading(true)
        await deleteAccountStakeKey(stakeKey)
        setLoading(false)
      }
    }
  }

  if (authLoading || loading || !account) {
    return <Loader />
  }

  return (
    <div className='flex-col'>
      <form className={styles.addForm} onSubmit={handleSubmit}>
        <TextField
          label='Add a Wallet'
          placeholder='Wallet Address / Stake Key'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          sx={{ backgroundColor: 'var(--charcoal)' }}
        />
        <BaseButton
          type='submit'
          label='ADD'
          backgroundColor='var(--grey)'
          hoverColor='var(--orange)'
          disabled={loading}
          fullWidth={false}
          className={input.length ? '' : styles.hide}
          onClick={handleSubmit}
        />
      </form>

      {stakeKeys.length ? (
        <div className={styles.syncWrapper}>
          <p>
            Note: we're using a BETA feature from Blockfrost in an attempt to get real-time TXs. If you
            buy/sell/trade your assets and these records did not process automatically, please click the "sync"
            button!
          </p>
          <BaseButton
            label='Sync'
            icon={SyncIcon}
            backgroundColor='var(--grey)'
            hoverColor='var(--orange)'
            disabled={loading}
            onClick={handleClickSync}
          />
        </div>
      ) : null}

      <div>
        {stakeKeys.length ? (
          stakeKeys.map((stakeKey) => (
            <div key={`wallet-${stakeKey}`} className={styles.walletItem}>
              <p>{stakeKey}</p>
              <button onClick={() => handleClickDelete(stakeKey)}>
                <DeleteIcon />
              </button>
            </div>
          ))
        ) : (
          <div>•••</div>
        )}
      </div>
    </div>
  )
}

export default ManageWallets
