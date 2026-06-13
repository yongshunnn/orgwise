# Orgwise — Claude Code Handoff (v2)

## What changed in v2
- Challenges: top-3 ranking (weighted 100/60/35%) replacing single-pick
- 18 challenges total (was 9) — added succession, modernise, scalepain, founder, distress, M&A, newline, compliance, marketing
- Industry prevalence data shown on each challenge card (sourced: SBF NBS 2024/2025, QBE SME Survey 2025)
- 6th lever added: Market (digital marketing / PSG grant)
- New inputs on Step 2: marketing investment + growth ambition (both optional)
- Move tags: capability keywords (fractional hire, employer of record, HR outsourcing etc.) — no brand names
- Download results as .txt (upgrade to PDF with jsPDF when ready)
- Weighted scoring engine: challenges scored at 100% / 60% / 35% by rank

## Stack
- Next.js 16 (App Router), TypeScript
- No Tailwind — all styles are inline `<style>` in `app/page.tsx`
- Anthropic API via server-side route only (`app/api/deepdive/route.ts`)

## File structure
```
orgwise/
├── app/
│   ├── page.tsx              ← entire frontend (React, styles, engine, data)
│   ├── layout.tsx            ← HTML shell, metadata, Google Fonts
│   ├── globals.css           ← minimal reset only
│   └── api/
│       └── deepdive/
│           └── route.ts      ← server-side Claude API call (POST)
├── CLAUDE.md                 ← this file
├── README.md
├── .env.example
├── vercel.json
└── package.json
```

## Key data structures in page.tsx

### CHALLENGES (18 items)
`[id, displayName, subLabel]` — ordered by prevalence in "all sectors"

### PREVALENCE
`Record<industry, Record<challengeId, pct>>` — percentages shown on challenge cards.
Industries: all, services, retail, professional, manufacturing, tech, construction, logistics.

### LEVERS (6)
recruit, develop, outsource, automate, regional, market
Each has: label, color (CSS var), blurb

### MOVE_COPY
`Record<leverOrChallengeId, {title, body, tags}>` — move cards on results page.
Body text uses `<em>` for capability keywords. Tags are `[colorCode, label]` pairs.
colorCode: "n"=neutral, "a"=amber, "t"=teal, "b"=blue

### Answers type
```typescript
type Answers = {
  industry: string;
  head: string;
  mix: string;
  traj: string;
  challenges: string[];   // ordered array [#1, #2, #3]
  funcs: string[];
  margin: string;
  manpower: string;
  marketing: string;      // NEW: marketing investment level
  growth: string;         // NEW: growth ambition beyond SG
};
```

## Scoring engine (analyse function)
1. Base score: all 6 levers start at 10
2. Challenge scoring: #1 × 1.0, #2 × 0.6, #3 × 0.35 (weighted)
3. Industry, mix, trajectory, financials, functions add flat modifiers
4. Marketing investment → Market lever points
5. Growth ambition → Regional lever points + MRA consideration notes
6. All scores floored at 0, normalised to 100%
7. Top lever = primary recommendation

## Move selection logic
- If #1 challenge has a specific move (succession, founder, scalepain etc.), that move is shown first
- Remaining 2 moves come from top-scoring levers
- Move copy references capabilities (fractional hire, employer of record etc.) not brand names

## Environment variables
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Local dev
```bash
npm install
npm run dev   # → http://localhost:3000
```

## Deploy to Vercel
```bash
# Push to GitHub
git add -A
git commit -m "v2: top-3 ranking, 18 challenges, market lever, download"
git push origin main

# Connect repo in Vercel dashboard → add ANTHROPIC_API_KEY env var → Deploy
```

## Service line mapping (internal reference)
The move tags hint at capabilities without naming companies:
| Tag label              | Maps to internally       |
|------------------------|--------------------------|
| Fractional hire        | Fractional advisory      |
| Fractional leadership  | Fractional advisory      |
| Employer of record     | Straits EOR              |
| HR outsourcing         | Elevate Payroll          |
| Payroll outsourcing    | Elevate Payroll          |
| Executive search       | StaffGo                  |
| Digital marketing      | PSG referral / advisory  |

## Things still to do
- [ ] Upgrade download from .txt to branded PDF (jsPDF)
- [ ] Add email capture after download ("email me this read")
- [x] CTA email → updated to business@staffgo.sg
- [ ] Custom domain in Vercel dashboard
- [ ] Add business situation as Step 0 (early/growth/mature/transitioning/distressed)
- [ ] Consider gating AI deep-dive behind email capture
