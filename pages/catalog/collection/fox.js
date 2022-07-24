import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import FoxCollectionCatalog from '../../../components/Catalogs/Collection/Fox'

export default function Page() {
  return (
    <div className='App flex-col'>
      <Header />
      <FoxCollectionCatalog />
      <Footer />
    </div>
  )
}
