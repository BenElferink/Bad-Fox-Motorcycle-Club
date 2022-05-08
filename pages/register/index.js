import { useRouter } from 'next/router'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Landing from '../../components/Landing'
import Section from '../../components/Section'
import BaseButton from '../../components/BaseButton'
import Discord from '../../icons/Discord'
import { DISCORD_REDIRECT_URL_REGISTER } from '../../constants/discord'

export default function Register() {
  const router = useRouter()

  const clickLogin = () => {
    router.push(DISCORD_REDIRECT_URL_REGISTER)
  }

  return (
    <div className='App flex-col'>
      <Header />

      <Landing>
        <Section>
          <h2>Register for Mint</h2>
          <p>Login with your Discord account to submit your wallet address.</p>
          <BaseButton
            label='Login'
            icon={Discord}
            onClick={clickLogin}
            style={{
              width: '100%',
              backgroundColor: 'var(--discord-purple)',
            }}
          />
        </Section>
      </Landing>

      <Footer />
    </div>
  )
}
