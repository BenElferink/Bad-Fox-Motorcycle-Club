import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.root}>
      <h2>About Bad Fox MC</h2>
      <p>Bad Fox Motorcycle Club is a NFT project on the Cardano Blockchain.</p>
      <p>
        We're focused on rewarding 100% of holders. There will be no raffle to top rare ranks, or any of that
        bullsh*t. You hold, you earn, simple as that.
      </p>
      <p>
        At the beginning of our roadmap, holders will be earning ADA through royalty distributions, and
        through other events. Later on we'll have a burn event allowing participants to get lifetime access to metaverse
        content and assets through airdrops.
      </p>
    </section>
  )
}
