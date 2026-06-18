# Discharge Summary Generator
**EMC Digicare · EasyMyCare Clinic, Dwarka**

AI-powered clinical discharge summary generator built with Next.js 14 and Claude (claude-sonnet-4-6).

---

## Features
- **AMIE-inspired 3-step pipeline**: Analyse → Generate → Refine
- **EMR Integration**: Pulls clinical notes, lab reports, and diagnostics from EMR (mock data included)
- **Physician Input**: Manual notes input field for additional clinical observations
- **Structured Output**: Diagnosis, procedures, hospital course, medications table, follow-up plans, red flags
- **Edit Mode**: Physician corrections before print with full control
- **Print-optimised**: Professional layout for hospital discharge documents
- **Type-safe**: Full TypeScript support with comprehensive type definitions
- **Error Handling**: Robust API validation and user-friendly error messages

---

## Quick Start

```bash
git clone https://github.com/shivesh2334-ai/discharge-1.git
cd discharge-1
npm install
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Get from [console.anthropic.com](https://console.anthropic.com) |

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo at [vercel.com/new](https://vercel.com/new)
3. Add `ANTHROPIC_API_KEY` in **Settings → Environment Variables**
4. Set region to **bom1 (Mumbai)**
5. Deploy ✅

---

## Project Structure

```
discharge-1/
├── pages/
│   ├── _app.tsx                 # Global layout + styles
│   ├── index.tsx                # Main app page
│   └── api/
│       └── generate-summary.ts   # Server-side Anthropic API route
├── components/
│   ├── PatientBanner.tsx        # Patient demographics header
│   ├── PipelineSteps.tsx        # AMIE-style 3-step progress indicator
│   ├── DataSourceCards.tsx      # EMR data source display
│   └── SummaryOutput.tsx        # Full structured discharge summary
├── lib/
│   └── patientData.ts           # Types + mock EMR data + fetch functions
├── .env.local.example           # Environment variables template
├── .gitignore                   # Git ignore patterns
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## Connecting to Real EMR Data

Replace the mock constants in `lib/patientData.ts` with API calls to your OGA Care / EasyMyCare backend:

```typescript
// lib/patientData.ts
export async function fetchPatientData(uhid: string): Promise<Patient> {
  const res = await fetch(`https://your-oga-care-api.com/patient/${uhid}`);
  if (!res.ok) throw new Error('Failed to fetch patient data');
  return res.json();
}
```

Then update `pages/index.tsx` to use live data:

```typescript
const patientData = await fetchPatientData(patientUHID);
```

---

## API Route: `/api/generate-summary`

### Request
```bash
POST /api/generate-summary
Content-Type: application/json

{
  "patient": {
    "name": "Rajesh Kumar",
    "age": 62,
    "sex": "Male",
    "uhid": "EMC-2026-04821",
    "ward": "Cardiology – Room 4B",
    "admitDate": "10 Jun 2026",
    "dischargeDate": "18 Jun 2026",
    "consultant": "Dr. Shivesh Kumar"
  },
  "clinicalNotes": "...",
  "labResults": "...",
  "diagnostics": "...",
  "manualNotes": "...",
  "diagnosisInput": "..."
}
```

### Response
```json
{
  "summary": {
    "chiefComplaint": "...",
    "diagnosis": [...],
    "procedures": [...],
    "hospitalCourse": "...",
    "investigations": {...},
    "medications": [...],
    "followUp": [...],
    "condition": "Stable",
    "advice": [...],
    "redFlags": [...]
  }
}
```

---

## Key Improvements (v1.0.1)

✅ **Project Structure**: Proper Next.js directory organization (pages/, components/, lib/)

✅ **Global Styles**: Added `_app.tsx` with comprehensive CSS and print styles

✅ **Type Safety**: Full TypeScript types across all components and API routes

✅ **Error Handling**: Enhanced API validation and user-friendly error messages

✅ **Code Organization**: Better separation of concerns and reusable components

✅ **Configuration**: Added `.gitignore` and environment variables template

✅ **Documentation**: Comprehensive README with setup and API documentation

---

## Tech Stack
- **Next.js 14** (Pages Router)
- **TypeScript** (strict mode)
- **React 18** (latest hooks)
- **Anthropic SDK** (claude-sonnet-4-6)
- **Vercel** (bom1 region)

---

## Security Notes
- 🔒 API keys are **never exposed** to the client
- ✅ All environment variables are server-side only
- ✅ Request validation on API routes
- ✅ Error handling without exposing sensitive details

---

## Troubleshooting

### API Key Error
```
Error: ANTHROPIC_API_KEY environment variable is not set
```
Solution: Ensure `.env.local` contains your API key.

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Build Errors
```bash
rm -rf .next
npm run build
```

---

## Support
For issues or feature requests, please open a GitHub issue.

---

*Built by Dr. Shivesh Kumar · EMC Digitals · drshivesh@gmail.com*
