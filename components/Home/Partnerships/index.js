import { GITHUB_MEDIA_URL } from '../../../constants/api-urls'

export default function Partnerships() {
  return (
    <div style={{ maxWidth: '90vw', width: '100%', margin: '3rem auto', color: 'var(--grey)' }}>
      <h1 style={{ margin: '0 0 1rem 0', textAlign: 'center' }}>Partnerships</h1>

      <div className='flex-row' style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          {
            name: 'OGBears',
            url: 'https://www.ogbears.com',
            logo: `${GITHUB_MEDIA_URL}/logo/other/ogbears.png`,
            logoHeight: '80px',
            logoWidth: '55px',
          },
          {
            name: 'CardaStacks',
            url: 'https://www.cardastacks.com',
            logo: `${GITHUB_MEDIA_URL}/logo/other/cardastacks.png`,
            logoHeight: '80px',
            logoWidth: '100px',
          },
          {
            name: 'Dot Dot Labs',
            url: 'https://dotdotlabs.io',
            logo: `${GITHUB_MEDIA_URL}/logo/other/dotdotlabs.png`,
            logoHeight: '80px',
            logoWidth: '65px',
          },
          {
            name: 'Cardano Villa',
            url: 'https://spatial.io/s/cardanovillas-BFMC-632abbcb959f2400013ec9a5?share=4838127040499173286',
            logo: `${GITHUB_MEDIA_URL}/logo/other/cardanovilla.png`,
            logoHeight: '80px',
            logoWidth: '80px',
          },
          {
            name: 'Cardano Lands',
            url: 'https://cardanolands.com',
            logo: `${GITHUB_MEDIA_URL}/logo/other/cardanolands.png`,
            logoHeight: '80px',
            logoWidth: '100px',
          },
          {
            name: 'SoundRig',
            url: 'https://www.soundrig.io',
            logo: `${GITHUB_MEDIA_URL}/logo/other/soundrig.png`,
            logoHeight: '80px',
            logoWidth: '110px',
          },
          {
            name: 'Bearmarket Doxxing',
            url: 'https://doxxing.bearmarket.io/bad-fox-motorcycle-club',
            logo: `${GITHUB_MEDIA_URL}/logo/other/bearmarket-doxxing.png`,
            logoHeight: '80px',
            logoWidth: '120px',
          },
          {
            name: 'The Ape Society',
            url: 'https://www.theapesociety.io',
            logo: `${GITHUB_MEDIA_URL}/logo/other/theapesociety.png`,
            logoHeight: '80px',
            logoWidth: '65px',
          },
          {
            name: 'Mad Dog Car Club',
            url: 'https://mdtoken.io',
            logo: `${GITHUB_MEDIA_URL}/logo/other/maddogcarclub.png`,
            logoHeight: '80px',
            logoWidth: '80px',
          },
        ].map((obj) => (
          <div
            key={`partner-${obj.name}`}
            onClick={() => window.open(obj.url, '_blank')}
            style={{
              width: '130px',
              margin: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                height: obj.logoHeight,
                width: obj.logoWidth,
                background: `url(${obj.logo}) no-repeat center`,
                backgroundSize: 'contain',
              }}
            />
            <h5 style={{ margin: 0, textAlign: 'center', userSelect: 'none' }}>{obj.name}</h5>
          </div>
        ))}
      </div>
    </div>
  )
}
