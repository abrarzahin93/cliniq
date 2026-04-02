// Bangladesh Drug Brand Database
// Priority: BEXIMCO, ACI, OPSONIN, DRUG INTERNATIONAL, SQUARE, INCEPTA, RENATA, ESKAYEF, ACME, HEALTHCARE
// Data curated from medex.com.bd

const BD_DRUGS = [
  // ── Gastro ──
  { generic: 'Omeprazole', brands: [
    { name: 'Proceptin', company: 'BEXIMCO', strength: '20mg', form: 'Capsule' },
    { name: 'Xeldrin', company: 'ACI', strength: '20mg', form: 'Capsule' },
    { name: 'Ometid', company: 'OPSONIN', strength: '20mg', form: 'Capsule' },
    { name: 'Cosec', company: 'DRUG INTERNATIONAL', strength: '20mg', form: 'Capsule' },
    { name: 'Seclo', company: 'SQUARE', strength: '20mg', form: 'Capsule' },
    { name: 'Omenix', company: 'INCEPTA', strength: '20mg', form: 'Capsule' },
    { name: 'Losectil', company: 'ESKAYEF', strength: '20mg', form: 'Capsule' },
    { name: 'Opal', company: 'HEALTHCARE', strength: '20mg', form: 'Capsule' },
  ]},
  { generic: 'Esomeprazole', brands: [
    { name: 'Nexum', company: 'SQUARE', strength: '20mg', form: 'Capsule' },
    { name: 'Sergel', company: 'HEALTHCARE', strength: '20mg', form: 'Capsule' },
    { name: 'Maxpro', company: 'RENATA', strength: '20mg', form: 'Capsule' },
    { name: 'Eso', company: 'INCEPTA', strength: '20mg', form: 'Capsule' },
    { name: 'Esoral', company: 'BEXIMCO', strength: '20mg', form: 'Capsule' },
  ]},
  { generic: 'Pantoprazole', brands: [
    { name: 'Pantonix', company: 'SQUARE', strength: '40mg', form: 'Tablet' },
    { name: 'Pantid', company: 'INCEPTA', strength: '40mg', form: 'Tablet' },
    { name: 'Toprazol', company: 'BEXIMCO', strength: '40mg', form: 'Tablet' },
    { name: 'Pantosec', company: 'RENATA', strength: '40mg', form: 'Tablet' },
  ]},
  { generic: 'Ranitidine', brands: [
    { name: 'Neotack', company: 'SQUARE', strength: '150mg', form: 'Tablet' },
    { name: 'Ranitid', company: 'ACI', strength: '150mg', form: 'Tablet' },
    { name: 'Ranison', company: 'OPSONIN', strength: '150mg', form: 'Tablet' },
  ]},
  { generic: 'Domperidone', brands: [
    { name: 'Omidon', company: 'SQUARE', strength: '10mg', form: 'Tablet' },
    { name: 'Motilium', company: 'ACI', strength: '10mg', form: 'Tablet' },
    { name: 'Domperidon', company: 'OPSONIN', strength: '10mg', form: 'Tablet' },
    { name: 'Vominore', company: 'INCEPTA', strength: '10mg', form: 'Tablet' },
  ]},
  { generic: 'Metoclopramide', brands: [
    { name: 'Maxolon', company: 'BEXIMCO', strength: '10mg', form: 'Tablet' },
    { name: 'Metozol', company: 'SQUARE', strength: '10mg', form: 'Tablet' },
  ]},

  // ── Analgesics / Antipyretics ──
  { generic: 'Paracetamol', brands: [
    { name: 'Napa', company: 'BEXIMCO', strength: '500mg', form: 'Tablet' },
    { name: 'Xcel', company: 'ACI', strength: '500mg', form: 'Tablet' },
    { name: 'Renova', company: 'OPSONIN', strength: '500mg', form: 'Tablet' },
    { name: 'Momodol', company: 'DRUG INTERNATIONAL', strength: '500mg', form: 'Suppository' },
    { name: 'Ace', company: 'SQUARE', strength: '500mg', form: 'Tablet' },
    { name: 'Reset', company: 'INCEPTA', strength: '500mg', form: 'Tablet' },
    { name: 'Fast', company: 'ACME', strength: '500mg', form: 'Tablet' },
    { name: 'Tamen', company: 'ESKAYEF', strength: '500mg', form: 'Tablet' },
  ]},
  { generic: 'Diclofenac', brands: [
    { name: 'Clofenac', company: 'SQUARE', strength: '50mg', form: 'Tablet' },
    { name: 'Voltalin', company: 'BEXIMCO', strength: '50mg', form: 'Tablet' },
    { name: 'Diclofen', company: 'OPSONIN', strength: '50mg', form: 'Tablet' },
  ]},
  { generic: 'Ibuprofen', brands: [
    { name: 'Profen', company: 'SQUARE', strength: '400mg', form: 'Tablet' },
    { name: 'Ibuprofen', company: 'ACI', strength: '400mg', form: 'Tablet' },
    { name: 'Inflam', company: 'OPSONIN', strength: '400mg', form: 'Tablet' },
  ]},
  { generic: 'Ketorolac', brands: [
    { name: 'Toradol', company: 'SQUARE', strength: '10mg', form: 'Tablet' },
    { name: 'Keron', company: 'INCEPTA', strength: '10mg', form: 'Tablet' },
  ]},
  { generic: 'Tramadol', brands: [
    { name: 'Tradol', company: 'SQUARE', strength: '50mg', form: 'Capsule' },
    { name: 'Tramadol', company: 'OPSONIN', strength: '50mg', form: 'Capsule' },
  ]},

  // ── Antibiotics ──
  { generic: 'Amoxicillin', brands: [
    { name: 'Tycil', company: 'BEXIMCO', strength: '500mg', form: 'Capsule' },
    { name: 'Avlomox', company: 'ACI', strength: '500mg', form: 'Capsule' },
    { name: 'Moxin', company: 'OPSONIN', strength: '500mg', form: 'Capsule' },
    { name: 'Demoxil', company: 'DRUG INTERNATIONAL', strength: '500mg', form: 'Capsule' },
    { name: 'Moxacil', company: 'SQUARE', strength: '500mg', form: 'Capsule' },
    { name: 'Bactamox', company: 'RENATA', strength: '500mg', form: 'Capsule' },
    { name: 'SK-mox', company: 'ESKAYEF', strength: '500mg', form: 'Capsule' },
  ]},
  { generic: 'Amoxicillin + Clavulanic Acid', brands: [
    { name: 'Moxaclav', company: 'SQUARE', strength: '625mg', form: 'Tablet' },
    { name: 'Augmentin', company: 'BEXIMCO', strength: '625mg', form: 'Tablet' },
    { name: 'Fimoxyclav', company: 'INCEPTA', strength: '625mg', form: 'Tablet' },
    { name: 'Clavam', company: 'ACI', strength: '625mg', form: 'Tablet' },
  ]},
  { generic: 'Azithromycin', brands: [
    { name: 'Azithrocin', company: 'BEXIMCO', strength: '500mg', form: 'Tablet' },
    { name: 'Odazyth', company: 'ACI', strength: '500mg', form: 'Tablet' },
    { name: 'Azicin', company: 'OPSONIN', strength: '500mg', form: 'Tablet' },
    { name: 'Azimex', company: 'DRUG INTERNATIONAL', strength: '500mg', form: 'Tablet' },
    { name: 'Zimax', company: 'SQUARE', strength: '500mg', form: 'Tablet' },
    { name: 'Tridosil', company: 'INCEPTA', strength: '500mg', form: 'Tablet' },
    { name: 'Zithrox', company: 'ESKAYEF', strength: '500mg', form: 'Tablet' },
    { name: 'Rozith', company: 'HEALTHCARE', strength: '500mg', form: 'Tablet' },
  ]},
  { generic: 'Ceftriaxone', brands: [
    { name: 'Arixon', company: 'BEXIMCO', strength: '1g', form: 'Injection' },
    { name: 'Aciphin', company: 'ACI', strength: '1g', form: 'Injection' },
    { name: 'Traxon', company: 'OPSONIN', strength: '1g', form: 'Injection' },
    { name: 'Dicephin', company: 'DRUG INTERNATIONAL', strength: '1g', form: 'Injection' },
    { name: 'Ceftron', company: 'SQUARE', strength: '1g', form: 'Injection' },
    { name: 'Exephin', company: 'INCEPTA', strength: '1g', form: 'Injection' },
    { name: 'Triject', company: 'ESKAYEF', strength: '1g', form: 'Injection' },
    { name: 'Oricef', company: 'HEALTHCARE', strength: '1g', form: 'Injection' },
  ]},
  { generic: 'Cefixime', brands: [
    { name: 'Cef-3', company: 'SQUARE', strength: '200mg', form: 'Capsule' },
    { name: 'Cefim', company: 'ACI', strength: '200mg', form: 'Capsule' },
    { name: 'Cefix', company: 'BEXIMCO', strength: '200mg', form: 'Capsule' },
    { name: 'Fixbac', company: 'OPSONIN', strength: '200mg', form: 'Capsule' },
  ]},
  { generic: 'Cefuroxime', brands: [
    { name: 'Cefotil', company: 'SQUARE', strength: '500mg', form: 'Tablet' },
    { name: 'Kilbac', company: 'ACI', strength: '500mg', form: 'Tablet' },
    { name: 'Seurox', company: 'INCEPTA', strength: '500mg', form: 'Tablet' },
  ]},
  { generic: 'Ciprofloxacin', brands: [
    { name: 'Ciprocin', company: 'SQUARE', strength: '500mg', form: 'Tablet' },
    { name: 'Cipro-A', company: 'ACI', strength: '500mg', form: 'Tablet' },
    { name: 'Ciprox', company: 'BEXIMCO', strength: '500mg', form: 'Tablet' },
  ]},
  { generic: 'Levofloxacin', brands: [
    { name: 'Levoxin', company: 'SQUARE', strength: '500mg', form: 'Tablet' },
    { name: 'Levoflox', company: 'ACI', strength: '500mg', form: 'Tablet' },
    { name: 'Lebac', company: 'INCEPTA', strength: '500mg', form: 'Tablet' },
  ]},
  { generic: 'Metronidazole', brands: [
    { name: 'Filmet', company: 'SQUARE', strength: '400mg', form: 'Tablet' },
    { name: 'Amodis', company: 'ACI', strength: '400mg', form: 'Tablet' },
    { name: 'Metryl', company: 'BEXIMCO', strength: '400mg', form: 'Tablet' },
  ]},
  { generic: 'Doxycycline', brands: [
    { name: 'Doxicap', company: 'SQUARE', strength: '100mg', form: 'Capsule' },
    { name: 'Doxylin', company: 'ACI', strength: '100mg', form: 'Capsule' },
    { name: 'Doxin', company: 'BEXIMCO', strength: '100mg', form: 'Capsule' },
  ]},
  { generic: 'Flucloxacillin', brands: [
    { name: 'Fluclox', company: 'SQUARE', strength: '500mg', form: 'Capsule' },
    { name: 'Floxapen', company: 'BEXIMCO', strength: '500mg', form: 'Capsule' },
  ]},
  { generic: 'Meropenem', brands: [
    { name: 'Meropen', company: 'SQUARE', strength: '1g', form: 'Injection' },
    { name: 'Ronem', company: 'INCEPTA', strength: '1g', form: 'Injection' },
    { name: 'Meronem', company: 'ACI', strength: '1g', form: 'Injection' },
  ]},

  // ── Cardiac / Antihypertensives ──
  { generic: 'Amlodipine', brands: [
    { name: 'Amdocal', company: 'BEXIMCO', strength: '5mg', form: 'Tablet' },
    { name: 'Cab', company: 'ACI', strength: '5mg', form: 'Tablet' },
    { name: 'Amocal', company: 'OPSONIN', strength: '5mg', form: 'Tablet' },
    { name: 'Amlocard', company: 'DRUG INTERNATIONAL', strength: '5mg', form: 'Tablet' },
    { name: 'Camlodin', company: 'SQUARE', strength: '5mg', form: 'Tablet' },
    { name: 'Amlotab', company: 'INCEPTA', strength: '5mg', form: 'Tablet' },
    { name: 'Xelcard', company: 'HEALTHCARE', strength: '5mg', form: 'Tablet' },
  ]},
  { generic: 'Atenolol', brands: [
    { name: 'Tenolol', company: 'SQUARE', strength: '50mg', form: 'Tablet' },
    { name: 'Atcard', company: 'ACI', strength: '50mg', form: 'Tablet' },
  ]},
  { generic: 'Bisoprolol', brands: [
    { name: 'Bisocor', company: 'SQUARE', strength: '5mg', form: 'Tablet' },
    { name: 'Biso', company: 'INCEPTA', strength: '5mg', form: 'Tablet' },
  ]},
  { generic: 'Losartan', brands: [
    { name: 'Losartas', company: 'SQUARE', strength: '50mg', form: 'Tablet' },
    { name: 'Angiazid', company: 'BEXIMCO', strength: '50mg', form: 'Tablet' },
    { name: 'Lortan', company: 'ACI', strength: '50mg', form: 'Tablet' },
  ]},
  { generic: 'Enalapril', brands: [
    { name: 'Enalap', company: 'SQUARE', strength: '5mg', form: 'Tablet' },
    { name: 'Epril', company: 'BEXIMCO', strength: '5mg', form: 'Tablet' },
  ]},
  { generic: 'Ramipril', brands: [
    { name: 'Ramace', company: 'SQUARE', strength: '5mg', form: 'Capsule' },
    { name: 'Ramicard', company: 'ACI', strength: '5mg', form: 'Capsule' },
  ]},
  { generic: 'Aspirin', brands: [
    { name: 'Ecosprin', company: 'SQUARE', strength: '75mg', form: 'Tablet' },
    { name: 'Ascard', company: 'ACI', strength: '75mg', form: 'Tablet' },
    { name: 'Desprin', company: 'BEXIMCO', strength: '75mg', form: 'Tablet' },
  ]},
  { generic: 'Clopidogrel', brands: [
    { name: 'Plavix', company: 'SQUARE', strength: '75mg', form: 'Tablet' },
    { name: 'Clopilet', company: 'INCEPTA', strength: '75mg', form: 'Tablet' },
    { name: 'Clot', company: 'ACI', strength: '75mg', form: 'Tablet' },
  ]},
  { generic: 'Atorvastatin', brands: [
    { name: 'Atova', company: 'BEXIMCO', strength: '10mg', form: 'Tablet' },
    { name: 'Atasin', company: 'ACI', strength: '10mg', form: 'Tablet' },
    { name: 'Avas', company: 'OPSONIN', strength: '10mg', form: 'Tablet' },
    { name: 'Divastin', company: 'DRUG INTERNATIONAL', strength: '10mg', form: 'Tablet' },
    { name: 'Anzitor', company: 'SQUARE', strength: '10mg', form: 'Tablet' },
    { name: 'Tiginor', company: 'INCEPTA', strength: '10mg', form: 'Tablet' },
    { name: 'Lipicon', company: 'ESKAYEF', strength: '10mg', form: 'Tablet' },
    { name: 'Xelpid', company: 'HEALTHCARE', strength: '10mg', form: 'Tablet' },
  ]},
  { generic: 'Rosuvastatin', brands: [
    { name: 'Rosuvas', company: 'SQUARE', strength: '10mg', form: 'Tablet' },
    { name: 'Crestor', company: 'ACI', strength: '10mg', form: 'Tablet' },
  ]},
  { generic: 'Furosemide', brands: [
    { name: 'Lasix', company: 'SQUARE', strength: '40mg', form: 'Tablet' },
    { name: 'Fusid', company: 'ACI', strength: '40mg', form: 'Tablet' },
    { name: 'Frusin', company: 'BEXIMCO', strength: '40mg', form: 'Tablet' },
  ]},
  { generic: 'Spironolactone', brands: [
    { name: 'Aldactone', company: 'SQUARE', strength: '25mg', form: 'Tablet' },
    { name: 'Spirocard', company: 'ACI', strength: '25mg', form: 'Tablet' },
  ]},
  { generic: 'Isosorbide Mononitrate', brands: [
    { name: 'Imdur', company: 'SQUARE', strength: '60mg', form: 'Tablet' },
    { name: 'Monotrate', company: 'ACI', strength: '60mg', form: 'Tablet' },
  ]},
  { generic: 'Nitroglycerin', brands: [
    { name: 'GTN', company: 'SQUARE', strength: '0.5mg', form: 'Tablet' },
    { name: 'Nitrostat', company: 'BEXIMCO', strength: '0.5mg', form: 'Tablet' },
  ]},

  // ── Diabetes ──
  { generic: 'Metformin', brands: [
    { name: 'Informet', company: 'BEXIMCO', strength: '500mg', form: 'Tablet' },
    { name: 'Metform', company: 'ACI', strength: '500mg', form: 'Tablet' },
    { name: 'Met', company: 'OPSONIN', strength: '500mg', form: 'Tablet' },
    { name: 'Oramet', company: 'DRUG INTERNATIONAL', strength: '500mg', form: 'Tablet' },
    { name: 'Comet', company: 'SQUARE', strength: '500mg', form: 'Tablet' },
    { name: 'Nobesit', company: 'INCEPTA', strength: '500mg', form: 'Tablet' },
    { name: 'Bigmet', company: 'RENATA', strength: '500mg', form: 'Tablet' },
    { name: 'Glunor', company: 'ESKAYEF', strength: '500mg', form: 'Tablet' },
    { name: 'Glymin', company: 'HEALTHCARE', strength: '500mg', form: 'Tablet' },
  ]},
  { generic: 'Glimepiride', brands: [
    { name: 'Amaryl', company: 'SQUARE', strength: '2mg', form: 'Tablet' },
    { name: 'Glimestar', company: 'ACI', strength: '2mg', form: 'Tablet' },
  ]},
  { generic: 'Gliclazide', brands: [
    { name: 'Gliclid', company: 'SQUARE', strength: '80mg', form: 'Tablet' },
    { name: 'Gliben', company: 'ACI', strength: '80mg', form: 'Tablet' },
  ]},
  { generic: 'Insulin (Soluble)', brands: [
    { name: 'Actrapid', company: 'INCEPTA', strength: '100IU/ml', form: 'Injection' },
    { name: 'Insul R', company: 'SQUARE', strength: '100IU/ml', form: 'Injection' },
  ]},
  { generic: 'Insulin (Mixed)', brands: [
    { name: 'Mixtard', company: 'INCEPTA', strength: '100IU/ml', form: 'Injection' },
    { name: 'Insul 30/70', company: 'SQUARE', strength: '100IU/ml', form: 'Injection' },
  ]},

  // ── Respiratory ──
  { generic: 'Salbutamol', brands: [
    { name: 'Sultolin', company: 'SQUARE', strength: '2mg', form: 'Tablet' },
    { name: 'Ventolin', company: 'ACI', strength: '100mcg', form: 'Inhaler' },
    { name: 'Brodil', company: 'BEXIMCO', strength: '2mg', form: 'Tablet' },
  ]},
  { generic: 'Montelukast', brands: [
    { name: 'Monas', company: 'SQUARE', strength: '10mg', form: 'Tablet' },
    { name: 'Montair', company: 'ACI', strength: '10mg', form: 'Tablet' },
    { name: 'Montegen', company: 'INCEPTA', strength: '10mg', form: 'Tablet' },
  ]},
  { generic: 'Theophylline', brands: [
    { name: 'Theobid', company: 'SQUARE', strength: '400mg', form: 'Tablet' },
    { name: 'Theovent', company: 'ACI', strength: '400mg', form: 'Tablet' },
  ]},
  { generic: 'Budesonide + Formoterol', brands: [
    { name: 'Budicort', company: 'SQUARE', strength: '200/6mcg', form: 'Inhaler' },
    { name: 'Foracort', company: 'INCEPTA', strength: '200/6mcg', form: 'Inhaler' },
  ]},

  // ── Steroids ──
  { generic: 'Prednisolone', brands: [
    { name: 'Cortan', company: 'SQUARE', strength: '5mg', form: 'Tablet' },
    { name: 'Deltasone', company: 'ACI', strength: '5mg', form: 'Tablet' },
  ]},
  { generic: 'Dexamethasone', brands: [
    { name: 'Oradexon', company: 'SQUARE', strength: '0.5mg', form: 'Tablet' },
    { name: 'Roxadex', company: 'ACI', strength: '0.5mg', form: 'Tablet' },
    { name: 'Decason', company: 'BEXIMCO', strength: '0.5mg', form: 'Tablet' },
  ]},
  { generic: 'Hydrocortisone', brands: [
    { name: 'Solu-Cortef', company: 'SQUARE', strength: '100mg', form: 'Injection' },
    { name: 'Hycort', company: 'INCEPTA', strength: '100mg', form: 'Injection' },
  ]},

  // ── Neuro / Psych ──
  { generic: 'Diazepam', brands: [
    { name: 'Sedil', company: 'SQUARE', strength: '5mg', form: 'Tablet' },
    { name: 'Valium', company: 'ACI', strength: '5mg', form: 'Tablet' },
  ]},
  { generic: 'Phenytoin', brands: [
    { name: 'Epinil', company: 'SQUARE', strength: '100mg', form: 'Tablet' },
    { name: 'Dilantin', company: 'ACI', strength: '100mg', form: 'Capsule' },
  ]},
  { generic: 'Carbamazepine', brands: [
    { name: 'Tegretol', company: 'SQUARE', strength: '200mg', form: 'Tablet' },
    { name: 'Carbin', company: 'INCEPTA', strength: '200mg', form: 'Tablet' },
  ]},
  { generic: 'Haloperidol', brands: [
    { name: 'Halopid', company: 'SQUARE', strength: '5mg', form: 'Tablet' },
    { name: 'Senorm', company: 'ACI', strength: '5mg', form: 'Tablet' },
  ]},
  { generic: 'Chlorpromazine', brands: [
    { name: 'Largectil', company: 'SQUARE', strength: '100mg', form: 'Tablet' },
  ]},

  // ── Antihistamines / Anti-allergics ──
  { generic: 'Fexofenadine', brands: [
    { name: 'Fexo', company: 'SQUARE', strength: '120mg', form: 'Tablet' },
    { name: 'Fexon', company: 'ACI', strength: '120mg', form: 'Tablet' },
    { name: 'Fenadin', company: 'OPSONIN', strength: '120mg', form: 'Tablet' },
  ]},
  { generic: 'Cetirizine', brands: [
    { name: 'Alatrol', company: 'SQUARE', strength: '10mg', form: 'Tablet' },
    { name: 'Cetzin', company: 'ACI', strength: '10mg', form: 'Tablet' },
  ]},
  { generic: 'Chlorpheniramine', brands: [
    { name: 'Histacin', company: 'SQUARE', strength: '4mg', form: 'Tablet' },
    { name: 'Piriton', company: 'ACI', strength: '4mg', form: 'Tablet' },
  ]},

  // ── Electrolytes / Supplements ──
  { generic: 'ORS', brands: [
    { name: 'ORSaline', company: 'SMC', strength: 'Standard', form: 'Sachet' },
    { name: 'Tasty Saline', company: 'SQUARE', strength: 'Standard', form: 'Sachet' },
  ]},
  { generic: 'Calcium + Vitamin D', brands: [
    { name: 'Calbo-D', company: 'SQUARE', strength: '500mg+200IU', form: 'Tablet' },
    { name: 'Acical-D', company: 'ACI', strength: '500mg+200IU', form: 'Tablet' },
  ]},
  { generic: 'Iron + Folic Acid', brands: [
    { name: 'Feronit', company: 'SQUARE', strength: '200mg', form: 'Tablet' },
    { name: 'Haemoforce', company: 'ACI', strength: '200mg', form: 'Capsule' },
  ]},
  { generic: 'Potassium Chloride', brands: [
    { name: 'KT', company: 'SQUARE', strength: '600mg', form: 'Tablet' },
  ]},
  { generic: 'Vitamin B Complex', brands: [
    { name: 'Bion', company: 'SQUARE', strength: 'Standard', form: 'Tablet' },
    { name: 'Pyrovit', company: 'ACI', strength: 'Standard', form: 'Tablet' },
  ]},

  // ── Anticoagulants ──
  { generic: 'Enoxaparin', brands: [
    { name: 'Clexane', company: 'INCEPTA', strength: '40mg', form: 'Injection' },
    { name: 'Nuparin', company: 'SQUARE', strength: '40mg', form: 'Injection' },
  ]},
  { generic: 'Warfarin', brands: [
    { name: 'Warfin', company: 'SQUARE', strength: '5mg', form: 'Tablet' },
    { name: 'Coumadin', company: 'ACI', strength: '5mg', form: 'Tablet' },
  ]},

  // ── Others ──
  { generic: 'Atropine', brands: [
    { name: 'Atropin', company: 'OPSONIN', strength: '0.6mg', form: 'Injection' },
    { name: 'Atropine', company: 'DRUG INTERNATIONAL', strength: '0.6mg', form: 'Injection' },
  ]},
  { generic: 'Adrenaline (Epinephrine)', brands: [
    { name: 'Adrenaline', company: 'OPSONIN', strength: '1mg', form: 'Injection' },
    { name: 'Epipen', company: 'DRUG INTERNATIONAL', strength: '1mg', form: 'Injection' },
  ]},
  { generic: 'N-Acetylcysteine', brands: [
    { name: 'Fluimucil', company: 'SQUARE', strength: '600mg', form: 'Sachet' },
    { name: 'Nystacef', company: 'BEXIMCO', strength: '600mg', form: 'Sachet' },
  ]},
  { generic: 'Ondansetron', brands: [
    { name: 'Emistat', company: 'SQUARE', strength: '4mg', form: 'Tablet' },
    { name: 'Onaseron', company: 'ACI', strength: '4mg', form: 'Tablet' },
  ]},
  { generic: 'Baclofen', brands: [
    { name: 'Beclofen', company: 'SQUARE', strength: '10mg', form: 'Tablet' },
    { name: 'Liofen', company: 'ACI', strength: '10mg', form: 'Tablet' },
  ]},
  { generic: 'Lactulose', brands: [
    { name: 'Laxose', company: 'SQUARE', strength: '3.35g/5ml', form: 'Syrup' },
    { name: 'Looz', company: 'INCEPTA', strength: '3.35g/5ml', form: 'Syrup' },
  ]},
  { generic: 'Hyoscine Butylbromide', brands: [
    { name: 'Buscopan', company: 'SQUARE', strength: '10mg', form: 'Tablet' },
    { name: 'Spasmo', company: 'ACI', strength: '10mg', form: 'Tablet' },
  ]},
  { generic: 'Albendazole', brands: [
    { name: 'Almex', company: 'SQUARE', strength: '400mg', form: 'Tablet' },
    { name: 'Albenza', company: 'ACI', strength: '400mg', form: 'Tablet' },
  ]},
  { generic: 'Fluconazole', brands: [
    { name: 'Flugal', company: 'SQUARE', strength: '150mg', form: 'Capsule' },
    { name: 'Flucon', company: 'ACI', strength: '150mg', form: 'Capsule' },
  ]},
  { generic: 'Artemether + Lumefantrine', brands: [
    { name: 'Coartem', company: 'SQUARE', strength: '20/120mg', form: 'Tablet' },
    { name: 'Lumefant', company: 'INCEPTA', strength: '20/120mg', form: 'Tablet' },
  ]},
]

// Approximate per-unit price in BDT (from medex.com.bd, 2024-2025)
const PRICE_MAP = {
  'omeprazole': 4, 'esomeprazole': 6, 'pantoprazole': 5, 'ranitidine': 2,
  'domperidone': 2, 'metoclopramide': 1.5,
  'paracetamol': 1.5, 'diclofenac': 2, 'ibuprofen': 2, 'ketorolac': 4, 'tramadol': 5,
  'amoxicillin': 5, 'amoxicillin + clavulanic acid': 12, 'azithromycin': 15,
  'ceftriaxone': 60, 'cefixime': 12, 'cefuroxime': 15, 'ciprofloxacin': 5,
  'levofloxacin': 10, 'metronidazole': 2, 'doxycycline': 3, 'flucloxacillin': 6,
  'meropenem': 350,
  'amlodipine': 3, 'atenolol': 2, 'bisoprolol': 4, 'losartan': 5,
  'enalapril': 2, 'ramipril': 4, 'aspirin': 1, 'clopidogrel': 5,
  'atorvastatin': 6, 'rosuvastatin': 8, 'furosemide': 2, 'spironolactone': 3,
  'isosorbide mononitrate': 4, 'nitroglycerin': 3,
  'metformin': 3, 'glimepiride': 5, 'gliclazide': 4,
  'insulin (soluble)': 450, 'insulin (mixed)': 450,
  'salbutamol': 2, 'montelukast': 8, 'theophylline': 3,
  'budesonide + formoterol': 450,
  'prednisolone': 2, 'dexamethasone': 2, 'hydrocortisone': 40,
  'diazepam': 1, 'phenytoin': 2, 'carbamazepine': 3, 'haloperidol': 2,
  'chlorpromazine': 2,
  'fexofenadine': 5, 'cetirizine': 3, 'chlorpheniramine': 1,
  'ors': 12, 'calcium + vitamin d': 5, 'iron + folic acid': 3,
  'potassium chloride': 3, 'vitamin b complex': 2,
  'enoxaparin': 250, 'warfarin': 3,
  'atropine': 8, 'adrenaline (epinephrine)': 10,
  'n-acetylcysteine': 15, 'ondansetron': 4, 'baclofen': 3,
  'lactulose': 120, 'hyoscine butylbromide': 4,
  'albendazole': 5, 'fluconazole': 10,
  'artemether + lumefantrine': 8,
}

// Priority order for sorting
const PRIORITY_COMPANIES = ['BEXIMCO', 'ACI', 'OPSONIN', 'DRUG INTERNATIONAL', 'SQUARE']

export function findBDbrands(drugName) {
  if (!drugName) return []
  const q = drugName.toLowerCase().trim()
  let match = BD_DRUGS.find(d => d.generic.toLowerCase() === q)
  if (!match) match = BD_DRUGS.find(d => d.generic.toLowerCase().includes(q) || q.includes(d.generic.toLowerCase()))
  if (!match) {
    const words = q.split(/\s+/)
    match = BD_DRUGS.find(d => words.some(w => w.length > 3 && d.generic.toLowerCase().includes(w)))
  }
  if (!match) return []
  const price = PRICE_MAP[match.generic.toLowerCase()] || null
  return [...match.brands].sort((a, b) => {
    const ai = PRIORITY_COMPANIES.indexOf(a.company)
    const bi = PRIORITY_COMPANIES.indexOf(b.company)
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi)
  }).map(b => ({ ...b, price }))
}

export function getBDprice(drugName) {
  if (!drugName) return null
  const q = drugName.toLowerCase().trim()
  if (PRICE_MAP[q]) return PRICE_MAP[q]
  const match = BD_DRUGS.find(d => d.generic.toLowerCase().includes(q) || q.includes(d.generic.toLowerCase()))
  return match ? (PRICE_MAP[match.generic.toLowerCase()] || null) : null
}

export default BD_DRUGS
