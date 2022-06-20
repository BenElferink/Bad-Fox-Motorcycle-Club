import { Fragment } from 'react'
import { useTimer } from 'react-timer-hook'
import { useMint } from '../../contexts/MintContext'
import styles from './CountDown.module.css'

export default function CountDown() {
  const { PRE_SALE_DATE_TIME, PUBLIC_SALE_DATE_TIME, isPreSaleOnline, isPublicSaleOnline, triggerMintStates } = useMint()

  const preSaleTimer = useTimer({
    expiryTimestamp: PRE_SALE_DATE_TIME,
    onExpire: () => triggerMintStates(),
  })

  const publicSaleTimer = useTimer({
    expiryTimestamp: PUBLIC_SALE_DATE_TIME,
    onExpire: () => triggerMintStates(),
  })

  const activeTimer = isPreSaleOnline ? publicSaleTimer : preSaleTimer

  return (
    <div className={styles.root}>
      {!isPreSaleOnline && !isPublicSaleOnline ? (
        <Fragment>
          <h4 className={styles.headingBig}>Countdown to OG & WL sale</h4>
        </Fragment>
      ) : isPreSaleOnline && !isPublicSaleOnline ? (
        <Fragment>
          <h4 className={styles.headingSmall}>OG & WL sale is live</h4>
          <h4 className={styles.headingBig}>Countdown to Public sale</h4>
        </Fragment>
      ) : !isPreSaleOnline && isPublicSaleOnline ? (
        <Fragment>
          <h4 className={styles.headingBig}>Public sale is live</h4>
        </Fragment>
      ) : null}

      <table>
        <thead>
          <tr>
            <th className={styles.title}>Days</th>
            <th className={styles.title}></th>
            <th className={styles.title}>Hours</th>
            <th className={styles.title}></th>
            <th className={styles.title}>Minutes</th>
            <th className={styles.title}></th>
            <th className={styles.title}>Seconds</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={styles.integer}>{`${activeTimer.days < 10 ? '0' : ''}${activeTimer.days}`}</td>
            <td className={styles.colon}>:</td>
            <td className={styles.integer}>{`${activeTimer.hours < 10 ? '0' : ''}${activeTimer.hours}`}</td>
            <td className={styles.colon}>:</td>
            <td className={styles.integer}>{`${activeTimer.minutes < 10 ? '0' : ''}${activeTimer.minutes}`}</td>
            <td className={styles.colon}>:</td>
            <td className={styles.integer}>{`${activeTimer.seconds < 10 ? '0' : ''}${activeTimer.seconds}`}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
