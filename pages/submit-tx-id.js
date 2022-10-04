import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Landing from '../components/Home/Landing'
import Section from '../components/Section'
import Loader from '../components/Loader'
import BaseButton from '../components/BaseButton'

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [txCount, setTxCount] = useState(0)
  const [inp, setInp] = useState('')

  const getTxCount = async () => {
    try {
      const { data } = await axios.get('/api/submit-tx-id')
      setTxCount(data.count)
    } catch (error) {
      console.error(error)
    }
  }

  const submitTx = async () => {
    if (!inp) {
      return alert('Please enter a transaction ID')
    }

    setLoading(true)
    try {
      await axios.post('/api/submit-tx-id', { txHash: inp })
      await getTxCount()
      setInp('')
      toast.success('Succesfully submitted transaction ID!')
    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.message ?? error?.message ?? 'An unexpected error occurred')
    }
    setLoading(false)
  }

  useEffect(() => {
    getTxCount()
  }, [])

  return (
    <div className='App flex-col'>
      <Header />
      <Landing>
        <Section>
          <h2>Submit a TX ID</h2>
          <p>So far {txCount} transactions have been submitted.</p>
          <p>
            Please submit your transaction ID, it must be a valid Bad Fox purchase from jpg.store, between
            September 1st and September 7th.
          </p>
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
      <Footer />
    </div>
  )
}
