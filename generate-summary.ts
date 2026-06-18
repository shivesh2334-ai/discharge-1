// pages/api/generate-summary.ts
// Server-side only – ANTHROPIC_API_KEY never exposed to client

import type { NextApiRequest, NextApiResponse } from "next";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    patient,
    clinicalNotes,
    labResults,
    diagnostics,
    manualNotes,
    diagnosisInput,
  } = req.body;

  if (!patient) {
    return res.status(400).json({ error: "Patient data is required" });
  }

  const systemPrompt = `You are an expert hospital physician generating a structured clinical discharge summary for an Indian hospital setting.
Output ONLY valid JSON with this exact structure (no markdown, no preamble, no backticks):
{
  "chiefComplaint": "string",
  "diagnosis": ["string"],
  "procedures": ["string"],
  "hospitalCourse": "string (3-5 sentences, clinical but readable)",
  "investigations": {"key finding label": "value with units"},
  "medications": [{"drug": "string", "dose": "string", "frequency": "string", "duration": "string"}],
  "followUp": ["string"],
  "condition": "Stable | Improved | Guarded | Critical",
  "advice": ["string"],
  "redFlags": ["string"]
}
Include 6-8 medications appropriate to the diagnosis. Include 4-6 red flag symptoms. Be clinically precise.`;

  const userPrompt = `Generate a discharge summary for this patient.

PATIENT: ${patient.name}, ${patient.age}Y ${patient.sex}, UHID: ${patient.uhid}
WARD: ${patient.ward}
ADMITTED: ${patient.admitDate} | DISCHARGED: ${patient.dischargeDate}
CONSULTANT: ${patient.consultant}
PRIMARY DIAGNOSIS INPUT: ${diagnosisInput || "As derived from clinical notes"}

CLINICAL NOTES FROM EMR:
${clinicalNotes}

LAB RESULTS:
${labResults}

DIAGNOSTICS & IMAGING:
${diagnostics}

ADDITIONAL MANUAL NOTES FROM PHYSICIAN:
${manualNotes || "Nil additional notes."}

Generate a comprehensive, clinically accurate discharge summary following Indian hospital standards.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      message.content
        .map((c) => (c.type === "text" ? c.text : ""))
        .join("") || "";

    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json({ summary: parsed });
  } catch (error) {
    console.error("Summary generation error:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate summary. Please try again." });
  }
}
