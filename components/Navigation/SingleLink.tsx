import Link from 'next/link'
import { useRouter } from 'next/router'

export interface SingleLinkProps {
  label: string
  path?: string
  url?: string
}

const SingleLink = (props: SingleLinkProps) => {
  const { label, path, url } = props
  const router = useRouter()
  const selected = router.asPath === path // || router.pathname === path
  const isNothing = !url && !path

  return (
    <Link
      scroll={false}
      href={url || path || ''}
      target={!!url ? '_blank' : ''}
      rel={!!url ? 'noopener noreferrer' : ''}
      onClick={() => {
        if (!isNothing) window.scroll({ top: 0, left: 0 })
      }}
      className={
        (selected ? 'text-white' : 'xl:border-0') +
        ' block py-2 px-3 xl:p-0 w-full xl:w-auto text-start xl:text-center text-sm rounded truncate ' +
        (isNothing
          ? 'cursor-not-allowed line-through text-gray-600'
          : 'hover:bg-gray-700 xl:hover:bg-transparent hover:text-white')
      }
    >
      {label}
    </Link>
  )
}

export default SingleLink
