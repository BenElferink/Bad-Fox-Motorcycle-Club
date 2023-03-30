'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import useWallet from '../../contexts/WalletContext'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import formatIpfsImageUrl from '../../functions/formatters/formatIpfsImageUrl'
import AssetFilters from '../filters/AssetFilters'
import AssetCard from '../cards/AssetCard'
import CopyChip from '../CopyChip'
import Loader from '../Loader'
import Modal from '../layout/Modal'
import ImageLoader from '../Loader/ImageLoader'
import ModelViewer from '../models/ModelViewer'
import { ADA_SYMBOL, BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../constants'
import { AssetIncludedFile, PolicyId, PopulatedAsset, TraitsFile } from '../../@types'
import { ResponsePolicyMarketListings } from '../../pages/api/policy/[policy_id]/market/listed'
import Image from 'next/image'

interface AssetModalContentProps {
  policyId: string
  asset: PopulatedAsset
  withWallet: boolean
}

const AssetModalContent = (props: AssetModalContentProps) => {
  const { policyId, asset, withWallet } = props

  const [boughtAtPrice, setBoughtAtPrice] = useState(0)
  const [badKeyIdOfBurnedAsset, setBadKeyIdOfBurnedAsset] = useState('')
  const [displayedFile, setDisplayedFile] = useState<AssetIncludedFile>(
    asset.files.length
      ? asset.files[0]
      : {
          name: asset.displayName,
          mediaType: 'image/png',
          src: asset.image.ipfs,
        }
  )

  useEffect(() => {
    const { isBurned, displayName, attributes } = asset

    if (isBurned) {
      const badKeyTraitCategory =
        policyId === BAD_FOX_POLICY_ID
          ? `Fox (${
              // translates to : M || F
              attributes.Gender?.charAt(0)
            })`
          : 'Motorcycle'

      const badKeyAssetsFile = getFileForPolicyId(BAD_KEY_POLICY_ID, 'assets') as PopulatedAsset[]
      const foundBadKey = badKeyAssetsFile.find(
        (badKey) => badKey.attributes[badKeyTraitCategory] === displayName
      ) as PopulatedAsset

      setBadKeyIdOfBurnedAsset(foundBadKey.assetId)
    }

    if (withWallet) {
      const stored = localStorage.getItem(`asset-price-${asset.assetId}`)
      const storedPrice = stored ? JSON.parse(stored) : 0
      const storedPriceNum = Number(storedPrice)

      if (storedPrice && !isNaN(storedPriceNum)) {
        setBoughtAtPrice(storedPriceNum)
      } else {
        axios.get(`/api/asset/${asset.assetId}/market/history`).then(({ data: { price } }) => {
          if (price) {
            setBoughtAtPrice(price)
          }
        })
      }
    }
  }, [policyId, asset, withWallet])

  return (
    <div className='flex flex-col lg:flex-row lg:justify-between md:px-6'>
      <div>
        {displayedFile.mediaType === 'image/png' ? (
          <button
            onClick={() =>
              window.open(
                formatIpfsImageUrl({
                  ipfsUri: displayedFile.src,
                  hasRank: false,
                }),
                '_blank',
                'noopener noreferrer'
              )
            }
            className='w-[80vw] md:w-[555px]'
          >
            <ImageLoader
              src={formatIpfsImageUrl({
                ipfsUri: displayedFile.src,
                hasRank: false,
              })}
              alt={displayedFile.name}
              width={1000}
              height={1000}
              loaderSize={150}
              style={{ borderRadius: '1rem' }}
            />
          </button>
        ) : displayedFile.mediaType === 'model/gltf-binary' ? (
          <button onClick={() => {}} className='w-[80vw] md:w-[555px]'>
            <div className='w-[100%] h-[80vw] md:w-[555px] md:h-[555px] bg-gray-900 bg-opacity-50 rounded-2xl border border-gray-700'>
              <ModelViewer
                src={formatIpfsImageUrl({
                  ipfsUri: displayedFile.src,
                  is3D: true,
                })}
              />
            </div>
          </button>
        ) : (
          <button onClick={() => {}} className='w-[80vw] md:w-[555px]'>
            <div className='w-[100%] h-[80vw] md:w-[555px] md:h-[555px] bg-gray-900 bg-opacity-50 rounded-2xl border border-gray-700'>
              Unhandled file type:
              <br />
              {displayedFile.mediaType}
            </div>
          </button>
        )}

        <div className='flex flex-wrap items-center'>
          {asset.files.length
            ? asset.files.map((file) =>
                file.src !== displayedFile.src ? (
                  <button
                    key={`file-${file.src}`}
                    onClick={() => setDisplayedFile(file)}
                    className='w-32 h-32 m-1'
                  >
                    {file.mediaType === 'image/png' ? (
                      <ImageLoader
                        src={formatIpfsImageUrl({
                          ipfsUri: file.src,
                          hasRank: !!asset.rarityRank,
                        })}
                        alt={file.name}
                        width={150}
                        height={150}
                        style={{ flex: 0.42, borderRadius: '1rem' }}
                      />
                    ) : file.mediaType === 'model/gltf-binary' ? (
                      <div className='w-full h-full bg-gray-900 bg-opacity-50 rounded-2xl border border-gray-700'>
                        <ModelViewer
                          src={formatIpfsImageUrl({
                            ipfsUri: file.src,
                            is3D: true,
                          })}
                          freeze
                        />
                      </div>
                    ) : (
                      <div className='w-full h-full bg-gray-900 bg-opacity-50 rounded-2xl border border-gray-700'>
                        Unhandled file type:
                        <br />
                        {displayedFile.mediaType}
                      </div>
                    )}
                  </button>
                ) : null
              )
            : null}
        </div>
      </div>

      <div className='mt-2 lg:mt-0 lg:ml-6'>
        <div className='my-1'>
          <CopyChip prefix='Policy ID' value={policyId} />
        </div>
        <div className='my-1'>
          <CopyChip prefix='Asset ID' value={asset.assetId} />
        </div>

        {withWallet ? (
          <div className='mt-1 flex items-center'>
            <p className='mx-2 whitespace-nowrap'>Bought for:</p>
            <input
              value={boughtAtPrice}
              onChange={(e) => {
                const val = Number(e.target.value)

                if (!isNaN(val)) {
                  localStorage.setItem(`asset-price-${asset.assetId}`, String(val))
                  setBoughtAtPrice(val)
                }
              }}
              className='w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-sm hover:bg-gray-700 hover:border-gray-500 hover:text-white'
            />
          </div>
        ) : null}

        <table className='mx-2 my-4 border-collapse'>
          <thead>
            <tr>
              <th className='pr-2 text-xs text-start truncate'>Trait Category</th>
              <th className='pl-2 text-xs text-start truncate'>Trait Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(asset.attributes).map(([category, trait]) => (
              <tr key={`attribute-${category}-${trait}`}>
                <td className='pr-2 text-xs text-start truncate'>{category}</td>
                <td className='pl-2 text-xs text-start truncate'>{trait}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {badKeyIdOfBurnedAsset ? (
          <button
            onClick={() =>
              window.open(`https://www.jpg.store/asset/${badKeyIdOfBurnedAsset}`, '_blank', 'noopener noreferrer')
            }
            className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded'
          >
            <Image unoptimized src='/media/fire.gif' alt='' width={30} height={30} className='mr-2' />
            Corresponding Bad Key
          </button>
        ) : null}

        <button
          onClick={() => window.open(`https://pool.pm/${asset.fingerprint}`, '_blank', 'noopener noreferrer')}
          className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
        >
          <Image unoptimized src='/media/icon/poolpm.png' alt='' width={30} height={30} className='mr-2' />
          pool.pm
        </button>

        <button
          onClick={() => window.open(`https://flipr.io/asset/${asset.assetId}`, '_blank', 'noopener noreferrer')}
          className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
        >
          <Image unoptimized src='/media/icon/flipr.png' alt='' width={30} height={30} className='mr-2' />
          Flipr
        </button>

        <button
          onClick={() =>
            window.open(`https://www.jpg.store/asset/${asset.assetId}`, '_blank', 'noopener noreferrer')
          }
          className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
        >
          <Image unoptimized src='/media/icon/jpgstore.png' alt='' width={30} height={30} className='mr-2' />
          JPG Store
        </button>

        {asset.rarityRank ? (
          <button
            onClick={() =>
              window.open(
                `https://cnft.tools/${
                  policyId === BAD_FOX_POLICY_ID
                    ? 'badfoxmotorcycleclub'
                    : policyId === BAD_MOTORCYCLE_POLICY_ID
                    ? 'bfmcbadmotorcycle'
                    : policyId === BAD_MOTORCYCLE_POLICY_ID
                    ? 'badfoxmotorcycleclubbadkey'
                    : ''
                }?asset=${asset.onChainName}`,
                '_blank',
                'noopener noreferrer'
              )
            }
            className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
          >
            <Image unoptimized src='/media/icon/cnfttools.png' alt='' width={30} height={30} className='mr-2' />
            CNFT Tools
          </button>
        ) : null}

        <button
          onClick={() =>
            window.open(
              `https://www.cnftjungle.io/asset/${policyId}.${asset.onChainName}`,
              '_blank',
              'noopener noreferrer'
            )
          }
          className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
        >
          <Image unoptimized src='/media/icon/cnftjungle.png' alt='' width={30} height={30} className='mr-2' />
          CNFT Jungle
        </button>

        <button
          onClick={() =>
            window.open(
              `https://opencnft.io/${
                policyId === BAD_FOX_POLICY_ID
                  ? 'bad-fox-motorcycle-club-fox-collection'
                  : policyId === BAD_MOTORCYCLE_POLICY_ID
                  ? 'bad-fox-motorcycle-club-bad-motorcycle'
                  : policyId === BAD_MOTORCYCLE_POLICY_ID
                  ? 'bad-fox-motorcycle-club-bad-key'
                  : ''
              }/asset/${asset.fingerprint}`,
              '_blank',
              'noopener noreferrer'
            )
          }
          className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
        >
          <Image unoptimized src='/media/icon/opencnft.png' alt='' width={30} height={30} className='mr-2' />
          Open CNFT
        </button>
      </div>
    </div>
  )
}

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
      const {
        data: { items: listedItems },
      } = await axios.get<ResponsePolicyMarketListings>(`/api/policy/${policyId}/market/listed`)

      const traits = getFileForPolicyId(policyId, 'traits') as TraitsFile
      const assets = (getFileForPolicyId(policyId, 'assets') as PopulatedAsset[]).map((asset) => {
        const foundListing = listedItems.find((listed) => listed.assetId === asset.assetId)
        return {
          ...asset,
          price: !!foundListing ? foundListing.price : 0,
        }
      })

      for await (const listed of listedItems) {
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
    if (withListed) {
      fetchPricesAndAppendListed()
    } else if (withWallet) {
      appendWallet()
    } else {
      appendDefault()
    }
  }, [withListed, withWallet, fetchPricesAndAppendListed, appendWallet, appendDefault])

  const [rendered, setRendered] = useState<PopulatedAsset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<PopulatedAsset | null>(null)
  // TODO : setDisplayNum using the window width and/or height
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

              return (
                <AssetCard
                  key={`collection-asset-${asset.assetId}-${idx}`}
                  onClick={() => setSelectedAsset(asset)}
                  isBurned={asset.isBurned}
                  title={asset.displayName}
                  imageSrc={formatIpfsImageUrl({
                    ipfsUri: asset.image.ipfs,
                    hasRank: !!asset.rarityRank,
                  })}
                  tiedImageSrcs={
                    asset.files?.length
                      ? asset.files
                          .filter((file) => file.mediaType === 'image/png')
                          .map((file) => ({
                            src: formatIpfsImageUrl({
                              ipfsUri: file.src,
                              hasRank: true,
                            }),
                            name: `#${asset.attributes[file.name.replace('Bad ', '')].split('#')[1]}`,
                          }))
                      : []
                  }
                  subTitles={
                    asset.isBurned
                      ? ['Asset Burned']
                      : [
                          asset.rarityRank ? `Rank: ${asset.rarityRank}` : '',
                          withListed ? (asset.price ? `Listed: ${ADA_SYMBOL}${asset.price}` : 'Unlisted') : '',
                        ]
                  }
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
        withListed={withListed && fetched}
        withWallet={withWallet}
        callbackRendered={(arr) => setRendered(arr)}
      />

      {selectedAsset ? (
        <Modal title={selectedAsset.displayName} open onClose={() => setSelectedAsset(null)}>
          <AssetModalContent policyId={policyId} asset={selectedAsset} withWallet={withWallet} />
        </Modal>
      ) : null}
    </div>
  )
}

export default CollectionAssets
