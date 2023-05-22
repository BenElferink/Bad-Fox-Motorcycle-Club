import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { format } from 'timeago.js'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import BadApi from '../utils/badApi'
import useScreenSize from '../hooks/useScreenSize'
import Loader from './Loader'
import ImageLoader from './Loader/ImageLoader'
import getFileForPolicyId from '../functions/getFileForPolicyId'
import formatIpfsImageUrl from '../functions/formatters/formatIpfsImageUrl'
import formatBigNumber from '../functions/formatters/formatBigNumber'
import { ADA_SYMBOL } from '../constants'
import type { BadApiMarket } from '../utils/badApi'
import type { PolicyId, PopulatedAsset } from '../@types'

const badApi = new BadApi()

export interface RecentMarketActivityProps {
  policyId: PolicyId
}

const RecentMarketActivity = (props: RecentMarketActivityProps) => {
  const { policyId } = props
  const { screenWidth } = useScreenSize()

  const imageSize = 170
  const [slidesPerView, setSlidesPerView] = useState(0)
  const [renderItems, setRenderItems] = useState<BadApiMarket['items']>([])
  const [fetching, setFetching] = useState(false)

  const assetsFile = useMemo(() => getFileForPolicyId(policyId, 'assets') as PopulatedAsset[], [policyId])

  useEffect(() => {
    const _l = renderItems.length
    if (!!_l) {
      const _v = Math.floor((screenWidth * 0.9) / imageSize)
      setSlidesPerView(_v < _l ? _v : _l)
    } else {
      setSlidesPerView(0)
    }
  }, [screenWidth, renderItems])

  useEffect(() => {
    setRenderItems([])
    setFetching(true)

    badApi.policy.market
      .getActivity(policyId)
      .then((payload) => setRenderItems(payload.items))
      .catch((error) => console.error(error))
      .finally(() => setFetching(false))
  }, [policyId])

  return (
    <section className='w-full my-4 mx-auto'>
      {fetching ? (
        <Loader />
      ) : !!slidesPerView ? (
        <Swiper slidesPerView={slidesPerView} modules={[Navigation]} navigation>
          {renderItems.map((item, idx) => {
            const thisAsset = assetsFile.find((obj) => obj.tokenId === item.tokenId)
            if (!thisAsset) return null

            return (
              <SwiperSlide key={`recently-sold-${item.tokenId}-${idx}`}>
                <div className='relative rounded-full border border-gray-900 shadow-inner'>
                  <Link href={`https://jpg.store/asset/${item.tokenId}`} target='_blank' rel='noopener noreferrer'>
                    <ImageLoader
                      width={imageSize}
                      height={imageSize}
                      src={formatIpfsImageUrl(thisAsset?.image.ipfs || '')}
                      alt={thisAsset?.tokenName?.display || ''}
                      style={{ borderRadius: '100%' }}
                    />
                    <p className='whitespace-nowrap px-1 rounded-lg bg-gray-900 text-xs text-center font-light absolute bottom-0 left-1/2 -translate-x-1/2 z-20'>
                      <span className='text-sm text-gray-200'>
                        {item.activityType === 'LIST'
                          ? 'Listed'
                          : item.activityType === 'SELL'
                          ? 'Bought'
                          : item.activityType}
                      </span>{' '}
                      {format(new Date(item.date))},{' '}
                      <span className='text-sm text-gray-200'>
                        {ADA_SYMBOL}
                        {formatBigNumber(item.price)}
                      </span>
                    </p>
                  </Link>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      ) : null}
    </section>
  )
}

export default RecentMarketActivity
