import React from 'react'
import { createRoot } from 'react-dom/client'
import { ScreenSizeProvider } from './contexts/ScreenSizeContext'
import CssBaseline from '@mui/material/CssBaseline'
import App from './App'
import '@fontsource/roboto'
import './globals.css'
import 'animate.css'
// https://animate.style

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ScreenSizeProvider>
      <CssBaseline />
      <App />
    </ScreenSizeProvider>
  </React.StrictMode>
)
