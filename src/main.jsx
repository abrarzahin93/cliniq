import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const globalStyles = document.createElement('style')
globalStyles.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #000000;
    color: #f0f0f0;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  input, textarea, select, button { font-family: inherit; }
  ::selection { background: rgba(216, 254, 145, 0.2); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
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

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
