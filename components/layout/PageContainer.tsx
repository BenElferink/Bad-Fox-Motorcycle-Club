import { PropsWithChildren } from 'react'

const PageContainer = (props: PropsWithChildren) => {
  const { children } = props

  return <div className='max-w-[800px] mx-auto px-4 flex flex-col items-center'>{children}</div>
}

export default PageContainer
