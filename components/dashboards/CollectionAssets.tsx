import { useCallback, useEffect, useRef, useState } from 'react'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import formatIpfsImageUrl from '../../functions/formatters/formatIpfsImageUrl'
import AssetFilters from '../filters/AssetFilters'
import AssetCard from '../cards/AssetCard'
import { ADA_SYMBOL } from '../../constants'
import { JpgListedItem, PolicyId, PopulatedAsset, TraitsFile } from '../../@types'
import axios from 'axios'
import useWallet from '../../contexts/WalletContext'
import Loader from '../Loader'

const INITIAL_DISPLAY_AMOUNT = 20

export interface CollectionAssetsProps {
  policyId: PolicyId
  withListed?: boolean
  withWallet?: boolean
}

const CollectionAssets = (props: CollectionAssetsProps) => {
  const { policyId, withListed = false, withWallet = false } = props
  const { populatedWallet } = useWallet()

  const [fetching, setFetching] = useState(false)
  const [fetched, setFetched] = useState(false)
  const [traitsFile, setTraitsFile] = useState<TraitsFile>({})
  const [assetsFile, setAssetsFile] = useState<PopulatedAsset[]>([])

  const appendDefault = useCallback(async () => {
    setTraitsFile(getFileForPolicyId(policyId, 'traits') as TraitsFile)
    setAssetsFile(getFileForPolicyId(policyId, 'assets') as PopulatedAsset[])
  }, [policyId])

  const appendWallet = useCallback(async () => {
    setTraitsFile(getFileForPolicyId(policyId, 'traits') as TraitsFile)
    setAssetsFile(populatedWallet?.assets[policyId] as PopulatedAsset[])
  }, [policyId, populatedWallet?.assets])

  const fetchPricesAndAppendListed = useCallback(async () => {
    setFetching(true)

    try {
      const uri = `/api/market/${policyId}/listed`
      const { data } = await axios.get<{ count: number; items: JpgListedItem[] }>(uri)

      const traits = getFileForPolicyId(policyId, 'traits') as TraitsFile
      const assets = (getFileForPolicyId(policyId, 'assets') as PopulatedAsset[]).map((asset) => {
        const foundListing = data.items.find((listed) => listed.assetId === asset.assetId)
        return {
          ...asset,
          price: !!foundListing ? foundListing.price : 0,
        }
      })

      setTraitsFile(traits)
      setAssetsFile(assets)
      setFetched(true)
    } catch (error) {
      console.error(error)
      appendDefault()
    }

    setFetching(false)
  }, [policyId, appendDefault])

  useEffect(() => {
    if (!!withListed) {
      fetchPricesAndAppendListed()
    } else if (!!withWallet) {
      appendWallet()
    } else {
      appendDefault()
    }
  }, [withListed, withWallet, fetchPricesAndAppendListed, appendWallet, appendDefault])

  const [rendered, setRendered] = useState<PopulatedAsset[]>([])
  const [displayNum, setDisplayNum] = useState(INITIAL_DISPLAY_AMOUNT)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = (e: Event) => {
      // @ts-ignore
      const { pageYOffset, innerHeight } = e.composedPath()[1]
      const isScrolledToBottom = (bottomRef.current?.offsetTop || 0) <= pageYOffset + innerHeight

      if (isScrolledToBottom) {
        setDisplayNum((prev) => prev + INITIAL_DISPLAY_AMOUNT)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  return (
    <div className='w-screen flex flex-col-reverse md:flex-row items-center md:items-start'>
      <div className='w-full'>
        <div className='flex flex-row flex-wrap items-center justify-center'>
          {fetching ? (
            <Loader />
          ) : !rendered.length ? (
            <div className='text-lg'>None found...</div>
          ) : (
            rendered.map((asset, idx) =>
              idx < displayNum ? (
                <AssetCard
                  key={`collection-asset-${asset.assetId}-${idx}`}
                  onClick={() => {
                    window.open(`https://jpg.store/asset/${asset.assetId}`, '_blank', 'noopener')
                  }}
                  imageSrc={formatIpfsImageUrl(asset.image.ipfs, !!asset.rarityRank)}
                  title={asset.displayName}
                  subTitles={[
                    `Rank: ${asset.rarityRank}`,
                    asset.price ? `Listed: ${ADA_SYMBOL}${asset.price}` : 'Unlisted',
                  ]}
                />
              ) : null
            )
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      <AssetFilters
        traitsData={traitsFile}
        assetsData={assetsFile}
        withListed={!!withListed && !!fetched}
        callbackRendered={(arr) => setRendered(arr)}
      />
    </div>
  )
}

export default CollectionAssets
