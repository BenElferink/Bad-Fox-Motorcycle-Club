import Image from 'next/image'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <div className={styles.root}>
      <div className={styles.cardano}>
        <Image src='/images/cardano-logo.png' alt='cardano' width={55} height={55} />
        Powered by Cardano
      </div>
    </div>
  )
}
