import { GITHUB_MEDIA_URL } from '../../constants/api-urls'
import { BAD_FOX_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../constants/policy-ids'

export default function Footer() {
  return (
    <footer
      className='flex-col'
      style={{
        width: '100%',
        marginTop: 'auto',
        padding: '0 1rem',
        color: 'var(--grey)',
        textAlign: 'center',
      }}
    >
      <div style={{ width: '100%' }}>
        <h4 style={{ margin: 0 }}>Powered By</h4>
        <div className='flex-row' style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            {
              name: 'Cardano',
              url: 'https://cardano.org',
              logo: `${GITHUB_MEDIA_URL}/logo/other/cardano.png`,
              logoHeight: '70px',
              logoWidth: '70px',
            },
            {
              name: 'Mesh',
              url: 'https://mesh.martify.io',
              logo: `${GITHUB_MEDIA_URL}/logo/other/mesh.png`,
              logoHeight: '70px',
              logoWidth: '70px',
            },
          ].map((obj) => (
            <div
              key={`powered-by-${obj.name}`}
              onClick={() => window.open(obj.url, '_blank')}
              style={{
                margin: '0.5rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <h5 style={{ margin: 0, textAlign: 'center', userSelect: 'none' }}>{obj.name}</h5>
              <div
                style={{
                  height: obj.logoHeight,
                  width: obj.logoWidth,
                  marginTop: '0.5rem',
                  background: `url(${obj.logo}) no-repeat center`,
                  backgroundSize: 'contain',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: '0.7rem' }}>
        Bad Fox Policy ID:
        <br />
        {BAD_FOX_POLICY_ID}
      </p>
      <p style={{ fontSize: '0.7rem' }}>
        Bad Motorcycle Policy ID:
        <br />
        {BAD_MOTORCYCLE_POLICY_ID}
      </p>
    </footer>
  )
}
