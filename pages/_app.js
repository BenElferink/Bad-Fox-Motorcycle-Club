import Head from 'next/head'
import { Fragment } from 'react'
import { Toaster } from 'react-hot-toast'
import { WalletProvider } from '../contexts/WalletContext'
import { ScreenSizeProvider } from '../contexts/ScreenSizeContext'
import { MintProvider } from '../contexts/MintContext'
import { createTheme, ThemeProvider } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource/roboto'
import 'animate.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../styles/swiper-overrides.css'
import '../styles/globals.css'

// https://animate.style
// https://raw.githubusercontent.com/belferink1996/bad-fox-mc-website/main/public

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

function App({ Component, pageProps }) {
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

      <Toaster />

      <ThemeProvider theme={theme}>
        <CssBaseline />

        <WalletProvider>
          <ScreenSizeProvider>
            <MintProvider>
              <Component {...pageProps} />
            </MintProvider>
          </ScreenSizeProvider>
        </WalletProvider>
      </ThemeProvider>
    </Fragment>
  )
}

export default App
