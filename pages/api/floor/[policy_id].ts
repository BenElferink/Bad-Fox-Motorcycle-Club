import { NextApiRequest, NextApiResponse } from 'next'
import { firestore } from '../../../utils/firebase'
import BadApi from '../../../utils/badApi'
import isPolicyIdAllowed from '../../../functions/isPolicyIdAllowed'
import getFileForPolicyId from '../../../functions/getFileForPolicyId'
import { ADMIN_CODE } from '../../../constants'
import type { FloorPrices, PolicyId, PopulatedAsset, TraitsFile } from '../../../@types'

export interface FloorResponse {
  count: number
  items: {
    policyId: string
    timestamp: number
    floor: number
    attributes: FloorPrices
  }[]
}

const badApi = new BadApi()

const getFloorPrices = async (
  policyId: PolicyId
): Promise<{
  baseFloor: number
  attributesFloor: FloorPrices
}> => {
  const floorData: FloorPrices = {}
  const traitsData: Record<string, string[]> = {}

  const policyAssets = getFileForPolicyId(policyId, 'assets') as PopulatedAsset[]
  const policyTraits = getFileForPolicyId(policyId, 'traits') as TraitsFile

  Object.entries(policyTraits).forEach(([cat, traits]) => {
    traitsData[cat] = traits.map(({ onChainName }) => onChainName)
  })

  const listings = (await badApi.policy.market.getData(policyId)).items

  console.log('Detecting floor prices for every attribute')

  for (const category in traitsData) {
    // Looping through categories

    const traits = traitsData[category]
    for (const trait of traits) {
      // Looping through category traits

      for (const { tokenId, price } of listings) {
        // Lisitng sare already sorted by price, cheapest 1st
        const asset = policyAssets.find((asset) => asset.tokenId === tokenId)

        if (asset?.attributes[category] === trait) {
          // Found floor price for this trait

          if (!floorData[category]) {
            floorData[category] = { [trait]: price }
          } else {
            floorData[category][trait] = price
          }

          break
        }
      }
    }
  }

  console.log('Found all floor prices')

  return {
    baseFloor: listings[0]?.price || 0,
    attributesFloor: floorData,
  }
}

const handler = async (req: NextApiRequest, res: NextApiResponse<FloorResponse>) => {
  const { method, headers, query } = req

  const policyId = query.policy_id as PolicyId

  if (!isPolicyIdAllowed(policyId)) {
    return res.status(400).end(`This Policy ID is not allowed: ${policyId}`)
  }

  const live = !!query.live && query.live != 'false' && query.live != '0'
  const limit = (() => {
    const min = 1
    const max = 30
    const num = Number(query.limit)

    return isNaN(num) ? max : num >= min && num <= max ? num : max
  })()

  try {
    switch (method) {
      case 'GET': {
        if (live) {
          const timestamp = Date.now()
          const liveFloorPrices = await getFloorPrices(policyId)

          return res.status(200).json({
            count: 1,
            items: [
              {
                policyId,
                timestamp,
                floor: liveFloorPrices.baseFloor,
                attributes: liveFloorPrices.attributesFloor,
              },
            ],
          })
        }

        if (!limit || isNaN(limit)) {
          return res.status(400).end('Query params required (limit: number)')
        }

        const docsQuery = await firestore
          .collection('floor-snapshots')
          .orderBy('timestamp', 'asc')
          // .limit(limit * projects.length)
          .get()

        const docs = docsQuery.docs
          .map((doc) => doc.data())
          .filter((doc) => doc.policyId === policyId) as FloorResponse['items']

        while (docs.length > limit) {
          docs.shift()
        }

        return res.status(200).json({
          count: docs.length,
          items: docs,
        })
      }

      case 'HEAD': {
        const adminCode = headers.admin_code

        if (adminCode !== ADMIN_CODE) {
          return res.status(401).end()
        }

        const timestamp = Date.now()
        const liveFloorPrices = await getFloorPrices(policyId)

        const collection = firestore.collection('floor-snapshots')
        await collection.add({
          policyId,
          timestamp,
          floor: liveFloorPrices.baseFloor,
          attributes: liveFloorPrices.attributesFloor,
        })

        return res.status(204).end()
      }

      default: {
        res.setHeader('Allow', 'GET')
        res.setHeader('Allow', 'HEAD')
        return res.status(405).end()
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}

export default handler
