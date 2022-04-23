import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.root}>
      <h2>About Bad Fox MC</h2>
      <p>
        Bad Fox Motorcycle Club is a <strong>community driven</strong> NFT Project. The team comes from some of the <strong>best projects on Cardano</strong> and the <strong>core of the community</strong> is comprised of close friends we've met along the way.
      </p>
      <p>
        In terms of utility, BFMC will be <strong>rewarding all holders passively</strong> with ADA, and will (later on) have{' '}
        <strong>a burn event</strong> allowing participants to get <strong>lifetime access to metaverse content and assets</strong>.
      </p>
    </section>
  )
}
