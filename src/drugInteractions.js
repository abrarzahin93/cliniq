// Drug-Drug Interaction Database
// Severity: critical (contraindicated), major (avoid), moderate (monitor), minor (info)
const INTERACTIONS = [
  // Anticoagulant interactions
  { drugs: ['warfarin', 'aspirin'], severity: 'major', effect: 'Increased bleeding risk. Monitor INR closely.', action: 'Avoid or reduce warfarin dose' },
  { drugs: ['warfarin', 'ibuprofen'], severity: 'major', effect: 'Increased bleeding risk + GI bleed.', action: 'Avoid NSAIDs with warfarin' },
  { drugs: ['warfarin', 'diclofenac'], severity: 'major', effect: 'Increased bleeding risk + GI bleed.', action: 'Avoid NSAIDs with warfarin' },
  { drugs: ['warfarin', 'metronidazole'], severity: 'major', effect: 'Metronidazole inhibits warfarin metabolism, increases INR.', action: 'Reduce warfarin dose, monitor INR' },
  { drugs: ['warfarin', 'ciprofloxacin'], severity: 'major', effect: 'Ciprofloxacin increases warfarin effect.', action: 'Monitor INR, reduce warfarin dose' },
  { drugs: ['warfarin', 'omeprazole'], severity: 'moderate', effect: 'Omeprazole may increase warfarin levels.', action: 'Monitor INR' },
  { drugs: ['enoxaparin', 'aspirin'], severity: 'major', effect: 'Additive bleeding risk.', action: 'Use with caution, monitor for bleeding' },
  { drugs: ['clopidogrel', 'omeprazole'], severity: 'major', effect: 'Omeprazole reduces clopidogrel activation.', action: 'Use pantoprazole instead' },
  { drugs: ['clopidogrel', 'esomeprazole'], severity: 'major', effect: 'Esomeprazole reduces clopidogrel activation.', action: 'Use pantoprazole instead' },

  // Diabetes interactions
  { drugs: ['metformin', 'contrast'], severity: 'critical', effect: 'Risk of lactic acidosis with IV contrast.', action: 'Stop metformin 48h before contrast, restart after renal function confirmed' },
  { drugs: ['glimepiride', 'fluconazole'], severity: 'major', effect: 'Fluconazole increases glimepiride levels, risk of hypoglycemia.', action: 'Monitor blood glucose closely' },
  { drugs: ['metformin', 'alcohol'], severity: 'major', effect: 'Increased risk of lactic acidosis.', action: 'Avoid excessive alcohol' },
  { drugs: ['insulin', 'atenolol'], severity: 'moderate', effect: 'Beta-blockers mask hypoglycemia symptoms.', action: 'Monitor blood glucose, prefer selective beta-blockers' },

  // Cardiac interactions
  { drugs: ['amlodipine', 'atenolol'], severity: 'moderate', effect: 'Additive hypotension and bradycardia.', action: 'Monitor BP and heart rate' },
  { drugs: ['enalapril', 'spironolactone'], severity: 'major', effect: 'Risk of hyperkalemia.', action: 'Monitor potassium levels regularly' },
  { drugs: ['ramipril', 'spironolactone'], severity: 'major', effect: 'Risk of hyperkalemia.', action: 'Monitor potassium levels regularly' },
  { drugs: ['losartan', 'spironolactone'], severity: 'major', effect: 'Risk of hyperkalemia.', action: 'Monitor potassium levels regularly' },
  { drugs: ['digoxin', 'amiodarone'], severity: 'critical', effect: 'Amiodarone increases digoxin levels 2-fold.', action: 'Reduce digoxin dose by 50%' },
  { drugs: ['atenolol', 'verapamil'], severity: 'critical', effect: 'Severe bradycardia, heart block, cardiac arrest.', action: 'Contraindicated combination' },

  // Antibiotic interactions
  { drugs: ['ciprofloxacin', 'theophylline'], severity: 'major', effect: 'Ciprofloxacin increases theophylline levels, risk of toxicity.', action: 'Reduce theophylline dose, monitor levels' },
  { drugs: ['metronidazole', 'alcohol'], severity: 'critical', effect: 'Disulfiram-like reaction: severe nausea, vomiting, flushing.', action: 'Absolutely avoid alcohol during and 48h after treatment' },
  { drugs: ['doxycycline', 'antacid'], severity: 'moderate', effect: 'Antacids reduce doxycycline absorption.', action: 'Separate by 2-3 hours' },
  { drugs: ['azithromycin', 'amiodarone'], severity: 'critical', effect: 'QT prolongation, risk of torsades de pointes.', action: 'Avoid combination' },
  { drugs: ['levofloxacin', 'amiodarone'], severity: 'critical', effect: 'QT prolongation, risk of torsades de pointes.', action: 'Avoid combination' },

  // NSAID interactions
  { drugs: ['ibuprofen', 'aspirin'], severity: 'major', effect: 'Ibuprofen blocks cardioprotective effect of aspirin.', action: 'Take aspirin 30min before ibuprofen if both needed' },
  { drugs: ['diclofenac', 'aspirin'], severity: 'major', effect: 'Increased GI bleed risk, reduced aspirin cardioprotection.', action: 'Avoid combination' },
  { drugs: ['ibuprofen', 'enalapril'], severity: 'moderate', effect: 'NSAIDs reduce ACE inhibitor effect, risk of renal impairment.', action: 'Monitor BP and renal function' },
  { drugs: ['diclofenac', 'losartan'], severity: 'moderate', effect: 'NSAIDs reduce ARB effect, risk of renal impairment.', action: 'Monitor BP and renal function' },
  { drugs: ['ketorolac', 'enoxaparin'], severity: 'critical', effect: 'Severe bleeding risk.', action: 'Contraindicated' },

  // Steroid interactions
  { drugs: ['prednisolone', 'ibuprofen'], severity: 'major', effect: 'Increased GI ulcer/bleed risk.', action: 'Add PPI prophylaxis' },
  { drugs: ['dexamethasone', 'diclofenac'], severity: 'major', effect: 'Increased GI ulcer/bleed risk.', action: 'Add PPI prophylaxis' },
  { drugs: ['prednisolone', 'metformin'], severity: 'moderate', effect: 'Steroids increase blood glucose.', action: 'Monitor blood glucose, may need insulin' },

  // CNS interactions
  { drugs: ['diazepam', 'tramadol'], severity: 'critical', effect: 'CNS depression, respiratory arrest risk.', action: 'Avoid combination or use lowest doses' },
  { drugs: ['diazepam', 'haloperidol'], severity: 'major', effect: 'Additive CNS depression.', action: 'Use lowest effective doses' },
  { drugs: ['tramadol', 'haloperidol'], severity: 'major', effect: 'Seizure risk increased.', action: 'Avoid in seizure-prone patients' },

  // Renal interactions
  { drugs: ['furosemide', 'gentamicin'], severity: 'major', effect: 'Additive ototoxicity and nephrotoxicity.', action: 'Monitor renal function and hearing' },
  { drugs: ['enalapril', 'potassium chloride'], severity: 'major', effect: 'Risk of hyperkalemia.', action: 'Monitor potassium levels' },
]

// Common drug allergies and cross-reactivity
const CROSS_ALLERGIES = {
  'penicillin': ['amoxicillin', 'amoxicillin + clavulanic acid', 'flucloxacillin', 'ampicillin'],
  'amoxicillin': ['penicillin', 'amoxicillin + clavulanic acid', 'flucloxacillin', 'ampicillin'],
  'cephalosporin': ['cefixime', 'ceftriaxone', 'cefuroxime'],
  'sulfa': ['sulfamethoxazole', 'cotrimoxazole'],
  'nsaid': ['ibuprofen', 'diclofenac', 'ketorolac', 'aspirin'],
  'aspirin': ['ibuprofen', 'diclofenac', 'ketorolac'],
}

function normalize(drug) {
  return drug.toLowerCase().replace(/[^a-z\s+]/g, '').trim()
}

export function checkInteractions(medications) {
  const alerts = []
  const drugNames = medications.map(m => normalize(m.drug))

  for (let i = 0; i < drugNames.length; i++) {
    for (let j = i + 1; j < drugNames.length; j++) {
      for (const int of INTERACTIONS) {
        const pair = int.drugs.map(normalize)
        if ((drugNames[i].includes(pair[0]) && drugNames[j].includes(pair[1])) ||
            (drugNames[i].includes(pair[1]) && drugNames[j].includes(pair[0]))) {
          alerts.push({
            drug1: medications[i].drug,
            drug2: medications[j].drug,
            severity: int.severity,
            effect: int.effect,
            action: int.action,
          })
        }
      }
    }
  }
  return alerts
}

export function checkAllergies(medications, allergiesText) {
  if (!allergiesText) return []
  const alerts = []
  const allergyWords = allergiesText.toLowerCase().split(/[,;\s]+/).filter(w => w.length > 2)

  for (const med of medications) {
    const drugLower = normalize(med.drug)
    // Direct match
    if (allergyWords.some(a => drugLower.includes(a) || a.includes(drugLower))) {
      alerts.push({ drug: med.drug, allergen: drugLower, type: 'direct', message: `Patient is allergic to ${med.drug}!` })
      continue
    }
    // Cross-reactivity
    for (const [allergen, related] of Object.entries(CROSS_ALLERGIES)) {
      if (allergyWords.some(a => a.includes(allergen))) {
        if (related.some(r => drugLower.includes(r))) {
          alerts.push({ drug: med.drug, allergen, type: 'cross', message: `${med.drug} may cross-react with ${allergen} allergy` })
        }
      }
    }
  }
  return alerts
}
