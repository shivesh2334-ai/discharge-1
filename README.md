# Discharge Summary Generator
**EMC Digicare · EasyMyCare Clinic, Dwarka**

AI-powered clinical discharge summary generator built with Next.js 14 and Claude claude-sonnet-4-6.

---

## Features
- AMIE-inspired 3-step pipeline: Analyse → Generate → Refine
- Pulls clinical notes, lab reports, and diagnostics from EMR (mock data included)
- Manual physician notes input field
- Structured output: diagnosis, procedures, hospital course, medications table, follow-up, red flags
- Edit mode for physician corrections before print
- Print-optimised layout

---

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/discharge-summary.git
cd discharge-summary
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
discharge-summary/
├── pages/
│   ├── index.tsx              # Main app page
│   ├── _app.tsx               # Global layout + styles
│   └── api/
│       └── generate-summary.ts  # Server-side Anthropic API route
├── components/
│   ├── PatientBanner.tsx      # Patient demographics header
│   ├── PipelineSteps.tsx      # AMIE-style 3-step progress indicator
│   ├── DataSourceCards.tsx    # EMR data source display
│   └── SummaryOutput.tsx      # Full structured discharge summary
├── lib/
│   └── patientData.ts         # Types + mock EMR data
├── .env.local.example
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Connecting to Real EMR Data

Replace the mock constants in `lib/patientData.ts` with API calls to your OGA Care / EasyMyCare backend:

```ts
// lib/patientData.ts
export async function fetchPatientData(uhid: string) {
  const res = await fetch(`https://your-oga-care-api.com/patient/${uhid}`);
  return res.json();
}
```

Then pass the live data into `pages/index.tsx`.

---

## Tech Stack
- **Next.js 14** (Pages Router)
- **TypeScript**
- **Anthropic SDK** (`claude-sonnet-4-6`)
- **Vercel** (bom1 region)

---

*Built by Dr. Shivesh Kumar · EMC Digitals · drshivesh@gmail.com*
