import Section from '../../components/Section'
import BaseButton from '../../components/BaseButton'
import Discord from '../../icons/Discord'

export default function DiscordLogin({ title = '', text = '', onClick = () => console.log('click') }) {
  return (
    <Section>
      {title ? <h2>{title}</h2> : null}
      {text ? <p>{text}</p> : null}

      <BaseButton
        label='Login'
        onClick={onClick}
        icon={Discord}
        backgroundColor='var(--discord-purple)'
        style={{ width: '100%' }}
      />
    </Section>
  )
}
