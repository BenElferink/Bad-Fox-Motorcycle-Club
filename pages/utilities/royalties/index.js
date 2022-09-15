import Image from 'next/image'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Section from '../../../components/Section'
import AssetCard from '../../../components/Assets/AssetCard'
import formatBigNumber from '../../../functions/formatters/formatBigNumber'
import { FOX_ROYALTY_WALLET, MOTORCYCLE_ROYALTY_WALLET } from '../../../constants/addresses'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import { GITHUB_MEDIA_URL } from '../../../constants/api-urls'

export default function Page() {
  const { isMobile } = useScreenSize()

  const [foxData, setFoxData] = useState({
    adaInWallet: 0,
    adaInVolume: 0,
  })

  const [motorcycleData, setMotorcycleData] = useState({
    adaInWallet: 0,
    adaInVolume: 0,
  })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await axios.get('/api/utilities/royalties/fox')

        setFoxData(res.data)
      } catch (error) {
        console.error(error.message)
      }
    })()
  }, [])

  return (
    <div className='App flex-col'>
      <Header />
      <div>
        <Section style={{ maxWidth: '95vw', padding: '1rem 0.5rem', marginTop: '111px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-111px', left: '11px', transform: 'rotate(180deg)' }}>
            <Image src={`${GITHUB_MEDIA_URL}/utilities/ada-token.png`} alt='' width={150} height={150} />
          </div>

          <h1 style={{ textAlign: 'center' }}>80% Royalties to 100% Holders</h1>
          <p>
            We're focused on rewarding 100% of holders.
            <br />
            There will be no raffle to top rare ranks, or any of that bullsh*t. You hold, you earn, simple as that.
          </p>
          <p>
            The community voted on a 7% fee for secondary sales, 80% of those fees are given back to all holders.
            <br />
            Let's say we have 1m in secondary volume, then the holders share would be: 1,000,000 * 7% * 80% =
            56,000.
          </p>
          <p>
            Royalties are distributed equally to all unlisted NFTs (Fox & Motorcycle collections), the more that
            are listed, the more you earn per NFT.
            <br />
            Rarity does not matter, but quantity does, holding more will earn you more. Sweeping is more beneficial
            than sniping.
          </p>
        </Section>

        <div>
          <div style={{ margin: isMobile ? '220px auto 0 auto' : '200px auto 0 auto', position: 'relative' }}>
            <AssetCard
              mainTitles={['Fox Collection']}
              subTitles={[
                `Total Volume: ${formatBigNumber(foxData.adaInVolume)}`,
                `Royalties in Wallet: ${formatBigNumber(foxData.adaInWallet)}`,
              ]}
              itemUrl={`https://pool.pm/${FOX_ROYALTY_WALLET}`}
            />

            <div
              style={{
                position: 'absolute',
                top: isMobile ? '-230px' : '-169px',
                right: isMobile ? '11px' : '42px',
              }}
            >
              <Image src={`${GITHUB_MEDIA_URL}/previews/2d-fox.png`} alt='' width={250} height={250} />
            </div>
          </div>

          <div
            style={{ margin: isMobile ? '120px auto 50px auto' : '100px auto 50px auto', position: 'relative' }}
          >
            <AssetCard
              mainTitles={['Motorycle Collection']}
              subTitles={[
                `Total Volume: ${formatBigNumber(motorcycleData.adaInVolume)}`,
                `Royalties in Wallet: ${formatBigNumber(motorcycleData.adaInWallet)}`,
              ]}
              itemUrl={`https://pool.pm/${MOTORCYCLE_ROYALTY_WALLET}`}
            />

            <div
              style={{
                position: 'absolute',
                top: isMobile ? '-215px' : '-169px',
                right: isMobile ? '11px' : '42px',
              }}
            >
              <Image src={`${GITHUB_MEDIA_URL}/previews/2d-motorbike.png`} alt='' width={300} height={300} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
