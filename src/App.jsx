import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { createT } from './i18n.js'
import { findBDbrands, getBDprice } from './bdDrugs.js'

// Lazy-load ward book and symptom checker — they're large and not needed on initial render
let _wardBookSections = null
let _symptomChecker = null

async function getWardBook() {
  if (!_wardBookSections) {
    const mod = await import('./wardbook.js')
    _wardBookSections = mod.WARD_BOOK_SECTIONS
  }
  return _wardBookSections
}

async function getSymptomChecker() {
  if (!_symptomChecker) {
    _symptomChecker = await import('./symptomChecker.js')
  }
  return _symptomChecker
}

// ─── Theme — Navy + Blue Medical ─────────────────────────────────────
const T = {
  bg: '#060a14',
  card: 'rgba(255,255,255,0.03)',
  cardHover: 'rgba(255,255,255,0.06)',
  cardBorder: 'rgba(255,255,255,0.07)',
  glass: 'rgba(255,255,255,0.04)',
  glassBorder: 'rgba(255,255,255,0.10)',
  accent: '#4da3ff',        // medical blue from favicon
  accentDim: 'rgba(77,163,255,0.12)',
  accentDark: '#0a1628',
  green: '#34d399', greenDim: 'rgba(52,211,153,0.12)',
  amber: '#fbbf24', amberDim: 'rgba(251,191,36,0.10)',
  red: '#f87171', redDim: 'rgba(248,113,113,0.10)',
  text: '#edf2f7',
  textDim: 'rgba(255,255,255,0.55)',
  textMuted: 'rgba(255,255,255,0.30)',
  surface1: '#0d1322',
  surface2: '#131b2e',
  heading: "'Canela', Georgia, serif",
  body: "'Inter', -apple-system, sans-serif",
  bangla: "'Noto Sans Bengali', 'Inter', sans-serif",
  mono: "'IBM Plex Mono', monospace",
}

const blur = '20px'
const glassCard = {
  background: T.glass,
  backdropFilter: `blur(${blur})`,
  WebkitBackdropFilter: `blur(${blur})`,
  border: `1px solid ${T.glassBorder}`,
  borderRadius: 16,
}

// ─── Styles ──────────────────────────────────────────────────────────
const s = {
  container: { maxWidth: 920, margin: '0 auto', padding: '16px 12px', fontFamily: T.body },
  header: {
    ...glassCard,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '10px 14px', marginBottom: 20,
    flexWrap: 'wrap', gap: 8,
    position: 'sticky', top: 8, zIndex: 50,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 12 },
  logoIcon: {
    width: 38, height: 38, borderRadius: 10,
    background: T.surface1,
    border: `1px solid ${T.glassBorder}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 4, overflow: 'hidden',
  },
  logoText: { fontFamily: T.heading, fontWeight: 500, fontSize: 22, color: T.text, letterSpacing: -0.3 },
  logoSub: { fontFamily: T.mono, fontSize: 10, color: T.textMuted, marginTop: 1, letterSpacing: 0.5, textTransform: 'uppercase' },
  btn: (bg, color = '#000') => ({
    padding: '10px 22px', border: 'none', borderRadius: 10, cursor: 'pointer',
    fontWeight: 600, fontSize: 14, color, background: bg,
    transition: 'all 0.25s ease', fontFamily: T.body,
  }),
  btnSm: (bg, color = '#000') => ({
    padding: '7px 16px', border: 'none', borderRadius: 8, cursor: 'pointer',
    fontWeight: 600, fontSize: 12, color, background: bg,
    transition: 'all 0.25s ease', fontFamily: T.body,
  }),
  btnOutline: {
    padding: '10px 22px', border: `1px solid ${T.glassBorder}`, borderRadius: 10,
    cursor: 'pointer', fontWeight: 500, fontSize: 14, color: T.textDim,
    background: 'rgba(255,255,255,0.05)', transition: 'all 0.25s ease', fontFamily: T.body,
    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
  },
  card: {
    ...glassCard, padding: '18px 16px', marginBottom: 14,
  },
  label: {
    fontFamily: T.mono, fontSize: 10, fontWeight: 500, color: T.textMuted,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6, display: 'block',
  },
  input: {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.cardBorder}`,
    borderRadius: 10, color: T.text, fontSize: 15, outline: 'none', fontFamily: T.body,
    transition: 'border-color 0.25s, background 0.25s',
  },
  textarea: {
    width: '100%', padding: '10px 14px',
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.cardBorder}`,
    borderRadius: 10, color: T.text, fontSize: 15, outline: 'none', fontFamily: T.body,
    minHeight: 90, resize: 'vertical', transition: 'border-color 0.25s, background 0.25s',
  },
  grid: (cols, gap = 14) => ({
    display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap,
  }),
  progressBar: { display: 'flex', gap: 4, marginBottom: 18 },
  progressStep: (active, done) => ({
    flex: 1, height: 4, borderRadius: 3,
    background: done ? T.accent : active
      ? `linear-gradient(90deg, ${T.accent}, rgba(77,163,255,0.3), ${T.accent})`
      : 'rgba(255,255,255,0.06)',
    backgroundSize: active ? '200% 100%' : 'auto',
    animation: active ? 'progressShimmer 2s ease infinite' : 'none',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  }),
  stepTitle: {
    fontFamily: T.heading, fontSize: 18, color: T.accent, marginBottom: 18,
    letterSpacing: -0.2,
  },
  badge: (color, bgColor) => ({
    display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 10,
    fontWeight: 600, fontFamily: T.mono, color, background: bgColor, textTransform: 'uppercase',
    letterSpacing: 0.5,
  }),
  tab: (active) => ({
    padding: '10px 20px', border: 'none', borderRadius: 10, cursor: 'pointer',
    fontWeight: 600, fontSize: 13, fontFamily: T.body,
    color: active ? '#000' : T.textMuted,
    background: active ? T.accent : 'transparent',
    transition: 'all 0.25s ease',
  }),
  toggle: (active) => ({
    padding: '7px 14px', border: `1px solid ${active ? T.accent : T.cardBorder}`,
    borderRadius: 9, cursor: 'pointer', fontWeight: 500, fontSize: 13,
    color: active ? '#000' : T.textDim,
    background: active ? T.accent : 'rgba(255,255,255,0.04)',
    transition: 'all 0.25s ease', fontFamily: T.body,
  }),
  disclaimer: {
    ...glassCard,
    background: 'rgba(251,191,36,0.06)',
    border: '1px solid rgba(251,191,36,0.15)',
    padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'flex-start', gap: 10,
  },
  spinner: {
    width: 28, height: 28, border: '2.5px solid rgba(255,255,255,0.06)',
    borderTop: `2.5px solid ${T.accent}`,
    borderRadius: '50%', animation: 'spin 0.7s linear infinite, pulseGlow 2s ease infinite',
  },
  rxPad: {
    ...glassCard, padding: '28px 24px', maxWidth: 640, margin: '0 auto',
  },
  rxPadPrint: {
    background: '#fff', color: '#111', padding: 40, borderRadius: 8,
    fontFamily: "'Inter', sans-serif", maxWidth: 640, margin: '0 auto',
  },
  statBox: (color) => ({
    ...glassCard, padding: '18px 22px', flex: 1, minWidth: 140,
    borderLeft: `3px solid ${color}`,
  }),
  medexLink: {
    color: T.accent, fontSize: 11, fontFamily: T.mono, textDecoration: 'none',
    padding: '3px 10px', border: `1px solid rgba(77,163,255,0.2)`, borderRadius: 6,
    display: 'inline-block', transition: 'all 0.25s',
    background: 'rgba(77,163,255,0.06)',
  },
}

// ─── localStorage ────────────────────────────────────────────────────
function loadPatientLog() {
  try { return JSON.parse(localStorage.getItem(LOG_KEY_V2) || '[]') }
  catch { return [] }
}

function savePatientLog(log) {
  localStorage.setItem(LOG_KEY_V2, JSON.stringify(log))
}

function addToLog(entry) {
  const log = loadPatientLog()
  log.unshift(entry)
  savePatientLog(log)
  return log
}

function updateLogEntry(id, updates) {
  const log = loadPatientLog()
  const idx = log.findIndex(e => e.id === id)
  if (idx !== -1) log[idx] = { ...log[idx], ...updates }
  savePatientLog(log)
  return log
}

function loadPatientLogForDoctor(doctorId) {
  return loadPatientLog().filter(e => e.doctorId === doctorId)
}

// ─── API sync ────────────────────────────────────────────────────────
const API_BASE = '/api'
const ADMIN_KEY = 'cliniq-admin-abrar-2024'

function apiPost(path, body) {
  fetch(API_BASE + path, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {}) // fire-and-forget
}

async function apiAdminStats() {
  const res = await fetch(API_BASE + '/admin/stats', { headers: { 'x-admin-key': ADMIN_KEY } })
  if (!res.ok) throw new Error('Unauthorized')
  return res.json()
}

// ─── Doctor Identity ─────────────────────────────────────────────────
const DOC_KEY = 'cliniq_doctor'
const LOG_KEY_V2 = 'cliniq_patient_log_v2'

function loadDoctor() {
  try { return JSON.parse(localStorage.getItem(DOC_KEY)) } catch { return null }
}

function saveDoctor(doc) {
  localStorage.setItem(DOC_KEY, JSON.stringify(doc))
}

function clearDoctor() {
  localStorage.removeItem(DOC_KEY)
}

// ─── MedEx helpers ───────────────────────────────────────────────────
function medexSearchUrl(drugName) {
  return `https://medex.com.bd/brands?search=${encodeURIComponent(drugName)}`
}

// ─── API ─────────────────────────────────────────────────────────────
const SYSTEM_DIAGNOSIS = `You are a clinical decision support system trained on Davidson's Principles and Practice of Medicine and Harrison's Principles of Internal Medicine. Analyze the patient data and respond ONLY with valid JSON matching this exact shape:
{
  "primary_diagnosis": "string",
  "diagnosis_reasoning": "string",
  "confidence": "high" | "medium" | "low",
  "differentials": [{"diagnosis": "string", "key_feature": "string", "likelihood": "string"}],
  "investigations": [{"test": "string", "rationale": "string", "priority": "urgent" | "routine"}]
}
Do not include any text outside the JSON object.`

const SYSTEM_PROBING = `You are a clinical decision support system. Given the patient's initial data and preliminary differential diagnoses, generate 5-8 targeted follow-up questions the examining doctor should ask the patient to refine the diagnosis.

Your questions should:
- Probe for red flag symptoms the patient may not have mentioned voluntarily
- Clarify ambiguous or vague presentations
- Check for associated symptoms that differentiate between the top differential diagnoses
- Explore relevant risk factors (occupational, travel, contact, dietary)

Respond ONLY with valid JSON matching this exact shape:
{
  "questions": [
    {"id": 1, "question": "string", "category": "red_flag" | "clarification" | "associated" | "risk_factor", "reason": "string"}
  ]
}
Do not include any text outside the JSON object.`

async function searchWardBook(diagnosis) {
  const sections = await getWardBook()
  const terms = diagnosis.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2)
  const scored = sections.map(section => {
    const hay = (section.title + ' ' + section.content).toLowerCase()
    let score = 0
    for (const term of terms) {
      if (hay.includes(term)) score += (section.title.toLowerCase().includes(term) ? 3 : 1)
    }
    return { ...section, score }
  }).filter(s => s.score > 0).sort((a, b) => b.score - a.score)
  const results = []
  let totalLen = 0
  for (const sec of scored) {
    if (totalLen + sec.content.length > 20000) break
    results.push(sec)
    totalLen += sec.content.length
  }
  return results
}

const SYSTEM_TREATMENT = (type, wardBookContext) => {
  let base = `You are a clinical decision support system. Provide a ${type} treatment plan.`
  if (wardBookContext) {
    base += `\n\nCRITICAL: You MUST follow the MMCH Ward Book protocols below EXACTLY. Do NOT deviate from these protocols. Use the EXACT drug names, doses, routes, and frequencies written in the ward book. Do NOT substitute, modify, or add drugs that are not in the protocol. If the ward book says "Inj. Ceftriaxone 1gm IV 12 hourly", you must prescribe exactly that — not a different antibiotic or different dose. Only add drugs beyond the ward book protocol if there is a clear clinical need not covered by the protocol.\n\nMMCH WARD BOOK PROTOCOL:\n${wardBookContext}`
  }
  base += `\n\nRespond ONLY with valid JSON matching this exact shape:
{
  "treatment_plan": [{"step": "string", "details": "string", "priority": "immediate" | "short-term" | "long-term"}],
  "medications": [{"drug": "string", "dose": "string", "route": "string", "frequency": "string", "duration": "string", "notes": "string"}],
  "monitoring": "string",
  "patient_advice": "string",
  "follow_up": "string",
  "red_flags": "string"
}
Do not include any text outside the JSON object.`
  return base
}

async function callClaude(systemPrompt, userMessage) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('API key not configured. Add VITE_ANTHROPIC_API_KEY to your .env file.')
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `API error ${res.status}`)
  }
  const data = await res.json()
  let text = data.content[0].text
  // Strip markdown code fences if present (```json ... ```)
  text = text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()
  return JSON.parse(text)
}

function buildPatientSummary(p) {
  const lines = []
  lines.push(`Patient: ${p.name || 'N/A'}, Age: ${p.age || 'N/A'}, Sex: ${p.sex || 'N/A'}, Weight: ${p.weight || 'N/A'} kg`)
  const vitals = []
  if (p.bp) vitals.push(`BP: ${p.bp}`)
  if (p.pulse) vitals.push(`Pulse: ${p.pulse}/min`)
  if (p.temp) vitals.push(`Temp: ${p.temp}°F`)
  if (p.spo2) vitals.push(`SpO2: ${p.spo2}%`)
  if (p.rr) vitals.push(`RR: ${p.rr}/min`)
  if (vitals.length) lines.push(`Vitals: ${vitals.join(', ')}`)
  if (p.complaints) lines.push(`Chief Complaints: ${p.complaints}`)
  if (p.pastHistory) lines.push(`Past History: ${p.pastHistory}`)
  if (p.drugHistory) lines.push(`Drug History: ${p.drugHistory}`)
  if (p.investigations) lines.push(`Investigation History: ${p.investigations}`)
  if (p.socialFamily) lines.push(`Social/Family History: ${p.socialFamily}`)
  if (p.generalExam && typeof p.generalExam === 'object') {
    const ge = p.generalExam
    const parts = []
    if (ge.built) parts.push(`Built: ${ge.built}`)
    if (ge.nourishment) parts.push(`Nourishment: ${ge.nourishment}`)
    if (ge.decubitus) parts.push(`Decubitus: ${ge.decubitus}`)
    if (ge.pallor) parts.push(`Pallor: ${ge.pallor}`)
    if (ge.jaundice) parts.push(`Jaundice: ${ge.jaundice}`)
    if (ge.cyanosis) parts.push(`Cyanosis: ${ge.cyanosis}`)
    if (ge.clubbing) parts.push(`Clubbing: ${ge.clubbing}`)
    if (ge.koilonychia) parts.push(`Koilonychia: ${ge.koilonychia}`)
    if (ge.leukonychia) parts.push(`Leukonychia: ${ge.leukonychia}`)
    if (ge.lymphadenopathy) parts.push(`Lymphadenopathy: ${ge.lymphadenopathy}${ge.lymphDetails ? ` (${ge.lymphDetails})` : ''}`)
    if (ge.edema) parts.push(`Edema: ${ge.edema}${ge.edemaDetails ? ` - ${ge.edemaDetails}` : ''}`)
    if (ge.dehydration) parts.push(`Dehydration: ${ge.dehydration}`)
    if (ge.jvp) parts.push(`JVP: ${ge.jvp}`)
    if (ge.thyroid) parts.push(`Thyroid: ${ge.thyroid}`)
    if (ge.otherFindings) parts.push(`Other: ${ge.otherFindings}`)
    if (parts.length) lines.push(`General Examination: ${parts.join(', ')}`)
  } else if (p.generalExam) {
    lines.push(`General Examination: ${p.generalExam}`)
  }
  if (p.respiratory) lines.push(`Respiratory Exam: ${p.respiratory}`)
  if (p.abdominal) lines.push(`Abdominal Exam: ${p.abdominal}`)
  if (p.cnsCvs) lines.push(`CNS/CVS Exam: ${p.cnsCvs}`)
  return lines.join('\n')
}

function todayStr() { return new Date().toISOString().slice(0, 10) }

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ─── Components ──────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={s.label}>{label}</label>
      {children}
    </div>
  )
}

function InputField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <Field label={label}>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={s.input}
        onFocus={e => { e.target.style.borderColor = T.accent; e.target.style.background = 'rgba(255,255,255,0.07)' }}
        onBlur={e => { e.target.style.borderColor = T.cardBorder; e.target.style.background = 'rgba(255,255,255,0.04)' }}
      />
    </Field>
  )
}

function TextareaField({ label, value, onChange, placeholder, rows }) {
  return (
    <Field label={label}>
      <textarea
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} style={{ ...s.textarea, minHeight: rows ? rows * 24 : 100 }}
        onFocus={e => { e.target.style.borderColor = T.accent; e.target.style.background = 'rgba(255,255,255,0.07)' }}
        onBlur={e => { e.target.style.borderColor = T.cardBorder; e.target.style.background = 'rgba(255,255,255,0.04)' }}
      />
    </Field>
  )
}

function ToggleGroup({ label, options, value, onChange }) {
  return (
    <Field label={label}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map(opt => (
          <button key={opt} style={{ ...s.toggle(value === opt), padding: '6px 14px', fontSize: 12 }} onClick={() => onChange(value === opt ? '' : opt)}>
            {opt}
          </button>
        ))}
      </div>
    </Field>
  )
}

// ─── Wizard Steps ────────────────────────────────────────────────────
function Step1({ p, setP, t }) {
  return (
    <>
      <div style={s.stepTitle}>{t('step1Title')}</div>
      <div className="cliniq-grid-2" style={s.grid(2)}>
        <InputField label={t('patientName')} value={p.name} onChange={v => setP({ ...p, name: v })} placeholder={t('phFullName')} />
        <InputField label={t('age')} value={p.age} onChange={v => setP({ ...p, age: v })} placeholder={t('phYears')} type="number" />
      </div>
      <Field label={t('sex')}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[['male', 'Male'], ['female', 'Female'], ['other', 'Other']].map(([key, val]) => (
            <button key={val} style={s.toggle(p.sex === val)} onClick={() => setP({ ...p, sex: val })}>
              {t(key)}
            </button>
          ))}
        </div>
      </Field>
      <InputField label={t('weightKg')} value={p.weight} onChange={v => setP({ ...p, weight: v })} placeholder={t('phKg')} type="number" />
      <div style={{ ...s.stepTitle, marginTop: 16, fontSize: 12 }}>{t('vitals')}</div>
      <div className="cliniq-grid-3" style={s.grid(3)}>
        <InputField label={t('bloodPressure')} value={p.bp} onChange={v => setP({ ...p, bp: v })} placeholder={t('phBP')} />
        <InputField label={t('pulseMin')} value={p.pulse} onChange={v => setP({ ...p, pulse: v })} placeholder="72" type="number" />
        <InputField label={t('tempF')} value={p.temp} onChange={v => setP({ ...p, temp: v })} placeholder="98.6" />
      </div>
      <div className="cliniq-grid-2" style={s.grid(2)}>
        <InputField label={t('spo2Pct')} value={p.spo2} onChange={v => setP({ ...p, spo2: v })} placeholder="98" type="number" />
        <InputField label={t('respRate')} value={p.rr} onChange={v => setP({ ...p, rr: v })} placeholder="16" type="number" />
      </div>
    </>
  )
}

function Step2({ p, setP, t }) {
  return (
    <>
      <div style={s.stepTitle}>{t('step2Title')}</div>
      <TextareaField
        label={t('chiefComplaints')}
        value={p.complaints} onChange={v => setP({ ...p, complaints: v })}
        placeholder={t('phComplaints')}
        rows={6}
      />
    </>
  )
}

function Step3({ p, setP, t }) {
  return (
    <>
      <div style={s.stepTitle}>{t('step3Title')}</div>
      <TextareaField label={t('pastMedicalHistory')} value={p.pastHistory} onChange={v => setP({ ...p, pastHistory: v })} placeholder={t('phPastHistory')} rows={3} />
      <TextareaField label={t('drugHistory')} value={p.drugHistory} onChange={v => setP({ ...p, drugHistory: v })} placeholder={t('phDrugHistory')} rows={3} />
      <TextareaField label={t('investigationHistory')} value={p.investigations} onChange={v => setP({ ...p, investigations: v })} placeholder={t('phInvestigations')} rows={3} />
      <TextareaField label={t('socialFamilyHistory')} value={p.socialFamily} onChange={v => setP({ ...p, socialFamily: v })} placeholder={t('phSocialFamily')} rows={3} />
    </>
  )
}

function Step4({ p, setP, t }) {
  const ge = (typeof p.generalExam === 'object' && p.generalExam) ? p.generalExam : {}
  const updateGE = (field, value) => setP({ ...p, generalExam: { ...ge, [field]: value } })

  return (
    <>
      <div style={s.stepTitle}>{t('step4Title')}</div>

      <div style={{ fontFamily: T.heading, fontSize: 15, color: T.textDim, marginBottom: 12 }}>{t('generalSurvey')}</div>
      <div className="cliniq-grid-3" style={s.grid(3)}>
        <ToggleGroup label={t('built')} options={[t('average'), t('thin'), t('obese')]} value={ge.built || ''} onChange={v => updateGE('built', v)} />
        <ToggleGroup label={t('nourishment')} options={[t('well'), t('moderate'), t('poor')]} value={ge.nourishment || ''} onChange={v => updateGE('nourishment', v)} />
        <InputField label={t('decubitus')} value={ge.decubitus || ''} onChange={v => updateGE('decubitus', v)} placeholder={t('phDecubitus')} />
      </div>

      <div style={{ fontFamily: T.heading, fontSize: 15, color: T.textDim, marginBottom: 12, marginTop: 8 }}>{t('inspectionFindings')}</div>
      <div className="cliniq-grid-3" style={s.grid(3)}>
        <ToggleGroup label={t('pallorAnaemia')} options={[t('absent'), t('mild'), t('moderate'), t('severe')]} value={ge.pallor || ''} onChange={v => updateGE('pallor', v)} />
        <ToggleGroup label={t('jaundiceIcterus')} options={[t('absent'), t('present')]} value={ge.jaundice || ''} onChange={v => updateGE('jaundice', v)} />
        <ToggleGroup label={t('cyanosis')} options={[t('absent'), t('peripheral'), t('central')]} value={ge.cyanosis || ''} onChange={v => updateGE('cyanosis', v)} />
        <ToggleGroup label={t('clubbing')} options={[t('absent'), t('present')]} value={ge.clubbing || ''} onChange={v => updateGE('clubbing', v)} />
        <ToggleGroup label={t('koilonychia')} options={[t('absent'), t('present')]} value={ge.koilonychia || ''} onChange={v => updateGE('koilonychia', v)} />
        <ToggleGroup label={t('leukonychia')} options={[t('absent'), t('present')]} value={ge.leukonychia || ''} onChange={v => updateGE('leukonychia', v)} />
      </div>

      <div style={{ fontFamily: T.heading, fontSize: 15, color: T.textDim, marginBottom: 12, marginTop: 8 }}>{t('otherFindings')}</div>
      <div className="cliniq-grid-2" style={s.grid(2)}>
        <div>
          <ToggleGroup label={t('lymphadenopathy')} options={[t('absent'), t('present')]} value={ge.lymphadenopathy || ''} onChange={v => updateGE('lymphadenopathy', v)} />
          {ge.lymphadenopathy === t('present') && (
            <InputField label={t('lymphNodeDetails')} value={ge.lymphDetails || ''} onChange={v => updateGE('lymphDetails', v)} placeholder={t('phLymphDetails')} />
          )}
        </div>
        <div>
          <ToggleGroup label={t('edema')} options={[t('absent'), t('pitting'), t('nonPitting')]} value={ge.edema || ''} onChange={v => updateGE('edema', v)} />
          {ge.edema && ge.edema !== t('absent') && (
            <InputField label={t('edemaLocation')} value={ge.edemaDetails || ''} onChange={v => updateGE('edemaDetails', v)} placeholder={t('phEdemaLocation')} />
          )}
        </div>
      </div>
      <div className="cliniq-grid-3" style={s.grid(3)}>
        <ToggleGroup label={t('dehydration')} options={[t('none'), t('mild'), t('moderate'), t('severe')]} value={ge.dehydration || ''} onChange={v => updateGE('dehydration', v)} />
        <ToggleGroup label={t('jvp')} options={[t('normal'), t('raised')]} value={ge.jvp || ''} onChange={v => updateGE('jvp', v)} />
        <ToggleGroup label={t('thyroid')} options={[t('normal'), t('enlarged')]} value={ge.thyroid || ''} onChange={v => updateGE('thyroid', v)} />
      </div>

      <TextareaField label={t('additionalNotes')} value={ge.otherFindings || ''} onChange={v => updateGE('otherFindings', v)} placeholder={t('phOtherFindings')} rows={3} />
    </>
  )
}

function Step5({ p, setP, t }) {
  return (
    <>
      <div style={s.stepTitle}>{t('step5Title')}</div>
      <TextareaField label={t('respiratorySystem')} value={p.respiratory} onChange={v => setP({ ...p, respiratory: v })} placeholder={t('phRespiratory')} rows={3} />
      <TextareaField label={t('abdominalExam')} value={p.abdominal} onChange={v => setP({ ...p, abdominal: v })} placeholder={t('phAbdominal')} rows={3} />
      <TextareaField label={t('cnsCvs')} value={p.cnsCvs} onChange={v => setP({ ...p, cnsCvs: v })} placeholder={t('phCnsCvs')} rows={3} />
    </>
  )
}

const STEPS = [Step1, Step2, Step3, Step4, Step5]

// ─── Result Tabs ─────────────────────────────────────────────────────
function ConfidenceBadge({ level }) {
  const m = { high: [T.green, T.greenDim], medium: [T.amber, T.amberDim], low: [T.red, T.redDim] }
  const [c, bg] = m[level] || m.medium
  return <span style={s.badge(c, bg)}>{level}</span>
}

function PriorityBadge({ level }) {
  const m = {
    urgent: [T.red, T.redDim], immediate: [T.red, T.redDim],
    routine: [T.accent, T.accentDim], 'short-term': [T.amber, T.amberDim],
    'long-term': [T.green, T.greenDim],
  }
  const [c, bg] = m[level] || [T.textDim, T.cardBorder]
  return <span style={s.badge(c, bg)}>{level}</span>
}

function DiagnosisTab({ dx }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h3 style={{ fontSize: 24, fontWeight: 500, color: T.text, fontFamily: T.heading }}>{dx.primary_diagnosis}</h3>
        <ConfidenceBadge level={dx.confidence} />
      </div>
      <div style={{ ...s.card, background: '#0f172a' }}>
        <div style={s.label}>Clinical Reasoning</div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: T.textDim }}>{dx.diagnosis_reasoning}</p>
      </div>
      <div style={s.label}>Differential Diagnoses</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {dx.differentials?.map((d, i) => (
          <div key={i} style={{ ...s.card, padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: T.text }}>{d.diagnosis}</div>
              <div style={{ fontSize: 13, color: T.textDim, marginTop: 2 }}>{d.key_feature}</div>
            </div>
            <span style={s.badge(T.textDim, T.cardBorder)}>{d.likelihood}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function InvestigationsTab({ inv }) {
  const [checked, setChecked] = useState({})
  return (
    <div>
      <div style={s.label}>Recommended Investigations</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {inv?.map((item, i) => (
          <div key={i} style={{ ...s.card, padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12, opacity: checked[i] ? 0.5 : 1 }}>
            <input
              type="checkbox" checked={!!checked[i]}
              onChange={() => setChecked(p => ({ ...p, [i]: !p[i] }))}
              style={{ marginTop: 4, accentColor: T.accent, width: 16, height: 16 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 15, color: T.text, textDecoration: checked[i] ? 'line-through' : 'none' }}>{item.test}</span>
                <PriorityBadge level={item.priority} />
              </div>
              <div style={{ fontSize: 13, color: T.textDim, marginTop: 4 }}>{item.rationale}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TreatmentTab({ tx }) {
  return (
    <div>
      <div style={s.label}>Treatment Plan</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {tx.treatment_plan?.map((step, i) => (
          <div key={i} style={{ ...s.card, padding: '14px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontFamily: T.mono, fontSize: 12, color: T.accent }}>STEP {i + 1}</span>
              <PriorityBadge level={step.priority} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, color: T.text, marginBottom: 4 }}>{step.step}</div>
            <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.6 }}>{step.details}</div>
          </div>
        ))}
      </div>
      {tx.monitoring && (
        <div style={{ ...s.card, background: '#0f172a', marginBottom: 12 }}>
          <div style={s.label}>Monitoring</div>
          <p style={{ fontSize: 14, color: T.textDim, lineHeight: 1.6 }}>{tx.monitoring}</p>
        </div>
      )}
      {tx.patient_advice && (
        <div style={{ ...s.card, background: '#0f172a', marginBottom: 12 }}>
          <div style={s.label}>Patient Advice</div>
          <p style={{ fontSize: 14, color: T.textDim, lineHeight: 1.6 }}>{tx.patient_advice}</p>
        </div>
      )}
      {tx.follow_up && (
        <div style={{ ...s.card, background: '#0f172a', marginBottom: 12 }}>
          <div style={s.label}>Follow-up</div>
          <p style={{ fontSize: 14, color: T.textDim, lineHeight: 1.6 }}>{tx.follow_up}</p>
        </div>
      )}
      {tx.red_flags && (
        <div style={{ ...s.card, background: T.redDim, border: `1px solid ${T.red}40` }}>
          <div style={{ ...s.label, color: T.red }}>Red Flags</div>
          <p style={{ fontSize: 14, color: T.text, lineHeight: 1.6 }}>{tx.red_flags}</p>
        </div>
      )}
    </div>
  )
}

function RxMedLine({ med, index }) {
  const [showDropdown, setShowDropdown] = useState(false)
  const brands = findBDbrands(med.drug)
  const [selectedBrand, setSelectedBrand] = useState(brands[0] || null)

  // Derive dosage form prefix from route
  const formPrefix = (med.route || '').toLowerCase().includes('iv') || (med.route || '').toLowerCase().includes('inj')
    ? 'Inj.' : (med.route || '').toLowerCase().includes('syrup') || (med.route || '').toLowerCase().includes('susp')
    ? 'Syr.' : (selectedBrand?.form || '').toLowerCase().includes('capsule')
    ? 'Cap.' : (selectedBrand?.form || '').toLowerCase().includes('inhaler')
    ? 'Inh.' : (selectedBrand?.form || '').toLowerCase().includes('suppository')
    ? 'Supp.' : (selectedBrand?.form || '').toLowerCase().includes('syrup')
    ? 'Syr.' : 'Tab.'

  const brandName = selectedBrand ? selectedBrand.name : med.drug
  const company = selectedBrand ? selectedBrand.company : ''

  return (
    <div style={{ padding: '14px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
      {/* Line 1: Tab. BrandName Dose (Company) [dropdown] */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: T.textMuted, fontFamily: T.mono, minWidth: 32 }}>{formPrefix}</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>{brandName}</span>
        <span style={{ fontSize: 14, color: T.textDim }}>{med.dose}</span>
        {company && <span style={{ fontSize: 11, color: T.accent, fontFamily: T.mono }}>({company})</span>}
        {brands.length > 1 && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              className="no-print"
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ background: 'none', border: `1px solid ${T.cardBorder}`, borderRadius: 6, padding: '2px 8px', cursor: 'pointer', fontSize: 10, color: T.textMuted, fontFamily: T.mono }}
            >
              {showDropdown ? 'close' : 'others'} &#9662;
            </button>
            {showDropdown && (
              <div className="no-print" style={{ position: 'absolute', top: '100%', left: 0, zIndex: 20, marginTop: 4, background: T.surface1, border: `1px solid ${T.glassBorder}`, borderRadius: 10, padding: 6, minWidth: 200, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                {brands.map((b, j) => (
                  <div
                    key={j}
                    onClick={() => { setSelectedBrand(b); setShowDropdown(false) }}
                    style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selectedBrand?.name === b.name ? T.accentDim : 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => { if (selectedBrand?.name !== b.name) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                    onMouseLeave={e => { if (selectedBrand?.name !== b.name) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{b.name}</span>
                    <span style={{ fontSize: 10, color: T.textMuted, fontFamily: T.mono }}>{b.company}</span>
                  </div>
                ))}
                <a href={medexSearchUrl(med.drug)} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: '8px 12px', fontSize: 11, color: T.accent, textDecoration: 'none', fontFamily: T.mono, borderTop: `1px solid ${T.cardBorder}`, marginTop: 4 }}>
                  More on MedEx &rarr;
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Line 2: Generic name in small italic */}
      <div style={{ fontSize: 11, color: T.textMuted, fontStyle: 'italic', marginTop: 2, paddingLeft: 38 }}>
        {med.drug}
      </div>

      {/* Line 3: Frequency ————— Duration */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, paddingLeft: 38 }}>
        <span style={{ fontSize: 14, color: T.text, fontWeight: 500 }}>{med.frequency}</span>
        <span style={{ flex: 1, borderBottom: `1px dashed ${T.cardBorder}`, minWidth: 40 }} />
        <span style={{ fontSize: 14, color: T.text }}>{med.duration}</span>
      </div>

      {/* Line 4: Doctor-only info (no-print) — reason + route + price */}
      <div className="no-print" style={{ marginTop: 6, paddingLeft: 38, fontSize: 11, color: T.textMuted, fontStyle: 'italic', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {med.notes && <span>({med.notes})</span>}
        {med.route && <span style={{ color: T.textDim }}>Route: {med.route}</span>}
        {(() => { const p = getBDprice(med.drug); return p ? <span style={{ color: T.amber, fontStyle: 'normal', fontFamily: T.mono, fontSize: 10 }}>~{p >= 100 ? `${p}` : `${p}`} BDT/unit</span> : null })()}
      </div>
    </div>
  )
}

function PrescriptionTab({ patient, dx, tx }) {
  return (
    <div>
      <div id="rx-print" style={s.rxPad}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${T.cardBorder}` }}>
          <div>
            <div style={{ fontFamily: T.heading, fontSize: 26, color: T.accent }}>Rx</div>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 2 }}>ClinIQ Prescription</div>
          </div>
          <div style={{ textAlign: 'right', fontSize: 13, color: T.textDim }}>
            <div>{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Patient info — compact one-liner */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 12, fontSize: 13 }}>
          <span><span style={{ color: T.textMuted }}>Name:</span> <span style={{ color: T.text, fontWeight: 600 }}>{patient.name || '—'}</span></span>
          <span><span style={{ color: T.textMuted }}>Age:</span> <span style={{ color: T.text }}>{patient.age || '—'}</span></span>
          <span><span style={{ color: T.textMuted }}>Sex:</span> <span style={{ color: T.text }}>{patient.sex || '—'}</span></span>
          {patient.weight && <span><span style={{ color: T.textMuted }}>Wt:</span> <span style={{ color: T.text }}>{patient.weight}kg</span></span>}
        </div>

        {/* Diagnosis */}
        <div style={{ marginBottom: 20, fontSize: 13 }}>
          <span style={{ color: T.textMuted }}>Dx:</span>{' '}
          <span style={{ color: T.accent, fontWeight: 500 }}>{dx?.primary_diagnosis || '—'}</span>
        </div>

        {/* Medications — proper prescription format */}
        <div style={{ marginBottom: 24 }}>
          {tx?.medications?.map((med, i) => (
            <RxMedLine key={i} med={med} index={i} />
          ))}
        </div>

        {/* Signature */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: `1px solid ${T.glassBorder}`, width: 180, marginBottom: 6 }} />
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Clinician Signature</div>
          </div>
        </div>
      </div>

      {/* Print button */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
        <button style={s.btn(T.accent)} onClick={() => window.print()}>
          Print Prescription
        </button>
      </div>
    </div>
  )
}

// ─── Probing Phase ───────────────────────────────────────────────────
const PROBING_CATEGORY_COLORS = {
  red_flag: [T.red, T.redDim],
  clarification: [T.amber, T.amberDim],
  associated: [T.accent, T.accentDim],
  risk_factor: [T.green, T.greenDim],
}

function ProbingPhase({ dxResult, probingQuestions, probingAnswers, setProbingAnswers, onRefine, onSkip, t: pt }) {
  const t = pt || (k => k)
  const updateAnswer = (id, value) => setProbingAnswers(prev => ({ ...prev, [id]: value }))
  const setQuickAnswer = (id, quick) => {
    const current = probingAnswers[id] || ''
    const cleaned = current.replace(/^(Yes|No|N\/A)\s*[-–—]?\s*/i, '').trim()
    updateAnswer(id, `${quick}${cleaned ? ' — ' + cleaned : ''}`)
  }

  return (
    <div>
      {/* Preliminary diagnosis */}
      <div style={{ ...s.card, borderLeft: `3px solid ${T.accent}` }}>
        <div style={s.label}>{t('preliminaryDiagnosis')}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
          <span style={{ fontFamily: T.heading, fontSize: 20, color: T.text }}>{dxResult?.primary_diagnosis}</span>
          {dxResult?.confidence && <ConfidenceBadge level={dxResult.confidence} />}
        </div>
        <div style={{ fontSize: 13, color: T.textMuted, marginTop: 6 }}>
          {t('probingInstructions')}
        </div>
      </div>

      {/* Loading or questions */}
      {!probingQuestions ? (
        <div style={{ ...s.card, textAlign: 'center', padding: 50 }}>
          <div style={{ ...s.spinner, margin: '0 auto 16px' }} />
          <div style={{ fontFamily: T.mono, fontSize: 13, color: T.accent }}>{t('generatingQuestions')}</div>
        </div>
      ) : (
        <>
          <div style={{ fontFamily: T.heading, fontSize: 16, color: T.textDim, marginBottom: 16 }}>
            {t('clinicalInterview')} — {probingQuestions.length} {t('questions')}
          </div>
          {probingQuestions.map((q, i) => {
            const [catColor, catBg] = PROBING_CATEGORY_COLORS[q.category] || [T.textDim, T.cardBorder]
            return (
              <div key={q.id} style={{ ...s.card, borderLeft: `3px solid ${catColor}`, padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted }}>Q{i + 1}</span>
                  <span style={s.badge(catColor, catBg)}>{q.category?.replace('_', ' ')}</span>
                </div>
                <div style={{ fontSize: 15, color: T.text, lineHeight: 1.5, marginBottom: 6 }}>{q.question}</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 12, fontFamily: T.mono }}>{q.reason}</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                  {[[t('yes'), 'Yes'], [t('no'), 'No'], [t('na'), 'N/A']].map(([label, val]) => (
                    <button
                      key={val}
                      style={{ ...s.toggle((probingAnswers[q.id] || '').startsWith(val)), padding: '5px 14px', fontSize: 12 }}
                      onClick={() => setQuickAnswer(q.id, val)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={probingAnswers[q.id] || ''}
                  onChange={e => updateAnswer(q.id, e.target.value)}
                  placeholder="Details or elaboration..."
                  style={{ ...s.input, fontSize: 13 }}
                  onFocus={e => { e.target.style.borderColor = T.accent; e.target.style.background = 'rgba(255,255,255,0.07)' }}
                  onBlur={e => { e.target.style.borderColor = T.cardBorder; e.target.style.background = 'rgba(255,255,255,0.04)' }}
                />
              </div>
            )
          })}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <button style={s.btnOutline} onClick={onSkip}>
              {t('skipConfirmDx')}
            </button>
            <button style={s.btn(T.accent)} onClick={onRefine}>
              {t('refineDiagnosis')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ─── Follow-up Scheduler ─────────────────────────────────────────────
function FollowUpScheduler({ logId, currentFollowUp, onSave }) {
  const [date, setDate] = useState(currentFollowUp?.date || '')
  const [notes, setNotes] = useState(currentFollowUp?.notes || '')

  const handleSave = () => {
    if (!date) return
    onSave(logId, { followUp: { scheduled: true, date, notes, completed: false } })
  }

  if (currentFollowUp?.scheduled && !currentFollowUp?.completed) {
    return (
      <div style={{ ...s.card, borderLeft: `3px solid ${T.amber}` }}>
        <div style={s.label}>Follow-up Scheduled</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={s.badge(T.amber, T.amberDim)}>{currentFollowUp.date}</span>
          {currentFollowUp.notes && (
            <span style={{ fontSize: 13, color: T.textDim }}>{currentFollowUp.notes}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ ...s.card, borderLeft: `3px solid ${T.accent}` }}>
      <div style={s.label}>Schedule Follow-up</div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label style={{ ...s.label, fontSize: 10 }}>Date</label>
          <input
            type="date" value={date} onChange={e => setDate(e.target.value)}
            min={todayStr()}
            style={{ ...s.input, colorScheme: 'dark' }}
          />
        </div>
        <div style={{ flex: 2, minWidth: 200 }}>
          <label style={{ ...s.label, fontSize: 10 }}>Notes (optional)</label>
          <input
            type="text" value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Review labs, adjust meds..."
            style={s.input}
          />
        </div>
        <button style={s.btn(T.accent)} onClick={handleSave}>Schedule</button>
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────
function Dashboard({ patientLog, setPatientLog, onLoadPatient, onViewDetail }) {
  const [search, setSearch] = useState('')
  const today = todayStr()

  const todaysPatients = useMemo(() =>
    patientLog.filter(e => e.date === today),
    [patientLog, today]
  )

  const followUpsDue = useMemo(() =>
    patientLog.filter(e => e.followUp?.scheduled && e.followUp.date === today && !e.followUp.completed),
    [patientLog, today]
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return patientLog
    const q = search.toLowerCase()
    return patientLog.filter(e =>
      (e.patient?.name || '').toLowerCase().includes(q) ||
      (e.dxResult?.primary_diagnosis || '').toLowerCase().includes(q)
    )
  }, [patientLog, search])

  const markFollowUpComplete = (id) => {
    const entry = patientLog.find(e => e.id === id)
    if (!entry) return
    const updated = updateLogEntry(id, { followUp: { ...entry.followUp, completed: true } })
    setPatientLog(updated)
  }

  const totalPatients = patientLog.length

  return (
    <div>
      {/* Stats */}
      <div className="cliniq-stats-row" style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={s.statBox(T.accent)}>
          <div style={{ ...s.label, marginBottom: 4 }}>Today</div>
          <div style={{ fontSize: 32, fontWeight: 500, color: T.text, fontFamily: T.heading }}>{todaysPatients.length}</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>patients seen</div>
        </div>
        <div style={s.statBox(T.amber)}>
          <div style={{ ...s.label, marginBottom: 4 }}>Follow-ups</div>
          <div style={{ fontSize: 32, fontWeight: 500, color: T.amber, fontFamily: T.heading }}>{followUpsDue.length}</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>due today</div>
        </div>
        <div style={s.statBox(T.green)}>
          <div style={{ ...s.label, marginBottom: 4 }}>Total</div>
          <div style={{ fontSize: 32, fontWeight: 500, color: T.text, fontFamily: T.heading }}>{totalPatients}</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>all records</div>
        </div>
      </div>

      {/* Follow-ups Due */}
      {followUpsDue.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ ...s.label, color: T.amber, fontSize: 13, marginBottom: 12 }}>Follow-ups Due Today</div>
          {followUpsDue.map(entry => (
            <div key={entry.id} style={{ ...s.card, borderLeft: `3px solid ${T.amber}`, padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 17, color: T.text, fontFamily: T.heading }}>{entry.patient?.name || 'Unknown'}</div>
                  <div style={{ fontSize: 13, color: T.textDim, marginTop: 2 }}>
                    {entry.patient?.age} / {entry.patient?.sex} &middot; Dx: {entry.dxResult?.primary_diagnosis}
                  </div>
                  {entry.followUp?.notes && (
                    <div style={{ fontSize: 13, color: T.amber, marginTop: 4 }}>Note: {entry.followUp.notes}</div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={s.btnSm(T.accent)} onClick={() => onLoadPatient(entry)}>Load Patient</button>
                  <button style={s.btnSm(T.green)} onClick={() => markFollowUpComplete(entry.id)}>Mark Complete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Today's Patients */}
      {todaysPatients.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ ...s.label, fontSize: 13, marginBottom: 12 }}>Today's Patients</div>
          {todaysPatients.map(entry => (
            <div
              key={entry.id}
              onClick={() => onViewDetail(entry)}
              style={{ ...s.card, padding: '14px 20px', cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.cardBorder}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 12, color: T.textMuted, minWidth: 60 }}>
                    {formatTime(entry.timestamp)}
                  </span>
                  <div>
                    <span style={{ fontWeight: 600, color: T.text }}>{entry.patient?.name || 'Unknown'}</span>
                    <span style={{ color: T.textMuted, fontSize: 13, marginLeft: 8 }}>
                      {entry.patient?.age}/{entry.patient?.sex}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, color: T.textDim }}>{entry.dxResult?.primary_diagnosis}</span>
                  {entry.dxResult?.confidence && <ConfidenceBadge level={entry.dxResult.confidence} />}
                  {entry.followUp?.scheduled && !entry.followUp?.completed && (
                    <span style={s.badge(T.amber, T.amberDim)}>F/U {entry.followUp.date}</span>
                  )}
                  {entry.followUp?.completed && (
                    <span style={s.badge(T.green, T.greenDim)}>F/U done</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Patient History */}
      <div>
        <div style={{ ...s.label, fontSize: 13, marginBottom: 12 }}>Patient History</div>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or diagnosis..."
          style={{ ...s.input, maxWidth: 400, marginBottom: 16 }}
          onFocus={e => e.target.style.borderColor = T.accent}
          onBlur={e => e.target.style.borderColor = T.cardBorder}
        />
        {filtered.length === 0 ? (
          <div style={{ ...s.card, textAlign: 'center', color: T.textMuted, padding: 40 }}>
            {patientLog.length === 0 ? 'No patient records yet. Complete a consultation to see records here.' : 'No matching records.'}
          </div>
        ) : (
          filtered.slice(0, 50).map(entry => (
            <div
              key={entry.id}
              onClick={() => onViewDetail(entry)}
              style={{ ...s.card, padding: '12px 20px', cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.cardBorder}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted, minWidth: 80 }}>
                    {entry.date}
                  </span>
                  <span style={{ fontWeight: 600, color: T.text, fontSize: 14 }}>{entry.patient?.name || 'Unknown'}</span>
                  <span style={{ color: T.textMuted, fontSize: 12 }}>{entry.patient?.age}/{entry.patient?.sex}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, color: T.textDim }}>{entry.dxResult?.primary_diagnosis}</span>
                  <span style={s.badge(T.textDim, T.cardBorder)}>{entry.treatmentType || 'dx only'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ─── Patient Detail View ─────────────────────────────────────────────
function PatientDetailView({ entry, onClose, onUpdateLog, onLoadPatient }) {
  const [activeTab, setActiveTab] = useState('diagnosis')
  const { patient, dxResult, txResult } = entry

  const tabs = [
    { id: 'diagnosis', label: 'Diagnosis', show: !!dxResult },
    { id: 'investigations', label: 'Investigations', show: !!dxResult?.investigations },
    { id: 'treatment', label: 'Treatment', show: !!txResult },
    { id: 'medications', label: 'Medications + BD Prices', show: !!txResult?.medications },
  ].filter(t => t.show)

  const handleFollowUpSave = (id, updates) => {
    onUpdateLog(id, updates)
  }

  return (
    <div>
      {/* Back bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <button style={s.btnOutline} onClick={onClose}>&larr; Back to Dashboard</button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={s.btnSm(T.accent)} onClick={() => onLoadPatient(entry)}>Load for New Consultation</button>
        </div>
      </div>

      {/* Patient summary */}
      <div style={{ ...s.card, borderLeft: `3px solid ${T.accent}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, color: T.text, fontFamily: T.heading }}>{patient?.name || 'Unknown'}</div>
            <div style={{ fontSize: 13, color: T.textDim, marginTop: 4 }}>
              {patient?.age} yrs / {patient?.sex} &middot; {patient?.weight ? `${patient.weight} kg` : ''} &middot; Seen: {entry.date} at {formatTime(entry.timestamp)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {dxResult?.confidence && <ConfidenceBadge level={dxResult.confidence} />}
            {entry.treatmentType && <span style={s.badge(T.textDim, T.cardBorder)}>{entry.treatmentType}</span>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <>
          <div className="cliniq-tabs" style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${T.cardBorder}`, marginBottom: 20 }}>
            {tabs.map(t => (
              <button key={t.id} style={s.tab(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={s.card}>
            {activeTab === 'diagnosis' && dxResult && <DiagnosisTab dx={dxResult} />}
            {activeTab === 'investigations' && dxResult && <InvestigationsTab inv={dxResult.investigations} />}
            {activeTab === 'treatment' && txResult && <TreatmentTab tx={txResult} />}
            {activeTab === 'medications' && txResult && (
              <MedicationsWithPrices medications={txResult.medications} />
            )}
          </div>
        </>
      )}

      {/* Follow-up */}
      <FollowUpScheduler
        logId={entry.id}
        currentFollowUp={entry.followUp}
        onSave={handleFollowUpSave}
      />
    </div>
  )
}

// ─── Medications with BD Prices ──────────────────────────────────────
function MedicationsWithPrices({ medications }) {
  return (
    <div>
      <div style={s.label}>Medications — Bangladesh Trade Names</div>
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>
        Showing top BD brands from priority manufacturers (BEXIMCO, ACI, OPSONIN, DRUG INTL, SQUARE)
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {medications?.map((med, i) => {
          const brands = findBDbrands(med.drug)
          return (
            <div key={i} style={{ ...s.card, padding: '16px 20px' }}>
              <div style={{ fontWeight: 500, fontSize: 17, color: T.text, fontFamily: T.heading }}>{med.drug}</div>
              <div style={{ fontSize: 13, color: T.textDim, marginTop: 4 }}>
                {med.dose} &middot; {med.route} &middot; {med.frequency} &middot; {med.duration}
              </div>
              {med.notes && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>{med.notes}</div>}
              {brands.length > 0 ? (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  {brands.map((b, j) => (
                    <div key={j} style={{ ...glassCard, padding: '6px 12px', borderRadius: 10, fontSize: 12 }}>
                      <span style={{ fontWeight: 600, color: T.accent }}>{b.name}</span>
                      <span style={{ color: T.textMuted, marginLeft: 6, fontSize: 10, fontFamily: T.mono }}>{b.company}</span>
                      <span style={{ color: T.textDim, marginLeft: 6, fontSize: 10 }}>{b.strength} {b.form}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <a href={medexSearchUrl(med.drug)} target="_blank" rel="noopener noreferrer" style={{ ...s.medexLink, marginTop: 8, display: 'inline-block' }}>Search MedEx &rarr;</a>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Spinner keyframes injection ─────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('cliniq-keyframes')) {
  const style = document.createElement('style')
  style.id = 'cliniq-keyframes'
  style.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    @keyframes pulseGlow { 0%, 100% { box-shadow: 0 0 0 0 rgba(77,163,255,0); } 50% { box-shadow: 0 0 20px 4px rgba(77,163,255,0.15); } }
    @keyframes progressShimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
    @keyframes breathe { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
    .cliniq-fade-in { animation: fadeInUp 0.4s ease both; }
    .cliniq-fade-in-delay-1 { animation: fadeInUp 0.4s ease 0.05s both; }
    .cliniq-fade-in-delay-2 { animation: fadeInUp 0.4s ease 0.1s both; }
    .cliniq-fade-in-delay-3 { animation: fadeInUp 0.4s ease 0.15s both; }
    .cliniq-scale-in { animation: scaleIn 0.3s ease both; }
    .cliniq-slide-in { animation: slideInRight 0.35s ease both; }
  `
  document.head.appendChild(style)
}

// ─── Responsive grid helper ──────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('cliniq-responsive')) {
  const style = document.createElement('style')
  style.id = 'cliniq-responsive'
  style.textContent = `
    @media (max-width: 640px) {
      .cliniq-grid-3 { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
      .cliniq-grid-2 { grid-template-columns: 1fr !important; gap: 10px !important; }
      .cliniq-tabs { gap: 4px !important; }
      .cliniq-tabs button { padding: 8px 14px !important; font-size: 12px !important; }
      .cliniq-stats-row { gap: 10px !important; }
      .cliniq-header-nav { gap: 10px !important; }
      .cliniq-header-actions { gap: 6px !important; }
      .cliniq-mobile-hide { display: none !important; }
    }
    @media (max-width: 420px) {
      .cliniq-grid-3 { grid-template-columns: 1fr !important; }
    }
    @media print {
      .no-print { display: none !important; }
    }
    .glass-hover:hover {
      background: rgba(255,255,255,0.06) !important;
      border-color: rgba(255,255,255,0.12) !important;
    }
  `
  document.head.appendChild(style)
}

// ─── BD Brand Pills ──────────────────────────────────────────────────
function BDbrands({ drugName }) {
  const brands = findBDbrands(drugName)
  if (!brands.length) return <a href={medexSearchUrl(drugName)} target="_blank" rel="noopener noreferrer" className="no-print" style={{ color: T.accent, fontSize: 10, textDecoration: 'none' }}>Search MedEx &rarr;</a>
  return (
    <div className="no-print" style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 3 }}>
      {brands.slice(0, 4).map((b, i) => (
        <span key={i} style={{ fontSize: 9, padding: '2px 7px', borderRadius: 6, background: 'rgba(77,163,255,0.1)', border: '1px solid rgba(77,163,255,0.15)', color: T.accent, fontFamily: T.mono, whiteSpace: 'nowrap' }}>
          {b.name} <span style={{ color: T.textMuted }}>({b.company})</span>
        </span>
      ))}
    </div>
  )
}

// ─── Welcome Screen ──────────────────────────────────────────────────
function WelcomeScreen({ onRegister, t }) {
  const [name, setName] = useState('')
  const handleSubmit = () => {
    if (!name.trim()) return
    const doc = { name: name.trim(), id: crypto.randomUUID?.() || String(Date.now()), registeredAt: new Date().toISOString() }
    saveDoctor(doc)
    apiPost('/register', doc)
    onRegister(doc)
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: T.body }}>
      <div style={{ ...glassCard, padding: 40, maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <img src="/favicon.png" alt="ClinIQ" style={{ width: 72, height: 72, borderRadius: 18, marginBottom: 20 }} />
        <div style={{ fontFamily: T.heading, fontSize: 28, color: T.text, marginBottom: 6 }}>ClinIQ</div>
        <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted, marginBottom: 28, textTransform: 'uppercase', letterSpacing: 1.5 }}>{t('clinicalDecisionSupport')}</div>
        <div style={{ fontSize: 15, color: T.textDim, marginBottom: 24 }}>Enter your name to get started</div>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="Dr. Your Name"
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          style={{ ...s.input, textAlign: 'center', fontSize: 16, marginBottom: 16 }}
        />
        <button style={{ ...s.btn(T.accent), width: '100%', padding: '14px 0', fontSize: 16 }} onClick={handleSubmit}>
          Start
        </button>
      </div>
    </div>
  )
}

// ─── Admin Panel ─────────────────────────────────────────────────────
function AdminPanel({ onClose }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    apiAdminStats().then(setStats).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', padding: 20, fontFamily: T.body }}>
      <div style={{ maxWidth: 920, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: T.heading, fontSize: 24, color: T.text }}>Admin Dashboard</div>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.textMuted }}>DR. ABRAR — DEVELOPER</div>
          </div>
          <button style={s.btnOutline} onClick={onClose}>Close</button>
        </div>

        {loading && <div style={{ ...s.card, textAlign: 'center', padding: 40 }}><div style={{ ...s.spinner, margin: '0 auto' }} /></div>}
        {error && <div style={{ ...s.card, color: T.red }}>Error: {error}</div>}

        {stats && (
          <>
            {/* Stats row */}
            <div className="cliniq-stats-row" style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
              <div style={s.statBox(T.accent)}>
                <div style={{ ...s.label, marginBottom: 4 }}>REGISTERED DOCTORS</div>
                <div style={{ fontSize: 32, fontWeight: 500, color: T.text, fontFamily: T.heading }}>{stats.totalDoctors}</div>
              </div>
              <div style={s.statBox(T.green)}>
                <div style={{ ...s.label, marginBottom: 4 }}>TOTAL CONSULTATIONS</div>
                <div style={{ fontSize: 32, fontWeight: 500, color: T.green, fontFamily: T.heading }}>{stats.totalConsultations}</div>
              </div>
            </div>

            {/* Doctors list */}
            <div style={{ ...s.label, fontSize: 13, marginBottom: 12 }}>Registered Doctors</div>
            {stats.doctors.map(doc => (
              <div key={doc.id} style={{ ...s.card, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, color: T.text, fontSize: 15 }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: T.textMuted, fontFamily: T.mono }}>
                    Registered: {doc.registeredAt?.slice(0, 10)} &middot; Last active: {doc.lastActive?.slice(0, 10) || 'Never'}
                  </div>
                </div>
                <span style={s.badge(T.accent, T.accentDim)}>{doc.totalPatients} patients</span>
              </div>
            ))}

            {/* Top Diagnoses */}
            {stats.topDiagnoses?.length > 0 && (
              <>
                <div style={{ ...s.label, fontSize: 13, marginBottom: 12, marginTop: 24 }}>Top Diagnoses</div>
                {stats.topDiagnoses.map(([dx, count], i) => (
                  <div key={i} style={{ ...s.card, padding: '10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: T.text, fontSize: 14 }}>{dx}</span>
                    <span style={s.badge(T.textDim, T.cardBorder)}>{count}</span>
                  </div>
                ))}
              </>
            )}

            {/* Daily Activity */}
            {Object.keys(stats.dailyActivity || {}).length > 0 && (
              <>
                <div style={{ ...s.label, fontSize: 13, marginBottom: 12, marginTop: 24 }}>Daily Activity (last entries)</div>
                <div style={s.card}>
                  {Object.entries(stats.dailyActivity).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 14).map(([date, count]) => (
                    <div key={date} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${T.cardBorder}` }}>
                      <span style={{ fontFamily: T.mono, fontSize: 13, color: T.textDim }}>{date}</span>
                      <span style={{ fontFamily: T.heading, fontSize: 15, color: T.text }}>{count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────
const INITIAL_GENERAL_EXAM = {
  built: '', nourishment: '', decubitus: '',
  pallor: '', jaundice: '', cyanosis: '', clubbing: '', koilonychia: '', leukonychia: '',
  lymphadenopathy: '', lymphDetails: '', edema: '', edemaDetails: '',
  dehydration: '', jvp: '', thyroid: '', otherFindings: '',
}

const INITIAL_PATIENT = {
  name: '', age: '', sex: '', weight: '',
  bp: '', pulse: '', temp: '', spo2: '', rr: '',
  complaints: '', pastHistory: '', drugHistory: '',
  investigations: '', socialFamily: '',
  generalExam: { ...INITIAL_GENERAL_EXAM },
  respiratory: '', abdominal: '', cnsCvs: '',
}

export default function App() {
  const [doctor, setDoctor] = useState(() => loadDoctor())
  const [showAdmin, setShowAdmin] = useState(false)
  const logoPressTimer = useRef(null)

  const [lang, setLang] = useState(() => localStorage.getItem('cliniq_lang') || 'en')
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const t = useMemo(() => createT(lang), [lang])
  const bodyFont = lang === 'bn' ? T.bangla : T.body

  useEffect(() => {
    const on = () => setIsOnline(true)
    const off = () => setIsOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const toggleLang = () => {
    const next = lang === 'en' ? 'bn' : 'en'
    setLang(next)
    localStorage.setItem('cliniq_lang', next)
  }

  const handleLogoDown = () => { logoPressTimer.current = setTimeout(() => setShowAdmin(true), 3000) }
  const handleLogoUp = () => { clearTimeout(logoPressTimer.current) }

  const handleRegister = (doc) => { setDoctor(doc); setPatientLog(loadPatientLogForDoctor(doc.id)) }
  const handleSignOut = () => { clearDoctor(); setDoctor(null) }

  const [view, setView] = useState('consultation')
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [step, setStep] = useState(0)
  const [patient, setPatient] = useState(INITIAL_PATIENT)
  const [phase, setPhase] = useState('intake')
  const [dxResult, setDxResult] = useState(null)
  const [txResult, setTxResult] = useState(null)
  const [activeTab, setActiveTab] = useState('diagnosis')
  const [error, setError] = useState(null)
  const [patientLog, setPatientLog] = useState(() => {
    const d = loadDoctor(); return d ? loadPatientLogForDoctor(d.id) : []
  })
  const [currentLogId, setCurrentLogId] = useState(null)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [probingQuestions, setProbingQuestions] = useState(null)
  const [probingAnswers, setProbingAnswers] = useState({})

  // Show welcome screen if no doctor registered
  if (!doctor && !showAdmin) return <WelcomeScreen onRegister={handleRegister} t={t} />
  // Show admin panel
  if (showAdmin) return <AdminPanel onClose={() => setShowAdmin(false)} />

  const reset = useCallback(() => {
    setStep(0)
    setPatient(INITIAL_PATIENT)
    setPhase('intake')
    setDxResult(null)
    setTxResult(null)
    setActiveTab('diagnosis')
    setError(null)
    setCurrentLogId(null)
    setView('consultation')
    setProbingQuestions(null)
    setProbingAnswers({})
  }, [])

  const submitDiagnosis = async () => {
    setPhase('diagnosing')
    setError(null)
    try {
      let result
      if (!navigator.onLine) {
        // Offline fallback — local symptom checker
        const sc = await getSymptomChecker()
        result = sc.offlineDiagnosis(buildPatientSummary(patient))
        setDxResult(result)
        setPhase('diagnosed') // skip probing offline
        return
      }
      const langInstruction = lang === 'bn' ? '\nIMPORTANT: Generate all text fields in Bangla (Bengali) language.' : ''
      result = await callClaude(SYSTEM_DIAGNOSIS + langInstruction, buildPatientSummary(patient))
      setDxResult(result)
      // Enter probing phase — generate follow-up questions
      setPhase('probing')
      setProbingQuestions(null)
      setProbingAnswers({})
      try {
        const summary = buildPatientSummary(patient)
          + `\n\nPreliminary Diagnosis: ${result.primary_diagnosis}`
          + `\nDifferentials: ${result.differentials?.map(d => d.diagnosis).join(', ')}`
        const probeLangInstruction = lang === 'bn' ? '\nIMPORTANT: Generate all questions and reasons in Bangla (Bengali) language so the doctor can read them directly to the patient.' : ''
        const probeResult = await callClaude(SYSTEM_PROBING + probeLangInstruction, summary)
        setProbingQuestions(probeResult.questions)
      } catch {
        setPhase('diagnosed')
      }
    } catch (e) {
      setError(e.message)
      setPhase('intake')
      setStep(4)
    }
  }

  const submitRefinedDiagnosis = async () => {
    setPhase('diagnosing')
    setError(null)
    try {
      let enrichedSummary = buildPatientSummary(patient)
      enrichedSummary += '\n\nClinical Interview Follow-up Findings:\n'
      probingQuestions?.forEach(q => {
        const answer = probingAnswers[q.id]
        if (answer && answer.trim()) {
          enrichedSummary += `Q: ${q.question}\nA: ${answer}\n\n`
        }
      })
      const result = await callClaude(SYSTEM_DIAGNOSIS, enrichedSummary)
      setDxResult(result)
      setPhase('diagnosed')
    } catch (e) {
      setError(e.message)
      setPhase('probing')
    }
  }

  const skipProbing = () => setPhase('diagnosed')

  const submitTreatment = async (type) => {
    setPhase('treating')
    setError(null)
    try {
      let result
      if (!navigator.onLine) {
        // Offline fallback
        const sc2 = await getSymptomChecker()
        result = sc2.offlineTreatment(dxResult.primary_diagnosis, buildPatientSummary(patient))
        setTxResult(result)
        setPhase('treated')
        setActiveTab('treatment')
        const logEntry = {
          id: crypto.randomUUID?.() || String(Date.now()),
          timestamp: new Date().toISOString(),
          date: todayStr(),
          doctorId: doctor?.id, doctorName: doctor?.name,
          patient: { ...patient },
          dxResult, txResult: result, treatmentType: type,
          followUp: { scheduled: false, date: null, notes: '', completed: false },
        }
        const updated = addToLog(logEntry)
        setPatientLog(updated.filter(e => e.doctorId === doctor?.id))
        setCurrentLogId(logEntry.id)
        return
      }
      let summary = buildPatientSummary(patient) + `\n\nDiagnosis: ${dxResult.primary_diagnosis}\nConfidence: ${dxResult.confidence}\nReasoning: ${dxResult.diagnosis_reasoning}`
      if (probingQuestions && Object.keys(probingAnswers).length > 0) {
        summary += '\n\nClinical Interview Follow-up:\n'
        probingQuestions.forEach(q => {
          const answer = probingAnswers[q.id]
          if (answer && answer.trim()) summary += `Q: ${q.question}\nA: ${answer}\n`
        })
      }
      const matchedSections = searchWardBook(dxResult.primary_diagnosis + ' ' + (patient.complaints || ''))
      const wardBookContext = matchedSections.length > 0
        ? matchedSections.map(sec => `--- ${sec.title} ---\n${sec.content}`).join('\n\n')
        : ''
      const langInstruction = lang === 'bn' ? '\nIMPORTANT: Generate all text fields in Bangla (Bengali) language.' : ''
      result = await callClaude(SYSTEM_TREATMENT(type, wardBookContext) + langInstruction, summary)
      setTxResult(result)
      setPhase('treated')
      setActiveTab('treatment')
      // Auto-save to log
      const logEntry = {
        id: crypto.randomUUID?.() || String(Date.now()),
        timestamp: new Date().toISOString(),
        date: todayStr(),
        doctorId: doctor?.id,
        doctorName: doctor?.name,
        patient: { ...patient },
        dxResult: dxResult,
        txResult: result,
        treatmentType: type,
        followUp: { scheduled: false, date: null, notes: '', completed: false },
      }
      const updated = addToLog(logEntry)
      setPatientLog(updated.filter(e => e.doctorId === doctor?.id))
      setCurrentLogId(logEntry.id)
      // Sync to server
      apiPost('/log', { doctorId: doctor?.id, doctorName: doctor?.name, patientName: patient.name, diagnosis: dxResult.primary_diagnosis, treatmentType: type, timestamp: logEntry.timestamp })
    } catch (e) {
      setError(e.message)
      setPhase('diagnosed')
    }
  }

  const handleUpdateLog = (id, updates) => {
    const updated = updateLogEntry(id, updates)
    setPatientLog(updated)
    // Update selectedEntry if viewing it
    if (selectedEntry?.id === id) {
      setSelectedEntry(prev => ({ ...prev, ...updates }))
    }
  }

  const handleLoadPatient = (entry) => {
    const loadedPatient = { ...entry.patient }
    if (typeof loadedPatient.generalExam === 'string') {
      loadedPatient.generalExam = { ...INITIAL_GENERAL_EXAM, otherFindings: loadedPatient.generalExam }
    }
    setPatient(loadedPatient)
    setView('consultation')
    setPhase('intake')
    setStep(0)
    setDxResult(null)
    setTxResult(null)
    setActiveTab('diagnosis')
    setError(null)
    setCurrentLogId(null)
    setSelectedEntry(null)
  }

  const StepComponent = STEPS[step]
  const tabs = [
    { id: 'diagnosis', label: t('diagnosisTab'), show: !!dxResult },
    { id: 'investigations', label: t('investigationsTab'), show: !!dxResult?.investigations },
    { id: 'treatment', label: t('treatmentTab'), show: !!txResult },
    { id: 'prescription', label: t('prescriptionTab'), show: !!txResult?.medications },
  ].filter(tb => tb.show)

  return (
    <div style={{ ...s.container, fontFamily: bodyFont }}>
      {/* Header */}
      <header style={{ ...s.header, flexDirection: 'column', alignItems: 'stretch', gap: 0 }}>
        {/* Row 1: Logo + compact actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={s.logo} onMouseDown={handleLogoDown} onMouseUp={handleLogoUp} onTouchStart={handleLogoDown} onTouchEnd={handleLogoUp}>
            <img src="/favicon.png" alt="ClinIQ" style={{ width: 32, height: 32, borderRadius: 8 }} />
            <div>
              <div style={{ ...s.logoText, fontSize: 17 }}>{t('cliniq')}</div>
              <div style={{ ...s.logoSub, fontSize: 8 }}>{doctor?.name}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button onClick={toggleLang} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.cardBorder}`, borderRadius: 7, padding: '4px 9px', cursor: 'pointer', fontSize: 11, color: T.textMuted, fontFamily: T.bangla }}>
              {lang === 'en' ? 'বাং' : 'EN'}
            </button>
            {!isOnline && <span style={{ ...s.badge(T.amber, T.amberDim), fontSize: 8 }}>OFF</span>}
            <button onClick={reset} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${T.cardBorder}`, borderRadius: 7, padding: '4px 9px', cursor: 'pointer', fontSize: 18, color: T.textDim, lineHeight: 1 }}>+</button>
          </div>
        </div>
        {/* Row 2: Full-width nav pills */}
        <div style={{ display: 'flex', gap: 4, width: '100%', marginTop: 10 }}>
          <button style={{ ...s.toggle(view === 'consultation'), padding: '7px 0', fontSize: 12, borderRadius: 8, flex: 1, textAlign: 'center' }} onClick={() => { setView('consultation'); setSelectedEntry(null) }}>
            {t('consultation')}
          </button>
          <button style={{ ...s.toggle(view === 'dashboard'), padding: '7px 0', fontSize: 12, borderRadius: 8, flex: 1, textAlign: 'center' }} onClick={() => { setView('dashboard'); setSelectedEntry(null) }}>
            {t('dashboard')}
          </button>
        </div>
      </header>

      {/* Offline Banner */}
      {!isOnline && (
        <div style={{ ...s.card, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>&#9889;</span>
          <span style={{ fontSize: 13, color: T.amber }}>{t('offlineBanner')}</span>
        </div>
      )}

      {/* Re-analyze with AI button when back online after offline diagnosis */}
      {isOnline && dxResult?._offline && phase === 'diagnosed' && (
        <div style={{ ...s.card, textAlign: 'center', padding: 16, background: 'rgba(77,163,255,0.06)', border: '1px solid rgba(77,163,255,0.2)' }}>
          <button style={s.btn(T.accent)} onClick={() => { setDxResult(null); submitDiagnosis() }}>
            {t('reanalyzeWithAI')}
          </button>
        </div>
      )}

      {/* Disclaimer */}
      {showDisclaimer && view === 'consultation' && (
        <div style={s.disclaimer}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>&#9888;</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: T.amber, marginBottom: 4 }}>{t('disclaimerTitle')}</div>
            <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.5 }}>
              {t('disclaimerText')}
            </div>
          </div>
          <button onClick={() => setShowDisclaimer(false)} style={{ background: 'none', border: 'none', color: T.textMuted, cursor: 'pointer', fontSize: 18, padding: 4 }}>&times;</button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ ...s.card, background: T.redDim, border: `1px solid ${T.red}40`, marginBottom: 20 }}>
          <div style={{ fontWeight: 600, color: T.red, marginBottom: 4, fontFamily: T.mono, fontSize: 12 }}>ERROR</div>
          <div style={{ fontSize: 14, color: T.text }}>{error}</div>
        </div>
      )}

      {/* ─── DASHBOARD VIEW ─── */}
      {view === 'dashboard' && !selectedEntry && (
        <Dashboard
          patientLog={patientLog}
          setPatientLog={setPatientLog}
          onLoadPatient={handleLoadPatient}
          onViewDetail={setSelectedEntry}
        />
      )}

      {view === 'dashboard' && selectedEntry && (
        <PatientDetailView
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          onUpdateLog={handleUpdateLog}
          onLoadPatient={handleLoadPatient}
        />
      )}

      {/* ─── CONSULTATION VIEW ─── */}
      {view === 'consultation' && (
        <>
          {/* Intake Wizard */}
          {(phase === 'intake') && (
            <>
              <div style={s.progressBar}>
                {STEPS.map((_, i) => (
                  <div key={i} style={s.progressStep(i === step, i < step)} />
                ))}
              </div>
              <div key={step} className="cliniq-fade-in" style={s.card}>
                <StepComponent p={patient} setP={setPatient} t={t} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <button
                  style={{ ...s.btnOutline, visibility: step === 0 ? 'hidden' : 'visible' }}
                  onClick={() => setStep(prev => prev - 1)}
                >
                  {t('back')}
                </button>
                {step < 4 ? (
                  <button style={s.btn(T.accent)} onClick={() => setStep(prev => prev + 1)}>
                    {t('continue')}
                  </button>
                ) : (
                  <button style={s.btn(T.green)} onClick={submitDiagnosis}>
                    {t('analyzeDiagnose')}
                  </button>
                )}
              </div>
            </>
          )}

          {/* Loading — Diagnosing */}
          {phase === 'diagnosing' && (
            <div className="cliniq-scale-in" style={{ ...s.card, textAlign: 'center', padding: 60 }}>
              <div style={{ ...s.spinner, margin: '0 auto 20px' }} />
              <div style={{ fontFamily: T.mono, fontSize: 13, color: T.accent, animation: 'breathe 2s ease infinite' }}>{t('analyzingPatientData')}</div>
              <div style={{ fontSize: 12, color: T.textMuted, marginTop: 8 }}>{t('runningDifferentialDx')}</div>
            </div>
          )}

          {/* Probing Phase */}
          {phase === 'probing' && (
            <ProbingPhase
              dxResult={dxResult}
              probingQuestions={probingQuestions}
              probingAnswers={probingAnswers}
              setProbingAnswers={setProbingAnswers}
              onRefine={submitRefinedDiagnosis}
              onSkip={skipProbing}
              t={t}
            />
          )}

          {/* Loading — Treating */}
          {phase === 'treating' && (
            <div className="cliniq-scale-in" style={{ ...s.card, textAlign: 'center', padding: 60 }}>
              <div style={{ ...s.spinner, margin: '0 auto 20px' }} />
              <div style={{ fontFamily: T.mono, fontSize: 13, color: T.green, animation: 'breathe 2s ease infinite' }}>{t('generatingTreatment')}</div>
            </div>
          )}

          {/* Results */}
          {(phase === 'diagnosed' || phase === 'treated') && (
            <>
              {phase === 'diagnosed' && (
                <div style={{ ...s.card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                  <div style={{ fontFamily: T.mono, fontSize: 12, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
                    {t('chooseTreatment')}
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button style={s.btn(T.amber, '#111')} onClick={() => submitTreatment('symptomatic')}>
                      {t('symptomaticTreatment')}
                    </button>
                    <button style={s.btn(T.green)} onClick={() => submitTreatment('definitive')}>
                      {t('definitiveTreatment')}
                    </button>
                  </div>
                </div>
              )}

              {tabs.length > 0 && (
                <>
                  <div className="cliniq-tabs" style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${T.cardBorder}`, marginBottom: 20 }}>
                    {tabs.map(tb => (
                      <button key={tb.id} style={s.tab(activeTab === tb.id)} onClick={() => setActiveTab(tb.id)}>
                        {tb.label}
                      </button>
                    ))}
                  </div>
                  <div style={s.card}>
                    {activeTab === 'diagnosis' && dxResult && <DiagnosisTab dx={dxResult} />}
                    {activeTab === 'investigations' && dxResult && <InvestigationsTab inv={dxResult.investigations} />}
                    {activeTab === 'treatment' && txResult && <TreatmentTab tx={txResult} />}
                    {activeTab === 'prescription' && txResult && <PrescriptionTab patient={patient} dx={dxResult} tx={txResult} />}
                  </div>
                </>
              )}

              {/* Follow-up scheduler after treatment */}
              {phase === 'treated' && currentLogId && (
                <FollowUpScheduler
                  logId={currentLogId}
                  currentFollowUp={patientLog.find(e => e.id === currentLogId)?.followUp}
                  onSave={handleUpdateLog}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
