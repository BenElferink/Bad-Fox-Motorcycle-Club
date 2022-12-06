import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper'
import { format } from 'timeago.js'
import { useScreenSize } from '../../contexts/ScreenSizeContext'
import { useMarket } from '../../contexts/MarketContext'
import formatBigNumber from '../../functions/formatters/formatBigNumber'
import Loader from '../Loader'
import { ADA_SYMBOL } from '../../constants'
import styles from './RecentlySold.module.css'
import ImageLoader from '../Loader/ImageLoader'

function RecentlySold() {
  const { screenWidth } = useScreenSize()
  const { recentlySold, fetchAndSetRecents } = useMarket()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading && !recentlySold.length) {
      ;(async () => {
        setLoading(true)
        await fetchAndSetRecents({ sold: true, page: 1 })
        setLoading(false)
      })()
    }
  }, [])

  const imageSize = 200
  const slidesPerView = Math.floor((screenWidth * 0.9) / imageSize)

  return (
    <section style={{ margin: '1rem auto 2rem auto' }}>
      <div style={{ width: imageSize * slidesPerView * 1.1 }}>
        {loading ? (
          <Loader />
        ) : (
          <Swiper slidesPerView={slidesPerView} modules={[Navigation]} navigation>
            {recentlySold.map((item, idx) => (
              <SwiperSlide key={`recently-sold-${item.assetId}-${idx}`}>
                <div style={{ width: imageSize, height: imageSize * 1.1, position: 'relative' }}>
                  <div className={styles.price} onClick={() => window.open(item.itemUrl, '_blank')}>
                    <span>{ADA_SYMBOL}</span>
                    {formatBigNumber(item.price)}
                  </div>

                  <ImageLoader
                    width={imageSize}
                    height={imageSize}
                    loaderSize={imageSize * 0.7}
                    src={item.imageUrl}
                    alt=''
                    style={{
                      background: 'radial-gradient(circle at top right, transparent 42px, var(--brown-25) 0)',
                      backgroundPosition: 'center',
                      borderRadius: '25% 50%',
                      borderTopRightRadius: '70% 100%',
                      borderBottomLeftRadius: '70% 100%',
                      boxShadow: '0 0 3px 1px var(--brown) inset',
                    }}
                  />

                  <div className={styles.timeAgo}>{format(new Date(item.date))}</div>
                  <div
                    className={styles.img}
                    style={{
                      width: imageSize,
                      height: imageSize,

                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      zIndex: -1,
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  )
}

export default RecentlySold
