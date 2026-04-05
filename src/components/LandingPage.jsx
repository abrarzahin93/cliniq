import { useEffect, useRef, useState } from 'react'

/*
 * ClinIQ Landing Page
 * Design DNA from fluent.health / avaros.ai:
 *  - Deep navy #051023 background
 *  - Lime green #bfff99 primary accent (pill CTAs)
 *  - Pale lavender #c6cef0 large headings
 *  - Ambient gradient orbs
 *  - Scroll-triggered reveal animations
 */

const L = {
  bg: '#051023',
  card1: '#081528',
  card2: '#0c1b37',
  accent: '#bfff99',
  accentDark: '#9fe67a',
  accent2: '#406ccf',
  text: '#c6cef0',
  textDim: '#b3c9ff',
  textMuted: 'rgba(198,206,240,0.5)',
  border: 'rgba(198,206,240,0.08)',
}

// Reveal on scroll hook
function useOnScreen(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function Reveal({ children, delay = 0, as = 'div', style }) {
  const [ref, visible] = useOnScreen()
  const Tag = as
  return (
    <Tag
      ref={ref}
      style={{
        ...style,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
      }}
    >
      {children}
    </Tag>
  )
}

const CTA = ({ children, onClick, variant = 'primary' }) => (
  <button
    onClick={onClick}
    className="cliniq-landing-cta"
    style={{
      background: variant === 'primary' ? L.accent : 'transparent',
      color: variant === 'primary' ? '#051023' : L.text,
      border: variant === 'primary' ? 'none' : `1px solid ${L.border}`,
      borderRadius: 100,
      padding: '14px 28px',
      fontSize: 15,
      fontWeight: 600,
      cursor: 'pointer',
      fontFamily: 'inherit',
      transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
  </button>
)

const featureIcons = {
  ai: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={L.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 2v10l7 3"/><circle cx="12" cy="12" r="2" fill={L.accent}/></svg>,
  drugs: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={L.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5a7.78 7.78 0 0 1-11-11l9-9a5.5 5.5 0 0 1 7.78 7.78l-5.78 5.78"/><path d="M8.5 8.5l7 7"/></svg>,
  calc: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={L.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="8" y2="10"/><line x1="12" y1="10" x2="12" y2="10"/><line x1="16" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="8" y2="14"/><line x1="12" y1="14" x2="12" y2="14"/><line x1="16" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>,
  globe: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={L.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
}

const features = [
  { icon: featureIcons.ai, title: 'AI-Powered Diagnosis', text: 'Trained on Davidson\'s, Harrison\'s & MMCH Ward Book. Suggests differentials, confidence scoring, and targeted investigations.' },
  { icon: featureIcons.drugs, title: 'Bangladesh Drug Database', text: 'Inline brand suggestions from BEXIMCO, ACI, Opsonin, Drug International, Square, Incepta, Renata & more.' },
  { icon: featureIcons.calc, title: 'Clinical Calculators', text: 'BMI, eGFR, CURB-65, GCS, Wells, IV fluid rates, pediatric dosing, lab interpretation — all at your fingertips.' },
  { icon: featureIcons.globe, title: 'Offline + Bangla', text: 'Works offline with local symptom checker. Full Bangla UI support for patient-facing questions.' },
]

const steps = [
  { n: '01', title: 'Sign up in seconds', text: 'Register with your BMDC number and medical college. No payment required.' },
  { n: '02', title: 'Enter patient data', text: 'Guided 5-step wizard: particulars, complaints, history, examination, systemic findings.' },
  { n: '03', title: 'Get clinical decisions', text: 'Instant diagnosis, differentials, investigations, treatment plan with BD drug brands, and printable prescription.' },
]

export default function LandingPage({ onGetStarted }) {
  return (
    <div className="cliniq-landing" style={{ background: L.bg, color: L.text, minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif", overflow: 'hidden', position: 'relative' }}>
      {/* Ambient orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,255,153,0.10), transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '20%', right: '-20%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(64,108,207,0.12), transparent 65%)', filter: 'blur(90px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '30%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(191,255,153,0.06), transparent 65%)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav className="cliniq-landing-nav" style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 6vw', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/icon-64.png" alt="ClinIQ" style={{ width: 32, height: 32, borderRadius: 8 }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: L.text, letterSpacing: -0.3 }}>ClinIQ</div>
        </div>
        <div className="cliniq-landing-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CTA onClick={onGetStarted}>Get Started</CTA>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 6vw 80px', maxWidth: 1400, margin: '0 auto' }}>
        <div className="cliniq-landing-hero-grid" style={{ display: 'grid', gap: 48, alignItems: 'center' }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: 'rgba(191,255,153,0.08)', border: `1px solid rgba(191,255,153,0.15)`, fontSize: 12, color: L.accent, marginBottom: 24, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: L.accent }}></span>
              Built for doctors in Bangladesh
            </div>
            <h1 className="cliniq-landing-h1" style={{ fontSize: 'clamp(42px, 7vw, 88px)', fontWeight: 600, lineHeight: 1.05, letterSpacing: -1.5, color: L.text, margin: 0, marginBottom: 20 }}>
              Clinical intelligence,<br/>
              <span style={{ color: L.accent }}>at your fingertips.</span>
            </h1>
            <p style={{ fontSize: 'clamp(16px, 1.5vw, 19px)', lineHeight: 1.6, color: L.textDim, marginBottom: 36, maxWidth: 560 }}>
              AI-powered diagnosis, treatment planning, and prescriptions with Bangladeshi drug brands.
              Trained on Davidson's, Harrison's, and the MMCH Ward Book.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <CTA onClick={onGetStarted}>Get Started — Free</CTA>
              <CTA onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} variant="ghost">See features</CTA>
            </div>
          </Reveal>

          {/* Phone mockup */}
          <Reveal delay={0.2}>
            <div className="cliniq-landing-mockup" style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: 280, height: 560, borderRadius: 42, background: 'linear-gradient(135deg, #0c1b37, #081528)', border: `1px solid ${L.border}`, padding: 12, boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(191,255,153,0.06)`, position: 'relative' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: 32, background: L.bg, padding: 24, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ fontSize: 11, color: L.textMuted, marginBottom: 4 }}>Good Morning</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: L.text, marginBottom: 20 }}>Dr. Abrar</div>
                  <div style={{ padding: '16px 14px', borderRadius: 14, background: L.card1, border: `1px solid ${L.border}`, marginBottom: 12 }}>
                    <div style={{ fontSize: 9, color: L.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Patients Today</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: L.accent }}>12</div>
                  </div>
                  <div style={{ padding: '16px 14px', borderRadius: 14, background: L.card1, border: `1px solid ${L.border}`, marginBottom: 12 }}>
                    <div style={{ fontSize: 9, color: L.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Current Diagnosis</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: L.text }}>Community Acquired Pneumonia</div>
                    <div style={{ display: 'inline-block', marginTop: 8, padding: '3px 10px', borderRadius: 100, background: 'rgba(191,255,153,0.12)', fontSize: 9, color: L.accent, fontWeight: 600 }}>HIGH CONFIDENCE</div>
                  </div>
                  <div style={{ padding: '14px', borderRadius: 14, background: L.card1, border: `1px solid ${L.border}` }}>
                    <div style={{ fontSize: 9, color: L.textMuted, marginBottom: 6 }}>Tab. Napa 500mg (BEXIMCO)</div>
                    <div style={{ fontSize: 11, color: L.textDim }}>1+1+1 — 5 days</div>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: 18, left: '50%', transform: 'translateX(-50%)', width: 60, height: 5, background: '#000', borderRadius: 100 }} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: '80px 6vw', maxWidth: 1400, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, color: L.accent, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, marginBottom: 12 }}>Features</div>
            <h2 className="cliniq-landing-h2" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: -1, color: L.text, margin: 0 }}>
              Everything a doctor needs,<br/>
              <span style={{ color: L.textMuted }}>in one app.</span>
            </h2>
          </div>
        </Reveal>
        <div className="cliniq-landing-features" style={{ display: 'grid', gap: 20 }}>
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ padding: 32, borderRadius: 20, background: L.card1, border: `1px solid ${L.border}`, height: '100%' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(191,255,153,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: L.text, margin: 0, marginBottom: 10, letterSpacing: -0.3 }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: L.textDim, margin: 0 }}>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 6vw', maxWidth: 1400, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ fontSize: 12, color: L.accent, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 600, marginBottom: 12 }}>How it works</div>
            <h2 className="cliniq-landing-h2" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: -1, color: L.text, margin: 0 }}>
              From patient to prescription,<br/>
              <span style={{ color: L.textMuted }}>in under 2 minutes.</span>
            </h2>
          </div>
        </Reveal>
        <div className="cliniq-landing-steps" style={{ display: 'grid', gap: 20 }}>
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{ padding: 32, borderRadius: 20, background: L.card1, border: `1px solid ${L.border}` }}>
                <div style={{ fontSize: 42, fontWeight: 700, color: L.accent, lineHeight: 1, marginBottom: 14, letterSpacing: -1 }}>{s.n}</div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: L.text, margin: 0, marginBottom: 10, letterSpacing: -0.3 }}>{s.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: L.textDim, margin: 0 }}>{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Made for BD */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 6vw', maxWidth: 1400, margin: '0 auto' }}>
        <Reveal>
          <div style={{ padding: 'clamp(40px, 6vw, 72px)', borderRadius: 28, background: `linear-gradient(135deg, ${L.card2}, ${L.card1})`, border: `1px solid ${L.border}`, textAlign: 'center' }}>
            <h2 className="cliniq-landing-h2" style={{ fontSize: 'clamp(28px, 4.5vw, 48px)', fontWeight: 600, lineHeight: 1.15, letterSpacing: -0.8, color: L.text, margin: 0, marginBottom: 16 }}>
              Built for Bangladeshi doctors,<br/>
              <span style={{ color: L.accent }}>by a Bangladeshi doctor.</span>
            </h2>
            <p style={{ fontSize: 'clamp(14px, 1.3vw, 17px)', lineHeight: 1.6, color: L.textDim, margin: '0 auto 32px', maxWidth: 640 }}>
              Every prescription uses real Bangladeshi brand names and prices. MMCH Ward Book protocols.
              BMDC verification. Full Bangla language support. Free for all registered medical practitioners.
            </p>
            <CTA onClick={onGetStarted}>Start for Free</CTA>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, padding: '40px 6vw', maxWidth: 1400, margin: '0 auto', borderTop: `1px solid ${L.border}` }}>
        <div className="cliniq-landing-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/icon-64.png" alt="ClinIQ" style={{ width: 24, height: 24, borderRadius: 6 }} />
            <div style={{ fontSize: 13, color: L.textMuted }}>© 2026 ClinIQ. Clinical decision support tool — not a substitute for clinical judgment.</div>
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 13, color: L.textMuted }}>
            <a href="https://github.com/abrarzahin93/cliniq" target="_blank" rel="noopener noreferrer" style={{ color: L.textMuted, textDecoration: 'none' }}>GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
