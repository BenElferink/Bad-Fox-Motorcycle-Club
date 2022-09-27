import { useRouter } from 'next/router'
import isPolicyIdAllowed from '../../../functions/isPolicyIdAllowed'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import CollectionTraits from '../../../components/Traits/CollectionTraits'

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
      <CollectionTraits policyId={query.policyId} />
      <Footer />
    </div>
  )
}
