import Head from 'next/head'
import { ScreenSizeProvider } from '../contexts/ScreenSizeContext'
import CssBaseline from '@mui/material/CssBaseline'
import '@fontsource/roboto'
import 'animate.css'
import 'swiper/css/bundle'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'
import '../styles/swiper-overrides.css'
import '../styles/globals.css'
// https://animate.style

function MyApp({ Component, pageProps }) {
  return (
    <ScreenSizeProvider>
      <CssBaseline />
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/manifest.json' />
        {/* <meta name='author' content='' /> */}
        {/* <meta name='description' content='' /> */}
        {/* <meta name='keywords' content='' /> */}
        <title>Bad Fox MC</title>
      </Head>
      <Component {...pageProps} />
    </ScreenSizeProvider>
  )
}

export default MyApp
