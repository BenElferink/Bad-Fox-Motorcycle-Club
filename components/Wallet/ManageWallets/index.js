import { useState } from 'react'
import { TextField } from '@mui/material'
import { CloudSync as SyncIcon, DeleteForever as DeleteIcon } from '@mui/icons-material'
import { useAuth } from '../../../contexts/AuthContext'
import BaseButton from '../../BaseButton'
import Loader from '../../Loader'
import styles from './ManageWallets.module.css'
import { FOX_POLICY_ID } from '../../../constants/policy-ids'

const ManageWallets = () => {
  const { account, addAccountPortfolioWallet, deleteAccountPortfolioWallet, syncAccountPortfolioWallets } =
    useAuth()

  const wallets = account.portfolioWallets ?? []

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!loading) {
      setLoading(true)
      await addAccountPortfolioWallet(input)
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
        await deleteAccountPortfolioWallet(stakeKey)
        setLoading(false)
      }
    }
  }

  if (loading || !account) {
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
          className={input.length ? '' : styles.hide}
          onClick={handleSubmit}
        />
      </form>

      {wallets.length ? (
        <div className={styles.syncWrapper}>
          <p>
            Note: if you buy/sell/trade your assets, these records are not processed automatically. To get accurate
            data on your holdings please click the "sync" button!
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
        {wallets.length ? (
          wallets.map(({ stakeKey, assets }) => (
            <div key={`wallet-${stakeKey}`} className={styles.walletItem}>
              <p>
                {stakeKey}
                <br />
                Fox count: {assets[FOX_POLICY_ID]?.length || 0}
              </p>
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
