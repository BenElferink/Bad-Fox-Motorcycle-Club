import { useRouter } from 'next/router'
import React from 'react'
import Landing from '../../Landing'
import Section from '../../Section'
import BaseButton from '../../BaseButton'

const DiscordNotAuthorized = () => {
  const router = useRouter()

  const clickLogin = () => {
    router.push(router.asPath.indexOf('/redirect') !== -1 ? router.asPath.replace('/redirect', '') : '/')
  }

  return (
    <Landing>
      <Section>
        <h2>You are not authorized!</h2>
        <p>You need to be logged in with Discord in order to continue</p>

        <BaseButton
          label='GO BACK'
          onClick={clickLogin}
          backgroundColor='var(--discord-purple)'
          style={{ width: '100%' }}
        />
      </Section>
    </Landing>
  )
}

export default DiscordNotAuthorized
