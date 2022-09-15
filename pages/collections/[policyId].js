import { useRouter } from 'next/router'
import { MarketProvider } from '../../contexts/MarketContext'
import isPolicyIdAllowed from '../../functions/isPolicyIdAllowed'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import RecentlySold from '../../components/RecentlySold'
import CollectionAssets from '../../components/Assets/CollectionAssets'

export default function Page() {
  const { query } = useRouter()
  const policyOk = isPolicyIdAllowed(query.policyId)

  if (!policyOk) {
    return (
      <div className='App flex-col'>
        <Header />
        <h1>That policy ID is not allowed 🤡</h1>
        <Footer />
      </div>
    )
  }

  return (
    <div className='App flex-col'>
      <Header />

      <MarketProvider policyId={query.policyId}>
        <RecentlySold />
        <CollectionAssets policyId={query.policyId} />
      </MarketProvider>

      <Footer />
    </div>
  )
}
