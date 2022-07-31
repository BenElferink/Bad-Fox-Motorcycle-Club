import Section from '../../Section'
import Loader from '../../Loader'

const DiscordFetchingAccount = () => {
  return (
    <Section>
      <h2>Please wait while we retrieve your account...</h2>
      <Loader />
    </Section>
  )
}

export default DiscordFetchingAccount
