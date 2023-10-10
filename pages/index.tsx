import Link from 'next/link'
import Image from 'next/image'
import Landing from '../components/Landing'
import Utilities from '../components/Utilities'
import TeamCard from '../components/cards/TeamCard'

const partners = [
  {
    name: 'ADA Anvil',
    url: 'https://ada-anvil.io',
    logoUrl: '/media/logo/other/adaanvil.png',
  },
  {
    name: 'Leon Art Group',
    url: 'https://x.com/leonartgroup',
    logoUrl: '/media/logo/other/leonartgroup.png',
  },
  {
    name: 'SoundRig',
    url: 'https://www.soundrig.io/artist/bad-fox-4042',
    logoUrl: '/media/logo/other/soundrig.png',
  },
  {
    name: 'Banker Coin',
    url: 'https://bankercoinada.com',
    logoUrl: '/media/logo/other/bankercoin.png',
  },

  // token partners
  {
    name: 'CSWAP DEX',
    url: 'https://www.cswap.fi',
    logoUrl: '/media/logo/other/cswap.png',
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
    name: 'IDO Pass DAO',
    url: 'https://idopass.finance',
    logoUrl: '/media/logo/other/idopassdao.png',
  },
  {
    name: 'Pangolin Protocol',
    url: 'https://pangolinprotocol.com',
    logoUrl: '/media/logo/other/pangolinprotocol.png',
  },
  {
    name: 'Cardano Lands',
    url: 'https://cardanolands.com',
    logoUrl: '/media/logo/other/cardanolands.png',
  },
  {
    name: 'Eggscape Club',
    url: 'https://eggscape.io',
    logoUrl: '/media/logo/other/eggscapeclub.png',
  },
  {
    name: 'NFT Creative',
    url: 'https://nftcreative.ca',
    logoUrl: '/media/logo/other/nftcreative.png',
  },
  {
    name: 'Mad Dog Car Club',
    url: 'https://mdtoken.io',
    logoUrl: '/media/logo/other/maddogcarclub.png',
  },
  {
    name: 'The Chillaz',
    url: 'https://utility.chainchillaz.io',
    logoUrl: '/media/logo/other/chillaz.png',
  },

  // game partners
  {
    name: 'OGBears',
    url: 'https://ogbears.com',
    logoUrl: '/media/logo/other/ogbears.png',
  },
  {
    name: 'Degen Royale',
    url: 'https://degenroyale.net',
    logoUrl: '/media/games/degen-royale/logo.png',
  },
  {
    name: 'Bitke',
    url: 'https://playbitke.com',
    logoUrl: '/media/logo/other/bitke.png',
  },
  {
    name: 'Speed Throne',
    url: 'https://speedthrone.io',
    logoUrl: '/media/logo/other/speedthrone.png',
  },
  {
    name: 'CardaStacks',
    url: 'https://cardastacks.com',
    logoUrl: '/media/logo/other/cardastacks.png',
  },
  {
    name: 'KWIC',
    url: 'https://keyboardwarriorsinternetcafe.io',
    logoUrl: '/media/logo/other/keyboardwarriorsinternetcafe.png',
  },
  {
    name: 'Space Troopers',
    url: 'https://spacetroopers.org',
    logoUrl: '/media/logo/other/spacetroopers.png',
  },
  {
    name: "Summoner's Guild",
    url: 'https://summonersguild.io',
    logoUrl: '/media/logo/other/summonersguild.png',
  },
  {
    name: 'Unbounded Earth',
    url: 'https://unbounded.earth',
    logoUrl: '/media/logo/other/unboundedearth.png',
  },
  {
    name: 'Bajuzki Studios',
    url: 'https://bajuzki.art',
    logoUrl: '/media/games/bajuzki/logo.png',
  },
]

const clients = [
  {
    name: '$LAB Token',
    url: 'https://www.lab-token.com',
    logoUrl: '/media/logo/other/labtoken.png',
  },
  {
    name: 'Ape Nation',
    url: 'https://apenationcnft.com',
    logoUrl: '/media/logo/other/apenation.png',
  },
  {
    name: 'Mallard Order',
    url: 'https://www.mallardorder.io',
    logoUrl: '/media/logo/other/mallardorder.png',
  },
  {
    name: 'Porky Island',
    url: 'https://porkyisland.com',
    logoUrl: '/media/logo/other/porkyisland.png',
  },
  {
    name: 'Walkers',
    url: 'https://walkerscardano.xyz',
    logoUrl: '/media/logo/other/walkers.png',
  },
  {
    name: 'Whiskees',
    url: 'https://whiskeesnfts.com',
    logoUrl: '/media/logo/other/whiskees.png',
  },
  {
    name: 'IDO Pass DAO',
    url: 'https://idopass.finance',
    logoUrl: '/media/logo/other/idopassdao.png',
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
  {
    name: 'BossFace Crypto',
    url: 'https://www.youtube.com/@bossfacecrypto',
    logoUrl: '/media/logo/other/bossface.png',
  },
]

const certifications = [
  {
    name: 'Ted Nation Doxxing',
    url: 'https://doxxing.bearmarket.io/bad-fox-motorcycle-club',
    logoUrl: '/media/logo/other/bearmarket.png',
  },
  {
    name: 'B.I.G  Doxxing',
    url: 'https://blockinvestmentgroup.com/?tab=calendar',
    logoUrl: '/media/logo/other/blockinvestmentgroup.png',
  },
]

const teamMembers = [
  {
    name: 'Ben Elferink',
    title: 'Founder / Fullstack Developer',
    description:
      'I started my career as Fullstack Developer in 2020 & have been involved in the crypto & NFT space since 2021. I do most of the work around here.',
    profilePicture: '/media/team/ben_elferink.jpg',
    socials: [
      'https://x.com/BenElferink',
      'https://discord.com/users/791763515554922507',
      'https://www.linkedin.com/in/ben-elferink-37ba251b9',
      'https://github.com/BenElferink',
    ],
  },
  {
    name: 'David Minkov',
    title: '2D Artist',
    description:
      "I'm an artist from a young age, and this is my first time being in the CNFT space, I'm excited to work on the 2D art for Bad Fox MC!",
    profilePicture: '/media/team/david_minkov.jpg',
    socials: [
      'https://x.com/Minkov_D',
      'https://discord.com/users/958536998140907550',
      'https://instagram.com/david_minkov',
      'https://www.linkedin.com/in/david-minkov-50187620a',
    ],
  },
  {
    name: '4042',
    title: 'Director of Vibes',
    description:
      'I use creative thinking as a means of expression. This helps me to connect dots and build bridges from one point to another. What is a "Director of Vibes" ? Look at it as a less formal version of Community Manager. I\'m here to coordinate the community vibes and connect with the people!',
    profilePicture: '/media/team/4042.jpg',
    socials: [
      'https://x.com/BadFox4042',
      'https://discord.com/users/829116071663370250',
      'https://www.youtube.com/@badfox4042',
      'https://soundcloud.com/badfox4042',
    ],
  },
  {
    name: 'Stef BBQ',
    title: 'Moderator',
    description:
      "I remote operate offshore oil and gas producing platforms from an onshore controlroom for a living, I've been into crypto for about 1,5 years and became a NFT enthousiast on Cardano little over a year ago. BadFoxMC has got a special place in my heart.",
    profilePicture: '/media/team/stef_bbq.jpg',
    socials: ['https://x.com/Stef_bbq', 'https://discord.com/users/933925521346138182', 'https://www.instagram.com/stef_bbq/'],
  },
  {
    name: 'Happyboi',
    title: 'Moderator',
    description:
      "I'm Sydney by name, also known as Happyboi. I'm into trading, and learning technical analysis. I don't have many hobbies, but I love reading books or watching movies whenever I'm free.",
    profilePicture: '/media/team/happyboi.jpg',
    socials: ['https://x.com/mr_hapyyy', 'https://discord.com/users/1024728525015621723', 'https://instagram.com/sydney.chukwu.52'],
  },
]

interface BadgeProps {
  name: string
  url: string
  logoUrl: string
}

const Badge = (props: BadgeProps) => {
  const { name, url, logoUrl } = props

  return (
    <Link
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className='group w-20 h-10 my-8 mx-4 flex flex-col items-center justify-center relative'
    >
      <Image src={logoUrl} alt='logo' fill sizes='5rem' className='object-contain drop-shadow-footeritem' />
      <h6 className='absolute -bottom-7 text-gray-500 group-hover:text-gray-400 text-xs whitespace-nowrap'>{name}</h6>
    </Link>
  )
}

const Page = () => {
  return (
    <div className='px-4 flex flex-col items-center'>
      <Landing />
      <Utilities />

      <div className='flex flex-col items-center justify-center my-8'>
        <h5 className='text-2xl'>Partners</h5>
        <div className='flex flex-wrap items-center justify-center'>
          {partners.map(({ name, url, logoUrl }) => (
            <Badge key={`partner-${name}`} name={name} url={url} logoUrl={logoUrl} />
          ))}
        </div>
      </div>

      <div className='flex flex-col items-center justify-center my-8'>
        <h5 className='text-2xl'>Clients</h5>
        <div className='flex flex-wrap items-center justify-center'>
          {clients.map(({ name, url, logoUrl }) => (
            <Badge key={`client-${name}`} name={name} url={url} logoUrl={logoUrl} />
          ))}
        </div>
      </div>

      <div className='flex flex-col items-center justify-center my-8'>
        <h5 className='text-2xl'>Featured by Content Creators</h5>
        <div className='flex flex-wrap items-center justify-center'>
          {featuredBy.map(({ name, url, logoUrl }) => (
            <Badge key={`featured-${name}`} name={name} url={url} logoUrl={logoUrl} />
          ))}
        </div>
      </div>

      <div id='team' className='flex flex-col items-center justify-center my-8'>
        <h5 className='text-2xl'>Certifications</h5>
        <div className='flex flex-wrap items-center justify-center'>
          {certifications.map(({ name, url, logoUrl }) => (
            <Badge key={`certification-${name}`} name={name} url={url} logoUrl={logoUrl} />
          ))}
        </div>
      </div>

      <div className='flex flex-wrap justify-center max-w-7xl my-12'>
        {teamMembers.map(({ profilePicture, name, title, description, socials }) => (
          <TeamCard key={`team-${name}`} profilePicture={profilePicture} name={name} title={title} description={description} socials={socials} />
        ))}
      </div>
    </div>
  )
}

export default Page
