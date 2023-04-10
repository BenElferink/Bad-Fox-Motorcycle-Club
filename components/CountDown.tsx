import { Fragment, useState } from 'react'
import { useTimer } from 'react-timer-hook'

const AIRDROP_START_DATE_TIME = new Date('2023-04-20T16:00:00.000+00:00')
const HOLDERS_START_DATE_TIME = new Date('2023-04-20T18:00:00.000+00:00')
const WHITELIST_START_DATE_TIME = new Date('2023-04-20T20:00:00.000+00:00')
const PUBLIC_START_DATE_TIME = new Date('2023-04-20T22:00:00.000+00:00')

export default function CountDown({ callbackMintStarted }: { callbackMintStarted: () => void }) {
  const isItTime = (now: Date, target: Date) => now.getTime() >= target.getTime()

  const [isAirdropStarted, setIsAirdropStarted] = useState(isItTime(new Date(), AIRDROP_START_DATE_TIME))
  const [isHoldersStarted, setIsHoldersStarted] = useState(isItTime(new Date(), HOLDERS_START_DATE_TIME))
  const [isWhitelistStarted, setIsWhitelistStarted] = useState(isItTime(new Date(), WHITELIST_START_DATE_TIME))
  const [isPublicStarted, setIsPublicStarted] = useState(isItTime(new Date(), PUBLIC_START_DATE_TIME))

  const triggerStates = () => {
    const nowDate = new Date()

    const isItAirdropTime = isItTime(nowDate, AIRDROP_START_DATE_TIME)
    const isItHoldersTime = isItTime(nowDate, HOLDERS_START_DATE_TIME)
    const isItWhitelistTime = isItTime(nowDate, WHITELIST_START_DATE_TIME)
    const isItPublicTime = isItTime(nowDate, PUBLIC_START_DATE_TIME)

    setIsAirdropStarted(isItAirdropTime)
    setIsHoldersStarted(isItHoldersTime)
    setIsWhitelistStarted(isItWhitelistTime)
    setIsPublicStarted(isItPublicTime)

    if (isItHoldersTime || isItWhitelistTime || isItPublicTime) {
      callbackMintStarted()
    }
  }

  const airdropTimer = useTimer({
    expiryTimestamp: AIRDROP_START_DATE_TIME,
    onExpire: () => triggerStates(),
  })

  const holdersTimer = useTimer({
    expiryTimestamp: HOLDERS_START_DATE_TIME,
    onExpire: () => triggerStates(),
  })

  const whitelistTimer = useTimer({
    expiryTimestamp: WHITELIST_START_DATE_TIME,
    onExpire: () => triggerStates(),
  })

  const publicTimer = useTimer({
    expiryTimestamp: PUBLIC_START_DATE_TIME,
    onExpire: () => triggerStates(),
  })

  const activeTimer = !isAirdropStarted
    ? airdropTimer
    : !isHoldersStarted
    ? holdersTimer
    : !isWhitelistStarted
    ? whitelistTimer
    : publicTimer

  return (
    <div className='text-center'>
      {!isAirdropStarted ? (
        <Fragment>
          <h4>Countdown to airdrop</h4>
        </Fragment>
      ) : !isHoldersStarted ? (
        <Fragment>
          <h4 className='text-sm'>Airdrop is live</h4>
          <h4>Countdown to holders mint</h4>
        </Fragment>
      ) : !isWhitelistStarted ? (
        <Fragment>
          <h4 className='text-sm'>Holders mint is live</h4>
          <h4>Countdown to whitelist mint</h4>
        </Fragment>
      ) : !isPublicStarted ? (
        <Fragment>
          <h4 className='text-sm'>Whitelist mint is live</h4>
          <h4>Countdown to public mint</h4>
        </Fragment>
      ) : isPublicStarted ? (
        <Fragment>
          <h4>Public mint is live</h4>
        </Fragment>
      ) : null}

      <table>
        <thead>
          <tr>
            <th className='text-xs font-light'>Days</th>
            <th className='text-xs font-light'></th>
            <th className='text-xs font-light'>Hours</th>
            <th className='text-xs font-light'></th>
            <th className='text-xs font-light'>Minutes</th>
            <th className='text-xs font-light'></th>
            <th className='text-xs font-light'>Seconds</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className='text-4xl font-light'>{`${activeTimer.days < 10 ? '0' : ''}${activeTimer.days}`}</td>
            <td className='text-4xl font-light'>:</td>
            <td className='text-4xl font-light'>{`${activeTimer.hours < 10 ? '0' : ''}${activeTimer.hours}`}</td>
            <td className='text-4xl font-light'>:</td>
            <td className='text-4xl font-light'>{`${activeTimer.minutes < 10 ? '0' : ''}${
              activeTimer.minutes
            }`}</td>
            <td className='text-4xl font-light'>:</td>
            <td className='text-4xl font-light'>{`${activeTimer.seconds < 10 ? '0' : ''}${
              activeTimer.seconds
            }`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
