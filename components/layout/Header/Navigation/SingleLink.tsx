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
  const selected = router.pathname === path || router.asPath === path

  // if (router.pathname === '/') {
  return (
    <Link
      scroll={false}
      href={url || path || ''}
      target={!!url ? '_blank' : ''}
      rel={!!url ? 'noopener' : ''}
      className={
        selected
          ? 'block py-2 px-3 md:p-0 w-full md:w-auto text-start md:text-center text-sm rounded text-white'
          : 'block py-2 px-3 md:p-0 w-full md:w-auto text-start md:text-center text-sm rounded md:border-0 hover:bg-gray-700 md:hover:bg-transparent hover:text-white'
      }
    >
      {label}
    </Link>
  )
  // }

  // return (
  //   <button
  //     type='button'
  //     onClick={() => {
  //       if (!selected && !!path) {
  //         window.location.href = path
  //       }
  //       if (!!url) {
  //         window.open(url, '_blank', 'noopener')
  //       }
  //     }}
  //     className={
  //       selected
  //         ? 'block py-2 px-3 md:p-0 w-full md:w-auto text-start md:text-center text-sm rounded text-white'
  //         : 'block py-2 px-3 md:p-0 w-full md:w-auto text-start md:text-center text-sm rounded md:border-0 hover:bg-gray-700 md:hover:bg-transparent hover:text-white'
  //     }
  //   >
  //     {label}
  //   </button>
  // )
}

export default SingleLink
