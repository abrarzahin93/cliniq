import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const globalStyles = document.createElement('style')
globalStyles.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'IBM Plex Sans', -apple-system, sans-serif;
    background: #05080f;
    color: #e2e8f0;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  input, textarea, select, button { font-family: inherit; }
  ::selection { background: #0ea5e933; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
  @media print {
    body * { visibility: hidden !important; }
    #rx-print, #rx-print * { visibility: visible !important; }
    #rx-print {
      position: absolute !important; left: 0 !important; top: 0 !important;
      width: 100% !important; background: white !important; color: black !important;
      padding: 40px !important;
    }
  }
`
document.head.appendChild(globalStyles)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
