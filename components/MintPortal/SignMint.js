import { Fragment, useState } from 'react'
import { Transaction } from '@martifylabs/mesh'
import { toast } from 'react-hot-toast'
import useWallet from '../../contexts/WalletContext'
import ConnectWallet from '../ConnectWallet'
import BaseButton from '../BaseButton'
import styles from './MintPortal.module.css'

const SignMint = ({ maxMints, mintPrice, mintAddress }) => {
  const { connected, connectedManually, disconnectWallet, wallet } = useWallet()
  const [building, setBuilding] = useState(false)

  const clickSign = async (amount) => {
    setBuilding(true)

    try {
      const tx = new Transaction({ initiator: wallet })
      tx.sendLovelace(mintAddress, String(mintPrice * amount * 1000000))

      toast.loading('Building TX', { duration: 2000 })
      const unsignedTx = await tx.build()
      toast.loading('Awaiting signature', { duration: 2000 })
      const signedTx = await wallet.signTx(unsignedTx)
      toast.loading('Submitting TX', { duration: 2000 })
      const txHash = await wallet.submitTx(signedTx)

      toast.success(`Success! ${txHash}`, { duration: 4000 })
    } catch (error) {
      toast.error(error.message, { duration: 4000 })
      console.error(error)
    }

    setBuilding(false)
  }

  return !connected ? (
    <ConnectWallet modalOnly disableManual introText='Connect a wallet to mint your NFTs.' />
  ) : (
    <Fragment>
      {!connectedManually ? (
        new Array(maxMints)
          .fill(null)
          .map((v, i) => (
            <BaseButton
              key={`mint-option-${i}`}
              label={`${i + 1}x cNFT = ₳${mintPrice * (i + 1)}`}
              onClick={() => clickSign(i + 1)}
              backgroundColor='var(--discord-purple)'
              disabled={building}
            />
          ))
      ) : (
        <div className={styles.mintModalDevision}>
          ERROR! You connected manually, if you wish to build & sign a TX please reconnect in a non-manual way.
          <BaseButton label={'DISCONNECT'} onClick={disconnectWallet} backgroundColor='var(--discord-purple)' />
        </div>
      )}
    </Fragment>
  )
}

export default SignMint
