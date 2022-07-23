import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Listings from '../../components/Market/Listings'
import RecentlySold from '../../components/Market/RecentlySold'

export default function Market() {
  return (
    <div className='App flex-col'>
      <Header />
      <Listings />
      <RecentlySold />
      <Footer />
    </div>
  )
}
