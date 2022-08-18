import Image from 'next/image'
import { useScreenSize } from '../../../contexts/ScreenSizeContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Section from '../../../components/Section'
import { GITHUB_MEDIA_URL } from '../../../constants/api-urls'

export default function Page() {
  const { isMobile } = useScreenSize()

  const mediaSize = isMobile ? 270 : 350

  const styles = {
    dropWrap: {
      margin: '2rem auto',
      padding: '1rem',
      borderRadius: '1rem',
    },
    dropTxt: {
      margin: '0',
      textAlign: 'center',
    },
    media: {
      margin: '1rem',
      borderRadius: '1rem',
      boxShadow: '0 0 0.25rem var(--orange)',
    },
  }

  return (
    <div className='App flex-col'>
      <Header />
      <div>
        <Section style={{ maxWidth: '95vw', padding: '1rem 0.5rem', marginTop: '100px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '-80px', left: '11px' }}>
            <Image src={`${GITHUB_MEDIA_URL}/utilities/flame.png`} alt='' width={77} height={110} />
          </div>

          <h1 style={{ textAlign: 'center' }}>Burn Event + Airdrops</h1>
          <p>The burn event is going to be an important changing factor in our roadmap and in market dynamics.</p>
          <p>
            If you choose to participate in the burn event, you'll be required to burn:
            <br />
            1x Male Fox, 1x Female Fox, 1x Motorcycle,
            <br />
            and in return you will receive 1x Key.
          </p>
          <p>
            At a 100% burn rate, there will be no more than 3,000 Keys.
            <br />
            If you choose to burn your NFTs, as a Key holder you will get lifetime airdrops for any future
            collections!
            <br />
            The artwork will be preserved by containing their IPFS references within the Key's metadata.
            <br />
            So if you burn your NFTs, you do not lose the artwork.
          </p>
          <p>
            Burning the NFTs reduces the supply for both collections, thereby increasing their value (floor prices
            and volume).
            <br />A decrease in supply also means more royalty shares for holders that choose not to burn their
            NFTs.
          </p>
        </Section>

        <div className='flex-col' style={styles.dropWrap}>
          <h2 style={{ textAlign: 'center' }}>1st Airdrop: 3D Fox Collection</h2>
          <p style={styles.dropTxt}>
            We're making 5,000 3D Fox avatars, and they will serve as metaverse compatible avatars.
            <br />
            You can instantly use them in the OGVerse (developed by OGBears), even during the early Alpha/Beta
            stages.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row-reverse',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                ...styles.media,
                // fix odd UI glitch (adds 6.5px to height)
                height: mediaSize,
              }}
            >
              <Image
                src={`${GITHUB_MEDIA_URL}/previews/3d-foxes.png`}
                alt=''
                width={mediaSize}
                height={mediaSize}
                style={{ borderRadius: '1rem' }}
              />
            </div>
            <video
              autoPlay
              loop
              muted
              playsInline // for mobile devices (will not auto-fullscreen on page-load)
              src={`${GITHUB_MEDIA_URL}/previews/3d-fox.mp4`}
              alt=''
              width={mediaSize}
              height={mediaSize}
              style={styles.media}
            />
          </div>
        </div>

        <div className='flex-col' style={styles.dropWrap}>
          <h2 style={{ textAlign: 'center' }}>2nd Airdrop: Vox Fox Collection</h2>
          <p style={styles.dropTxt}>
            We've partnered with Dot Dot Labs to develop 5,000 Vox Fox avatars.
            <br />
            These Vox avatars will serve as Boss Planet compatible avatars.
            <br />
            We will also work together on a Motorcycle Club for Boss Planet land that we will purchase.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                ...styles.media,
                // fix odd UI glitch (adds 6.5px to height)
                height: mediaSize,
              }}
            >
              <Image
                src={`${GITHUB_MEDIA_URL}/utilities/dot-dot-labs.jpg`}
                alt=''
                width={mediaSize}
                height={mediaSize}
                style={{ borderRadius: '1rem' }}
              />
            </div>
            <div
              style={{
                ...styles.media,
                // fix odd UI glitch (adds 6.5px to height)
                height: mediaSize,
              }}
            >
              <Image
                src={`${GITHUB_MEDIA_URL}/utilities/boss-planet.jpg`}
                alt=''
                width={mediaSize}
                height={mediaSize}
                style={{ borderRadius: '1rem' }}
              />
            </div>
          </div>
        </div>

        <div className='flex-col' style={styles.dropWrap}>
          <h2 style={{ textAlign: 'center' }}>Stay tuned for more...</h2>
        </div>
      </div>
      <Footer />
    </div>
  )
}
