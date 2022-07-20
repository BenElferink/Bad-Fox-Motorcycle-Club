require('dotenv').config()
const fs = require('fs')
const Axios = require('axios')
const { FOX_POLICY_ID } = require('../constants/policy-ids')
const { BLOCKFROST_API_KEY } = require('../constants/api-keys')
const blockfrostJsonFile = require('../data/blockfrost')

const POLICY_ID = FOX_POLICY_ID
const BLOCKFROST_KEY = BLOCKFROST_API_KEY
const BLOCKFROST_API = 'https://cardano-mainnet.blockfrost.io/api/v0'

const run = async () => {
  const policyAssets = []
  const populatedAssets = blockfrostJsonFile?.assets ?? []

  try {
    console.log('getting all assets from blockfrost')
    for (let page = 1; true; page++) {
      console.log(`querying page number ${page}`)

      const { data: policyAssetsPagination } = await Axios.get(
        `${BLOCKFROST_API}/assets/policy/${POLICY_ID}?page=${page}`,
        {
          headers: {
            project_id: BLOCKFROST_KEY,
          },
        }
      )

      if (!policyAssetsPagination.length) {
        break
      }

      policyAssetsPagination.forEach((item) => {
        if (item.asset !== POLICY_ID) policyAssets.push(item)
      })
    }

    console.log(`got a total of ${policyAssets.length} assets from blockfrost`)
    console.log(`populating ${policyAssets.length} new assets`)

    for (let idx = 0; idx < policyAssets.length; idx++) {
      const { asset } = policyAssets[idx]

      if (!populatedAssets.find((item) => item.asset === asset)) {
        console.log(`idx: ${idx}, populating asset ${asset}`)

        const { data: populatedAsset } = await Axios.get(`${BLOCKFROST_API}/assets/${asset}`, {
          headers: {
            project_id: BLOCKFROST_KEY,
          },
        })

        populatedAssets.push(populatedAsset)
      }
    }

    console.log('sorting assets by #ID')
    populatedAssets.sort(
      (a, b) =>
        Number(a.onchain_metadata.name.replace('Bad Fox #', '')) -
        Number(b.onchain_metadata.name.replace('Bad Fox #', ''))
    )

    console.log(`saving ${populatedAssets.length} assets to JSON file`)
    fs.writeFileSync(
      './data/blockfrost.json',
      JSON.stringify({
        _wen: Date.now(),
        policyId: POLICY_ID,
        count: populatedAssets.length,
        assets: populatedAssets,
      }),
      'utf8'
    )

    console.log('done!')
  } catch (error) {
    console.error(error)
  }
}

run()
