import { useRouter } from 'next/router'
import CollectionSelector from '../../components/Wallet/CollectionSelector'

const Page = () => {
  const router = useRouter()

  return (
    <div>
      <div className='pt-10'>
        <CollectionSelector onSelected={(_pId) => router.push(`/collections/${_pId}`)} />
      </div>
    </div>
  )
}

export default Page
