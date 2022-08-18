import Image from 'next/image'
import traitSetsData from '../../../data/clay-trait-sets'
// import traitsData from '../../../data/traits/fox'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Section from '../../../components/Section'
import ClayTraitSet from '../../../components/ClayTraitSet'
import { GITHUB_MEDIA_URL } from '../../../constants/api-urls'

// const data = {
//   'Role Name': {
//     share: 0,
//     possibilities: 0,
//     set: [
//       {
//         traitCategory: '',
//         traitLabel: '',
//         traitCount: 0,
//         traitPercent: '0.0%',
//         traitImage: '',
//       },
//     ],
//   },
// }

let totalShares = 0
let totalPossibilities = 0

// Object.entries(data).forEach(([roleName, { set }]) => {
//   let possibilities = 0

//   set.forEach((obj, setIdx) => {
//     const traitPrefix = obj.traitLabel.substring(0, 3)
//     const traitName = obj.traitLabel.substring(4)

//     const foundTrait = traitsData[obj.traitCategory].find(
//       ({ gender, label }) =>
//         ((gender === 'Male' && traitPrefix === '(M)') ||
//           (gender === 'Female' && traitPrefix === '(F)') ||
//           (gender === 'Unisex' && traitPrefix === '(U)')) &&
//         label === traitName
//     )

//     if (!foundTrait) {
//       console.warn('no trait', traitPrefix, traitName)
//     } else {
//       data[roleName].share += Math.round(10 / Number(foundTrait.percent.replace('%', '')))
//       data[roleName].set[setIdx] = {
//         ...obj,
//         traitCount: foundTrait.count,
//         traitPercent: foundTrait.percent,
//         traitImage: foundTrait.image,
//       }

//       if (foundTrait.count < possibilities || possibilities === 0) {
//         possibilities = foundTrait.count
//       }
//     }
//   })

//   data[roleName].possibilities = possibilities

//   totalShares += data[roleName].share * data[roleName].possibilities
//   totalPossibilities += data[roleName].possibilities
// })

Object.values(traitSetsData).forEach(({ share, possibilities }) => {
  totalShares += share * possibilities
  totalPossibilities += possibilities
})

export default function Page() {
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
            As of mid August 2022, Clay have officialy launched their $CLAY token.
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
            To be eligible for the token drop, holders will be required to collect sets of traits.
            <br />
            Sets can stack if you have multiples of the entire set (each trait is required).
          </p>
          <p>
            The token distribution will occur towards the end of Q4 2022.
            <br />
            Tokens per share = "Total tokens" / "Total shares"
          </p>
          <p>
            Total tokens = STILL ACCUMULATING
            <br />
            Maximum shares = {totalShares}
            <br />
            Maximum possibilities = {totalPossibilities}
          </p>
        </Section>

        <div className='flex-col' style={{ margin: '2rem auto' }}>
          {Object.entries(traitSetsData)
            .sort((a, b) => b[1].share - a[1].share)
            .map(([roleName, { share, possibilities, set }]) => (
              <ClayTraitSet
                key={roleName}
                title={roleName}
                textRows={[`Token Share: ${share}`, `Possibilities: ${possibilities}`]}
                set={set}
              />
            ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
