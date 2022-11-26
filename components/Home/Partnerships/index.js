import { Fragment } from 'react'
import { GITHUB_MEDIA_URL } from '../../../constants/api-urls'

const PartnerItem = ({ name, url, logoUrl, logoHeight, logoWidth }) => (
  <div
    onClick={() => window.open(url, '_blank')}
    style={{
      minWidth: '130px',
      margin: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
    }}
  >
    <div
      style={{
        height: logoHeight,
        width: logoWidth,
        background: `url(${logoUrl}) no-repeat center`,
        backgroundSize: 'contain',
      }}
    />
    <h5 style={{ margin: 0, textAlign: 'center', userSelect: 'none' }}>{name}</h5>
  </div>
)

const Partnerships = () => {
  const styles = {
    container: {
      maxWidth: '90vw',
      width: '100%',
      margin: '3rem auto',
      color: 'var(--grey)',
    },
    title: {
      margin: '0 0 1rem 0',
      textAlign: 'center',
    },
    wrap: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }

  return (
    <Fragment>
      <div style={styles.container}>
        <h1 style={styles.title}>Partnerships</h1>

        <div style={styles.wrap}>
          {[
            {
              name: 'Dot Dot Labs',
              url: 'https://dotdotlabs.io',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/dotdotlabs.png`,
              logoHeight: '80px',
              logoWidth: '65px',
            },
            {
              name: 'CardaStacks',
              url: 'https://www.cardastacks.com',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/cardastacks.png`,
              logoHeight: '80px',
              logoWidth: '100px',
            },
            {
              name: 'OGBears',
              url: 'https://www.ogbears.com',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/ogbears.png`,
              logoHeight: '80px',
              logoWidth: '55px',
            },
            {
              name: 'Unbounded Earth',
              url: 'https://unbounded.earth',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/unboundedearth.png`,
              logoHeight: '80px',
              logoWidth: '80px',
            },
            {
              name: 'Cornucopias',
              url: 'https://www.cornucopias.io',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/cornucopias.png`,
              logoHeight: '80px',
              logoWidth: '120px',
            },
            {
              name: 'Cardano Lands',
              url: 'https://cardanolands.com',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/cardanolands.png`,
              logoHeight: '80px',
              logoWidth: '100px',
            },
            {
              name: 'The Ape Society',
              url: 'https://www.theapesociety.io',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/theapesociety.png`,
              logoHeight: '80px',
              logoWidth: '65px',
            },
            {
              name: 'Mad Dog Car Club',
              url: 'https://mdtoken.io',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/maddogcarclub.png`,
              logoHeight: '80px',
              logoWidth: '80px',
            },
            {
              name: 'SoundRig',
              url: 'https://www.soundrig.io',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/soundrig.png`,
              logoHeight: '80px',
              logoWidth: '110px',
            },
            {
              name: 'Bearmarket Doxxing',
              url: 'https://doxxing.bearmarket.io/bad-fox-motorcycle-club',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/bearmarket-doxxing.png`,
              logoHeight: '80px',
              logoWidth: '120px',
            },
          ].map((obj) => (
            <PartnerItem
              key={`partner-${obj.name}`}
              name={obj.name}
              url={obj.url}
              logoUrl={obj.logoUrl}
              logoHeight={obj.logoHeight}
              logoWidth={obj.logoWidth}
            />
          ))}
        </div>
      </div>

      <div style={styles.container}>
        <h1 style={styles.title}>Alliances</h1>

        <div style={styles.wrap}>
          {[
            {
              name: 'Cardano Villa',
              url: 'https://spatial.io/s/cardanovillas-BFMC-632abbcb959f2400013ec9a5?share=4838127040499173286',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/cardanovilla.png`,
              logoHeight: '80px',
              logoWidth: '80px',
            },
            {
              name: 'Winged Warriors',
              url: 'https://wingedwarriors.xyz',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/wingedwarriors.png`,
              logoHeight: '80px',
              logoWidth: '110px',
            },
            {
              name: 'Freaky Snakes',
              url: 'https://freakysnakes.io',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/freakysnakes.png`,
              logoHeight: '80px',
              logoWidth: '80px',
            },
            {
              name: "Summoner's Guild",
              url: 'https://summonersguild.io',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/summonersguild.png`,
              logoHeight: '80px',
              logoWidth: '80px',
            },
            {
              name: 'Space Troopers',
              url: 'https://spacetroopers.org/arenabeta',
              logoUrl: `${GITHUB_MEDIA_URL}/logo/other/spacetroopers.png`,
              logoHeight: '80px',
              logoWidth: '80px',
            },
          ].map((obj) => (
            <PartnerItem
              key={`partner-${obj.name}`}
              name={obj.name}
              url={obj.url}
              logoUrl={obj.logoUrl}
              logoHeight={obj.logoHeight}
              logoWidth={obj.logoWidth}
            />
          ))}
        </div>
      </div>
    </Fragment>
  )
}

export default Partnerships
