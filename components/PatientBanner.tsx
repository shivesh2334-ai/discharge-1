// components/PatientBanner.tsx
import { Patient } from '@/lib/patientData';

interface Props {
  patient: Patient;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>{value}</div>
    </div>
  );
}

export default function PatientBanner({ patient }: Props) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        padding: '16px 20px',
        marginBottom: 20,
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px 32px',
      }}
    >
      <Field label="Patient" value={patient.name} />
      <Field label="Age / Sex" value={`${patient.age}Y ${patient.sex}`} />
      <Field label="UHID" value={patient.uhid} />
      <Field label="Ward" value={patient.ward} />
      <Field label="Admission" value={patient.admitDate} />
      <Field label="Discharge" value={patient.dischargeDate} />
      <Field label="Consultant" value={patient.consultant} />
    </div>
  );
}
