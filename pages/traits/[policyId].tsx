import { useRouter } from 'next/router'
import CollectionTraits from '../../components/dashboards/CollectionTraits'
import isPolicyIdAllowed from '../../functions/isPolicyIdAllowed'
import { PolicyId } from '../../@types'

const Page = () => {
  const router = useRouter()
  const policyId = router.query.policyId as PolicyId
  const policyOk = isPolicyIdAllowed(policyId, 'traits')

  return (
    <div className='flex flex-col items-center'>
      {!policyOk ? (
        <p className='pt-[15vh] text-center text-xl text-[var(--pink)]'>Policy ID is not permitted.</p>
      ) : (
        <CollectionTraits policyId={policyId} />
      )}
    </div>
  )
}

export default Page
