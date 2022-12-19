import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import { useCallback, useEffect, useState } from 'react'

const songs = ['/media/music/4042 - Welcome To The Club.wav']

const MusicPlayer = () => {
  const [player, setPlayer] = useState<HTMLAudioElement>()
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const _player = new Audio()
    setPlayer(_player)
  }, [])

  const play = useCallback(() => {
    if (player) {
      const foundIdx = songs.findIndex((str) => str === player.src)
      let albumIdx = foundIdx !== -1 ? foundIdx : Math.floor(Math.random() * songs.length)

      if (!player.src) {
        player.src = songs[albumIdx]
      }

      player.onended = () => {
        albumIdx += 1
        if (albumIdx >= songs.length) {
          albumIdx = 0
        }

        player.src = songs[albumIdx]
        player.play()
      }

      player.play()
      setPlaying(true)
    }
  }, [player])

  const pause = useCallback(() => {
    if (player) {
      player.pause()
      setPlaying(false)
    }
  }, [player])

  const [playedOnMount, setPlayedOnMount] = useState(false)

  useEffect(() => {
    const handler = () => {
      if (player && !playedOnMount) {
        play()
        setPlayedOnMount(true)
      }
    }

    window.addEventListener('click', handler)
    return () => {
      window.removeEventListener('click', handler)
    }
  }, [player, play, playedOnMount])

  return (
    <div className='md:mx-2 flex items-center'>
      <button
        onClick={() => (playing ? pause() : play())}
        className='relative mx-2 p-1 rounded-full border border-gray-400'
      >
        {playing ? <PauseIcon className='w-4 h-4' /> : <PlayIcon className='w-4 h-4' />}
        <div className='absolute top-1 animate-ping w-4 h-4 rounded-full border border-gray-200' />
      </button>
    </div>
  )
}

export default MusicPlayer
