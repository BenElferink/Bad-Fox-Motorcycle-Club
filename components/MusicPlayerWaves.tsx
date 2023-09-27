import { useCallback, useEffect, useRef, useState } from 'react'
import { PauseIcon, PlayIcon } from '@heroicons/react/24/solid'
import WaveSurfer from 'wavesurfer.js'
import { useRender } from '@/contexts/RenderContext'

const MusicPlayerWaves = (props: { src: string; w?: string; h?: string }) => {
  const { src, w = 'w-full', h = 'h-full' } = props

  const { userClicked } = useRender()
  const [mounted, setMounted] = useState(false)
  const [playing, setPlaying] = useState(false)

  const waveRef = useRef<WaveSurfer | null>(null)
  const visualRef = useRef<HTMLDivElement | null>(null)

  const stop = useCallback(() => {
    const _wave = waveRef.current

    if (_wave) {
      _wave.stop()

      setPlaying(false)
    }
  }, [waveRef])

  const pause = useCallback(() => {
    const _wave = waveRef.current

    if (_wave) {
      _wave.pause()

      setPlaying(false)
    }
  }, [waveRef])

  const play = useCallback(() => {
    const _wave = waveRef.current

    if (_wave) {
      _wave.play()

      setPlaying(true)
    }
  }, [waveRef])

  useEffect(() => {
    if (!waveRef.current && visualRef.current && userClicked && !mounted) {
      const _wave = WaveSurfer.create({
        container: visualRef.current,
        waveColor: 'whitesmoke',
        progressColor: 'skyblue',
        barWidth: 1,
        height: 'auto',
      })

      _wave.on('finish', () => {
        stop()
      })

      _wave.load(src.replace('https://firebasestorage.googleapis.com', '/storage'))
      waveRef.current = _wave
      setMounted(true)

      return () => {
        _wave.destroy()
        waveRef.current = null
        setMounted(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waveRef, visualRef, userClicked, src])

  return (
    <div className={`${w} ${h} flex items-center`}>
      <button onClick={() => (mounted ? (playing ? pause() : play()) : null)} className='relative mx-1 p-1 rounded-full border border-gray-400'>
        {playing ? <PauseIcon className='w-4 h-4' /> : <PlayIcon className='w-4 h-4' />}
        <div className='absolute top-1 animate-ping w-4 h-4 rounded-full border border-gray-200' />
      </button>

      <div ref={visualRef} className={`${w} ${h}`} />
    </div>
  )
}

export default MusicPlayerWaves
