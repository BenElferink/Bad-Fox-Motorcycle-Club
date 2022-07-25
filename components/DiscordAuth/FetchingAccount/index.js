import React from 'react'
import Landing from '../../Landing'
import Section from '../../Section'
import Loader from '../../Loader'

const DiscordFetchingAccount = () => {
  return (
    <Landing>
      <Section>
        <h2>Please wait while we retrieve your account...</h2>
        <Loader />
      </Section>
    </Landing>
  )
}

export default DiscordFetchingAccount
