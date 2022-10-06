import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import Landing from '../Home/Landing'
import Section from '../Section'
import Loader from '../Loader'
import BaseButton from '../BaseButton'

export default function SubmitTx({ policyId }) {
  const [txGeneralInfo, setTxGeneralInfo] = useState({
    count: 0,
    setting: {
      startDate: '1970-01-01T00:00:00.000Z',
      endDate: '1970-01-01T00:00:00.000Z',
    },
    txs: [],
  })

  const [loading, setLoading] = useState(false)

  const getTxCount = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`/api/jpg-tx/${policyId}`)
      setTxGeneralInfo(data)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    getTxCount()
  }, [])

  const [inp, setInp] = useState('')

  const submitTx = async () => {
    if (!inp) {
      return alert('Please enter a transaction ID')
    }

    setLoading(true)
    try {
      await axios.post(`/api/jpg-tx/${policyId}`, { txHash: inp })
      await getTxCount()
      setInp('')
      toast.success('Succesfully submitted transaction ID!')
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message ?? error?.message ?? 'An unexpected error occurred')
    }
    setLoading(false)
  }

  return (
    <Landing>
      <Section>
        <h2>Submit a Transaction ID</h2>
        <p>
          Please submit a valid transaction ID between the dates{' '}
          {new Date(txGeneralInfo.setting.startDate).toLocaleString()} and{' '}
          {new Date(txGeneralInfo.setting.endDate).toLocaleString()}
          <br />
          Transaction must be a purchase from jpg.store with policy ID
          <br />
          {policyId}
        </p>
        <p>{txGeneralInfo.count} transactions submitted so far</p>
        <input
          placeholder='Your TX ID...'
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          style={{
            width: '100%',
            margin: '0.5rem 0',
            padding: '0.6rem 0',
            background: 'var(--white)',
            borderRadius: '4px',
            border: 'none',
            textAlign: 'center',
          }}
        />
        {loading ? (
          <Loader />
        ) : (
          <BaseButton label='Submit' onClick={submitTx} backgroundColor='var(--discord-purple)' fullWidth />
        )}
      </Section>
    </Landing>
  )
}
