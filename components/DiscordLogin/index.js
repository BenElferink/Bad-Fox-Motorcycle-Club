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
        icon={Discord}
        onClick={onClick}
        style={{
          width: '100%',
          backgroundColor: 'var(--discord-purple)',
        }}
      />
    </Section>
  )
}
