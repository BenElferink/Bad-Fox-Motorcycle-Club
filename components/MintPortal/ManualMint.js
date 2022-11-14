import { useState } from 'react'
import BaseButton from '../BaseButton'

const ManualMint = ({ mintAddress }) => {
  const [isCopied, setIsCopied] = useState(false)

  const clickCopy = (value) => {
    if (!isCopied) {
      setIsCopied(true)
      navigator.clipboard.writeText(value)
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }

  return (
    <BaseButton
      label={isCopied ? 'COPIED 👍' : 'COPY MINT ADDRESS'}
      onClick={() => clickCopy(mintAddress)}
      backgroundColor='var(--discord-purple)'
    />
  )
}

export default ManualMint
