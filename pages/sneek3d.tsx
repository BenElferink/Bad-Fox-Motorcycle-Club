import { ChangeEventHandler, FormEventHandler, useState } from 'react'
import { PopulatedAsset } from '../@types'
import ImageLoader from '../components/Loader/ImageLoader'
import FoxModel from '../components/models/FoxModel'
import { BAD_FOX_POLICY_ID } from '../constants'
import avatarFilesFile from '../data/3D/files.json'
import avatarRendersFile from '../data/3D/renders.json'
import getFileForPolicyId from '../functions/getFileForPolicyId'

const Page = () => {
  const [search, setSearch] = useState('')

  const searchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const v = e.target.value
    const numV = Number(v)

    if (!isNaN(numV) && numV >= 0 && numV <= 6000) {
      setSearch(v)
    }
  }

  const [foxName, setFoxName] = useState('')
  const [fileSrc, setFileSrc] = useState('')
  const [newImageSrc, setNewImageSrc] = useState('')
  const [oldImageSrc, setOldImageSrc] = useState('')

  const searchSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e?.preventDefault()
    setFoxName('')

    setTimeout(() => {
      let v = String(Number(search))
      while (v.length < 4) {
        v = `0${v}`
      }
      v = `Bad Fox #${v}`

      setSearch('')
      setFoxName(v)
      // @ts-ignore
      setFileSrc(avatarFilesFile[`${v}.glb`])
      // @ts-ignore
      setNewImageSrc(avatarRendersFile[`${v}.png`])
      setOldImageSrc(
        (getFileForPolicyId(BAD_FOX_POLICY_ID, 'assets') as PopulatedAsset[])?.find(
          (item) => item.displayName === v
        )?.image.firebase || ''
      )
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

      {!!foxName ? (
        <div>
          <h6 className='text-center text-xl'>{foxName}</h6>
          <div className='flex flex-wrap items-start justify-center'>
            <div
              onClick={() => window.open(oldImageSrc, '_blank', '_noopener')}
              className='flex flex-col items-center justify-center w-[270px] md:w-[333px] lg:w-[444px] h-[270px] md:h-[333px] lg:h-[444px] m-4 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700 cursor-pointer'
            >
              <ImageLoader
                src={oldImageSrc}
                alt='2D Profile Picture'
                width={1080}
                height={1080}
                loaderSize={200}
                style={{ borderRadius: '0.75rem' }}
              />
            </div>

            <div
              onClick={() => window.open(newImageSrc, '_blank', '_noopener')}
              className='flex flex-col items-center justify-center w-[270px] md:w-[333px] lg:w-[444px] h-[270px] md:h-[333px] lg:h-[444px] m-4 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700 cursor-pointer'
            >
              <ImageLoader
                src={newImageSrc}
                alt='3D Profile Picture'
                width={1080}
                height={1080}
                loaderSize={200}
                style={{ borderRadius: '0.75rem' }}
              />
            </div>

            <div className='flex flex-col items-center justify-center w-[270px] md:w-[333px] lg:w-[444px] h-[550px] md:h-[650px] lg:h-[750px] m-4 bg-gray-900 bg-opacity-50 rounded-xl border border-gray-700'>
              <FoxModel src={fileSrc.replace('https://firebasestorage.googleapis.com', '/storage')} />
            </div>
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
