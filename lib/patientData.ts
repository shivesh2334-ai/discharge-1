// lib/patientData.ts
// In production, replace these with API calls to your OGA Care / EasyMyCare backend

export interface Patient {
  name: string;
  age: number;
  sex: string;
  uhid: string;
  ward: string;
  admitDate: string;
  dischargeDate: string;
  consultant: string;
}

export interface SummaryData {
  chiefComplaint: string;
  diagnosis: string[];
  procedures: string[];
  hospitalCourse: string;
  investigations: Record<string, string>;
  medications: {
    drug: string;
    dose: string;
    frequency: string;
    duration: string;
  }[];
  followUp: string[];
  condition: string;
  advice: string[];
  redFlags: string[];
}

export const MOCK_PATIENT: Patient = {
  name: 'Rajesh Kumar',
  age: 62,
  sex: 'Male',
  uhid: 'EMC-2026-04821',
  ward: 'Cardiology – Room 4B',
  admitDate: '10 Jun 2026',
  dischargeDate: '18 Jun 2026',
  consultant: 'Dr. Shivesh Kumar (MD, DM Cardiology)',
};

export const MOCK_CLINICAL_NOTES = `• 10 Jun: Admitted with 3h chest pain, diaphoresis. ECG: ST elevation V1–V4. Troponin I: 18.2 ng/mL. Diagnosis: Anterior STEMI.
• 10 Jun: Emergency PCI performed. LAD 90% stenosis – drug-eluting stent placed. Post-procedure TIMI-3 flow.
• 11 Jun: Transferred to CCU. BP 100/70, HR 88. Echocardiogram: EF 38%, anterior wall hypokinesia.
• 13 Jun: Started on cardiac rehabilitation protocol. Mobilising with support.
• 15 Jun: Repeat echo – EF improved to 42%. No pericardial effusion.
• 17 Jun: Review by physiotherapy. Independent mobilisation achieved.`;

export const MOCK_LABS = `CBC (12 Jun): Hb 11.2 g/dL, WBC 11,800/µL, Plt 198,000/µL
Biochemistry: Na 138, K 4.1, Cr 1.1 mg/dL, eGFR 68
Lipid Profile: LDL 148 mg/dL, HDL 32 mg/dL, TG 210 mg/dL
HbA1c: 7.8%
Troponin I peak: 18.2 → 3.4 → 0.9 ng/mL (trending down)
BNP: 480 → 210 pg/mL (improving)`;

export const MOCK_DIAGNOSTICS = `ECG (admission): ST elevation V1–V4, Q waves developing
ECG (discharge): Q waves V1–V4, no acute ST changes
Echo (11 Jun): EF 38%, anterior hypokinesia, no MR, no pericardial effusion
Echo (15 Jun): EF 42%, mild anterior wall motion improvement
Coronary angiography: LAD 90% proximal occlusion, RCA/LCx – minimal disease
Chest X-ray (11 Jun): Mild pulmonary oedema
Chest X-ray (17 Jun): Resolving; no consolidation`;

/**
 * Fetch patient data from OGA Care / EasyMyCare backend
 * Replace with actual API endpoint in production
 */
export async function fetchPatientData(uhid: string): Promise<Patient> {
  // In production:
  // const res = await fetch(`https://your-oga-care-api.com/patient/${uhid}`);
  // return res.json();

  // For now, return mock data
  return MOCK_PATIENT;
}
