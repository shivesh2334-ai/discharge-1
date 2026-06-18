// components/SummaryOutput.tsx
import { SummaryData, Patient } from "@/lib/patientData";

const SECTION_COLORS: Record<string, string> = {
  diagnosis: "#e85d5d",
  procedures: "#d97706",
  course: "#0891b2",
  investigations: "#7c3aed",
  medications: "#059669",
  followup: "#1d4ed8",
  advice: "#be185d",
};

function SummarySection({
  title, color, children,
}: {
  title: string; color: string; children: React.ReactNode;
}) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: "16px 20px", border: "1px solid #e2e8f0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 3, height: 16, background: color, borderRadius: 2 }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{title}</div>
      </div>
      {children}
    </div>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <div style={{
      background: color + "15", border: `1px solid ${color}40`,
      borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, color,
    }}>
      {label}
    </div>
  );
}

interface Props {
  summary: SummaryData;
  patient: Patient;
  onEdit: () => void;
  onReset: () => void;
}

export default function SummaryOutput({ summary, patient, onEdit, onReset }: Props) {
  return (
    <div>
      {/* Header bar */}
      <div style={{
        background: "linear-gradient(135deg, #1a1f3a, #2d3561)", borderRadius: 14,
        padding: "20px 24px", display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 16,
      }} className="no-print">
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>Discharge Summary Ready</div>
          <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>AI-generated · Requires physician sign-off</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onEdit} style={btnStyle("#334155")}>✏️ Edit</button>
          <button onClick={() => window.print()} style={btnStyle("#059669")}>🖨️ Print</button>
          <button onClick={onReset} style={btnStyle("#e85d5d")}>↩ Reset</button>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }} className="no-print">
        <Badge label={`Condition: ${summary.condition}`} color="#059669" />
        <Badge label={`${summary.diagnosis?.length || 0} Diagnoses`} color="#7c3aed" />
        <Badge label={`${summary.medications?.length || 0} Medications`} color="#d97706" />
        <Badge label={`${summary.followUp?.length || 0} Follow-up Items`} color="#0891b2" />
      </div>

      {/* Sections */}
      <div style={{ display: "grid", gap: 12 }}>

        <SummarySection title="Chief Complaint & Diagnosis" color={SECTION_COLORS.diagnosis}>
          <div style={{ color: "#475569", fontSize: 13, marginBottom: 8 }}>{summary.chiefComplaint}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {summary.diagnosis?.map((d, i) => (
              <span key={i} style={{
                background: "#fef2f2", color: "#e85d5d",
                fontSize: 12, padding: "3px 10px", borderRadius: 20, fontWeight: 600,
              }}>{d}</span>
            ))}
          </div>
        </SummarySection>

        <SummarySection title="Procedures Performed" color={SECTION_COLORS.procedures}>
          <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
            {summary.procedures?.map((p, i) => (
              <li key={i} style={{ color: "#475569", fontSize: 13, marginBottom: 4 }}>{p}</li>
            ))}
          </ul>
        </SummarySection>

        <SummarySection title="Hospital Course" color={SECTION_COLORS.course}>
          <p style={{ margin: 0, color: "#475569", fontSize: 13, lineHeight: 1.7 }}>{summary.hospitalCourse}</p>
        </SummarySection>

        <SummarySection title="Investigations Summary" color={SECTION_COLORS.investigations}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {Object.entries(summary.investigations || {}).map(([k, v]) => (
              <div key={k} style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 12px" }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{k}</div>
                <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 600, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>
        </SummarySection>

        <SummarySection title="Discharge Medications" color={SECTION_COLORS.medications}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Drug", "Dose", "Frequency", "Duration"].map((h) => (
                  <th key={h} style={{
                    padding: "8px 10px", textAlign: "left", color: "#64748b",
                    fontSize: 11, fontWeight: 700, textTransform: "uppercase",
                    letterSpacing: "0.5px", borderBottom: "1px solid #e2e8f0",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {summary.medications?.map((m, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "8px 10px", color: "#1e293b", fontWeight: 600 }}>{m.drug}</td>
                  <td style={{ padding: "8px 10px", color: "#475569" }}>{m.dose}</td>
                  <td style={{ padding: "8px 10px", color: "#475569" }}>{m.frequency}</td>
                  <td style={{ padding: "8px 10px", color: "#475569" }}>{m.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SummarySection>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <SummarySection title="Follow-up Plan" color={SECTION_COLORS.followup}>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {summary.followUp?.map((f, i) => (
                <li key={i} style={{ color: "#475569", fontSize: 13, marginBottom: 5 }}>{f}</li>
              ))}
            </ul>
          </SummarySection>
          <SummarySection title="Discharge Advice" color={SECTION_COLORS.advice}>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {summary.advice?.map((a, i) => (
                <li key={i} style={{ color: "#475569", fontSize: 13, marginBottom: 5 }}>{a}</li>
              ))}
            </ul>
          </SummarySection>
        </div>

        {/* Red Flags */}
        <div style={{
          background: "#fef2f2", borderRadius: 12, padding: "16px 20px",
          border: "1.5px solid #fca5a5",
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", marginBottom: 10 }}>
            ⚠️ Red Flags – Patient to Return Immediately If:
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {summary.redFlags?.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#7f1d1d" }}>
                <span style={{ color: "#dc2626", flexShrink: 0 }}>▸</span>{r}
              </div>
            ))}
          </div>
        </div>

        {/* Sign-off */}
        <div style={{
          background: "#fff", borderRadius: 12, padding: "16px 20px",
          border: "1px solid #e2e8f0", display: "flex",
          justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{patient.consultant}</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>EasyMyCare Clinic, Dwarka, New Delhi</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              Generated: {new Date().toLocaleString("en-IN")}
            </div>
            <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 2 }}>
              AI-assisted · Physician verification required
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function btnStyle(bg: string): React.CSSProperties {
  return {
    background: bg, color: "#fff", border: "none", borderRadius: 8,
    padding: "8px 14px", fontSize: 12, fontWeight: 600,
    cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
  };
}
