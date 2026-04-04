// ─── Pediatric Dose Calculator ───────────────────────────────────────
const PEDIATRIC_DRUGS = [
  { drug: 'Paracetamol', dose: '15 mg/kg', maxDose: '1000 mg', frequency: 'Q6H', route: 'Oral', forms: ['Syrup 120mg/5ml', 'Drop 80mg/ml', 'Supp 125mg/250mg'] },
  { drug: 'Ibuprofen', dose: '10 mg/kg', maxDose: '400 mg', frequency: 'Q8H', route: 'Oral', forms: ['Syrup 100mg/5ml'] },
  { drug: 'Amoxicillin', dose: '25-50 mg/kg/day', maxDose: '500 mg/dose', frequency: 'Q8H', route: 'Oral', forms: ['Syrup 125mg/5ml', 'Syrup 250mg/5ml'] },
  { drug: 'Amoxicillin+Clavulanate', dose: '25-45 mg/kg/day', maxDose: '875 mg/dose', frequency: 'Q12H', route: 'Oral', forms: ['Syrup 228.5mg/5ml'] },
  { drug: 'Azithromycin', dose: '10 mg/kg Day1, then 5mg/kg', maxDose: '500 mg', frequency: 'OD x5days', route: 'Oral', forms: ['Syrup 200mg/5ml'] },
  { drug: 'Ceftriaxone', dose: '50-75 mg/kg/day', maxDose: '2g/day', frequency: 'Q12-24H', route: 'IV/IM', forms: ['Inj 250mg, 500mg, 1g'] },
  { drug: 'Metronidazole', dose: '7.5 mg/kg', maxDose: '500 mg', frequency: 'Q8H', route: 'Oral/IV', forms: ['Syrup 200mg/5ml'] },
  { drug: 'Salbutamol Neb', dose: '0.15 mg/kg', maxDose: '5 mg', frequency: 'Q4-6H', route: 'Nebulizer', forms: ['Respule 2.5mg/2.5ml'] },
  { drug: 'Prednisolone', dose: '1-2 mg/kg', maxDose: '60 mg', frequency: 'OD', route: 'Oral', forms: ['Syrup 5mg/5ml, Tab 5mg'] },
  { drug: 'Ondansetron', dose: '0.15 mg/kg', maxDose: '4 mg', frequency: 'Q8H', route: 'IV/Oral', forms: ['Syrup 4mg/5ml, Inj 4mg/2ml'] },
  { drug: 'Domperidone', dose: '0.25 mg/kg', maxDose: '10 mg', frequency: 'Q8H', route: 'Oral', forms: ['Susp 5mg/5ml'] },
  { drug: 'Ranitidine', dose: '2-4 mg/kg/day', maxDose: '150 mg/dose', frequency: 'Q12H', route: 'Oral', forms: ['Syrup 75mg/5ml'] },
  { drug: 'Omeprazole', dose: '1 mg/kg', maxDose: '20 mg', frequency: 'OD', route: 'Oral', forms: ['Sachet 10mg, 20mg'] },
  { drug: 'Phenobarbital', dose: '3-5 mg/kg/day', maxDose: '60 mg/day', frequency: 'Q12H', route: 'Oral', forms: ['Elixir 15mg/5ml'] },
  { drug: 'Diazepam (rectal)', dose: '0.5 mg/kg', maxDose: '10 mg', frequency: 'PRN seizure', route: 'Rectal', forms: ['Inj 5mg/ml for rectal'] },
  { drug: 'ORS', dose: '10-20 ml/kg after each stool', maxDose: 'Ad lib', frequency: 'After each loose stool', route: 'Oral', forms: ['Sachet'] },
  { drug: 'Zinc', dose: '<6mo: 10mg, >6mo: 20mg', maxDose: '20 mg', frequency: 'OD x14 days', route: 'Oral', forms: ['Syrup 20mg/5ml, Tab 20mg'] },
  { drug: 'Iron (Ferrous)', dose: '3-6 mg/kg/day elemental', maxDose: '200 mg', frequency: 'Q8-12H', route: 'Oral', forms: ['Drop, Syrup'] },
  { drug: 'Adrenaline (Croup)', dose: '0.5 ml/kg', maxDose: '5 ml', frequency: 'PRN', route: 'Nebulizer (1:1000)', forms: ['Amp 1mg/ml'] },
]

export function calcPediatricDose(drugName, weightKg) {
  const match = PEDIATRIC_DRUGS.find(d => d.drug.toLowerCase().includes(drugName.toLowerCase()))
  if (!match) return null
  const doseMatch = match.dose.match(/([\d.]+)(?:\s*-\s*([\d.]+))?\s*mg\/kg/)
  if (!doseMatch) return { ...match, calculatedDose: match.dose, weight: weightKg }
  const low = parseFloat(doseMatch[1]) * weightKg
  const high = doseMatch[2] ? parseFloat(doseMatch[2]) * weightKg : low
  const maxNum = parseFloat(match.maxDose)
  return {
    ...match,
    weight: weightKg,
    calculatedLow: Math.min(low, maxNum).toFixed(1),
    calculatedHigh: Math.min(high, maxNum).toFixed(1),
    calculatedDose: low === high ? `${Math.min(low, maxNum).toFixed(1)} mg` : `${Math.min(low, maxNum).toFixed(1)}-${Math.min(high, maxNum).toFixed(1)} mg`,
  }
}

export { PEDIATRIC_DRUGS }

// ─── Clinical Scoring Systems ────────────────────────────────────────
export function calcCURB65({ confusion, urea, rr, bp, age }) {
  let score = 0
  if (confusion) score++
  if (urea > 7) score++ // mmol/L
  if (rr >= 30) score++
  if (bp && (parseInt(bp.split('/')[0]) < 90 || parseInt(bp.split('/')[1]) <= 60)) score++
  if (age >= 65) score++
  const risk = score <= 1 ? 'Low (outpatient)' : score === 2 ? 'Moderate (short stay/supervised)' : 'High (admit, consider ICU)'
  const mortality = score <= 1 ? '<3%' : score === 2 ? '9%' : score === 3 ? '17%' : '>40%'
  return { score, risk, mortality, max: 5 }
}

export function calcGCS({ eye, verbal, motor }) {
  const e = parseInt(eye) || 1, v = parseInt(verbal) || 1, m = parseInt(motor) || 1
  const total = e + v + m
  const severity = total <= 8 ? 'Severe (intubate)' : total <= 12 ? 'Moderate' : 'Mild'
  return { total, eye: e, verbal: v, motor: m, severity, max: 15 }
}

export function calcWells({ clinicalDVT, altDxLessLikely, hr100, immobile, previousPE, hemoptysis, cancer }) {
  let score = 0
  if (clinicalDVT) score += 3
  if (altDxLessLikely) score += 3
  if (hr100) score += 1.5
  if (immobile) score += 1.5
  if (previousPE) score += 1.5
  if (hemoptysis) score += 1
  if (cancer) score += 1
  const risk = score <= 1 ? 'Low' : score <= 6 ? 'Moderate' : 'High'
  return { score, risk }
}

export function calcAPGAR({ appearance, pulse, grimace, activity, respiration }) {
  const total = (appearance || 0) + (pulse || 0) + (grimace || 0) + (activity || 0) + (respiration || 0)
  const status = total >= 7 ? 'Normal' : total >= 4 ? 'Moderately depressed' : 'Severely depressed'
  return { total, status, max: 10 }
}

// ─── Lab Result Interpreter ──────────────────────────────────────────
const LAB_RANGES = {
  'hemoglobin': { unit: 'g/dL', male: [13, 17], female: [12, 16], low: 'Anemia', high: 'Polycythemia' },
  'hb': { unit: 'g/dL', male: [13, 17], female: [12, 16], low: 'Anemia', high: 'Polycythemia' },
  'wbc': { unit: '/cmm', both: [4000, 11000], low: 'Leukopenia', high: 'Leukocytosis' },
  'tlc': { unit: '/cmm', both: [4000, 11000], low: 'Leukopenia', high: 'Leukocytosis' },
  'platelet': { unit: '/cmm', both: [150000, 400000], low: 'Thrombocytopenia', high: 'Thrombocytosis' },
  'plt': { unit: '/cmm', both: [150000, 400000], low: 'Thrombocytopenia', high: 'Thrombocytosis' },
  'esr': { unit: 'mm/hr', male: [0, 15], female: [0, 20], high: 'Raised ESR (inflammation/infection)' },
  'creatinine': { unit: 'mg/dL', both: [0.7, 1.3], high: 'Elevated creatinine (renal impairment)' },
  's.creatinine': { unit: 'mg/dL', both: [0.7, 1.3], high: 'Elevated creatinine (renal impairment)' },
  'urea': { unit: 'mg/dL', both: [15, 45], high: 'Elevated urea (renal/pre-renal)' },
  'bun': { unit: 'mg/dL', both: [7, 20], high: 'Elevated BUN' },
  'sodium': { unit: 'mEq/L', both: [135, 145], low: 'Hyponatremia', high: 'Hypernatremia' },
  'na+': { unit: 'mEq/L', both: [135, 145], low: 'Hyponatremia', high: 'Hypernatremia' },
  'potassium': { unit: 'mEq/L', both: [3.5, 5.0], low: 'Hypokalemia', high: 'Hyperkalemia' },
  'k+': { unit: 'mEq/L', both: [3.5, 5.0], low: 'Hypokalemia', high: 'Hyperkalemia' },
  'chloride': { unit: 'mEq/L', both: [96, 106], low: 'Hypochloremia', high: 'Hyperchloremia' },
  'calcium': { unit: 'mg/dL', both: [8.5, 10.5], low: 'Hypocalcemia', high: 'Hypercalcemia' },
  'rbs': { unit: 'mmol/L', both: [4.0, 7.8], high: 'Hyperglycemia' },
  'fbs': { unit: 'mmol/L', both: [3.9, 6.1], high: 'Impaired fasting glucose / DM' },
  'hba1c': { unit: '%', both: [4.0, 5.6], high: 'Pre-diabetes (5.7-6.4) or DM (>6.5)' },
  'sgpt': { unit: 'U/L', both: [7, 56], high: 'Elevated ALT (liver injury)' },
  'alt': { unit: 'U/L', both: [7, 56], high: 'Elevated ALT (liver injury)' },
  'sgot': { unit: 'U/L', both: [10, 40], high: 'Elevated AST (liver/cardiac)' },
  'ast': { unit: 'U/L', both: [10, 40], high: 'Elevated AST (liver/cardiac)' },
  'bilirubin': { unit: 'mg/dL', both: [0.1, 1.2], high: 'Hyperbilirubinemia (jaundice if >2.5)' },
  's.bilirubin': { unit: 'mg/dL', both: [0.1, 1.2], high: 'Hyperbilirubinemia (jaundice if >2.5)' },
  'albumin': { unit: 'g/dL', both: [3.5, 5.5], low: 'Hypoalbuminemia (liver disease/nephrotic)' },
  'alkaline phosphatase': { unit: 'U/L', both: [44, 147], high: 'Raised ALP (cholestatic/bone)' },
  'alp': { unit: 'U/L', both: [44, 147], high: 'Raised ALP (cholestatic/bone)' },
  'tsh': { unit: 'mIU/L', both: [0.4, 4.0], low: 'Hyperthyroidism', high: 'Hypothyroidism' },
  't3': { unit: 'ng/dL', both: [80, 200], low: 'Low T3', high: 'Elevated T3 (thyrotoxicosis)' },
  't4': { unit: 'ug/dL', both: [5.0, 12.0], low: 'Low T4 (hypothyroid)', high: 'Elevated T4 (hyperthyroid)' },
  'pt': { unit: 'seconds', both: [11, 13.5], high: 'Prolonged PT (coagulopathy/warfarin)' },
  'inr': { unit: '', both: [0.8, 1.1], high: 'Elevated INR' },
  'aptt': { unit: 'seconds', both: [25, 35], high: 'Prolonged APTT' },
  'd-dimer': { unit: 'ng/mL', both: [0, 500], high: 'Elevated D-dimer (DVT/PE/DIC)' },
  'crp': { unit: 'mg/L', both: [0, 5], high: 'Elevated CRP (inflammation/infection)' },
  'procalcitonin': { unit: 'ng/mL', both: [0, 0.5], high: 'Elevated procalcitonin (bacterial infection)' },
  'troponin': { unit: 'ng/mL', both: [0, 0.04], high: 'Elevated troponin (myocardial injury/MI)' },
  'uric acid': { unit: 'mg/dL', male: [3.4, 7.0], female: [2.4, 6.0], high: 'Hyperuricemia (gout risk)' },
}

export function interpretLab(testName, value, sex = 'male') {
  const key = testName.toLowerCase().trim()
  const range = LAB_RANGES[key]
  if (!range) return null
  const val = parseFloat(value)
  if (isNaN(val)) return null
  const [low, high] = range[sex === 'female' ? 'female' : 'male'] || range.both
  let status = 'normal', interpretation = 'Within normal range', color = 'green'
  if (val < low) {
    status = 'low'; interpretation = range.low || `Below normal (ref: ${low}-${high})`; color = 'amber'
  } else if (val > high) {
    status = 'high'; interpretation = range.high || `Above normal (ref: ${low}-${high})`; color = 'red'
  }
  return { test: testName, value: val, unit: range.unit, refLow: low, refHigh: high, status, interpretation, color }
}

export function interpretMultipleLabs(labEntries, sex) {
  return labEntries.map(({ test, value }) => interpretLab(test, value, sex)).filter(Boolean)
}
