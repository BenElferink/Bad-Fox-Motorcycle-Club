import { useRouter } from 'next/router'
import BaseButton from '../BaseButton'
import Discord from '../../icons/Discord'
import { DISCORD_REDIRECT_URL_REGISTER } from '../../constants/discord'
import styles from './DiscordLogin.module.css'

export default function DiscordLogin() {
  const router = useRouter()

  const clickLogin = () => {
    router.push(DISCORD_REDIRECT_URL_REGISTER)
  }

  return (
    <section className={`${styles.root} flex-col`}>
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
    </section>
  )
}
