import { useEffect, useMemo, useRef, useState } from 'react'

/*
 * ClinIQ Landing Page — dark-space theme
 *
 * Design DNA from avaros.ai (fluent.health successor):
 *  - Deep space navy background with multi-radial gradient glows
 *  - Static starfield canvas (180 particles)
 *  - Instrument Serif display font + Plus Jakarta Sans body
 *  - Lime green accent (#c8ff5e) — pill CTAs, badges, accent words
 *  - Per-card accent color on 6 feature cards
 *  - Pill badge + horizontal rule section headers
 *
 * Self-contained: injects its own fonts and stylesheet on mount.
 * Does NOT read the app's T theme — landing is always dark.
 */

// ─── Design tokens ──────────────────────────────────────────────────────
const C = {
  bg: '#070d1a',
  surface: 'rgba(13, 24, 42, 0.75)',
  surfaceSolid: '#0d182a',
  elevated: 'rgba(20, 35, 58, 0.9)',
  border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.18)',
  text: '#ffffff',
  textDim: 'rgba(200, 215, 235, 0.65)',
  textMuted: 'rgba(180, 200, 225, 0.35)',
  accent: '#c8ff5e',
  accentDim: 'rgba(200,255,94,0.12)',
}

// Per-card accent colors — 6 features get 6 different hues
const FEATURES = [
  {
    id: 'ai',
    label: 'AI DIAGNOSIS',
    name: 'Clinical intelligence, trained on the standards',
    tagline: 'Davidson\u2019s, Harrison\u2019s, and the MMCH Ward Book — in every recommendation.',
    accent: '#c8ff5e',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 2L3 7l9 5 9-5-9-5z" /><path d="M3 17l9 5 9-5M3 12l9 5 9-5" />
      </svg>
    ),
    bullets: [
      'Differential diagnoses with confidence scoring',
      'Evidence-based investigation panel',
      'Clinical reasoning you can audit',
    ],
  },
  {
    id: 'bd',
    label: 'BANGLADESH FIRST',
    name: 'Real BD brands, real prices',
    tagline: 'BEXIMCO, ACI, Square, Opsonin, Drug International, Incepta, Renata \u2014 inline.',
    accent: '#60A5FA',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    bullets: [
      'Swap between top brands with one tap',
      'Live BDT pricing per unit',
      'MMCH Ward Book antibiotic protocols',
    ],
  },
  {
    id: 'calc',
    label: 'CLINICAL TOOLS',
    name: 'Every calculator you reach for',
    tagline: 'BMI, eGFR, CURB-65, GCS, IV fluids, pediatric dosing, lab interpretation.',
    accent: '#A78BFA',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="10" y2="10" /><line x1="12" y1="10" x2="14" y2="10" /><line x1="16" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="10" y2="14" /><line x1="8" y1="18" x2="10" y2="18" />
      </svg>
    ),
    bullets: [
      '8+ bedside calculators',
      'Normal-range lab interpreter',
      'Color-coded severity scoring',
    ],
  },
  {
    id: 'offline',
    label: 'WORKS ANYWHERE',
    name: 'Offline + Bangla, built in',
    tagline: 'Local symptom checker when the network drops. Full Bangla UI for patient-facing questions.',
    accent: '#F472B6',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 12.55a11 11 0 0114.08 0" /><path d="M1.42 9a16 16 0 0121.16 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
    bullets: [
      'Works in rural clinics with no signal',
      'Read questions to patients in Bangla',
      'Auto-syncs when back online',
    ],
  },
  {
    id: 'safety',
    label: 'SAFETY NET',
    name: 'Drug interactions. Allergies. Red flags.',
    tagline: 'Every prescription is checked against your patient\u2019s drug history before you print.',
    accent: '#FB7185',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    bullets: [
      'Critical / major / moderate severity',
      'Cross-checked against allergies',
      'Red-flag vitals flagged immediately',
    ],
  },
  {
    id: 'workflow',
    label: 'YOUR WORKFLOW',
    name: 'From patient to Rx in under 2 minutes',
    tagline: 'Dashboard, PDF export, WhatsApp share, QR handoff, follow-up scheduler.',
    accent: '#F59E0B',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    bullets: [
      'Save every consultation automatically',
      'Print-ready BD prescription pad',
      'Send Rx to patients on WhatsApp',
    ],
  },
]

const BENEFITS = [
  { k: 'Free forever',        v: 'No card. No trial. Free for every BMDC-registered doctor in Bangladesh.' },
  { k: 'Save 10+ min per case', v: 'Guided intake + instant diagnosis + auto-formatted Rx.' },
  { k: 'Prescription-safe',   v: 'Drug interaction & allergy alerts before you sign the pad.' },
  { k: 'Works offline',       v: 'Rural clinic, no signal? Local symptom checker still runs.' },
  { k: 'Bangla + English',    v: 'Switch language per patient \u2014 including diagnosis text.' },
  { k: 'Your data, your device', v: 'Patient records live on your phone. Nothing shared without your permission.' },
]

const STEPS = [
  { n: '01', title: 'Sign up in 30 seconds', body: 'Name, BMDC number, medical college. That\u2019s it.' },
  { n: '02', title: 'Enter the patient',     body: 'Guided 5-step wizard \u2014 particulars, complaints, history, exam, systems.' },
  { n: '03', title: 'Get clinical decisions',body: 'Diagnosis, differentials, investigations, treatment, and a printable Rx.' },
]

const STATS = [
  { n: '8+',     l: 'clinical calculators' },
  { n: '500+',   l: 'BD drug brands' },
  { n: '100%',   l: 'offline-capable' },
  { n: 'Free',   l: 'forever for doctors' },
]

// ─── Global style + fonts (injected once) ──────────────────────────────
let STYLES_INJECTED = false
function injectStyles() {
  if (STYLES_INJECTED || typeof document === 'undefined') return
  STYLES_INJECTED = true
  // Google Fonts — Plus Jakarta Sans body + Instrument Serif display (Canela-adjacent)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
  document.head.appendChild(link)

  const style = document.createElement('style')
  style.textContent = `
    .cliniq-mw *{box-sizing:border-box}
    .cliniq-mw{--mw-accent:${C.accent};font-family:'Plus Jakarta Sans','Inter',sans-serif;color:${C.text};background:${C.bg};min-height:100vh;position:relative;overflow-x:hidden}
    .cliniq-mw-serif{font-family:'Instrument Serif',Georgia,serif;font-weight:400;letter-spacing:-0.02em}
    .cliniq-mw-stars{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:0.55}
    .cliniq-mw-glows{position:fixed;inset:0;z-index:0;pointer-events:none;background:
      radial-gradient(900px 700px at 5% 40%, rgba(0,200,180,0.10), transparent 60%),
      radial-gradient(700px 600px at 95% 20%, rgba(120,60,220,0.10), transparent 60%),
      radial-gradient(800px 500px at 60% 90%, rgba(30,60,140,0.14), transparent 60%),
      radial-gradient(500px 400px at 30% 10%, rgba(60,120,200,0.08), transparent 60%)}
    .cliniq-mw-shell{position:relative;z-index:1;max-width:1200px;margin:0 auto;padding:28px 6vw 60px}

    /* Topbar */
    .cliniq-mw-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:80px}
    .cliniq-mw-brand{display:flex;align-items:center;gap:12px}
    .cliniq-mw-logo{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#c8ff5e,#48e0c4);display:grid;place-items:center;box-shadow:0 4px 20px rgba(200,255,94,0.25)}
    .cliniq-mw-brand-name{font-weight:700;font-size:17px;letter-spacing:-0.01em}
    .cliniq-mw-brand-sub{font-size:11px;color:${C.textMuted};margin-top:1px;letter-spacing:0.04em}
    .cliniq-mw-live{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:100px;background:rgba(74,222,128,0.08);border:1px solid rgba(74,222,128,0.25);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#4ade80}
    .cliniq-mw-live-dot{width:7px;height:7px;border-radius:50%;background:#4ade80;box-shadow:0 0 7px rgba(74,222,128,0.6);animation:mwPulse 2s ease-in-out infinite}
    @keyframes mwPulse{50%{opacity:0.5}}

    /* Pills + section headers */
    .cliniq-mw-pill{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:100px;font-size:10.5px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase}
    .cliniq-mw-section-header{display:flex;align-items:center;gap:18px;margin:80px 0 32px}
    .cliniq-mw-rule{flex:1;height:1px;background:${C.border}}

    /* Hero */
    .cliniq-mw-hero{text-align:center;padding:20px 0 40px}
    .cliniq-mw-greet{display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border-radius:100px;background:${C.accentDim};border:1px solid rgba(200,255,94,0.25);font-size:12px;font-weight:600;color:${C.accent};margin-bottom:28px;letter-spacing:0.01em}
    .cliniq-mw-greet-dot{width:6px;height:6px;border-radius:50%;background:${C.accent};box-shadow:0 0 8px ${C.accent}}
    .cliniq-mw-title{font-size:clamp(40px,6.5vw,84px);line-height:1.02;letter-spacing:-0.035em;font-weight:400;max-width:900px;margin:0 auto 22px}
    .cliniq-mw-title em{font-style:normal;color:${C.accent}}
    .cliniq-mw-sub{font-size:clamp(15px,1.4vw,18px);line-height:1.55;color:${C.textDim};max-width:620px;margin:0 auto 36px}
    .cliniq-mw-cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:14px}
    .cliniq-mw-btn{border:none;cursor:pointer;font-family:inherit;font-size:14px;font-weight:700;padding:14px 28px;border-radius:100px;transition:all .3s cubic-bezier(.2,.8,.2,1)}
    .cliniq-mw-btn-primary{background:${C.accent};color:#000;box-shadow:0 0 24px rgba(200,255,94,0.25)}
    .cliniq-mw-btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 32px rgba(200,255,94,0.4)}
    .cliniq-mw-btn-ghost{background:transparent;color:${C.text};border:1px solid ${C.border}}
    .cliniq-mw-btn-ghost:hover{border-color:${C.borderHover};background:rgba(255,255,255,0.03)}
    .cliniq-mw-micro{font-size:12px;color:${C.textMuted};margin-top:10px}

    /* Stats strip */
    .cliniq-mw-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;padding:28px;border:1px solid ${C.border};border-radius:22px;background:${C.surface};backdrop-filter:blur(12px);margin:56px auto 0;max-width:760px}
    @media(min-width:640px){.cliniq-mw-stats{grid-template-columns:repeat(4,1fr)}}
    .cliniq-mw-stat-n{font-family:'Instrument Serif',Georgia,serif;font-size:40px;letter-spacing:-0.02em;color:${C.text};line-height:1}
    .cliniq-mw-stat-l{font-size:11px;font-weight:600;color:${C.textMuted};text-transform:uppercase;letter-spacing:0.1em;margin-top:8px}

    /* Features grid */
    .cliniq-mw-features{display:grid;grid-template-columns:1fr;gap:20px}
    @media(min-width:700px){.cliniq-mw-features{grid-template-columns:repeat(2,1fr)}}
    @media(min-width:1060px){.cliniq-mw-features{grid-template-columns:repeat(3,1fr)}}
    .cliniq-mw-card{position:relative;padding:26px;border-radius:22px;border:1px solid ${C.border};background:${C.surface};backdrop-filter:blur(12px);transition:all .35s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column;min-height:320px;overflow:hidden}
    .cliniq-mw-card::before{content:'';position:absolute;inset:0;background:radial-gradient(400px 300px at 0% 0%, var(--mw-card-accent) 0%, transparent 50%);opacity:0;transition:opacity .35s;pointer-events:none}
    .cliniq-mw-card:hover{transform:translateY(-4px);border-color:${C.borderHover};box-shadow:0 24px 60px rgba(0,0,0,0.45)}
    .cliniq-mw-card:hover::before{opacity:0.08}
    .cliniq-mw-card-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;position:relative;z-index:1}
    .cliniq-mw-icon-box{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;border:1px solid rgba(255,255,255,0.07);color:var(--mw-card-accent)}
    .cliniq-mw-icon-box svg{width:22px;height:22px}
    .cliniq-mw-card-name{font-family:'Instrument Serif',Georgia,serif;font-size:22px;line-height:1.2;letter-spacing:-0.01em;margin:14px 0 10px;position:relative;z-index:1}
    .cliniq-mw-card-tag{font-size:13.5px;color:${C.textDim};line-height:1.55;margin-bottom:16px;position:relative;z-index:1}
    .cliniq-mw-card-div{height:1px;background:${C.border};margin:10px 0 14px;position:relative;z-index:1}
    .cliniq-mw-bullets{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:9px;position:relative;z-index:1}
    .cliniq-mw-bullets li{font-size:13px;color:${C.text};display:flex;align-items:flex-start;gap:10px;line-height:1.4}
    .cliniq-mw-bullet-dot{width:5px;height:5px;border-radius:50%;background:var(--mw-card-accent);margin-top:7px;flex-shrink:0;box-shadow:0 0 6px var(--mw-card-accent)}

    /* Benefits list */
    .cliniq-mw-benefits{display:grid;grid-template-columns:1fr;gap:16px}
    @media(min-width:700px){.cliniq-mw-benefits{grid-template-columns:1fr 1fr}}
    .cliniq-mw-benefit{padding:22px 24px;border:1px solid ${C.border};border-radius:18px;background:${C.surface};display:flex;gap:14px;align-items:flex-start;transition:border-color .3s}
    .cliniq-mw-benefit:hover{border-color:rgba(200,255,94,0.25)}
    .cliniq-mw-benefit-check{width:22px;height:22px;border-radius:50%;background:${C.accentDim};border:1px solid rgba(200,255,94,0.4);color:${C.accent};display:grid;place-items:center;flex-shrink:0;margin-top:2px}
    .cliniq-mw-benefit-k{font-weight:700;font-size:15px;color:${C.text};margin-bottom:4px}
    .cliniq-mw-benefit-v{font-size:13.5px;color:${C.textDim};line-height:1.5}

    /* Steps */
    .cliniq-mw-steps{display:grid;grid-template-columns:1fr;gap:20px}
    @media(min-width:800px){.cliniq-mw-steps{grid-template-columns:repeat(3,1fr)}}
    .cliniq-mw-step{padding:28px;border:1px solid ${C.border};border-radius:22px;background:${C.surface};position:relative}
    .cliniq-mw-step-n{font-family:'Instrument Serif',Georgia,serif;font-size:44px;color:${C.accent};letter-spacing:-0.02em;line-height:1;margin-bottom:16px}
    .cliniq-mw-step-title{font-family:'Instrument Serif',Georgia,serif;font-size:24px;color:${C.text};letter-spacing:-0.01em;margin-bottom:8px}
    .cliniq-mw-step-body{font-size:13.5px;color:${C.textDim};line-height:1.55}

    /* Final CTA block */
    .cliniq-mw-final{margin-top:80px;padding:60px 40px;border:1px solid ${C.border};border-radius:28px;background:${C.surface};text-align:center;position:relative;overflow:hidden}
    .cliniq-mw-final::before{content:'';position:absolute;inset:0;background:radial-gradient(600px 300px at 50% 0%,rgba(200,255,94,0.10),transparent 60%);pointer-events:none}
    .cliniq-mw-final-title{font-family:'Instrument Serif',Georgia,serif;font-size:clamp(32px,4vw,52px);line-height:1.1;letter-spacing:-0.02em;margin-bottom:16px;position:relative}
    .cliniq-mw-final-sub{font-size:15px;color:${C.textDim};max-width:520px;margin:0 auto 28px;line-height:1.55;position:relative}

    /* Footer */
    .cliniq-mw-foot{margin-top:60px;padding-top:28px;border-top:1px solid ${C.border};display:flex;flex-wrap:wrap;gap:16px;align-items:center;justify-content:space-between;font-size:12px;color:${C.textMuted}}
    .cliniq-mw-foot a{color:${C.textDim};text-decoration:none}
    .cliniq-mw-foot a:hover{color:${C.accent}}

    /* Reveal */
    .cliniq-mw-reveal{opacity:0;transform:translateY(20px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1)}
    .cliniq-mw-reveal-in{opacity:1;transform:none}

    /* Responsive tightening */
    @media(max-width:540px){
      .cliniq-mw-shell{padding:20px 5vw 40px}
      .cliniq-mw-top{margin-bottom:50px}
      .cliniq-mw-brand-sub{display:none}
      .cliniq-mw-section-header{margin:60px 0 24px;gap:12px}
      .cliniq-mw-card{min-height:auto;padding:22px}
      .cliniq-mw-final{padding:44px 24px}
    }
  `
  document.head.appendChild(style)
}

// ─── Starfield canvas ──────────────────────────────────────────────────
function Stars() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let stars = []
    const draw = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = innerWidth * dpr
      canvas.height = innerHeight * dpr
      canvas.style.width = innerWidth + 'px'
      canvas.style.height = innerHeight + 'px'
      ctx.scale(dpr, dpr)
      stars = Array.from({ length: 180 }, () => ({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: 0.2 + Math.random() * 1.1,
        a: 0.05 + Math.random() * 0.45,
      }))
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      for (const s of stars) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200,225,255,${s.a})`
        ctx.fill()
      }
    }
    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [])
  return <canvas ref={ref} className="cliniq-mw-stars" />
}

// ─── Reveal on scroll ──────────────────────────────────────────────────
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect() } }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={'cliniq-mw-reveal' + (on ? ' cliniq-mw-reveal-in' : '')} style={{ transitionDelay: delay + 'ms' }}>
      {children}
    </div>
  )
}

// ─── Small components ──────────────────────────────────────────────────
function Pill({ children, color = C.accent }) {
  return (
    <span className="cliniq-mw-pill" style={{
      color,
      background: `${color}14`,
      border: `1px solid ${color}40`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
      {children}
    </span>
  )
}

function SectionHeader({ label, color }) {
  return (
    <div className="cliniq-mw-section-header">
      <Pill color={color}>{label}</Pill>
      <div className="cliniq-mw-rule" />
    </div>
  )
}

function FeatureCard({ feat }) {
  return (
    <div className="cliniq-mw-card" style={{ '--mw-card-accent': feat.accent }}>
      <div className="cliniq-mw-card-head">
        <div className="cliniq-mw-icon-box" style={{ background: `${feat.accent}12` }}>{feat.icon}</div>
        <Pill color={feat.accent}>{feat.label}</Pill>
      </div>
      <div className="cliniq-mw-card-name">{feat.name}</div>
      <div className="cliniq-mw-card-tag">{feat.tagline}</div>
      <div className="cliniq-mw-card-div" />
      <ul className="cliniq-mw-bullets">
        {feat.bullets.map(b => (
          <li key={b}><span className="cliniq-mw-bullet-dot" />{b}</li>
        ))}
      </ul>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────
export default function LandingPage({ onGetStarted }) {
  useEffect(() => { injectStyles() }, [])

  const greeting = useMemo(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning, doctor'
    if (h < 17) return 'Good afternoon, doctor'
    return 'Good evening, doctor'
  }, [])

  return (
    <div className="cliniq-mw">
      <Stars />
      <div className="cliniq-mw-glows" />

      <div className="cliniq-mw-shell">
        {/* Topbar */}
        <header className="cliniq-mw-top">
          <div className="cliniq-mw-brand">
            <div className="cliniq-mw-logo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
                <path d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2zM12 14v4M10 16h4" />
              </svg>
            </div>
            <div>
              <div className="cliniq-mw-brand-name">ClinIQ</div>
              <div className="cliniq-mw-brand-sub">Clinical decision support</div>
            </div>
          </div>
          <div className="cliniq-mw-live">
            <span className="cliniq-mw-live-dot" />
            All systems live
          </div>
        </header>

        {/* Hero */}
        <section className="cliniq-mw-hero">
          <Reveal>
            <div className="cliniq-mw-greet">
              <span className="cliniq-mw-greet-dot" />{greeting}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="cliniq-mw-title cliniq-mw-serif">
              Clinical intelligence,<br />
              <em>working on</em> your next case.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="cliniq-mw-sub">
              AI-assisted diagnosis, Bangladesh drug brands, clinical calculators,
              and a printable Rx pad — built for every doctor in every clinic.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="cliniq-mw-cta-row">
              <button className="cliniq-mw-btn cliniq-mw-btn-primary" onClick={onGetStarted}>Get started — free</button>
              <a className="cliniq-mw-btn cliniq-mw-btn-ghost" href="#features">See what’s inside</a>
            </div>
            <div className="cliniq-mw-micro">Free forever · No credit card · BMDC-verified doctors only</div>
          </Reveal>

          {/* Stats strip */}
          <Reveal delay={300}>
            <div className="cliniq-mw-stats">
              {STATS.map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div className="cliniq-mw-stat-n">{s.n}</div>
                  <div className="cliniq-mw-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Features */}
        <section id="features">
          <SectionHeader label="What’s inside" color={C.accent} />
          <div className="cliniq-mw-features">
            {FEATURES.map((f, i) => (
              <Reveal key={f.id} delay={i * 60}><FeatureCard feat={f} /></Reveal>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section>
          <SectionHeader label="Why doctors choose it" color="#60A5FA" />
          <div className="cliniq-mw-benefits">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.k} delay={i * 50}>
                <div className="cliniq-mw-benefit">
                  <div className="cliniq-mw-benefit-check">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <div className="cliniq-mw-benefit-k">{b.k}</div>
                    <div className="cliniq-mw-benefit-v">{b.v}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <SectionHeader label="From sign-up to prescription" color="#A78BFA" />
          <div className="cliniq-mw-steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="cliniq-mw-step">
                  <div className="cliniq-mw-step-n">{s.n}</div>
                  <div className="cliniq-mw-step-title">{s.title}</div>
                  <div className="cliniq-mw-step-body">{s.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <Reveal>
          <section className="cliniq-mw-final">
            <h2 className="cliniq-mw-final-title">
              Built for Bangladeshi doctors.<br />
              <em style={{ color: C.accent, fontStyle: 'normal' }}>Always free.</em>
            </h2>
            <p className="cliniq-mw-final-sub">
              Join the doctors already using ClinIQ to diagnose, prescribe, and follow up
              faster — with real BD brand names, BDT pricing, and MMCH Ward Book protocols.
            </p>
            <button className="cliniq-mw-btn cliniq-mw-btn-primary" onClick={onGetStarted}>
              Start for free
            </button>
            <div className="cliniq-mw-micro">Sign up takes under 30 seconds · BMDC number required</div>
          </section>
        </Reveal>

        {/* Footer */}
        <footer className="cliniq-mw-foot">
          <div>© {new Date().getFullYear()} ClinIQ · Built by Dr. Abrar Zahin</div>
          <div style={{ display: 'flex', gap: 18 }}>
            <a href="https://github.com/abrarzahin93/cliniq" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="mailto:abrar@abrarzahin.com">Contact</a>
            <span>v2.1</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
