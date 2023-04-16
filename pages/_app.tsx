import Head from 'next/head'
import { AppProps } from 'next/app'
import { Fragment } from 'react'
import { Toaster } from 'react-hot-toast'
import 'animate.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../styles/swiper-overrides.css'
import '../styles/globals.css'
import { WalletProvider } from '../contexts/WalletContext'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
// import SnowCanvas from '../components/canvas/SnowCanvas'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Fragment>
      <Head>
        <meta
          name='description'
          content='Bad Fox Motorcycle Club is a large collective of NFT fans who are working to innovate on what is possible with a Web3 brand. We do diverse forms of fund redistributions, integrations into various games/metaverses, and we develop tools that benefit everyone on Cardano.'
        />

        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='author' content='Ben Elferink' />
        {/* <meta name='description' content='' /> */}
        {/* <meta name='keywords' content='' /> */}

        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />

        <title>Bad Fox Motorcycle Club</title>
      </Head>

      <Toaster />
      <Header />
      <main className='w-screen min-h-screen bg-black bg-opacity-50'>
        {/* <SnowCanvas /> */}
        <WalletProvider>
          <Component {...pageProps} />
        </WalletProvider>
      </main>
      <Footer />
    </Fragment>
  )
}

export default App
