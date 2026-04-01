import { WARD_BOOK_SECTIONS } from './wardbook.js'

// Simple symptom-to-condition decision tree for offline fallback
const CONDITION_RULES = [
  { keywords: ['fever', 'cough', 'sputum', 'breathless', 'dyspnea', 'chest'], condition: 'Community Acquired Pneumonia', category: 'respiratory', wardKeys: ['pneumonia', 'cap'] },
  { keywords: ['fever', 'cough', 'wheeze', 'asthma', 'copd', 'exacerbation'], condition: 'Acute Exacerbation of COPD / Asthma', category: 'respiratory', wardKeys: ['copd', 'asthma'] },
  { keywords: ['chest pain', 'angina', 'crushing', 'radiating', 'jaw', 'arm'], condition: 'Acute Coronary Syndrome', category: 'cardiac', wardKeys: ['angina', 'stemi', 'mi', 'nstemi'] },
  { keywords: ['breathless', 'orthopnea', 'pnd', 'edema', 'lvf', 'heart failure'], condition: 'Acute Heart Failure / LVF', category: 'cardiac', wardKeys: ['heart failure', 'lvf'] },
  { keywords: ['headache', 'weakness', 'hemiplegia', 'slurred', 'stroke', 'facial droop'], condition: 'Stroke (CVA)', category: 'neurological', wardKeys: ['stroke'] },
  { keywords: ['seizure', 'convulsion', 'epilep', 'fitting', 'tonic', 'clonic'], condition: 'Status Epilepticus / Seizure', category: 'neurological', wardKeys: ['epilepticus', 'seizure', 'convulsion'] },
  { keywords: ['unconscious', 'coma', 'unresponsive', 'gcs', 'altered'], condition: 'Unconscious Patient', category: 'neurological', wardKeys: ['unconscious'] },
  { keywords: ['vomiting', 'diarrhea', 'loose stool', 'dehydration', 'gastro'], condition: 'Acute Gastroenteritis', category: 'gi', wardKeys: ['gastroenteritis', 'diarrhea'] },
  { keywords: ['abdominal pain', 'abdomen', 'vomiting', 'acute abdomen'], condition: 'Acute Abdomen', category: 'gi', wardKeys: ['acute abdomen'] },
  { keywords: ['jaundice', 'yellow', 'liver', 'hepat', 'ascites'], condition: 'Acute Liver Disease / CLD', category: 'gi', wardKeys: ['liver', 'hepatic', 'cld'] },
  { keywords: ['hematemesis', 'melena', 'blood vomit', 'gi bleed', 'variceal'], condition: 'GI Bleeding', category: 'gi', wardKeys: ['bleeding', 'variceal', 'pud'] },
  { keywords: ['diabetes', 'sugar', 'polyuria', 'polydipsia', 'hyperglycemia'], condition: 'Diabetes Mellitus', category: 'endocrine', wardKeys: ['diabetes'] },
  { keywords: ['dka', 'ketoacidosis', 'kussmaul', 'fruity breath'], condition: 'Diabetic Ketoacidosis', category: 'endocrine', wardKeys: ['dka', 'ketoacidosis'] },
  { keywords: ['hypoglycemia', 'low sugar', 'sweating', 'tremor', 'confusion'], condition: 'Hypoglycaemia', category: 'endocrine', wardKeys: ['hypoglycaemia'] },
  { keywords: ['hypertension', 'high bp', 'headache', 'bp high'], condition: 'Hypertension', category: 'cardiac', wardKeys: ['hypertension'] },
  { keywords: ['shock', 'hypotension', 'low bp', 'tachycardia', 'cold', 'clammy'], condition: 'Shock', category: 'emergency', wardKeys: ['shock'] },
  { keywords: ['anaphylaxis', 'allergy', 'urticaria', 'swelling', 'angioedema'], condition: 'Anaphylactic Shock', category: 'emergency', wardKeys: ['anaphylactic'] },
  { keywords: ['snake bite', 'bite', 'fang', 'venom'], condition: 'Snake Bite', category: 'toxicology', wardKeys: ['snake bite'] },
  { keywords: ['poisoning', 'opc', 'organophosphate', 'insecticide', 'salivation'], condition: 'OPC Poisoning', category: 'toxicology', wardKeys: ['opc', 'poisoning'] },
  { keywords: ['paracetamol', 'overdose', 'acetaminophen'], condition: 'Paracetamol Poisoning', category: 'toxicology', wardKeys: ['paracetamol poisoning'] },
  { keywords: ['dysuria', 'uti', 'burning', 'urinary', 'frequency'], condition: 'Urinary Tract Infection', category: 'renal', wardKeys: ['uti', 'pyelonephritis'] },
  { keywords: ['creatinine', 'kidney', 'oliguria', 'anuria', 'aki', 'renal'], condition: 'Acute Kidney Injury', category: 'renal', wardKeys: ['aki', 'kidney'] },
  { keywords: ['dengue', 'thrombocytopenia', 'petechiae', 'tourniquet'], condition: 'Dengue Fever', category: 'infectious', wardKeys: ['dengue'] },
  { keywords: ['typhoid', 'enteric', 'step ladder'], condition: 'Typhoid Fever', category: 'infectious', wardKeys: ['typhoid'] },
  { keywords: ['malaria', 'rigor', 'spleen', 'plasmodium'], condition: 'Malaria', category: 'infectious', wardKeys: ['malaria'] },
  { keywords: ['tb', 'tuberculosis', 'night sweat', 'hemoptysis', 'weight loss'], condition: 'Tuberculosis', category: 'infectious', wardKeys: ['tuberculosis', 'tb'] },
  { keywords: ['vertigo', 'dizziness', 'spinning', 'nystagmus'], condition: 'Vertigo', category: 'neurological', wardKeys: ['vertigo'] },
  { keywords: ['back pain', 'lbp', 'lumbar', 'sciatica'], condition: 'Low Back Pain', category: 'musculoskeletal', wardKeys: ['back pain', 'lbp'] },
  { keywords: ['hyponatremia', 'sodium', 'low sodium'], condition: 'Hyponatraemia', category: 'metabolic', wardKeys: ['hyponatraemia'] },
  { keywords: ['hyperkalemia', 'potassium', 'high potassium'], condition: 'Hyperkalaemia', category: 'metabolic', wardKeys: ['hyperkalaemia'] },
  { keywords: ['hypokalemia', 'low potassium'], condition: 'Hypokalaemia', category: 'metabolic', wardKeys: ['hypokalaemia'] },
]

function searchWardBookLocal(keywords) {
  const scored = WARD_BOOK_SECTIONS.map(section => {
    const hay = (section.title + ' ' + section.content).toLowerCase()
    let score = 0
    for (const k of keywords) {
      if (hay.includes(k.toLowerCase())) score += (section.title.toLowerCase().includes(k.toLowerCase()) ? 3 : 1)
    }
    return { ...section, score }
  }).filter(s => s.score > 0).sort((a, b) => b.score - a.score)
  return scored.slice(0, 3)
}

export function offlineDiagnosis(patientSummary) {
  const text = patientSummary.toLowerCase()
  const matches = CONDITION_RULES.map(rule => {
    const score = rule.keywords.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0)
    return { ...rule, score }
  }).filter(r => r.score >= 2).sort((a, b) => b.score - a.score)

  if (matches.length === 0) {
    return {
      primary_diagnosis: 'Unable to determine offline — insufficient symptom match',
      diagnosis_reasoning: 'The local symptom checker could not match enough keywords to suggest a diagnosis. Please re-analyze with AI when online.',
      confidence: 'low',
      differentials: [],
      investigations: [{ test: 'Complete Blood Count', rationale: 'Baseline investigation', priority: 'routine' }],
      _offline: true,
    }
  }

  const primary = matches[0]
  const wardSections = searchWardBookLocal(primary.wardKeys)

  return {
    primary_diagnosis: primary.condition,
    diagnosis_reasoning: `Offline symptom checker matched ${primary.score} keywords for ${primary.condition} (category: ${primary.category}). This is a preliminary suggestion — please verify with AI diagnosis when online.`,
    confidence: 'low',
    differentials: matches.slice(1, 5).map(m => ({
      diagnosis: m.condition,
      key_feature: `${m.score} symptom keyword matches`,
      likelihood: m.score >= 3 ? 'possible' : 'less likely',
    })),
    investigations: [
      { test: 'Complete Blood Count', rationale: 'Baseline investigation', priority: 'routine' },
      { test: 'Blood Glucose', rationale: 'Screen for metabolic causes', priority: 'routine' },
      { test: 'Serum Electrolytes', rationale: 'Check metabolic panel', priority: 'routine' },
    ],
    _offline: true,
    _wardBookMatch: wardSections,
  }
}

export function offlineTreatment(diagnosis, patientSummary) {
  const searchTerms = diagnosis.toLowerCase().split(/\s+/).filter(w => w.length > 2)
  const matched = searchWardBookLocal(searchTerms)

  if (matched.length === 0) {
    return {
      treatment_plan: [{ step: 'Consult AI when online', details: 'No matching ward book protocol found offline. Please re-analyze with AI for treatment recommendations.', priority: 'immediate' }],
      medications: [],
      monitoring: 'Monitor vitals every 4-6 hours',
      patient_advice: 'Rest, adequate hydration, seek emergency care if symptoms worsen',
      follow_up: 'Review when online AI diagnosis is available',
      red_flags: 'Worsening symptoms, altered consciousness, respiratory distress',
      _offline: true,
    }
  }

  // Extract protocol text and format as treatment
  const protocolText = matched.map(s => s.content).join('\n\n').slice(0, 3000)

  return {
    treatment_plan: [
      { step: 'Ward Book Protocol Available', details: `Matched ward book section: ${matched[0].title}. See medications below from MMCH protocols.`, priority: 'immediate' },
      { step: 'Verify with AI when online', details: 'This treatment is based on local ward book matching. Re-analyze with AI for personalized treatment.', priority: 'short-term' },
    ],
    medications: [],
    monitoring: 'Monitor vitals every 4-6 hours. Check relevant labs as per ward book protocol.',
    patient_advice: 'Follow the ward book protocol. Rest, adequate hydration.',
    follow_up: 'Re-evaluate within 24-48 hours or when online AI is available',
    red_flags: 'Worsening symptoms, hemodynamic instability, altered consciousness',
    _offline: true,
    _protocolText: protocolText,
  }
}
