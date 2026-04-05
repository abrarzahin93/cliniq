import { Component, createElement } from 'react'
import { createRoot } from 'react-dom/client'

// ─── Global stylesheet ────────────────────────────────────────────────
// Everything that needs to respond to viewport width or theme lives here as
// real CSS classes. Keeps React renders cheap (no style-object spreading)
// and lets media queries do responsive work without JS.
const s = document.createElement('style')
s.textContent = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Inter',-apple-system,sans-serif;min-height:100vh;-webkit-font-smoothing:antialiased}
  input,textarea,select,button{font-family:inherit}
  ::selection{background:rgba(77,163,255,.25)}
  ::-webkit-scrollbar{width:5px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:3px}

  /* ─── Layout container — responsive max-width ──────────────────── */
  .cliniq-container{max-width:480px;margin:0 auto;padding:12px 16px 100px;position:relative;z-index:1}
  @media(min-width:640px){.cliniq-container{max-width:640px;padding:20px 24px 100px}}
  @media(min-width:1024px){.cliniq-container{max-width:960px;padding:28px 32px 40px 260px}}
  @media(min-width:1280px){.cliniq-container{max-width:1200px;padding:32px 40px 40px 260px}}

  /* ─── Responsive grids ─────────────────────────────────────────── */
  .cliniq-grid-2{display:grid;grid-template-columns:1fr;gap:14px}
  .cliniq-grid-3{display:grid;grid-template-columns:1fr;gap:14px}
  @media(min-width:640px){.cliniq-grid-2{grid-template-columns:1fr 1fr}.cliniq-grid-3{grid-template-columns:1fr 1fr}}
  @media(min-width:1024px){.cliniq-grid-3{grid-template-columns:1fr 1fr 1fr}}

  /* ─── Memoized form fields (Fields.jsx) ───────────────────────── */
  .cliniq-field{margin-bottom:14px}
  .cliniq-label{font-family:'Inter',sans-serif;font-size:11px;font-weight:500;color:var(--cq-text-muted);text-transform:uppercase;letter-spacing:1.2px;margin-bottom:8px;display:block}
  .cliniq-input{width:100%;padding:14px 18px;background:var(--cq-input-bg);border:1px solid var(--cq-input-border);border-radius:16px;color:var(--cq-text);font-size:16px;outline:none;font-family:'Inter',sans-serif;transition:border-color .2s,background .2s}
  .cliniq-input:focus{border-color:var(--cq-accent);background:rgba(127,127,127,.06)}
  .cliniq-textarea{width:100%;padding:14px 18px;background:var(--cq-input-bg);border:1px solid var(--cq-input-border);border-radius:16px;color:var(--cq-text);font-size:16px;outline:none;font-family:'Inter',sans-serif;min-height:100px;resize:vertical;transition:border-color .2s,background .2s}
  .cliniq-textarea:focus{border-color:var(--cq-accent);background:rgba(127,127,127,.06)}
  .cliniq-toggle-group{display:flex;gap:6px;flex-wrap:wrap}
  .cliniq-toggle{padding:8px 16px;border:1px solid var(--cq-glass-border);border-radius:14px;cursor:pointer;font-weight:500;font-size:13px;color:var(--cq-toggle-inactive-text);background:var(--cq-toggle-inactive-bg);font-family:'Inter',sans-serif;transition:all .2s cubic-bezier(.4,0,.2,1)}
  .cliniq-toggle:hover{border-color:var(--cq-accent)}
  .cliniq-toggle-active{color:#fff;background:var(--cq-accent);border-color:transparent;box-shadow:0 4px 16px rgba(77,163,255,.15)}

  /* ─── Landing page (fluent.health style) ──────────────────────── */
  .cliniq-landing-h1{font-size:44px;line-height:1.05;letter-spacing:-1.5px;font-weight:500}
  @media(min-width:640px){.cliniq-landing-h1{font-size:64px;letter-spacing:-2px}}
  @media(min-width:1024px){.cliniq-landing-h1{font-size:88px;letter-spacing:-3px}}
  .cliniq-landing-h2{font-size:32px;line-height:1.1;letter-spacing:-1px;font-weight:500}
  @media(min-width:640px){.cliniq-landing-h2{font-size:48px;letter-spacing:-1.5px}}
  @media(min-width:1024px){.cliniq-landing-h2{font-size:64px;letter-spacing:-2px}}
  .cliniq-landing-hero-grid{display:grid;grid-template-columns:1fr;gap:40px;align-items:center}
  @media(min-width:1024px){.cliniq-landing-hero-grid{grid-template-columns:1.2fr 1fr;gap:60px}}
  .cliniq-landing-features{display:grid;grid-template-columns:1fr;gap:20px}
  @media(min-width:768px){.cliniq-landing-features{grid-template-columns:1fr 1fr}}
  @media(min-width:1024px){.cliniq-landing-features{grid-template-columns:repeat(4,1fr)}}
  .cliniq-landing-steps{display:grid;grid-template-columns:1fr;gap:28px}
  @media(min-width:768px){.cliniq-landing-steps{grid-template-columns:1fr 1fr 1fr}}
  .cliniq-landing-footer{display:flex;flex-direction:column;gap:16px;align-items:flex-start}
  @media(min-width:640px){.cliniq-landing-footer{flex-direction:row;justify-content:space-between;align-items:center}}
  .cliniq-landing-nav-links{display:none}
  @media(min-width:768px){.cliniq-landing-nav-links{display:flex;gap:28px}}
  .cliniq-landing-mockup{display:none}
  @media(min-width:1024px){.cliniq-landing-mockup{display:block}}
  .cliniq-reveal{opacity:0;transform:translateY(24px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1)}
  .cliniq-reveal-in{opacity:1;transform:none}

  /* ─── Animations ─────────────────────────────────────────────── */
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulseGlow{50%{box-shadow:0 0 24px rgba(77,163,255,.3)}}
  @keyframes breathe{50%{opacity:.6}}
  @keyframes progressShimmer{to{background-position:-200% 0}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  .cliniq-fade-in{animation:fadeIn .3s cubic-bezier(.2,.8,.2,1)}
  .cliniq-scale-in{animation:fadeIn .25s cubic-bezier(.2,.8,.2,1)}
  .cliniq-view-enter{animation:fadeIn .25s cubic-bezier(.2,.8,.2,1)}
  .cliniq-tab-content{animation:fadeIn .2s cubic-bezier(.2,.8,.2,1)}

  /* ─── Ambient gradient orbs ──────────────────────────────────── */
  .cliniq-orb{position:fixed;border-radius:50%;filter:blur(80px);pointer-events:none;z-index:0}
  .cliniq-orb-1{width:300px;height:300px;top:-100px;left:-100px;background:radial-gradient(circle,rgba(77,163,255,.14),transparent)}
  .cliniq-orb-2{width:400px;height:400px;top:30%;right:-150px;background:radial-gradient(circle,rgba(124,92,252,.08),transparent)}
  .cliniq-orb-3{width:300px;height:300px;bottom:-100px;left:20%;background:radial-gradient(circle,rgba(52,211,153,.06),transparent)}

  /* ─── Print ──────────────────────────────────────────────────── */
  @media print{body *{visibility:hidden!important}.no-print{display:none!important}#rx-print,#rx-print *{visibility:visible!important;color:#111!important}#rx-print{position:absolute!important;left:0!important;top:0!important;width:100%!important;background:#fff!important;padding:40px!important;border:none!important}}
`
document.head.appendChild(s)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {})
}

// Top-level error boundary so any crash in the tree renders a visible error
// instead of a blank white screen (and a reset button so the user can recover).
class Boundary extends Component {
  constructor(p) { super(p); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch(err, info) { console.error('REACT ERROR:', err, info?.componentStack) }
  render() {
    if (this.state.err) {
      return createElement('div', { style: { padding: 40, color: '#f87171', fontFamily: 'sans-serif', minHeight: '100vh', background: '#030508' } }, [
        createElement('h2', { key: 'h', style: { marginBottom: 16 } }, 'App Error'),
        createElement('pre', { key: 'e', style: { color: '#fbbf24', fontSize: 12, whiteSpace: 'pre-wrap', overflow: 'auto', maxWidth: '90vw' } }, (this.state.err.stack || String(this.state.err))),
        createElement('button', { key: 'b', style: { marginTop: 20, padding: '12px 24px', background: '#4da3ff', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer' }, onClick: () => { localStorage.clear(); location.reload() } }, 'Clear Data & Reload'),
      ])
    }
    return this.props.children
  }
}

async function boot() {
  try {
    const { default: App } = await import('./App.jsx')
    createRoot(document.getElementById('root')).render(createElement(Boundary, null, createElement(App)))
  } catch (e) {
    console.error('BOOT CRASH:', e)
    const root = document.getElementById('root')
    root.innerHTML = '<div style="padding:40px;color:#f87171;font-family:sans-serif;text-align:center"><h2>App Error</h2><pre id="cliniq-err" style="text-align:left;font-size:12px;color:#fbbf24;overflow:auto;max-width:90vw"></pre><button id="cliniq-reset" style="margin-top:20px;padding:12px 24px;background:#4da3ff;color:#fff;border:none;border-radius:12px;cursor:pointer">Clear Data & Reload</button></div>'
    // textContent (not innerHTML) so any injected HTML in the stack trace can't run
    root.querySelector('#cliniq-err').textContent = e.stack || String(e)
    // addEventListener instead of inline onclick — CSP-friendly
    root.querySelector('#cliniq-reset').addEventListener('click', () => {
      localStorage.clear()
      location.reload()
    })
  }
}
boot()
