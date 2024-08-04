import Landing from '../components/Landing'
// import TeamCard from '../components/cards/TeamCard'

const Page = () => {
  return (
    <div className='px-4 flex flex-col items-center'>
      <Landing />

      {/* <div className='my-12 flex flex-wrap justify-center'>
        {[
          {
            name: 'Ben Elferink',
            title: 'Founder / Fullstack Developer',
            description:
              'I started my career as Fullstack Developer in 2020 & have been involved in the crypto & NFT space since 2021. I do most of the work around here.',
            profilePicture: '/media/team/ben_elferink.jpg',
            socials: ['https://x.com/intent/follow?screen_name=BenElferink', 'https://discord.com/users/791763515554922507'],
          },
          {
            name: 'Leon Art Group',
            title: '3D Artists',
            description: 'We stand in-between imagination and reality! We are here to create 3D art/models for your projects!',
            profilePicture: '/media/team/leon_art_group.jpg',
            socials: ['https://x.com/intent/follow?screen_name=LeonArtgroup', 'https://discord.com/users/700108986522796124'],
          },
        ].map(({ profilePicture, name, title, description, socials }) => (
          <TeamCard key={`team-${name}`} profilePicture={profilePicture} name={name} title={title} description={description} socials={socials} />
        ))}
      </div> */}
    </div>
  )
}

export default Page
