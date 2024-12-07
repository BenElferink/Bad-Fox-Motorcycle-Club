import Head from 'next/head'
import { AppProps } from 'next/app'
import { Fragment } from 'react'
import { Toaster } from 'react-hot-toast'
import 'animate.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '@/styles/swiper-overrides.css'
import '@/styles/globals.css'
import { WalletProvider } from '@/contexts/WalletContext'
import { RenderProvider } from '@/contexts/RenderContext'
import Header from '@/components/layout/Header'
// import SnowCanvas from '@/components/canvas/SnowCanvas'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Fragment>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='author' content='Ben Elferink' />
        <meta name='keywords' content='cardano, blockchain, nft, non fungible token' />
        <meta
          name='description'
          content='Bad Fox Motorcycle Club is a large collective of NFT fans who are working to innovate on what is possible with a Web3 brand. We do diverse forms of fund redistributions, integrations into various games/metaverses, and we develop tools that benefit everyone on Cardano.'
        />

        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />

        <title>Bad Fox MC</title>
      </Head>

      <Toaster />
      <Header />
      <main className='w-screen min-h-[91vh] bg-black bg-opacity-50'>
        {/* <SnowCanvas /> */}

        <WalletProvider>
          <RenderProvider>
            <Component {...pageProps} />
          </RenderProvider>
        </WalletProvider>
      </main>
    </Fragment>
  )
}

export default App
