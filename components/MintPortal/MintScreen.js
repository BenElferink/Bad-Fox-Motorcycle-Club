import { Fragment, useState } from 'react'
import BaseButton from '../BaseButton'
import ManualMint from './ManualMint'
import SignMint from './SignMint'
import styles from './MintPortal.module.css'

const MintScreen = ({ maxMints = 0, mintPrice = 0, mintAddress = 'None' }) => {
  const [mode, setMode] = useState('')

  return (
    <div className={styles.mintModal}>
      {mode === 'MANUAL' ? (
        <Fragment>
          <div className={styles.mintModalDevision}>
            <h4>
              You can mint up to {maxMints} NFTs for ₳{mintPrice} each.
            </h4>
            <p className='flex-col'>
              {new Array(maxMints).fill(null).map((v, i) => (
                <span key={`mint-option-${i}`}>
                  {i + 1}x cNFT = ₳{mintPrice * (i + 1)}
                </span>
              ))}
            </p>
          </div>

          <ManualMint mintAddress={mintAddress} />
          <BaseButton label='GO BACK' onClick={() => setMode('')} backgroundColor='var(--discord-purple)' />
        </Fragment>
      ) : mode === 'SIGN TX' ? (
        <Fragment>
          <div className={styles.mintModalDevision}>
            <h4>
              You can mint up to {maxMints} NFTs for ₳{mintPrice} each.
            </h4>
          </div>

          <SignMint maxMints={maxMints} mintPrice={mintPrice} mintAddress={mintAddress} />
          <BaseButton label='GO BACK' onClick={() => setMode('')} backgroundColor='var(--discord-purple)' />
        </Fragment>
      ) : (
        <Fragment>
          <div className={styles.mintModalDevision}>
            <h4>
              You can mint up to {maxMints} NFTs for ₳{mintPrice} each.
            </h4>
            <p>Please choose a minting method:</p>
          </div>

          <BaseButton label='MANUAL' onClick={() => setMode('MANUAL')} backgroundColor='var(--discord-purple)' />
          <BaseButton label='SIGN TX' onClick={() => setMode('SIGN TX')} backgroundColor='var(--discord-purple)' />
        </Fragment>
      )}
    </div>
  )
}

export default MintScreen
