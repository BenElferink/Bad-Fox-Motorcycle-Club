import Landing from '../components/Landing'
import Previews from '../components/Previews'
import Utilities from '../components/Utilities'
import TeamCard from '../components/cards/TeamCard'
import Link from 'next/link'
import Image from 'next/image'

const partnerships = [
  {
    name: 'Leon Art Group',
    url: 'https://twitter.com/leonartgroup',
    logoUrl: '/media/logo/other/leonartgroup.png',
  },
  {
    name: 'ADA Anvil',
    url: 'https://ada-anvil.io',
    logoUrl: '/media/logo/other/adaanvil.png',
  },
  {
    name: 'SoundRig',
    url: 'https://www.soundrig.io/artist/bad-fox-4042',
    logoUrl: '/media/logo/other/soundrig.png',
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

const certifications = [
  {
    name: 'Bearmarket Doxxing',
    url: 'https://doxxing.bearmarket.io/bad-fox-motorcycle-club',
    logoUrl: '/media/logo/other/bearmarket.png',
  },
  {
    name: 'Block Investment Group',
    url: 'https://blockinvestmentgroup.com/?tab=calendar',
    logoUrl: '/media/logo/other/blockinvestmentgroup.png',
  },
]

const teamMembers = [
  {
    name: 'Ben Elferink',
    title: 'Co-Founder / Fullstack Developer',
    description:
      'I started my career as Fullstack Developer in 2020 & have been involved in the crypto & NFT space since 2021. I do most of the work around here.',
    profilePicture: '/media/team/Ben.jpg',
    socials: [
      'https://twitter.com/BenElferink',
      'https://discord.com/users/791763515554922507',
      'https://www.linkedin.com/in/ben-elferink-37ba251b9',
      'https://github.com/belferink1996',
    ],
  },
  {
    name: 'Chris Mitrev',
    title: 'Co-Founder / Artist',
    description:
      "I'm a graffiti artist. I helped in the making of the 2D traits, I lead the work & design for our merchandise store. I also make the graphics for social media.",
    profilePicture: '/media/team/Chris.jpg',
    socials: [
      'https://twitter.com/ChrisMitrev',
      'https://discord.com/users/906518144108101642',
      'https://instagram.com/m__chris',
    ],
  },
  {
    name: 'David Minkov',
    title: '2D Artist',
    description:
      "I'm an artist from a young age, and this is my first time being in the CNFT space! I'm excited to lead the work on 2D art for Bad Fox MC.",
    profilePicture: '/media/team/David.jpg',
    socials: [
      'https://twitter.com/Minkov_D',
      'https://discord.com/users/958536998140907550',
      'https://instagram.com/david_minkov',
      'https://www.linkedin.com/in/david-minkov-50187620a',
    ],
  },
  {
    name: 'Crib King (4042)',
    title: 'Director of Vibes',
    description:
      'I use creative thinking as a means of expression. This helps me to connect dots and build bridges from one point to another. What is a "Director of Vibes" ? Look at it as a less formal version of Community Manager. I\'m here to coordinate the community vibes and connect with the people!',
    profilePicture: '/media/team/4042.jpg',
    socials: [
      'https://twitter.com/BadFox4042',
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
    profilePicture: '/media/team/Stef.jpg',
    socials: [
      'https://twitter.com/Stef_bbq',
      'https://discord.com/users/933925521346138182',
      'https://www.instagram.com/stef_bbq/',
    ],
  },
  {
    name: 'Stevie T',
    title: 'Moderator',
    description:
      "I've been an IT admin for 10+ years, and have been involved in the crypto space since 2019. I found my passion in CNFTs, and am proud to be part of the Bad Fox team.",
    profilePicture: '/media/team/Stevie.jpg',
    socials: ['https://twitter.com/StevieTIota', 'https://discord.com/users/677534591636209664'],
  },
  {
    name: 'Happyboi',
    title: 'Moderator',
    description:
      "I'm Sydney by name, also known as Happyboi. I'm into trading, and learning technical analysis. I don't have many hobbies, but I love reading books or watching movies whenever I'm free.",
    profilePicture: '/media/team/Happyboi.jpg',
    socials: ['https://discord.com/users/1024728525015621723', 'https://instagram.com/sydney.chukwu.52'],
  },
]

interface BadgeProps {
  name: string
  url: string
  logoUrl: string
  className?: string
}

const Badge = (props: BadgeProps) => {
  const { name, url, logoUrl, className } = props

  return (
    <Link
      href={url}
      target='_blank'
      rel='noopener noreferrer'
      className={'w-20 h-10 my-6 mx-6 flex flex-col items-center justify-center relative ' + className}
    >
      <Image src={logoUrl} alt='logo' fill sizes='5rem' className='object-contain' />
      <h6 className='absolute -bottom-7 text-xs whitespace-nowrap'>{name}</h6>
    </Link>
  )
}

const Page = () => {
  return (
    <div className='px-4 flex flex-col items-center'>
      <Landing />
      <Previews />
      <Utilities />

      <div className='flex flex-col items-center justify-center my-8 text-gray-500'>
        <h5 className='text-2xl'>Partnerships</h5>
        <div className='flex flex-wrap items-center justify-center'>
          {partnerships.map(({ name, url, logoUrl }) => (
            <Badge key={`partner-${name}`} name={name} url={url} logoUrl={logoUrl} />
          ))}
        </div>
      </div>

      <div className='flex flex-col items-center justify-center my-8 text-gray-500'>
        <h5 className='text-2xl'>Featured by Content Creators</h5>
        <div className='flex flex-wrap items-center justify-center'>
          {featuredBy.map(({ name, url, logoUrl }) => (
            <Badge key={`featured-${name}`} name={name} url={url} logoUrl={logoUrl} />
          ))}
        </div>
      </div>

      <div id='team' className='flex flex-col items-center justify-center my-8 text-gray-500'>
        <h5 className='text-2xl'>Certifications</h5>
        <div className='flex flex-wrap items-center justify-center'>
          {certifications.map(({ name, url, logoUrl }) => (
            <Badge key={`certification-${name}`} name={name} url={url} logoUrl={logoUrl} className='mx-8' />
          ))}
        </div>
      </div>

      <div className='flex flex-wrap justify-center max-w-7xl mb-10'>
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
