import data from '../../data/partners.json'
import styles from './Partnerships.module.css'

const Partnerships = () => {
  return (
    <div className={styles.root}>
      <h1>Partnerships</h1>

      <div className={styles.partnersWrapper}>
        {data.map((obj) => (
          <div key={obj.name} className={styles.partner} onClick={() => window.open(obj.url, '_blank')}>
            <div
              style={{
                height: obj.logoHeight,
                width: obj.logoWidth,
                background: `url(${obj.logo}) no-repeat center`,
                backgroundSize: 'contain',
              }}
            />
            <h5>{obj.name}</h5>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Partnerships
