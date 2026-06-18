// pages/index.tsx
import { useState } from "react";
import Head from "next/head";
import PatientBanner from "@/components/PatientBanner";
import PipelineSteps from "@/components/PipelineSteps";
import DataSourceCards from "@/components/DataSourceCards";
import SummaryOutput from "@/components/SummaryOutput";
import {
  MOCK_PATIENT,
  MOCK_CLINICAL_NOTES,
  MOCK_LABS,
  MOCK_DIAGNOSTICS,
  SummaryData,
} from "@/lib/patientData";

type AppStep = "input" | "loading" | "summary";

const LOADING_MESSAGES = [
  { step: 1, title: "Analysing Clinical Data…", sub: "Processing notes, labs, and diagnostics from EMR" },
  { step: 2, title: "Generating Summary…", sub: "Cross-referencing clinical guidelines" },
  { step: 3, title: "Refining Output…", sub: "Applying clinical reasoning and safety checks" },
];

export default function Home() {
  const [appStep, setAppStep] = useState<AppStep>("input");
  const [pipelineStep, setPipelineStep] = useState(0);
  const [manualNotes, setManualNotes] = useState("");
  const [diagnosisInput, setDiagnosisInput] = useState("");
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const handleGenerate = async () => {
    setError("");
    setLoading(true);
    setAppStep("loading");

    setPipelineStep(1);
    await delay(900);

    setPipelineStep(2);

    try {
      const res = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: MOCK_PATIENT,
          clinicalNotes: MOCK_CLINICAL_NOTES,
          labResults: MOCK_LABS,
          diagnostics: MOCK_DIAGNOSTICS,
          manualNotes,
          diagnosisInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Unknown error");

      setPipelineStep(3);
      await delay(700);

      setSummary(data.summary);
      setEditedText(formatForEdit(data.summary));
      setAppStep("summary");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to generate summary.";
      setError(msg);
      setAppStep("input");
    } finally {
      setLoading(false);
    }
  };

  const formatForEdit = (s: SummaryData): string => `DISCHARGE SUMMARY – ${MOCK_PATIENT.name}
UHID: ${MOCK_PATIENT.uhid} | ${MOCK_PATIENT.admitDate} → ${MOCK_PATIENT.dischargeDate}
Consultant: ${MOCK_PATIENT.consultant}

DIAGNOSIS:
${s.diagnosis?.join("\n")}

PROCEDURES:
${s.procedures?.join("\n")}

HOSPITAL COURSE:
${s.hospitalCourse}

MEDICATIONS:
${s.medications?.map((m) => `${m.drug} ${m.dose} ${m.frequency} × ${m.duration}`).join("\n")}

FOLLOW-UP:
${s.followUp?.join("\n")}

DISCHARGE CONDITION: ${s.condition}

ADVICE:
${s.advice?.join("\n")}

RED FLAGS:
${s.redFlags?.join("\n")}`;

  const handleReset = () => {
    setAppStep("input");
    setPipelineStep(0);
    setSummary(null);
    setEditMode(false);
    setError("");
  };

  const loadingInfo = LOADING_MESSAGES.find((m) => m.step === pipelineStep);

  return (
    <>
      <Head>
        <title>Discharge Summary Generator – EMC Digicare</title>
      </Head>

      <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)",
          padding: "20px 32px", display: "flex", alignItems: "center", gap: 16,
        }} className="no-print">
          <div style={{
            background: "#e85d5d", borderRadius: 10, width: 44, height: 44,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>🏥</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 18, letterSpacing: "-0.3px" }}>
              Discharge Summary Generator
            </div>
            <div style={{ color: "#94a3b8", fontSize: 12 }}>
              AI-powered · Clinician-reviewed · EMC Digicare
            </div>
          </div>
          <div style={{ marginLeft: "auto", background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 14px" }}>
            <span style={{ color: "#60a5fa", fontSize: 12, fontWeight: 600 }}>● LIVE</span>
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
          <PatientBanner patient={MOCK_PATIENT} />

          <PipelineSteps
            currentStep={appStep === "loading" ? pipelineStep : 0}
            complete={appStep === "summary"}
          />

          {/* INPUT STEP */}
          {appStep === "input" && (
            <div style={{ display: "grid", gap: 16 }}>
              <DataSourceCards
                clinicalNotes={MOCK_CLINICAL_NOTES}
                labs={MOCK_LABS}
                diagnostics={MOCK_DIAGNOSTICS}
              />

              {/* Diagnosis override */}
              <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1px solid #e2e8f0" }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", display: "block", marginBottom: 8 }}>
                  Primary Diagnosis{" "}
                  <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional override)</span>
                </label>
                <input
                  value={diagnosisInput}
                  onChange={(e) => setDiagnosisInput(e.target.value)}
                  placeholder="e.g. Anterior STEMI post-PCI, Type 2 DM, Hypertension"
                  style={{
                    width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0",
                    borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit",
                  }}
                />
              </div>

              {/* Manual notes */}
              <div style={{
                background: "#fff", borderRadius: 12, padding: 20,
                border: "1.5px dashed #cbd5e1",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>✏️</span>
                  <label style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>
                    Manual Notes from Patient Records / EMR
                  </label>
                  <span style={{
                    fontSize: 11, background: "#fef3c7", color: "#92400e",
                    padding: "2px 8px", borderRadius: 20, fontWeight: 600,
                  }}>PHYSICIAN INPUT</span>
                </div>
                <textarea
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Add any additional clinical observations, verbal history, family notes, or specific instructions not captured in the EMR…"
                  rows={4}
                  style={{
                    width: "100%", padding: "10px 14px", border: "1.5px solid #e2e8f0",
                    borderRadius: 8, fontSize: 14, resize: "vertical", outline: "none",
                    fontFamily: "inherit", color: "#334155",
                  }}
                />
              </div>

              {error && (
                <div style={{
                  background: "#fef2f2", border: "1px solid #fca5a5",
                  borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: 13,
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  background: "linear-gradient(135deg, #e85d5d, #c0392b)",
                  color: "#fff", border: "none", borderRadius: 12,
                  padding: "16px 32px", fontSize: 16, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <span>🚀</span> Generate Discharge Summary
              </button>
            </div>
          )}

          {/* LOADING STEP */}
          {appStep === "loading" && loadingInfo && (
            <div style={{
              background: "#fff", borderRadius: 14, padding: "48px 32px",
              textAlign: "center", border: "1px solid #e2e8f0",
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                {pipelineStep === 1 ? "🔬" : pipelineStep === 2 ? "📋" : "✅"}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>
                {loadingInfo.title}
              </div>
              <div style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
                {loadingInfo.sub}
              </div>
              <div style={{
                background: "#f1f5f9", borderRadius: 8, height: 6,
                overflow: "hidden", maxWidth: 400, margin: "0 auto",
              }}>
                <div style={{
                  background: "linear-gradient(90deg, #e85d5d, #1a1f3a)",
                  height: "100%", width: `${(pipelineStep / 3) * 100}%`,
                  transition: "width 0.6s ease", borderRadius: 8,
                }} />
              </div>
              <div style={{ color: "#94a3b8", fontSize: 12, marginTop: 10 }}>
                Step {pipelineStep} of 3
              </div>
            </div>
          )}

          {/* SUMMARY STEP */}
          {appStep === "summary" && summary && (
            <>
              {editMode ? (
                <div style={{ background: "#fff", borderRadius: 12, padding: 20, border: "1.5px solid #e85d5d" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e85d5d" }}>
                      ✏️ Edit Mode – Modify then print
                    </div>
                    <button
                      onClick={() => setEditMode(false)}
                      style={{
                        background: "#1a1f3a", color: "#fff", border: "none",
                        borderRadius: 8, padding: "6px 14px", fontSize: 12,
                        fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      ← Back to View
                    </button>
                  </div>
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={24}
                    style={{
                      width: "100%", fontSize: 13,
                      fontFamily: "'Courier New', monospace",
                      border: "1px solid #e2e8f0", borderRadius: 8,
                      padding: 12, resize: "vertical", outline: "none",
                      lineHeight: 1.8,
                    }}
                  />
                  <button
                    onClick={() => window.print()}
                    style={{
                      marginTop: 12, background: "#059669", color: "#fff",
                      border: "none", borderRadius: 8, padding: "10px 20px",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    🖨️ Print Edited Summary
                  </button>
                </div>
              ) : (
                <SummaryOutput
                  summary={summary}
                  patient={MOCK_PATIENT}
                  onEdit={() => setEditMode(true)}
                  onReset={handleReset}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
