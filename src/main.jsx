import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const globalStyles = document.createElement('style')
globalStyles.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Inter', -apple-system, system-ui, sans-serif;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
  input, textarea, select, button { font-family: inherit; }
  ::selection { background: rgba(77, 163, 255, 0.25); }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
  @media print {
    body * { visibility: hidden !important; }
    .no-print, #preloader { display: none !important; }
    #rx-print, #rx-print * { visibility: visible !important; color: #111 !important; }
    #rx-print {
      position: absolute !important; left: 0 !important; top: 0 !important;
      width: 100% !important; background: white !important; color: #111 !important;
      padding: 40px !important; backdrop-filter: none !important; border: none !important;
    }
    #rx-print div, #rx-print span { border-color: #ddd !important; background: transparent !important; }
  }
`
document.head.appendChild(globalStyles)

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}

// Hide preloader
function hidePreloader() {
  const el = document.getElementById('preloader')
  if (el) { el.classList.add('hide'); setTimeout(() => el.remove(), 400) }
}

// Safety: auto-hide preloader after 5s even if React crashes
setTimeout(hidePreloader, 5000)

try {
  createRoot(document.getElementById('root')).render(
    <App onReady={hidePreloader} />
  )
} catch (e) {
  console.error('ClinIQ boot error:', e)
  hidePreloader()
  document.getElementById('root').innerHTML = '<div style="padding:40px;text-align:center;color:#f87171;font-family:sans-serif"><h2>Something went wrong</h2><p>' + e.message + '</p><button onclick="location.reload()" style="margin-top:16px;padding:12px 24px;background:#4da3ff;color:#fff;border:none;border-radius:12px;font-size:15px;cursor:pointer">Reload</button></div>'
}
