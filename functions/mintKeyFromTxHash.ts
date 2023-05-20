import { AppWallet, BlockfrostProvider, ForgeScript, Mint, Transaction } from '@meshsdk/core'
import { PopulatedAsset } from '../@types'
import {
  BAD_FOX_POLICY_ID,
  BAD_KEY_POLICY_ID,
  BAD_KEY_SIGNING_KEY,
  BAD_MOTORCYCLE_POLICY_ID,
  BLOCKFROST_API_KEY,
} from '../constants'
import BadApi from '../utils/badApi'
import getFileForPolicyId from './getFileForPolicyId'
import toHex from './formatters/hex/toHex'

const SLOT = '112468367'
const KEY_HASH = '578c9f433b0bfe8f2c90fd9ff9b4e76391f04ac4ead2c760daceeaf5'

const mintKeyFromTxHash = async (txHash: string) => {
  const badApi = new BadApi()
  const txData = await badApi.transaction.getData(txHash, { withUtxos: true })

  if (!txData) {
    throw new Error('TX not submitted yet')
  }

  let selectedBike = ''
  let selectedMale = ''
  let selectedFemale = ''
  let recipientAddress = ''

  const foxes = getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets') as PopulatedAsset[]
  const bikes = getFileForPolicyId(BAD_MOTORCYCLE_POLICY_ID, 'assets') as PopulatedAsset[]

  let thisMale = undefined
  let thisFemale = undefined

  for (const utxo of txData.utxos || []) {
    for (const { tokenId } of utxo.tokens) {
      console.log(tokenId)

      if (tokenId.indexOf(BAD_FOX_POLICY_ID) == 0) {
        const foundToken = foxes.find((item) => item.tokenId === tokenId)

        if (foundToken) {
          if (foundToken?.attributes['Gender'] === 'Female') {
            selectedFemale = tokenId
            thisFemale = foundToken
          } else {
            selectedMale = tokenId
            thisMale = foundToken
          }
        }
      }

      if (tokenId.indexOf(BAD_MOTORCYCLE_POLICY_ID) == 0) {
        selectedBike = tokenId
        recipientAddress = utxo.address.from
      }
    }
  }

  thisMale = foxes.find((item) => item.tokenId === selectedMale)
  thisFemale = foxes.find((item) => item.tokenId === selectedFemale)
  const thisBike = bikes.find((item) => item.tokenId === selectedBike)

  if (!thisMale || !thisFemale || !thisBike) {
    throw new Error('Missing required asset(s) from TX')
  }

  const badKeyPayload: Mint = {
    label: '721',
    assetName: `BadKey${thisBike?.tokenName?.display.split('#')[1]}`,
    assetQuantity: '1',
    metadata: {
      project: 'Bad Fox Motorcycle Club',
      collection: 'Bad Key',
      name: `Bad Key #${thisBike?.tokenName?.display.split('#')[1]}`,
      website: 'https://badfoxmc.com',
      twitter: 'https://twitter.com/BadFoxMC',
      image: 'QmRG8ATFNgtcohy7vtkciToGazzw4ngG3wKCQUFH5hR4UT',
      mediaType: 'image/png',
      files: [
        {
          mediaType: 'model/gltf-binary',
          name: 'Bad Key',
          src: 'ipfs://QmZyzAGjdbHbxYYiKhvgR18TmTF6UiYEDTQjSAjdnEKQNg',
        },
        {
          mediaType: 'image/png',
          name: 'Bad Motorcycle',
          src: thisBike?.image.ipfs,
        },
        {
          mediaType: 'image/png',
          name: 'Bad Fox (M)',
          src: thisMale?.image.ipfs,
        },
        {
          mediaType: 'image/png',
          name: 'Bad Fox (F)',
          src: thisFemale?.image.ipfs,
        },
      ],
      attributes: {
        'Fox (F)': thisFemale?.tokenName?.display,
        'Fox (M)': thisMale?.tokenName?.display,
        Motorcycle: thisBike?.tokenName?.display,
      },
    },
    recipient: recipientAddress,
  }

  try {
    const tokenId = `${BAD_KEY_POLICY_ID}${toHex(badKeyPayload.assetName)}`
    const foundToken = await badApi.token.getData(tokenId)

    if (!!foundToken) {
      throw new Error('Already minted this!')
    }
  } catch (error) {
    // Token not found:
    // THIS IS OK!
  }

  const blockchainProvider = new BlockfrostProvider(BLOCKFROST_API_KEY)

  const _wallet = new AppWallet({
    networkId: 1,
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    key: {
      type: 'cli',
      payment: BAD_KEY_SIGNING_KEY,
    },
  })

  const _script = ForgeScript.fromNativeScript({
    type: 'all',
    scripts: [
      { type: 'before', slot: SLOT },
      { type: 'sig', keyHash: KEY_HASH },
    ],
  })

  const _tx = new Transaction({ initiator: _wallet })

  _tx.setTimeToExpire(SLOT)
  _tx.mintAsset(_script, badKeyPayload)

  const _unsigTx = await _tx.build()
  const _sigTx = await _wallet.signTx(_unsigTx)
  const _txHash = await _wallet.submitTx(_sigTx)

  return _txHash
}

export default mintKeyFromTxHash
