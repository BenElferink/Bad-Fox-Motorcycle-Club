import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'timeago.js'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import useScreenSize from '../hooks/useScreenSize'
import Loader from './Loader'
import ImageLoader from './Loader/ImageLoader'
import formatBigNumber from '../functions/formatters/formatBigNumber'
import { ADA_SYMBOL } from '../constants'
import { PolicyId } from '../@types'
import { FormattedListingOrSale } from '../utils/jpgStore'

export interface RecentMarketActivityProps {
  policyId: PolicyId
  type?: 'sales' | 'listings' | 'mix'
}

const RecentMarketActivity = (props: RecentMarketActivityProps) => {
  const { policyId, type = 'mix' } = props
  const { screenWidth } = useScreenSize()
  const [fetching, setFetching] = useState(false)

  const [recentlyListed, setRecentlyListed] = useState<FormattedListingOrSale[]>([])
  const [recentlySold, setRecentlySold] = useState<FormattedListingOrSale[]>([])

  const fetchRecents = useCallback(
    async ({ sold = false }: { sold?: boolean }): Promise<FormattedListingOrSale[]> => {
      try {
        const uri = `/api/policy/${policyId}/market/recent?sold=${sold}`
        const { data } = await axios.get<{ count: number; items: FormattedListingOrSale[] }>(uri)
        return data.items
      } catch (error) {
        console.error(error)
        return []
      }
    },
    [policyId]
  )

  const fetchAndSet = useCallback(async (): Promise<void> => {
    setFetching(true)
    const isSalesOnly = type === 'sales'
    const isListingsOnly = type === 'listings'

    try {
      if (isSalesOnly) {
        const salesItems = await fetchRecents({ sold: true })
        setRecentlySold(salesItems)
      } else if (isListingsOnly) {
        const listingsItems = await fetchRecents({ sold: false })
        setRecentlyListed(listingsItems)
      } else {
        const salesItems = await fetchRecents({ sold: true })
        const listingsItems = await fetchRecents({ sold: false })
        setRecentlySold(salesItems)
        setRecentlyListed(listingsItems)
      }
    } catch (error) {
      console.error(error)
    }

    setFetching(false)
  }, [type, fetchRecents])

  useEffect(() => {
    fetchAndSet()
  }, [fetchAndSet])

  const imageSize = 170
  const [slidesPerView, setSlidesPerView] = useState(0)
  const [renderItems, setRenderItems] = useState<FormattedListingOrSale[]>([])

  useEffect(() => {
    const _l = renderItems.length
    if (!!_l) {
      const _v = Math.floor((screenWidth * 0.9) / imageSize)
      setSlidesPerView(_v < _l ? _v : _l)
    }
  }, [screenWidth, renderItems])

  useEffect(() => {
    let payload: FormattedListingOrSale[] = []

    switch (type) {
      case 'sales': {
        payload = recentlySold
        break
      }
      case 'listings': {
        payload = recentlyListed
        break
      }
      default: {
        payload = recentlySold
          .concat(recentlyListed)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      }
    }

    setRenderItems(payload)
  }, [type, recentlySold, recentlyListed])

  return (
    <section className='w-full my-4 mx-auto'>
      {fetching ? (
        <Loader />
      ) : !!slidesPerView ? (
        <Swiper slidesPerView={slidesPerView} modules={[Navigation]} navigation>
          {renderItems.map((item, idx) => (
            <SwiperSlide key={`recently-sold-${item.assetId}-${idx}`}>
              <div className='relative rounded-full border border-gray-900 shadow-inner'>
                <Link href={item.itemUrl} target='_blank' rel='noopener noreferrer'>
                  <ImageLoader
                    width={imageSize}
                    height={imageSize}
                    src={item.imageUrl}
                    alt={item.name}
                    style={{ borderRadius: '100%' }}
                  />
                  <p className='whitespace-nowrap px-1 rounded-lg bg-gray-900 text-xs text-center font-light absolute bottom-0 left-1/2 -translate-x-1/2 z-20'>
                    <span className='text-sm text-gray-200'>
                      {item.type === 'sale' ? 'Bought' : item.type === 'listing' ? 'Listed' : null}
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
          ))}
        </Swiper>
      ) : null}
    </section>
  )
}

export default RecentMarketActivity
