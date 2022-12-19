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
import { JpgRecentItem, PolicyId } from '../@types'

export interface RecentMarketActivityProps {
  policyId: PolicyId
  type?: 'sales' | 'listings' | 'mix'
}

const RecentMarketActivity = (props: RecentMarketActivityProps) => {
  const { policyId, type = 'mix' } = props
  const { screenWidth } = useScreenSize()
  const [fetching, setFetching] = useState(false)

  const [recentlyListed, setRecentlyListed] = useState<JpgRecentItem[]>([])
  const [recentlySold, setRecentlySold] = useState<JpgRecentItem[]>([])

  const fetchRecentSales = useCallback(
    async ({ page = 1 }: { page?: number }): Promise<JpgRecentItem[]> => {
      try {
        const uri = `/api/market/${policyId}/recent?sold=${true}&page=${page}`
        const { data } = await axios.get<{ count: number; items: JpgRecentItem[] }>(uri)
        return data.items
      } catch (error) {
        console.error(error)
        return []
      }
    },
    [policyId]
  )

  const fetchRecentListings = useCallback(
    async ({ page = 1 }: { page?: number }): Promise<JpgRecentItem[]> => {
      try {
        const uri = `/api/market/${policyId}/recent?sold=${false}&page=${page}`
        const { data } = await axios.get<{ count: number; items: JpgRecentItem[] }>(uri)
        return data.items
      } catch (error) {
        console.error(error)
        return []
      }
    },
    [policyId]
  )

  const fetchAndSetRecents = useCallback(
    async ({ page = 1 }: { page?: number }): Promise<void> => {
      setFetching(true)
      const isSalesOnly = type === 'sales'
      const isListingsOnly = type === 'listings'

      try {
        if (isSalesOnly) {
          const salesItems = await fetchRecentSales({ page })
          setRecentlySold(salesItems)
        } else if (isListingsOnly) {
          const listingsItems = await fetchRecentListings({ page })
          setRecentlyListed(listingsItems)
        } else {
          const salesItems = await fetchRecentSales({ page })
          const listingsItems = await fetchRecentListings({ page })
          setRecentlySold(salesItems)
          setRecentlyListed(listingsItems)
        }
      } catch (error) {
        console.error(error)
      }

      setFetching(false)
    },
    [type, fetchRecentSales, fetchRecentListings]
  )

  useEffect(() => {
    fetchAndSetRecents({ page: 1 })
  }, [fetchAndSetRecents])

  const imageSize = 170
  const [slidesPerView, setSlidesPerView] = useState(0)
  const [renderItems, setRenderItems] = useState<JpgRecentItem[]>([])

  useEffect(() => {
    setSlidesPerView(Math.floor((screenWidth * 0.9) / imageSize))
  }, [screenWidth])

  useEffect(() => {
    setRenderItems(
      type === 'sales'
        ? recentlySold
        : type === 'listings'
        ? recentlyListed
        : [...recentlySold, ...recentlyListed].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
    )
  }, [type, recentlySold, recentlyListed])

  return (
    <section className='w-full my-4 mx-auto'>
      {fetching ? (
        <Loader />
      ) : (
        <Swiper slidesPerView={slidesPerView} modules={[Navigation]} navigation>
          {renderItems.map((item, idx) => (
            <SwiperSlide key={`recently-sold-${item.assetId}-${idx}`}>
              <div className='relative rounded-full border border-gray-900 shadow-inner'>
                <Link href={item.itemUrl} target='_blank' rel='noopener'>
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
      )}
    </section>
  )
}

export default RecentMarketActivity
