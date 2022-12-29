import { ChangeEventHandler, FormEventHandler, useState } from 'react'
import ImageLoader from '../components/Loader/ImageLoader'
import ModelViewer from '../components/ModelViewer'
import avatarFilesFile from '../data/3D/files.json'
import avatarRendersFile from '../data/3D/renders.json'

const Page = () => {
  const [search, setSearch] = useState('')
  const [fileSrc, setFileSrc] = useState('')
  const [imageSrc, setImageSrc] = useState('')

  const searchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = e.target.value
    const numV = Number(v)

    if (!isNaN(numV) && numV >= 0 && numV <= 6000) {
      setSearch(v)
    }
  }

  const searchSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e?.preventDefault()
    setFileSrc('')
    setImageSrc('')

    setTimeout(() => {
      let v = String(Number(search))
      while (v.length < 4) {
        v = `0${v}`
      }
      v = `Bad Fox #${v}`

      setSearch('')
      // @ts-ignore
      setFileSrc(avatarFilesFile[`${v}.glb`])
      // @ts-ignore
      setImageSrc(avatarRendersFile[`${v}.png`])
    }, 0)
  }

  return (
    <div className='flex flex-col items-center'>
      <form onSubmit={searchSubmit} className='w-72 mt-4 relative'>
        <input
          placeholder='Search Fox #ID'
          value={search}
          onChange={searchChange}
          className='w-full my-2 p-3 rounded-lg bg-gray-900 border border-gray-700 text-sm hover:bg-gray-700 hover:border-gray-500 hover:text-white'
        />
        <button
          type='submit'
          disabled={!search}
          className={
            (search ? 'block' : 'hidden') +
            ' absolute top-1/2 right-1 -translate-y-1/2 p-2 bg-green-900 hover:bg-green-700 bg-opacity-50 hover:bg-opacity-50 text-sm hover:text-gray-200 rounded-lg border hover:border border-green-700 hover:border-green-700 hover:cursor-pointer'
          }
        >
          Show Me!
        </button>
      </form>

      {fileSrc && imageSrc ? (
        <div className='flex flex-wrap items-center justify-center'>
          <div className='flex flex-col items-center justify-center w-[300px] md:w-[450px] lg:w-[600px] h-[300px] md:h-[450px] lg:h-[600px] m-4 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700'>
            <ModelViewer src={fileSrc.replace('https://firebasestorage.googleapis.com', '/storage')} />
          </div>

          <div
            onClick={() => window.open(imageSrc, '_blank', '_noopener')}
            className='flex flex-col items-center justify-center w-[300px] md:w-[450px] lg:w-[600px] h-[300px] md:h-[450px] lg:h-[600px] m-4 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700 cursor-pointer'
          >
            <ImageLoader
              src={imageSrc}
              alt='3D Profile Picture'
              width={1080}
              height={1080}
              loaderSize={200}
              style={{ borderRadius: '0.75rem' }}
            />
          </div>
        </div>
      ) : (
        <p className='text-center'>
          Want to see what your Bad Fox will look like in 3D?
          <br />
          No problem, we got you covered!
        </p>
      )}
    </div>
  )
}

export default Page
