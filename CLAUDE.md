# Orgwise — Claude Code Handoff

## What this is
A people-first business strategy diagnostic for Singapore SMEs. Built with Next.js 16 + TypeScript. No database — analysis runs client-side. One server-side API route calls Claude for the AI deep-dive.

## Stack
- Next.js 16 (App Router)
- TypeScript
- No Tailwind — all styles are inline `<style>` in `app/page.tsx`
- Anthropic API via server-side route (`app/api/deepdive/route.ts`)

## Project structure
```
orgwise/
├── app/
│   ├── page.tsx              ← entire frontend (React, styles, engine)
│   ├── layout.tsx            ← HTML shell, metadata, Google Fonts
│   ├── globals.css           ← minimal reset only
│   └── api/
│       └── deepdive/
│           └── route.ts      ← server-side Claude API call (POST)
├── public/                   ← static assets (default Next.js)
├── vercel.json               ← Vercel deploy config
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Key design decisions
- **Rules engine in `analyse()` function** (`app/page.tsx`) — scores 5 levers (recruit/develop/outsource/automate/regional), normalises to 100%. Fully deterministic, no API needed.
- **AI deep-dive is optional** — calls `/api/deepdive` only when user clicks the button. Degrades gracefully if API is unavailable.
- **Anthropic key is server-side only** — `process.env.ANTHROPIC_API_KEY` in the API route, never exposed to the browser.
- **No data stored** — everything lives in React state, nothing persists.

## Environment variables needed
```
ANTHROPIC_API_KEY=sk-ant-...
```
Add this in Vercel dashboard → Project → Settings → Environment Variables.

## Local dev
```bash
npm install
npm run dev
# → http://localhost:3000
```

## Deploy to Vercel
```bash
# One-time setup
npm install -g vercel
vercel login

# Deploy
vercel --prod
```
Or push to GitHub and connect repo in Vercel dashboard — it auto-deploys on every push to main.

## GitHub setup
```bash
git remote add origin https://github.com/yongshunnn/orgwise.git
git branch -M main
git push -u origin main
```

## Service line mapping (important for CTAs)
The 5 levers map to your 3 business entities:
| Lever | Service | Entity |
|-------|---------|--------|
| Recruit | Recruitment | StaffGo (EA Lic: 23C2993) |
| Develop | Fractional HR | Advisory |
| Outsource | Payroll & HR admin | Elevate Payroll Pte Ltd |
| Automate | Advisory + tech | Fractional |
| Regional | Employer of Record | Straits EOR |

## Things to customise
- [ ] CTA email address — currently `hello@elevate-payroll.com` in `page.tsx` (search "Get in touch")
- [ ] Brand name — "orgwise" is a placeholder, update in `layout.tsx` metadata and `page.tsx` logo
- [ ] Domain — point a custom domain in Vercel dashboard after first deploy
- [ ] Scoring weights — tune the `analyse()` function in `page.tsx` as you learn from real users

## Frameworks referenced in the engine
- **Core vs Context** (Geoffrey Moore) — outsource/automate decisions
- **Maister leverage model** — develop/pyramid decisions
- **Build-vs-buy talent** — recruit vs develop
- **Porter generic strategies** — positioning layer
- **Transaction Cost Economics** — make vs buy / regional layer

## Singapore context baked in
- MOM Work Permit Dependency Ratio Ceiling tightening
- EP/S Pass COMPASS salary floors
- Two-tier levy pressure
- Workplace Fairness Act (2026)
- PSG/EDG/EIS grants (consolidating into EDGE 2H2026)
- Retirement/re-employment age rise from 1 July 2026
