import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const globalStyles = document.createElement('style')
globalStyles.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #060a14;
    color: #edf2f7;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  input, textarea, select, button { font-family: inherit; }
  ::selection { background: rgba(77, 163, 255, 0.25); }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
  @media print {
    body * { visibility: hidden !important; }
    .no-print { display: none !important; }
    #rx-print, #rx-print * { visibility: visible !important; color: #111 !important; }
    #rx-print {
      position: absolute !important; left: 0 !important; top: 0 !important;
      width: 100% !important; background: white !important; color: #111 !important;
      padding: 40px !important; backdrop-filter: none !important;
      border: none !important;
    }
    #rx-print div, #rx-print span { border-color: #ddd !important; background: transparent !important; }
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
