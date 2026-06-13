import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    industry, head, mix, traj,
    challenges, funcs,
    margin, manpower,
    marketing, growth,
    alloc, primary,
  } = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "no key" }, { status: 500 });

  const prompt = `You are a pragmatic people-and-org strategy advisor for Singapore SMEs. Be concrete, candid and brief — the reader is a time-poor owner.

BUSINESS PROFILE
- Industry: ${industry}
- Headcount: ${head}
- Workforce mix: ${mix}
- Revenue trajectory: ${traj}
- Challenges (ranked): ${challenges}
- Where the work piles up: ${funcs}
- Margin health: ${margin}
- Manpower as % of revenue: ${manpower}
- Marketing investment: ${marketing}
- Growth ambition beyond Singapore: ${growth}

A diagnostic engine suggests this energy split: ${alloc}. Primary lever: ${primary}.

Write a tailored read using these frameworks where relevant:
- Core vs Context (Geoffrey Moore) — outsource/automate decisions
- Maister leverage model — develop/pyramid decisions
- Build-vs-buy talent — recruit vs develop
- Porter generic strategies — positioning layer
- Transaction Cost Economics — make vs buy / regional

Ground it in current Singapore realities:
- Tightening Dependency Ratio Ceiling & two-tier Work Permit levy
- EP/S Pass salary floors rising; COMPASS framework
- Workplace Fairness Act effective 2026
- PSG digital marketing grant: up to 50%, 55 pre-approved vendors, S$30k/yr cap
- MRA grant: up to 70% of overseas BD costs (Budget 2026 enhancement from April 2026), S$100k per new market cap, three pillars
- PSG/EDG/MRA consolidating into new EDGE framework in 2H2026

Use capability language naturally — reference fractional leadership, employer of record, HR outsourcing, payroll outsourcing, executive search, digital marketing solutions — but never name specific companies.

Format with these exact headings:
## The read
2–3 sentences on what's really going on.
## Three moves
Bulleted list of 3 specific moves. Each should name a capability (fractional hire, HR outsourcing, employer of record, digital marketing, etc.).
## One thing to watch
A single risk or trade-off the owner should not ignore.

Under 320 words. No preamble or sign-off.`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await resp.json();
    const text = (data.content || [])
      .filter((b: { type: string }) => b.type === "text")
      .map((b: { text: string }) => b.text)
      .join("\n")
      .trim();
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "api error" }, { status: 500 });
  }
}
