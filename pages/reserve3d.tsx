import { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { CheckIcon, NoSymbolIcon } from '@heroicons/react/24/solid'
import { firestore } from '../utils/firebase'
import useWallet from '../contexts/WalletContext'
import WalletConnect from '../components/Wallet/WalletConnect'
import ImageLoader from '../components/Loader/ImageLoader'
import { APRIL_20_BLOCK, BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID } from '../constants'
import avatarRendersFile from '../data/3D/fox-png.json'
import avatarAssetsFile from '../data/assets/bad-fox-3d.json'

interface ChoiceItem {
  name: string
  num: number
  src: string
}

interface Reservation {
  stakeKey: string
  serialNumbers: number[]
}

const Reserve3D = () => {
  const { populatedWallet } = useWallet()
  const [loading, setLoading] = useState(false)
  const [numberOfChoices, setNumberOfChoices] = useState(0)
  const [reserved, setReserved] = useState<number[]>([])
  const [availableChoices, setAvailableChoices] = useState<ChoiceItem[]>([])

  const syncWalletReservations = async (stakeKey: string, choices: ChoiceItem[]): Promise<void> => {
    try {
      const collection = firestore.collection('reservations')
      const collectionQuery = await collection.where('stakeKey', '==', stakeKey).get()

      if (collectionQuery.docs.length) {
        const documentId = collectionQuery.docs[0].id
        const thisDoc = collectionQuery.docs[0].data() as Reservation

        const okReserves: number[] = []
        ;(thisDoc?.serialNumbers || []).forEach((num) => {
          const choiceIdx = choices.findIndex((item) => item.num === num)

          if (choiceIdx !== -1) {
            okReserves.push(num)
          }
        })

        // remove unowned assets from db reservations
        await collection.doc(documentId).update({
          serialNumbers: thisDoc.serialNumbers.filter((num) => okReserves.includes(num)),
        })

        // update local states with approved reserves
        setReserved(okReserves)
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  const handleClickAsset = async (stakeKey: string, serialNumber: number, alreadyReserved: boolean) => {
    if (loading) {
      return
    }

    if (reserved.length >= numberOfChoices && !alreadyReserved) {
      toast.error('Reached maximum reservations!')
      return
    }

    setLoading(true)
    toast.loading('Processing...')

    try {
      const collection = firestore.collection('reservations')
      const collectionQuery = await collection.where('stakeKey', '==', stakeKey).get()

      if (!collectionQuery.docs.length) {
        await collection.add({
          stakeKey,
          serialNumbers: [serialNumber],
        })
      } else {
        const documentId = collectionQuery.docs[0].id
        const thisDoc = collectionQuery.docs[0].data() as Reservation

        await collection.doc(documentId).update({
          serialNumbers: !alreadyReserved
            ? // add this
              [...thisDoc.serialNumbers, serialNumber].sort((a, b) => a - b)
            : // remove this
              thisDoc.serialNumbers.filter((num) => num !== serialNumber),
        })
      }

      await syncWalletReservations(stakeKey, availableChoices)

      toast.dismiss()
      toast.success('Done!')
    } catch (error: any) {
      console.error(error)

      toast.dismiss()
      toast.error(error.message)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (populatedWallet) {
      const payload: {
        name: string
        num: number
        src: string
      }[] = []

      populatedWallet.assets[BAD_FOX_POLICY_ID].forEach((asset) => {
        let name = String(asset.serialNumber)
        while (name.length < 4) name = `0${name}`
        name = `Bad Fox #${name}`

        payload.push({
          name: name.replace('Bad', '3D'),
          num: asset.serialNumber as number,
          // @ts-ignore
          src: avatarRendersFile[`${name}.png`],
        })
      })

      populatedWallet.assets[BAD_KEY_POLICY_ID].forEach((asset) => {
        const maleNumber = Number(asset.attributes['Fox (M)'].split('#')[1])

        let maleName = String(maleNumber)
        while (maleName.length < 4) maleName = `0${maleName}`
        maleName = `Bad Fox #${maleName}`

        payload.push({
          name: maleName.replace('Bad', '3D'),
          num: maleNumber,
          // @ts-ignore
          src: avatarRendersFile[`${maleName}.png`],
        })

        const femaleNumber = Number(asset.attributes['Fox (F)'].split('#')[1])

        let femaleName = String(femaleNumber)
        while (femaleName.length < 4) femaleName = `0${femaleName}`
        femaleName = `Bad Fox #${femaleName}`

        payload.push({
          name: femaleName.replace('Bad', '3D'),
          num: femaleNumber,
          // @ts-ignore
          src: avatarRendersFile[`${femaleName}.png`],
        })
      })

      const _numOfChoices = populatedWallet.assets[BAD_KEY_POLICY_ID].reduce((count, curr) => {
        if (curr.mintBlockHeight) {
          if (curr.mintBlockHeight < APRIL_20_BLOCK) {
            count += 1
          } else {
            count += 2
          }
        }

        return count
      }, 0)

      const _availableChoices = payload.sort((a, b) => a.num - b.num)

      setNumberOfChoices(_numOfChoices)
      setAvailableChoices(_availableChoices)
      syncWalletReservations(populatedWallet.stakeKey, _availableChoices)
    }
  }, [populatedWallet])

  return (
    <div className='flex flex-col items-center'>
      <h2 className='text-center text-xl'>
        You reserved{' '}
        <strong className='text-gray-200'>
          {reserved.length} / {numberOfChoices}
        </strong>{' '}
        free airdrops!
        <br />
      </h2>

      {reserved.length > numberOfChoices ? (
        <p className='my-4 text-center text-sm text-[var(--pink)]'>
          <strong>Oh oh! Your reservation(s) are over-extended.</strong>
          <br />
          Please remove {reserved.length - numberOfChoices} reservation(s).
          <br />
          If you don&apos;t, we will have to do so on your behalf.
        </p>
      ) : (
        <p className='my-4 text-center text-sm'>
          Reserve your avatars by clicking on them.
          <br />
          If you do not reserve {numberOfChoices} avatars, the remaining airdrops will be random.
          <br />
          If you do not own the asset at the time of the airdrop, the reservation will cancel.
        </p>
      )}

      <div className='flex flex-wrap items-center justify-center px-4 md:px-0'>
        {availableChoices.map((item) => {
          const isReserved = reserved.findIndex((num) => num === item.num) !== -1
          const isAirdropped = avatarAssetsFile.assets.findIndex((x) => x.serialNumber === item.num) !== -1

          return (
            <button
              key={item.name}
              onClick={() => handleClickAsset(populatedWallet?.stakeKey as string, item.num, reserved.findIndex((num) => num === item.num) !== -1)}
              disabled={loading || isAirdropped}
              className='relative flex flex-col items-center justify-center max-w-[350px] max-h-[350px] w-full h-full m-2 md:m-4 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700 cursor-pointer disabled:cursor-not-allowed'
            >
              {isReserved ? (
                <div className='w-full h-full absolute top-0 left-0 z-20 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-xl'>
                  <CheckIcon className='w-2/3 h-2/3 text-green-400' />
                </div>
              ) : isAirdropped ? (
                <div className='w-full h-full absolute top-0 left-0 z-20 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-xl'>
                  <NoSymbolIcon className='w-2/3 h-2/3 text-red-400' />
                </div>
              ) : null}

              <span className='absolute top-1 left-2 z-20 text-black text-lg'>{item.name}</span>

              <ImageLoader src={item.src} alt={item.name} width={500} height={500} loaderSize={150} style={{ borderRadius: '0.75rem' }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

const Page = () => {
  const { connected, connectedManually, disconnectWallet } = useWallet()

  // return (
  //   <div className='flex flex-col items-center'>
  //     <p className='pt-[5vh] text-center text-lg text-[var(--pink)]'>3D reservations are closed.</p>
  //   </div>
  // )

  if (connectedManually) {
    return (
      <div className='flex flex-col items-center'>
        <p className='pt-[5vh] text-center text-lg text-[var(--pink)]'>
          Error! You connected manually.
          <br />
          Please re-connect in a non-manual way.
        </p>

        <button
          onClick={disconnectWallet}
          className='p-1 px-2 mt-2 bg-red-900 hover:bg-red-700 bg-opacity-50 hover:bg-opacity-50 rounded-xl border border-red-900 hover:border-red-700 text-base hover:text-gray-200'
        >
          Disconnect Wallet
        </button>
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center'>
      {!connected ? (
        <Fragment>
          <WalletConnect introText='Connect to reserve your NFTs.' />
          <p className='pt-[15vh] text-center text-xl text-[var(--pink)]'>Not connected.</p>
        </Fragment>
      ) : (
        <Reserve3D />
      )}
    </div>
  )
}

export default Page
