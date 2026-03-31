import { useState, useCallback } from 'react'
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
  // Return top matches, capped at ~20K chars to stay within context
  const results = []
  let totalLen = 0
  for (const s of scored) {
    if (totalLen + s.content.length > 20000) break
    results.push(s)
    totalLen += s.content.length
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
      <div style={{ ...s.grid(2), '@media(maxWidth:600px)': s.grid(1) }}>
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
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
                <td style={{ padding: '8px 6px', fontWeight: 600 }}>{med.drug}</td>
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
  const [showDisclaimer, setShowDisclaimer] = useState(true)
  const [step, setStep] = useState(0)
  const [patient, setPatient] = useState(INITIAL_PATIENT)
  const [phase, setPhase] = useState('intake') // intake | diagnosing | diagnosed | treating | treated
  const [dxResult, setDxResult] = useState(null)
  const [txResult, setTxResult] = useState(null)
  const [activeTab, setActiveTab] = useState('diagnosis')
  const [error, setError] = useState(null)

  const reset = useCallback(() => {
    setStep(0)
    setPatient(INITIAL_PATIENT)
    setPhase('intake')
    setDxResult(null)
    setTxResult(null)
    setActiveTab('diagnosis')
    setError(null)
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
      // Search ward book for relevant protocols
      const matchedSections = searchWardBook(dxResult.primary_diagnosis + ' ' + (patient.complaints || ''))
      const wardBookContext = matchedSections.length > 0
        ? matchedSections.map(s => `--- ${s.title} ---\n${s.content}`).join('\n\n')
        : ''
      const result = await callClaude(SYSTEM_TREATMENT(type, wardBookContext), summary)
      setTxResult(result)
      setPhase('treated')
      setActiveTab('treatment')
    } catch (e) {
      setError(e.message)
      setPhase('diagnosed')
    }
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
        <div style={s.logo}>
          <div style={s.logoIcon}>C</div>
          <div>
            <div style={s.logoText}>ClinIQ</div>
            <div style={s.logoSub}>Clinical Decision Support</div>
          </div>
        </div>
        <button style={s.btnOutline} onClick={reset}>New Patient</button>
      </header>

      {/* Disclaimer */}
      {showDisclaimer && (
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
              onClick={() => setStep(s => s - 1)}
            >
              Back
            </button>
            {step < 4 ? (
              <button style={s.btn(T.accent)} onClick={() => setStep(s => s + 1)}>
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
          {/* Treatment choice buttons */}
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
                {activeTab === 'prescription' && txResult && <PrescriptionTab patient={patient} dx={dxResult} tx={txResult} />}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
