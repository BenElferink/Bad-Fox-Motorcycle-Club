import { MarketProvider } from '../../contexts/MarketContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Listings from '../../components/Market/Listings'
import RecentlySold from '../../components/Market/RecentlySold'

export default function Page() {
  return (
    <div className='App flex-col'>
      <Header />
      <MarketProvider>
        <Listings />
        <RecentlySold />
      </MarketProvider>
      <Footer />
    </div>
  )
}
