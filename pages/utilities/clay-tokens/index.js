import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Section from '../../../components/Section'
import ClayTraitSet from '../../../components/ClayTraitSet'
import { GITHUB_MEDIA_URL } from '../../../constants/api-urls'
import Loader from '../../../components/Loader'

export default function Page({}) {
  const [clayData, setClayData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const { data } = await axios.get('/api/utilities/clay')
        setClayData(data)
      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    })()
  }, [])

  return (
    <div className='App flex-col'>
      <Header />
      <div>
        <Section style={{ maxWidth: '95vw', padding: '1rem 0.5rem', marginTop: '111px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-111px', left: '11px' }}>
            <Image src={`${GITHUB_MEDIA_URL}/utilities/clay-token.png`} alt='' width={150} height={150} />
          </div>

          <h1>$CLAY Tokens</h1>
          <p>
            We're all familiar with the outstanding success of Clay Nation, right?
            <br />
            Clay have officially launched their $CLAY token during mid August 2022.
            <br />
            The $CLAY token can be obtained by trading, staking, baking, or holding.
          </p>
          <p>
            The Bad Fox treasury is accumulating $CLAY tokens in various methods, such as:
            <br />
            Staking with the CLAY pool, baking Good Charlottes, and by holding Clay Pitches.
          </p>
          <p>
            We're going to distribute all of the $CLAY tokens from the treasury to Bad Fox holders.
            <br />
            To be eligible for the token drop, you'll be required to collect traits sets.
            <br />
            Sets can stack if you have multiples of the entire set (each trait is required).
          </p>
          <p>The token distribution will occur towards the end of Q4 2022.</p>
          <p>
            Total tokens = {Math.floor(clayData.clayBalance ?? 0)} (accumulating)
            <br />
            Total shares = {clayData.ownedShares ?? 0} / {clayData.maxShares ?? 0}
            <br />
            Tokens per share = {(clayData.tokensPerShare ?? 0).toFixed(2)}
            <br />
            Total possibilities = {clayData.ownedPossibilities ?? 0} / {clayData.maxPossibilities ?? 0}
          </p>
        </Section>

        <div className='flex-col' style={{ margin: '2rem auto' }}>
          {loading ? (
            <Loader color='var(--white)' />
          ) : (
            Object.entries(clayData.traitSets ?? {})
              .sort((a, b) => b[1].shares - a[1].shares)
              .map(([roleName, { shares, tokens, possibilities, occupied, set }]) => (
                <ClayTraitSet
                  key={roleName}
                  title={roleName}
                  textRows={[
                    `Shares: ${shares}`,
                    `Token Value: ${tokens.toFixed(2)}`,
                    `Possibilities: ${occupied} / ${possibilities}`,
                  ]}
                  set={set}
                />
              ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
