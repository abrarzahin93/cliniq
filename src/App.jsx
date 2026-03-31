import { useState, useCallback, useMemo } from 'react'
import { WARD_BOOK_SECTIONS } from './wardbook.js'

// ─── Theme ───────────────────────────────────────────────────────────
const T = {
  bg: '#05080f', card: '#0b1120', cardBorder: '#1e293b',
  accent: '#0ea5e9', accentDim: '#0ea5e920', green: '#10b981', greenDim: '#10b98120',
  amber: '#f59e0b', amberDim: '#f59e0b20', red: '#ef4444', redDim: '#ef444420',
  text: '#e2e8f0', textDim: '#94a3b8', textMuted: '#64748b',
  mono: "'IBM Plex Mono', monospace", sans: "'IBM Plex Sans', sans-serif",
}

// ─── Styles ──────────────────────────────────────────────────────────
const s = {
  container: { maxWidth: 900, margin: '0 auto', padding: '20px 16px', fontFamily: T.sans },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 0', borderBottom: `1px solid ${T.cardBorder}`, marginBottom: 24,
    flexWrap: 'wrap', gap: 12,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoIcon: {
    width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${T.accent}, #6366f1)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: T.mono, fontWeight: 700, fontSize: 16, color: '#fff',
  },
  logoText: { fontFamily: T.mono, fontWeight: 600, fontSize: 20, color: T.text, letterSpacing: -0.5 },
  logoSub: { fontFamily: T.mono, fontSize: 11, color: T.textMuted, marginTop: 2 },
  btn: (bg, color = '#fff') => ({
    padding: '10px 20px', border: 'none', borderRadius: 8, cursor: 'pointer',
    fontWeight: 600, fontSize: 14, color, background: bg,
    transition: 'all 0.2s', fontFamily: T.sans,
  }),
  btnSm: (bg, color = '#fff') => ({
    padding: '6px 14px', border: 'none', borderRadius: 6, cursor: 'pointer',
    fontWeight: 600, fontSize: 12, color, background: bg,
    transition: 'all 0.2s', fontFamily: T.sans,
  }),
  btnOutline: {
    padding: '10px 20px', border: `1px solid ${T.cardBorder}`, borderRadius: 8,
    cursor: 'pointer', fontWeight: 500, fontSize: 14, color: T.textDim,
    background: 'transparent', transition: 'all 0.2s', fontFamily: T.sans,
  },
  card: {
    background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 12,
    padding: 24, marginBottom: 20,
  },
  label: {
    fontFamily: T.mono, fontSize: 11, fontWeight: 500, color: T.textMuted,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, display: 'block',
  },
  input: {
    width: '100%', padding: '10px 14px', background: '#0f172a', border: `1px solid ${T.cardBorder}`,
    borderRadius: 8, color: T.text, fontSize: 14, outline: 'none', fontFamily: T.sans,
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%', padding: '12px 14px', background: '#0f172a', border: `1px solid ${T.cardBorder}`,
    borderRadius: 8, color: T.text, fontSize: 14, outline: 'none', fontFamily: T.sans,
    minHeight: 100, resize: 'vertical', transition: 'border-color 0.2s',
  },
  grid: (cols, gap = 12) => ({
    display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap,
  }),
  progressBar: { display: 'flex', gap: 4, marginBottom: 24 },
  progressStep: (active, done) => ({
    flex: 1, height: 4, borderRadius: 2,
    background: done ? T.accent : active ? T.accent + '80' : T.cardBorder,
    transition: 'background 0.3s',
  }),
  stepTitle: {
    fontFamily: T.mono, fontSize: 13, color: T.accent, marginBottom: 16,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  badge: (color, bgColor) => ({
    display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: 11,
    fontWeight: 600, fontFamily: T.mono, color, background: bgColor, textTransform: 'uppercase',
  }),
  tab: (active) => ({
    padding: '10px 18px', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer',
    fontWeight: 600, fontSize: 13, fontFamily: T.mono,
    color: active ? T.accent : T.textMuted,
    background: active ? T.card : 'transparent',
    borderBottom: active ? `2px solid ${T.accent}` : '2px solid transparent',
    transition: 'all 0.2s',
  }),
  toggle: (active) => ({
    padding: '8px 18px', border: `1px solid ${active ? T.accent : T.cardBorder}`,
    borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: 13,
    color: active ? T.accent : T.textDim,
    background: active ? T.accentDim : 'transparent',
    transition: 'all 0.2s', fontFamily: T.sans,
  }),
  disclaimer: {
    background: T.amberDim, border: `1px solid ${T.amber}40`, borderRadius: 10,
    padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12,
  },
  spinner: {
    width: 20, height: 20, border: `2px solid ${T.cardBorder}`, borderTop: `2px solid ${T.accent}`,
    borderRadius: '50%', animation: 'spin 0.8s linear infinite',
  },
  rxPad: {
    background: '#fff', color: '#111', padding: 40, borderRadius: 4,
    fontFamily: T.sans, maxWidth: 700, margin: '0 auto',
  },
  statBox: (color) => ({
    background: T.card, border: `1px solid ${T.cardBorder}`, borderRadius: 12,
    padding: '16px 20px', flex: 1, minWidth: 140, borderLeft: `3px solid ${color}`,
  }),
  medexLink: {
    color: T.accent, fontSize: 11, fontFamily: T.mono, textDecoration: 'none',
    padding: '2px 8px', border: `1px solid ${T.accent}40`, borderRadius: 4,
    display: 'inline-block', transition: 'all 0.2s',
  },
}

// ─── localStorage ────────────────────────────────────────────────────
const LS_KEY = 'cliniq_patient_log'

function loadPatientLog() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') }
  catch { return [] }
}

function savePatientLog(log) {
  localStorage.setItem(LS_KEY, JSON.stringify(log))
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

function searchWardBook(diagnosis) {
  const terms = diagnosis.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2)
  const scored = WARD_BOOK_SECTIONS.map(section => {
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
  let base = `You are a clinical decision support system trained on Davidson's Principles and Practice of Medicine and Harrison's Principles of Internal Medicine. Provide a ${type} treatment plan.`
  if (wardBookContext) {
    base += `\n\nIMPORTANT: You have access to the following clinical ward book protocols from the Department of Medicine, MMCH. Use these protocols as your PRIMARY reference for drug names, doses, routes, and frequencies. Follow these protocols closely when they match the patient's condition:\n\n${wardBookContext}`
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
  const text = data.content[0].text
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
  if (p.generalExam) lines.push(`General Examination: ${p.generalExam}`)
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
        onFocus={e => e.target.style.borderColor = T.accent}
        onBlur={e => e.target.style.borderColor = T.cardBorder}
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
        onFocus={e => e.target.style.borderColor = T.accent}
        onBlur={e => e.target.style.borderColor = T.cardBorder}
      />
    </Field>
  )
}

// ─── Wizard Steps ────────────────────────────────────────────────────
function Step1({ p, setP }) {
  return (
    <>
      <div style={s.stepTitle}>Step 1 — Patient Particulars</div>
      <div style={s.grid(2)}>
        <InputField label="Patient Name" value={p.name} onChange={v => setP({ ...p, name: v })} placeholder="Full name" />
        <InputField label="Age" value={p.age} onChange={v => setP({ ...p, age: v })} placeholder="Years" type="number" />
      </div>
      <Field label="Sex">
        <div style={{ display: 'flex', gap: 8 }}>
          {['Male', 'Female', 'Other'].map(opt => (
            <button key={opt} style={s.toggle(p.sex === opt)} onClick={() => setP({ ...p, sex: opt })}>
              {opt}
            </button>
          ))}
        </div>
      </Field>
      <InputField label="Weight (kg)" value={p.weight} onChange={v => setP({ ...p, weight: v })} placeholder="kg" type="number" />
      <div style={{ ...s.stepTitle, marginTop: 16, fontSize: 12 }}>Vitals</div>
      <div style={s.grid(3)}>
        <InputField label="Blood Pressure" value={p.bp} onChange={v => setP({ ...p, bp: v })} placeholder="120/80" />
        <InputField label="Pulse (/min)" value={p.pulse} onChange={v => setP({ ...p, pulse: v })} placeholder="72" type="number" />
        <InputField label="Temp (°F)" value={p.temp} onChange={v => setP({ ...p, temp: v })} placeholder="98.6" />
      </div>
      <div style={s.grid(2)}>
        <InputField label="SpO2 (%)" value={p.spo2} onChange={v => setP({ ...p, spo2: v })} placeholder="98" type="number" />
        <InputField label="Resp. Rate (/min)" value={p.rr} onChange={v => setP({ ...p, rr: v })} placeholder="16" type="number" />
      </div>
    </>
  )
}

function Step2({ p, setP }) {
  return (
    <>
      <div style={s.stepTitle}>Step 2 — Chief Complaints</div>
      <TextareaField
        label="Chief Complaints"
        value={p.complaints} onChange={v => setP({ ...p, complaints: v })}
        placeholder={"Describe the patient's main complaints.\nInclude duration for each (e.g., 'Fever — 3 days, Cough — 1 week')"}
        rows={6}
      />
    </>
  )
}

function Step3({ p, setP }) {
  return (
    <>
      <div style={s.stepTitle}>Step 3 — History</div>
      <TextareaField label="Past Medical History" value={p.pastHistory} onChange={v => setP({ ...p, pastHistory: v })} placeholder="DM, HTN, asthma, surgeries, hospitalizations..." rows={3} />
      <TextareaField label="Drug History" value={p.drugHistory} onChange={v => setP({ ...p, drugHistory: v })} placeholder="Current medications, doses, allergies..." rows={3} />
      <TextareaField label="Investigation History" value={p.investigations} onChange={v => setP({ ...p, investigations: v })} placeholder="Recent labs, imaging, ECG..." rows={3} />
      <TextareaField label="Social / Family History" value={p.socialFamily} onChange={v => setP({ ...p, socialFamily: v })} placeholder="Smoking, alcohol, occupation, family diseases..." rows={3} />
    </>
  )
}

function Step4({ p, setP }) {
  return (
    <>
      <div style={s.stepTitle}>Step 4 — General Examination</div>
      <TextareaField
        label="General Examination Findings"
        value={p.generalExam} onChange={v => setP({ ...p, generalExam: v })}
        placeholder={"Built, nourishment, pallor, icterus, cyanosis, clubbing,\nlymphadenopathy, edema, JVP..."}
        rows={6}
      />
    </>
  )
}

function Step5({ p, setP }) {
  return (
    <>
      <div style={s.stepTitle}>Step 5 — Systemic Examination (Optional)</div>
      <TextareaField label="Respiratory System" value={p.respiratory} onChange={v => setP({ ...p, respiratory: v })} placeholder="Chest shape, air entry, breath sounds, added sounds..." rows={3} />
      <TextareaField label="Abdominal Examination" value={p.abdominal} onChange={v => setP({ ...p, abdominal: v })} placeholder="Inspection, palpation, percussion, auscultation..." rows={3} />
      <TextareaField label="CNS / CVS" value={p.cnsCvs} onChange={v => setP({ ...p, cnsCvs: v })} placeholder="Heart sounds, murmurs, neurological findings..." rows={3} />
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
        <h3 style={{ fontSize: 22, fontWeight: 600, color: T.text }}>{dx.primary_diagnosis}</h3>
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

function PrescriptionTab({ patient, dx, tx }) {
  return (
    <div>
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button style={s.btn(T.accent)} onClick={() => window.print()}>
          Print Prescription
        </button>
      </div>
      <div id="rx-print" style={s.rxPad}>
        <div style={{ borderBottom: '2px solid #111', paddingBottom: 16, marginBottom: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: T.mono }}>Rx</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Generated by ClinIQ Clinical Decision Support</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16, fontSize: 13 }}>
          <div><strong>Patient:</strong> {patient.name || '—'}</div>
          <div><strong>Age/Sex:</strong> {patient.age || '—'} / {patient.sex || '—'}</div>
          <div><strong>Weight:</strong> {patient.weight ? `${patient.weight} kg` : '—'}</div>
          <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
        </div>
        <div style={{ marginBottom: 16, fontSize: 13 }}>
          <strong>Diagnosis:</strong> {dx?.primary_diagnosis || '—'}
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 24 }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              {['#', 'Drug', 'Dose', 'Route', 'Frequency', 'Duration', 'Notes'].map(h => (
                <th key={h} style={{ padding: '8px 6px', textAlign: 'left', borderBottom: '1px solid #ddd', fontFamily: T.mono, fontSize: 10, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tx?.medications?.map((med, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '8px 6px' }}>{i + 1}</td>
                <td style={{ padding: '8px 6px' }}>
                  <span style={{ fontWeight: 600 }}>{med.drug}</span>
                  <br />
                  <a
                    href={medexSearchUrl(med.drug)}
                    target="_blank" rel="noopener noreferrer"
                    className="no-print"
                    style={{ color: '#0ea5e9', fontSize: 10, textDecoration: 'none' }}
                  >
                    Find BD Trade Names &rarr;
                  </a>
                </td>
                <td style={{ padding: '8px 6px' }}>{med.dose}</td>
                <td style={{ padding: '8px 6px' }}>{med.route}</td>
                <td style={{ padding: '8px 6px' }}>{med.frequency}</td>
                <td style={{ padding: '8px 6px' }}>{med.duration}</td>
                <td style={{ padding: '8px 6px', color: '#666' }}>{med.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 60, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #111', width: 200, marginBottom: 4 }} />
            <div style={{ fontSize: 12, color: '#666' }}>Clinician Signature</div>
          </div>
        </div>
      </div>
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
          <div style={{ fontSize: 28, fontWeight: 700, color: T.text, fontFamily: T.mono }}>{todaysPatients.length}</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>patients seen</div>
        </div>
        <div style={s.statBox(T.amber)}>
          <div style={{ ...s.label, marginBottom: 4 }}>Follow-ups</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: T.amber, fontFamily: T.mono }}>{followUpsDue.length}</div>
          <div style={{ fontSize: 12, color: T.textMuted }}>due today</div>
        </div>
        <div style={s.statBox(T.green)}>
          <div style={{ ...s.label, marginBottom: 4 }}>Total</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: T.text, fontFamily: T.mono }}>{totalPatients}</div>
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
                  <div style={{ fontWeight: 600, fontSize: 16, color: T.text }}>{entry.patient?.name || 'Unknown'}</div>
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
            <div style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{patient?.name || 'Unknown'}</div>
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
      <div style={s.label}>Medications — Bangladesh Trade Names &amp; Prices</div>
      <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 16 }}>
        Click "MedEx" to find Bangladeshi trade names, manufacturers, and current prices on medex.com.bd
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {medications?.map((med, i) => (
          <div key={i} style={{ ...s.card, padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: T.text }}>{med.drug}</div>
                <div style={{ fontSize: 13, color: T.textDim, marginTop: 4 }}>
                  {med.dose} &middot; {med.route} &middot; {med.frequency} &middot; {med.duration}
                </div>
                {med.notes && <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>{med.notes}</div>}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <a
                  href={medexSearchUrl(med.drug)}
                  target="_blank" rel="noopener noreferrer"
                  style={s.medexLink}
                >
                  MedEx — BD Trade Names &amp; Prices
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Spinner keyframes injection ─────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('cliniq-keyframes')) {
  const style = document.createElement('style')
  style.id = 'cliniq-keyframes'
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`
  document.head.appendChild(style)
}

// ─── Responsive grid helper ──────────────────────────────────────────
if (typeof document !== 'undefined' && !document.getElementById('cliniq-responsive')) {
  const style = document.createElement('style')
  style.id = 'cliniq-responsive'
  style.textContent = `
    @media (max-width: 640px) {
      .cliniq-grid-3 { grid-template-columns: 1fr !important; }
      .cliniq-grid-2 { grid-template-columns: 1fr !important; }
      .cliniq-tabs { flex-wrap: wrap !important; }
      .cliniq-stats-row { flex-direction: column !important; }
    }
    @media print {
      .no-print { display: none !important; }
    }
  `
  document.head.appendChild(style)
}

// ─── App ─────────────────────────────────────────────────────────────
const INITIAL_PATIENT = {
  name: '', age: '', sex: '', weight: '',
  bp: '', pulse: '', temp: '', spo2: '', rr: '',
  complaints: '', pastHistory: '', drugHistory: '',
  investigations: '', socialFamily: '', generalExam: '',
  respiratory: '', abdominal: '', cnsCvs: '',
}

export default function App() {
  const [view, setView] = useState('consultation') // consultation | dashboard
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [step, setStep] = useState(0)
  const [patient, setPatient] = useState(INITIAL_PATIENT)
  const [phase, setPhase] = useState('intake')
  const [dxResult, setDxResult] = useState(null)
  const [txResult, setTxResult] = useState(null)
  const [activeTab, setActiveTab] = useState('diagnosis')
  const [error, setError] = useState(null)
  const [patientLog, setPatientLog] = useState(() => loadPatientLog())
  const [currentLogId, setCurrentLogId] = useState(null)
  const [selectedEntry, setSelectedEntry] = useState(null)

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
  }, [])

  const submitDiagnosis = async () => {
    setPhase('diagnosing')
    setError(null)
    try {
      const result = await callClaude(SYSTEM_DIAGNOSIS, buildPatientSummary(patient))
      setDxResult(result)
      setPhase('diagnosed')
    } catch (e) {
      setError(e.message)
      setPhase('intake')
      setStep(4)
    }
  }

  const submitTreatment = async (type) => {
    setPhase('treating')
    setError(null)
    try {
      const summary = buildPatientSummary(patient) + `\n\nDiagnosis: ${dxResult.primary_diagnosis}\nConfidence: ${dxResult.confidence}\nReasoning: ${dxResult.diagnosis_reasoning}`
      const matchedSections = searchWardBook(dxResult.primary_diagnosis + ' ' + (patient.complaints || ''))
      const wardBookContext = matchedSections.length > 0
        ? matchedSections.map(sec => `--- ${sec.title} ---\n${sec.content}`).join('\n\n')
        : ''
      const result = await callClaude(SYSTEM_TREATMENT(type, wardBookContext), summary)
      setTxResult(result)
      setPhase('treated')
      setActiveTab('treatment')
      // Auto-save to log
      const logEntry = {
        id: crypto.randomUUID?.() || String(Date.now()),
        timestamp: new Date().toISOString(),
        date: todayStr(),
        patient: { ...patient },
        dxResult: dxResult,
        txResult: result,
        treatmentType: type,
        followUp: { scheduled: false, date: null, notes: '', completed: false },
      }
      const updated = addToLog(logEntry)
      setPatientLog(updated)
      setCurrentLogId(logEntry.id)
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
    setPatient({ ...entry.patient })
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
    { id: 'diagnosis', label: 'Diagnosis', show: !!dxResult },
    { id: 'investigations', label: 'Investigations', show: !!dxResult?.investigations },
    { id: 'treatment', label: 'Treatment', show: !!txResult },
    { id: 'prescription', label: 'Prescription', show: !!txResult?.medications },
  ].filter(t => t.show)

  return (
    <div style={s.container}>
      {/* Header */}
      <header style={s.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={s.logo}>
            <div style={s.logoIcon}>C</div>
            <div>
              <div style={s.logoText}>ClinIQ</div>
              <div style={s.logoSub}>Clinical Decision Support</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button style={s.toggle(view === 'consultation')} onClick={() => { setView('consultation'); setSelectedEntry(null) }}>
              Consultation
            </button>
            <button style={s.toggle(view === 'dashboard')} onClick={() => { setView('dashboard'); setSelectedEntry(null) }}>
              Dashboard
            </button>
          </div>
        </div>
        <button style={s.btnOutline} onClick={reset}>New Patient</button>
      </header>

      {/* Disclaimer */}
      {showDisclaimer && view === 'consultation' && (
        <div style={s.disclaimer}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>&#9888;</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: T.amber, marginBottom: 4 }}>Clinical Support Tool Only</div>
            <div style={{ fontSize: 13, color: T.textDim, lineHeight: 1.5 }}>
              ClinIQ is an AI-assisted decision support tool and does NOT replace clinical judgment. All diagnoses and treatment plans must be verified by a qualified medical professional before any clinical action is taken.
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
              <div style={s.card}>
                <StepComponent p={patient} setP={setPatient} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                <button
                  style={{ ...s.btnOutline, visibility: step === 0 ? 'hidden' : 'visible' }}
                  onClick={() => setStep(prev => prev - 1)}
                >
                  Back
                </button>
                {step < 4 ? (
                  <button style={s.btn(T.accent)} onClick={() => setStep(prev => prev + 1)}>
                    Continue
                  </button>
                ) : (
                  <button style={s.btn(T.green)} onClick={submitDiagnosis}>
                    Analyze &amp; Diagnose
                  </button>
                )}
              </div>
            </>
          )}

          {/* Loading — Diagnosing */}
          {phase === 'diagnosing' && (
            <div style={{ ...s.card, textAlign: 'center', padding: 60 }}>
              <div style={{ ...s.spinner, margin: '0 auto 16px' }} />
              <div style={{ fontFamily: T.mono, fontSize: 13, color: T.accent }}>Analyzing patient data...</div>
              <div style={{ fontSize: 13, color: T.textMuted, marginTop: 8 }}>Running differential diagnosis</div>
            </div>
          )}

          {/* Loading — Treating */}
          {phase === 'treating' && (
            <div style={{ ...s.card, textAlign: 'center', padding: 60 }}>
              <div style={{ ...s.spinner, margin: '0 auto 16px' }} />
              <div style={{ fontFamily: T.mono, fontSize: 13, color: T.green }}>Generating treatment plan...</div>
            </div>
          )}

          {/* Results */}
          {(phase === 'diagnosed' || phase === 'treated') && (
            <>
              {phase === 'diagnosed' && (
                <div style={{ ...s.card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
                  <div style={{ fontFamily: T.mono, fontSize: 12, color: T.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Choose Treatment Approach
                  </div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button style={s.btn(T.amber, '#111')} onClick={() => submitTreatment('symptomatic')}>
                      Symptomatic Treatment
                    </button>
                    <button style={s.btn(T.green)} onClick={() => submitTreatment('definitive')}>
                      Definitive Treatment
                    </button>
                  </div>
                </div>
              )}

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
