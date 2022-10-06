import { useRouter } from 'next/router'
import { MarketProvider } from '../../../contexts/MarketContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import RecentlySold from '../../../components/RecentlySold'
import CollectionAssets from '../../../components/Assets/CollectionAssets'
import PolicyIdForbidden from '../../../components/Error/PolicyIdForbidden'
import isPolicyIdAllowed from '../../../functions/isPolicyIdAllowed'

export default function Page() {
  const { query } = useRouter()
  const policyOk = isPolicyIdAllowed(query.policyId)

  return (
    <div className='App flex-col'>
      <Header />

      {!policyOk ? (
        <PolicyIdForbidden />
      ) : (
        <MarketProvider policyId={query.policyId}>
          <RecentlySold />
          <CollectionAssets policyId={query.policyId} />
        </MarketProvider>
      )}

      <Footer />
    </div>
  )
}
