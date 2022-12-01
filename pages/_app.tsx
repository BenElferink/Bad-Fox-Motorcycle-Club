import Head from 'next/head'
import { AppProps } from 'next/app'
import { Fragment } from 'react'
import { Toaster } from 'react-hot-toast'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material'
import { ScreenSizeProvider } from '../contexts/ScreenSizeContext'
import { WalletProvider } from '../contexts/WalletContext'
import '@fontsource/roboto'
import 'animate.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../styles/swiper-overrides.css'
import '../styles/globals.css'

// https://animate.style

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function App({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
        <meta name='author' content='Ben Elferink' />
        {/* <meta name='description' content='' /> */}
        {/* <meta name='keywords' content='' /> */}
        <title>Bad Fox Motorcycle Club</title>
      </Head>

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Toaster />

        <ScreenSizeProvider>
          <WalletProvider>
            <Component {...pageProps} />
          </WalletProvider>
        </ScreenSizeProvider>
      </ThemeProvider>
    </Fragment>
  )
}

export default App
