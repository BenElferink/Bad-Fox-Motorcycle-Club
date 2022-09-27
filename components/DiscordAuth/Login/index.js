import { useDiscord } from '../../../contexts/DiscordContext'
import Section from '../../Section'
import BaseButton from '../../BaseButton'
import DiscordFetchingAccount from '../FetchingAccount'
import Discord from '../../../icons/Discord'

export default function DiscordLogin({ title = '', text = '', onClick = () => console.log('click') }) {
  const { loading, account } = useDiscord()

  if (loading && !account) {
    return <DiscordFetchingAccount />
  }

  return (
    <Section>
      {title ? <h2>{title}</h2> : null}
      {text ? <p>{text}</p> : null}

      <BaseButton
        label='Authorize'
        onClick={onClick}
        icon={Discord}
        backgroundColor='var(--discord-purple)'
        style={{ width: '100%' }}
      />
    </Section>
  )
}
