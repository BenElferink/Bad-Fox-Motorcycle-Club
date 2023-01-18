import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import useWallet from '../../contexts/WalletContext'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import formatIpfsImageUrl from '../../functions/formatters/formatIpfsImageUrl'
import AssetFilters from '../filters/AssetFilters'
import AssetCard from '../cards/AssetCard'
import Loader from '../Loader'
import { ADA_SYMBOL, BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID } from '../../constants'
import { PolicyId, PopulatedAsset, TraitsFile } from '../../@types'
import { ResponsePolicyMarketListings } from '../../pages/api/policy/[policy_id]/market/listed'

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
      const uri = `/api/policy/${policyId}/market/listed`
      const { data } = await axios.get<ResponsePolicyMarketListings>(uri)

      const traits = getFileForPolicyId(policyId, 'traits') as TraitsFile
      const assets = (getFileForPolicyId(policyId, 'assets') as PopulatedAsset[]).map((asset) => {
        const foundListing = data.items.find((listed) => listed.assetId === asset.assetId)
        return {
          ...asset,
          price: !!foundListing ? foundListing.price : 0,
        }
      })

      for await (const listed of data.items) {
        const found = assets.find((asset) => asset.assetId === listed.assetId)

        if (!found) {
          const { data } = await axios.get<PopulatedAsset>(
            `/api/asset/${listed.assetId}/populate?policyId=${policyId}&withRanks=${
              policyId !== BAD_KEY_POLICY_ID
            }`
          )

          data.price = listed.price
          assets.push(data as typeof assets[0])
        }
      }

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
            rendered.map((asset, idx) => {
              if (idx >= displayNum) {
                return null
              }

              const keyAssetsFile = !!asset?.isBurned
                ? (getFileForPolicyId(BAD_KEY_POLICY_ID, 'assets') as PopulatedAsset[])
                : []

              const foundKey = keyAssetsFile.find(
                (key) =>
                  key.attributes[
                    policyId === BAD_FOX_POLICY_ID ? `Fox (${asset?.attributes?.Gender?.charAt(0)})` : 'Motorcycle'
                  ] === asset.displayName
              )

              return (
                <AssetCard
                  key={`collection-asset-${asset?.assetId}-${idx}`}
                  onClick={() => {
                    if (!!asset?.isBurned) {
                      window.open(`https://jpg.store/asset/${foundKey?.assetId}`, '_blank', 'noopener')
                    } else {
                      window.open(`https://jpg.store/asset/${asset?.assetId}`, '_blank', 'noopener')
                    }
                  }}
                  isBurned={!!asset?.isBurned}
                  title={asset?.displayName}
                  imageSrc={formatIpfsImageUrl(asset?.image?.ipfs || '/not-found.webp', !!asset?.rarityRank)}
                  tiedImageSrcs={
                    !!asset?.files?.length
                      ? asset.files
                          .filter((file) => file.mediaType === 'image/png')
                          .map((file) => ({
                            src: formatIpfsImageUrl(file.src, true),
                            name: `#${asset.attributes[file.name.replace('Bad ', '')].split('#')[1]}`,
                          }))
                      : []
                  }
                  subTitles={[
                    !!asset?.isBurned
                      ? 'Asset Transcended'
                      : !!asset?.rarityRank
                      ? `Rank: ${asset.rarityRank}`
                      : '',
                    !!asset?.isBurned
                      ? (foundKey?.displayName as string)
                      : !!withListed
                      ? asset?.price
                        ? `Listed: ${ADA_SYMBOL}${asset.price}`
                        : 'Unlisted'
                      : '',
                  ]}
                />
              )
            })
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      <AssetFilters
        policyId={policyId}
        traitsData={traitsFile}
        assetsData={assetsFile}
        withListed={!!withListed && !!fetched}
        withWallet={!!withWallet}
        callbackRendered={(arr) => setRendered(arr)}
      />
    </div>
  )
}

export default CollectionAssets
