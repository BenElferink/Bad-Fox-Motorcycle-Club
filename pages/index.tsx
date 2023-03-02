import Landing from '../components/Landing'
import Previews from '../components/Previews'
import PartnerProject from '../components/PartnerProject'
import Utilities from '../components/Utilities'
import TeamCard from '../components/cards/TeamCard'

const alliances = [
  {
    name: 'Stag Alliance',
    url: 'https://www.stagalliance.com',
    logoUrl: '/media/logo/other/stagalliance.png',
  },
  {
    name: 'MICEFIA',
    url: 'https://micefia.com',
    logoUrl: '/media/logo/other/micefia.png',
  },
  {
    name: 'Alley Katz',
    url: 'https://alleykatz.xyz',
    logoUrl: '/media/logo/other/alleykatz.png',
  },
  {
    name: 'Goombles',
    url: 'https://www.goombles.io',
    logoUrl: '/media/logo/other/goombles.png',
  },
  {
    name: "Summoner's Guild",
    url: 'https://summonersguild.io',
    logoUrl: '/media/logo/other/summonersguild.png',
  },
  {
    name: 'Space Troopers',
    url: 'https://spacetroopers.org',
    logoUrl: '/media/logo/other/spacetroopers.png',
  },
  {
    name: 'Walkers',
    url: 'http://walkerscardano.xyz',
    logoUrl: '/media/logo/other/walkers.png',
  },
  {
    name: 'Beez Hive',
    url: 'https://beezhive.io',
    logoUrl: '/media/logo/other/beezhive.png',
  },
  {
    name: 'Winged Warriors',
    url: 'https://wingedwarriors.xyz',
    logoUrl: '/media/logo/other/wingedwarriors.png',
  },
  {
    name: 'Blurry Kits Lounge',
    url: 'https://www.blurrykitslounge.com',
    logoUrl: '/media/logo/other/blurrykitslounge.png',
  },
  {
    name: 'Ape Nation',
    url: 'https://apenationcnft.com',
    logoUrl: '/media/logo/other/apenation.png',
  },
  {
    name: 'Eggscape Club',
    url: 'https://eggscape.io',
    logoUrl: '/media/logo/other/eggscapeclub.png',
  },
  {
    name: 'Space Otter Society',
    url: 'https://spaceottersociety.io',
    logoUrl: '/media/logo/other/spaceottersociety.png',
  },
  {
    name: 'Generation Zeta',
    url: 'https://twitter.com/GenZetaCNFT',
    logoUrl: '/media/logo/other/generationzeta.png',
  },
]

const tokenPartnerships = [
  {
    name: 'NFT Creative',
    url: 'https://nftcreative.ca',
    logoUrl: '/media/logo/other/nftcreative.png',
  },
  {
    name: 'Cardano Lands',
    url: 'https://cardanolands.com',
    logoUrl: '/media/logo/other/cardanolands.png',
  },
  {
    name: 'The Ape Society',
    url: 'https://theapesociety.io',
    logoUrl: '/media/logo/other/theapesociety.png',
  },
  {
    name: 'Cardano Crocs Club',
    url: 'https://cardanocrocsclub.com',
    logoUrl: '/media/logo/other/cardanocrocsclub.png',
  },
  {
    name: 'CSWAP DEX',
    url: 'https://www.cswap.fi',
    logoUrl: '/media/logo/other/cswap.png',
  },
  {
    name: 'Mad Dog Car Club',
    url: 'https://mdtoken.io',
    logoUrl: '/media/logo/other/maddogcarclub.png',
  },
  {
    name: 'Degen Dino orb Society',
    url: 'https://stake.ddos.design',
    logoUrl: '/media/logo/other/degendinoorbsociety.png',
  },
  {
    name: 'Lunatics',
    url: 'https://lunaticscnft.io',
    logoUrl: '/media/logo/other/lunatics.png',
  },
  {
    name: 'Safari Squad',
    url: 'https://www.safarisquad.io',
    logoUrl: '/media/logo/other/safarisquad.png',
  },
]

const metaPartnerships = [
  {
    name: 'CardaStacks',
    url: 'https://cardastacks.com',
    logoUrl: '/media/logo/other/cardastacks.png',
  },
  {
    name: 'Dot Dot Labs',
    url: 'https://dotdotlabs.io',
    logoUrl: '/media/logo/other/dotdotlabs.png',
  },
  {
    name: 'Unbounded Earth',
    url: 'https://unbounded.earth',
    logoUrl: '/media/logo/other/unboundedearth.png',
  },
  {
    name: 'OGBears',
    url: 'https://ogbears.com',
    logoUrl: '/media/logo/other/ogbears.png',
  },
  {
    name: 'Cornucopias',
    url: 'https://cornucopias.io',
    logoUrl: '/media/logo/other/cornucopias.png',
  },
  {
    name: 'Speed Throne',
    url: 'https://speedthrone.io',
    logoUrl: '/media/logo/other/speedthrone.png',
  },
]

const creativePartnerships = [
  {
    name: 'SoundRig',
    url: 'https://www.soundrig.io/artist/bad-fox-4042',
    logoUrl: '/media/logo/other/soundrig.png',
  },
  {
    name: 'Leon Art Group',
    url: 'https://twitter.com/leonartgroup',
    logoUrl: '/media/logo/other/leonartgroup.png',
  },
]

const featuredBy = [
  {
    name: 'Awesomeisjayell',
    url: 'https://www.youtube.com/@awesomeisjayell',
    logoUrl: '/media/logo/other/awesomeisjayell.png',
  },
  {
    name: 'Atlanick',
    url: 'https://www.youtube.com/@Atlanick',
    logoUrl: '/media/logo/other/atlanick.png',
  },
  {
    name: 'Cardano Thor',
    url: 'https://www.youtube.com/@CardanoThor',
    logoUrl: '/media/logo/other/cardanothor.png',
  },
  {
    name: 'Ultimate CNFT',
    url: 'https://www.youtube.com/@ultimatecnft',
    logoUrl: '/media/logo/other/ultimatecnft.png',
  },
]

const doxxedServices = [
  {
    name: 'Bearmarket Doxxing',
    url: 'https://doxxing.bearmarket.io/bad-fox-motorcycle-club',
    logoUrl: '/media/badges/bearmarket.png',
  },
  {
    name: 'Block Investment Group',
    url: 'https://blockinvestmentgroup.com/?tab=calendar',
    logoUrl: '/media/badges/blockinvestmentgroup.png',
  },
]

const teamMembers = [
  {
    name: 'Ben Elferink',
    title: 'Founder / Fullstack Developer',
    description:
      "I started my career as Fullstack Developer in 2020 & have been involved in the crypto & NFT space since 2021. Aside from my personal portfolio, I've also helped build several communities at their early stages.",
    profilePicture: '/media/team/Ben.jpg',
    socials: [
      'https://github.com/belferink1996',
      'https://www.linkedin.com/in/ben-elferink-37ba251b9',
      'https://twitter.com/BenElferink',
      'https://discord.com/users/791763515554922507',
    ],
  },
  {
    name: 'David Minkov',
    title: 'Co-Founder / Artist',
    description:
      "I'm an artist from a very young age, I started my graphic design career in 2020. I'm very excited to work on the art for Bad Fox MC, as it's is my first time being in the Cardano NFT space!",
    profilePicture: '/media/team/David.jpg',
    socials: [
      'https://www.linkedin.com/in/david-minkov-50187620a',
      'https://instagram.com/david_minkov',
      'https://twitter.com/Minkov_D',
      'https://discord.com/users/958536998140907550',
    ],
  },
  {
    name: 'Chris Mitrev',
    title: 'Co-Founder / Artist',
    description:
      "I'm an aspiring artist. I've invested in the tools required to produce the art for Bad Fox MC. I help in the making of traits, and I lead the work & design for our merchandise store.",
    profilePicture: '/media/team/Chris.jpg',
    socials: [
      'https://instagram.com/m__chris',
      'https://twitter.com/ChrisMitrev',
      'https://discord.com/users/906518144108101642',
    ],
  },
  {
    name: 'Crib King (4042)',
    title: 'Director of Vibes',
    description:
      'I use creative thinking as a means of expression. This helps me to connect dots and build bridges from one point to another. What is a "Director of Vibes" ? Look at it as a less formal version of Community Manager. I\'m here to coordinate the community vibes and connect with the people!',
    profilePicture: '/media/team/4042.jpg',
    socials: [
      'https://twitter.com/CribKingCOM',
      'https://soundcloud.com/badfox4042',
      'https://www.youtube.com/@badfox4042',
      'https://discord.com/users/829116071663370250',
    ],
  },
  {
    name: 'Uberman',
    title: 'Blockchain & Fullstack Developer',
    description:
      "I'm a programmer, and I've been minting NFT projects on Cardano since September 2021. Over that time, I've' been part of many successful teams such as OGBears, and Filthy Rich Horses. I love everyone who is part of the Cardano community and now it feels like a small family to me.",
    profilePicture: '/media/team/Uberman.jpg',
    socials: ['https://discord.com/users/458201578571038740'],
  },
]

const Page = () => {
  return (
    <div className='px-4 flex flex-col items-center'>
      <Landing />
      <Previews />
      <Utilities />

      <div className='flex flex-col items-center justify-center my-8 text-gray-500'>
        <h5 className='text-2xl'>Partnerships</h5>
        <div className='flex flex-wrap items-center justify-center'>
          {tokenPartnerships.map(({ name, url, logoUrl }) => (
            <PartnerProject key={`partner-${name}`} name={name} url={url} logoUrl={logoUrl} />
          ))}
        </div>
        <div className='flex flex-wrap items-center justify-center'>
          {metaPartnerships.map(({ name, url, logoUrl }) => (
            <PartnerProject key={`partner-${name}`} name={name} url={url} logoUrl={logoUrl} />
          ))}
        </div>
        <div className='flex flex-wrap items-center justify-center'>
          {creativePartnerships.map(({ name, url, logoUrl }) => (
            <PartnerProject key={`partner-${name}`} name={name} url={url} logoUrl={logoUrl} />
          ))}
        </div>
      </div>

      <div className='flex flex-col items-center justify-center my-8 text-gray-500'>
        <h5 className='text-2xl'>Featured by Content Creators</h5>
        <div className='flex flex-wrap items-center justify-center'>
          {featuredBy.map(({ name, url, logoUrl }) => (
            <PartnerProject key={`featured-${name}`} name={name} url={url} logoUrl={logoUrl} />
          ))}
        </div>
      </div>

      <div className='flex flex-col items-center justify-center my-8 text-gray-500'>
        <h5 className='text-2xl'>Alliances</h5>
        <div className='flex flex-wrap items-center justify-center'>
          {alliances.map(({ name, url, logoUrl }) => (
            <PartnerProject key={`alliance-${name}`} name={name} url={url} logoUrl={logoUrl} />
          ))}
        </div>
      </div>

      <div id='team' className='flex flex-col items-center justify-center my-8 text-gray-500'>
        <h5 className='text-2xl'>Certifications</h5>
        <div className='flex flex-wrap items-center justify-center'>
          {doxxedServices.map(({ name, url, logoUrl }) => (
            <PartnerProject
              key={`certification-${name}`}
              name={name}
              url={url}
              logoUrl={logoUrl}
              className='mx-8'
            />
          ))}
        </div>
      </div>

      <div className='flex flex-wrap justify-center max-w-5xl mb-10'>
        {teamMembers.map(({ profilePicture, name, title, description, socials }) => (
          <TeamCard
            key={`team-${name}`}
            profilePicture={profilePicture}
            name={name}
            title={title}
            description={description}
            socials={socials}
          />
        ))}
      </div>
    </div>
  )
}

export default Page
