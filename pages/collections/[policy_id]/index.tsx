import { useRouter } from 'next/router'
import { Fragment } from 'react'
import RecentMarketActivity from '../../../components/RecentMarketActivity'
import CollectionAssets from '../../../components/dashboards/CollectionAssets'
import isPolicyIdAllowed from '../../../functions/isPolicyIdAllowed'
import { PolicyId } from '../../../@types'

const Page = () => {
  const router = useRouter()
  const policyId = router.query.policy_id as PolicyId
  const policyOk = isPolicyIdAllowed(policyId, 'collections')

  return (
    <div className='flex flex-col items-center'>
      {!policyOk ? (
        <p className='pt-[15vh] text-center text-xl text-[var(--pink)]'>Policy ID is not permitted.</p>
      ) : (
        <Fragment>
          <RecentMarketActivity policyId={policyId} />
          <CollectionAssets policyId={policyId} withListed />
        </Fragment>
      )}
    </div>
  )
}

export default Page
