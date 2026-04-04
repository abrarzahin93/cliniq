import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const s = document.createElement('style')
s.textContent = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',-apple-system,sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
  input,textarea,select,button{font-family:inherit}
  ::selection{background:rgba(77,163,255,.25)}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:3px}
  @media print{body *{visibility:hidden!important}.no-print{display:none!important}#rx-print,#rx-print *{visibility:visible!important;color:#111!important}#rx-print{position:absolute!important;left:0!important;top:0!important;width:100%!important;background:#fff!important;padding:40px!important;backdrop-filter:none!important;border:none!important}}
`
document.head.appendChild(s)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {})
}

createRoot(document.getElementById('root')).render(<App />)
