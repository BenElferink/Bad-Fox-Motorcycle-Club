import { useEffect } from 'react'

export interface ModalProps {
  open: boolean
  onClose?: () => void
  title?: string
  noModal?: boolean
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  scrollToTop?: boolean
}

const Modal = (props: ModalProps) => {
  const { open, onClose, title, noModal, className = '', style = {}, children, scrollToTop } = props

  useEffect(() => {
    if (!!open && !!scrollToTop) {
      window.scrollTo({ top: 0 })
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [open, scrollToTop])

  return (
    <div
      className={
        (!!open ? 'block' : 'hidden') +
        ' w-screen h-screen bg-black bg-opacity-50 backdrop-blur-lg flex items-center justify-center fixed top-0 left-0 z-50'
      }
    >
      <div className='animate__animated animate__fadeIn'>
        <section
          className={
            (noModal ? 'bg-transparent overflow-hidden' : 'bg-gray-800 overflow-auto') +
            ' relative flex flex-col items-center min-w-screen md:min-w-[420px] max-w-screen md:max-w-[90vw] w-screen md:w-fit min-h-screen md:min-h-fit max-h-screen md:max-h-[90vh] p-4 md:rounded-3xl  ' +
            className
          }
          style={style}
        >
          {onClose ? (
            <button
              className='w-6 h-6 rounded-full bg-gray-400 hover:bg-gray-300 text-gray-800 flex items-center justify-center absolute top-3 right-3'
              onClick={onClose}
            >
              &#10005;
            </button>
          ) : null}

          {title && <h2 className='text-2xl mb-4'>{title}</h2>}
          {children}
        </section>
      </div>
    </div>
  )
}

export default Modal
