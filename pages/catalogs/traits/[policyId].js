import { useRouter } from 'next/router'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import CollectionTraits from '../../../components/Traits/CollectionTraits'
import PolicyIdForbidden from '../../../components/Error/PolicyIdForbidden'
import isPolicyIdAllowed from '../../../functions/isPolicyIdAllowed'

export default function Page() {
  const { query } = useRouter()
  const policyOk = isPolicyIdAllowed(query.policyId)

  return (
    <div className='App flex-col'>
      <Header />
      {!policyOk ? <PolicyIdForbidden /> : <CollectionTraits policyId={query.policyId} />}
      <Footer />
    </div>
  )
}
