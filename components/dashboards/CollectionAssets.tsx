'use client'
import Image from 'next/image'
import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { FolderArrowDownIcon } from '@heroicons/react/24/solid'
import BadApi from '../../utils/badApi'
import useWallet from '../../contexts/WalletContext'
import getFileForPolicyId from '../../functions/getFileForPolicyId'
import formatIpfsImageUrl from '../../functions/formatters/formatIpfsImageUrl'
import AssetFilters from '../filters/AssetFilters'
import AssetCard from '../cards/AssetCard'
import CopyChip from '../CopyChip'
import Loader from '../Loader'
import Modal from '../layout/Modal'
import ImageLoader from '../Loader/ImageLoader'
import GlbViewer from '../models/google/GlbViewer'
import TPoseModel from '../models/three/fbx/TPoseModel'
import { ADA_SYMBOL, BAD_FOX_3D_POLICY_ID, BAD_FOX_POLICY_ID, BAD_KEY_POLICY_ID, BAD_MOTORCYCLE_POLICY_ID } from '../../constants'
import type { PolicyId, PopulatedAsset, TraitsFile } from '../../@types'

const badApi = new BadApi()

interface AssetModalContentProps {
  policyId: string
  asset: PopulatedAsset
  withWallet: boolean
  selectBadKeyOfBurnedAsset: (assetId: string) => void
}

const AssetModalContent = (props: AssetModalContentProps) => {
  const { policyId, asset, withWallet, selectBadKeyOfBurnedAsset } = props

  const [boughtAtPrice, setBoughtAtPrice] = useState(0)
  const [badKeyIdOfBurnedAsset, setBadKeyIdOfBurnedAsset] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [displayedFile, setDisplayedFile] = useState<PopulatedAsset['files'][0]>(
    asset.files.length
      ? asset.files[0]
      : {
          name: asset?.tokenName?.display as string,
          mediaType: 'image/png',
          src:
            // (getFileForPolicyId(policyId as PolicyId, 'assets') as PopulatedAsset[]).find(
            //   (item) => item.tokenId === asset.tokenId
            // )?.image.url ||
            asset.image.url || asset.image.ipfs,
        }
  )

  useEffect(() => {
    const { isBurned, tokenName, attributes } = asset

    if (isBurned) {
      const badKeyTraitCategory =
        policyId === BAD_FOX_POLICY_ID
          ? `Fox (${
              // translates to : M || F
              attributes.Gender?.charAt(0)
            })`
          : 'Motorcycle'

      const badKeyAssetsFile = getFileForPolicyId(BAD_KEY_POLICY_ID, 'assets') as PopulatedAsset[]
      const foundBadKey = badKeyAssetsFile.find((badKey) => badKey.attributes[badKeyTraitCategory] === tokenName?.display) as PopulatedAsset

      setBadKeyIdOfBurnedAsset(foundBadKey.tokenId)
    }

    if (withWallet) {
      const stored = localStorage.getItem(`asset-price-${asset.tokenId}`)
      const storedPrice = stored ? JSON.parse(stored) : 0
      const storedPriceNum = Number(storedPrice)

      if (storedPrice && !isNaN(storedPriceNum)) {
        setBoughtAtPrice(storedPriceNum)
      } else {
        badApi.token.market.getActivity(asset.tokenId).then((data) => {
          const price = data.items.filter(({ activityType }) => activityType === 'BUY')[0]?.price || 0
          setBoughtAtPrice(price)
        })
      }
    }
  }, [policyId, asset, withWallet])

  return (
    <div className='flex flex-col lg:flex-row lg:justify-between md:px-6'>
      <div>
        {displayedFile.mediaType === 'image/png' ? (
          <button
            onClick={() => window.open(formatIpfsImageUrl(displayedFile.src), '_blank', 'noopener noreferrer')}
            className='w-[80vw] md:w-[555px]'
          >
            <ImageLoader
              src={formatIpfsImageUrl(displayedFile.src)}
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
              <GlbViewer src={formatIpfsImageUrl(displayedFile.src)} />
            </div>
          </button>
        ) : displayedFile.mediaType === 'application/octet-stream' ? (
          <button onClick={() => {}} className='w-[80vw] md:w-[555px]'>
            <div className='w-[100%] h-[80vw] md:w-[555px] md:h-[555px] bg-gray-900 bg-opacity-50 rounded-2xl border border-gray-700'>
              <TPoseModel withControls src={formatIpfsImageUrl(displayedFile.src)} />
            </div>
          </button>
        ) : (
          <button onClick={() => {}} className='w-[80vw] md:w-[555px]'>
            <div className='w-[100%] h-[80vw] md:w-[555px] md:h-[555px] flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-2xl border border-gray-700'>
              Unhandled file type:
              <br />
              {displayedFile.mediaType}
            </div>
          </button>
        )}

        <div className='flex flex-wrap items-center'>
          {asset.files.length
            ? asset.files.map((file) => (
                // file.src !== displayedFile.src ? (
                <button key={`file-${file.name}`} onClick={() => setDisplayedFile(file)} className='w-32 h-32 m-1'>
                  {file.mediaType === 'image/png' ? (
                    <ImageLoader
                      src={formatIpfsImageUrl(file.src)}
                      alt={file.name}
                      width={150}
                      height={150}
                      style={{ flex: 0.42, borderRadius: '1rem' }}
                    />
                  ) : file.mediaType === 'model/gltf-binary' ? (
                    <div className='w-full h-full bg-gray-900 bg-opacity-50 rounded-2xl border border-gray-700'>
                      <GlbViewer src={formatIpfsImageUrl(file.src)} freeze />
                    </div>
                  ) : file.mediaType === 'application/octet-stream' ? (
                    <div className='w-full h-full bg-gray-900 bg-opacity-50 rounded-2xl border border-gray-700'>
                      <TPoseModel src={formatIpfsImageUrl(file.src)} />
                    </div>
                  ) : (
                    <div className='w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-2xl border border-gray-700 text-xs'>
                      Unhandled file type:
                      <br />
                      {displayedFile.mediaType}
                    </div>
                  )}
                </button>
                // ) : null
              ))
            : null}
        </div>
      </div>

      <div className='mt-2 lg:mt-0 lg:ml-6'>
        <div className='my-1'>
          <CopyChip prefix='Policy ID' value={policyId} />
        </div>
        <div className='my-1'>
          <CopyChip prefix='Asset ID' value={asset.tokenId} />
        </div>

        {withWallet ? (
          <div className='mt-1 flex items-center'>
            <p className='mx-2 whitespace-nowrap'>Bought for:</p>
            <input
              value={boughtAtPrice}
              onChange={(e) => {
                const val = Number(e.target.value)

                if (!isNaN(val)) {
                  localStorage.setItem(`asset-price-${asset.tokenId}`, String(val))
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

        {withWallet && asset.policyId === BAD_FOX_3D_POLICY_ID && asset.files.length
          ? asset.files.map((file) => {
              const isGlb = file.mediaType === 'model/gltf-binary'

              return ['model/gltf-binary', 'application/octet-stream'].includes(file.mediaType) ? (
                <button
                  key={`download-${file.src}`}
                  onClick={async () => {
                    const fileName = `${asset.tokenName?.display}.${isGlb ? 'glb' : 'fbx'}`
                    const fileUrl = formatIpfsImageUrl(file.src)

                    setDownloading(true)
                    fetch(fileUrl, { method: 'GET' })
                      .then((response) => response.blob())
                      .then((blob) => {
                        const urlBlob = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = urlBlob
                        a.innerText = fileName
                        a.download = fileName
                        a.click()
                      })
                      .catch((error) => console.error(error))
                      .finally(() => setDownloading(false))
                  }}
                  disabled={downloading}
                  className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200 disabled:bg-opacity-50 disabled:bg-gray-900 disabled:text-gray-700 disabled:border-gray-800 disabled:cursor-not-allowed'
                >
                  <FolderArrowDownIcon className='w-8 h-8 mr-2' />
                  {isGlb ? '.glb (animated, rigged)' : '.fbx (a-pose, not rigged)'}
                </button>
              ) : null
            })
          : null}

        {badKeyIdOfBurnedAsset ? (
          <button
            onClick={() => selectBadKeyOfBurnedAsset(badKeyIdOfBurnedAsset)}
            className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded'
          >
            <Image unoptimized src='/media/fire.gif' alt='' width={30} height={30} className='mr-2' />
            Corresponding Bad Key
          </button>
        ) : (
          <Fragment>
            <button
              onClick={() => window.open(`https://pool.pm/${asset.fingerprint}`, '_blank', 'noopener noreferrer')}
              className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
            >
              <Image unoptimized src='/media/logo/other/poolpm.png' alt='' width={30} height={30} className='mr-2' />
              pool.pm
            </button>

            {/* <button
              onClick={() => window.open(`https://www.taptools.io/charts/nft?assets&policyID=${asset.policyId}`, '_blank', 'noopener noreferrer')}
              className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
            >
              <Image unoptimized src='/media/logo/other/taptools.webp' alt='' width={30} height={30} className='mr-2' />
              TapTools
            </button> */}

            <button
              onClick={() => window.open(`https://www.jpg.store/asset/${asset.tokenId}`, '_blank', 'noopener noreferrer')}
              className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
            >
              <Image unoptimized src='/media/logo/other/jpgstore.png' alt='' width={30} height={30} className='mr-2' />
              JPG Store
            </button>

            <button
              onClick={() => window.open(`https://flipr.io/asset/${asset.tokenId}`, '_blank', 'noopener noreferrer')}
              className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
            >
              <Image unoptimized src='/media/logo/other/flipr.png' alt='' width={30} height={30} className='mr-2' />
              Flipr
            </button>

            <button
              onClick={() => window.open(`https://www.plutus.art/asset/${asset.tokenId}`, '_blank', 'noopener noreferrer')}
              className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
            >
              <Image unoptimized src='/media/logo/other/plutusart.png' alt='' width={30} height={30} className='mr-2' />
              Plutus Art
            </button>

            <button
              onClick={() => window.open(`https://epoch.art/asset/${asset.tokenId}`, '_blank', 'noopener noreferrer')}
              className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
            >
              <Image unoptimized src='/media/logo/other/epochart.png' alt='' width={30} height={30} className='mr-2' />
              Epoch Art
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
                    }?asset=${asset.tokenName?.onChain}`,
                    '_blank',
                    'noopener noreferrer'
                  )
                }
                className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
              >
                <Image unoptimized src='/media/logo/other/cnfttools.png' alt='' width={30} height={30} className='mr-2' />
                CNFT Tools
              </button>
            ) : null}

            <button
              onClick={() => window.open(`https://www.jngl.io/asset/${policyId}.${asset.tokenName?.onChain}`, '_blank', 'noopener noreferrer')}
              className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
            >
              <Image unoptimized src='/media/logo/other/cnftjungle.png' alt='' width={30} height={30} className='mr-2' />
              Jungle
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
              <Image unoptimized src='/media/logo/other/opencnft.png' alt='' width={30} height={30} className='mr-2' />
              Open CNFT
            </button>

            <button
              onClick={() => window.open(`https://cardanoscan.io/token/${asset.tokenId}`, '_blank', 'noopener noreferrer')}
              className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
            >
              <Image unoptimized src='/media/logo/other/cardanoscan.png' alt='' width={30} height={30} className='mr-2' />
              Cardanoscan
            </button>

            <button
              onClick={() => window.open(`https://cexplorer.io/asset/${asset.fingerprint}`, '_blank', 'noopener noreferrer')}
              className='w-full my-1 py-2 px-4 flex items-center justify-start bg-gray-700 border border-gray-600 rounded hover:bg-gray-500 hover:border-gray-400 hover:text-gray-200'
            >
              <Image unoptimized src='/media/logo/other/cexplorer.png' alt='' width={30} height={30} className='mr-2' />
              Cexplorer
            </button>
          </Fragment>
        )}
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
  const [selectedAsset, setSelectedAsset] = useState<PopulatedAsset | null>(null)

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
      const fetched = await badApi.policy.market.getData(policyId)

      const traits = getFileForPolicyId(policyId, 'traits') as TraitsFile
      const assets = (getFileForPolicyId(policyId, 'assets') as PopulatedAsset[]).map((asset) => {
        const found = fetched.items.find((listed) => listed.tokenId === asset.tokenId)

        return {
          ...asset,
          price: !!found ? found.price : 0,
        }
      })

      for await (const listed of fetched.items) {
        const found = assets.find((asset) => listed.tokenId === asset.tokenId)

        if (!found) {
          const data: Partial<PopulatedAsset> = await badApi.token.getData(listed.tokenId)

          data.price = listed.price

          assets.push(data as (typeof assets)[0])
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
                  key={`collection-asset-${asset.tokenId}-${idx}`}
                  onClick={() => setSelectedAsset(asset)}
                  isBurned={asset.isBurned}
                  title={asset.tokenName?.display as string}
                  imageSrc={formatIpfsImageUrl(asset.image.ipfs)}
                  tiedImageSrcs={
                    asset.policyId === BAD_KEY_POLICY_ID && asset.files?.length
                      ? asset.files
                          .filter((file) => file.mediaType === 'image/png')
                          .map((file) => ({
                            src: formatIpfsImageUrl(file.src),
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
        <Modal title={selectedAsset.tokenName?.display} open onClose={() => setSelectedAsset(null)}>
          <AssetModalContent
            policyId={policyId}
            asset={selectedAsset}
            withWallet={withWallet}
            selectBadKeyOfBurnedAsset={(badKeyId) => {
              setSelectedAsset(null)
              setTimeout(() => {
                const badKeys = getFileForPolicyId(BAD_KEY_POLICY_ID, 'assets') as PopulatedAsset[]
                const foundBadKey = badKeys.find((asset) => asset.tokenId === badKeyId)
                if (foundBadKey) setSelectedAsset(foundBadKey)
              }, 0)
            }}
          />
        </Modal>
      ) : null}
    </div>
  )
}

export default CollectionAssets
