// pages/api/generate-summary.ts
// Server-side only – ANTHROPIC_API_KEY never exposed to client

import type { NextApiRequest, NextApiResponse } from 'next';
import Anthropic from '@anthropic-ai/sdk';

interface RequestBody {
  patient?: Record<string, unknown>;
  clinicalNotes?: string;
  labResults?: string;
  diagnostics?: string;
  manualNotes?: string;
  diagnosisInput?: string;
}

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  summary: Record<string, unknown>;
}

type ResponseData = ErrorResponse | SuccessResponse;

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY environment variable is not set');
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
): Promise<void> {
  // CORS & Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Request validation
  const { patient, clinicalNotes, labResults, diagnostics, manualNotes, diagnosisInput } =
    req.body as RequestBody;

  if (!patient) {
    return res.status(400).json({ error: 'Patient data is required' });
  }

  if (!clinicalNotes || !labResults || !diagnostics) {
    return res.status(400).json({ error: 'Clinical data (notes, labs, diagnostics) is required' });
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
PRIMARY DIAGNOSIS INPUT: ${diagnosisInput || 'As derived from clinical notes'}

CLINICAL NOTES FROM EMR:
${clinicalNotes}

LAB RESULTS:
${labResults}

DIAGNOSTICS & IMAGING:
${diagnostics}

ADDITIONAL MANUAL NOTES FROM PHYSICIAN:
${manualNotes || 'Nil additional notes.'}

Generate a comprehensive, clinically accurate discharge summary following Indian hospital standards.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const text =
      message.content
        .map((c) => (c.type === 'text' ? c.text : ''))
        .join('') || '';

    if (!text) {
      return res.status(500).json({ error: 'No response from AI model' });
    }

    // Clean and parse JSON response
    const clean = text.replace(/```json|```/g, '').trim();
    let parsed: Record<string, unknown>;

    try {
      parsed = JSON.parse(clean);
    } catch (parseError) {
      console.error('JSON Parse error:', parseError, 'Raw response:', text);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    return res.status(200).json({ summary: parsed });
  } catch (error) {
    console.error('Summary generation error:', error);

    if (error instanceof Anthropic.APIError) {
      return res.status(error.status || 500).json({
        error: `API Error: ${error.message}`,
      });
    }

    return res.status(500).json({
      error: 'Failed to generate summary. Please try again.',
    });
  }
}
