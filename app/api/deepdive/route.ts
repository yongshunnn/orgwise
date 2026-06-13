import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {industry,head,mix,traj,challenge,funcs,margin,manpower,alloc,primary} = body;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({error:"no key"},{ status:500 });

  const prompt = `You are a pragmatic people-and-org strategy advisor for Singapore SMEs. Be concrete, candid and brief — the reader is a time-poor owner.

BUSINESS PROFILE
- Industry: ${industry}
- Headcount: ${head}
- Workforce mix: ${mix}
- Revenue trajectory: ${traj}
- Biggest challenge: ${challenge}
- Where the work piles up: ${funcs}
- Margin health: ${margin}
- Manpower as % of revenue: ${manpower}

A diagnostic engine suggests this energy split: ${alloc}. Primary lever: ${primary}.

Write a tailored read using these lenses where relevant: Core-vs-Context (Geoffrey Moore), Maister's leverage model, build-vs-buy talent, Porter's generic strategies. Ground it in current Singapore realities (tightening Dependency Ratio Ceiling & two-tier levy, EP/S Pass salary floors & COMPASS, the talent paradox, Workplace Fairness Act, PSG/EDG/EIS grants consolidating into EDGE in 2H2026).

Format with these exact sections as markdown headings:
## The read
2-3 sentences on what's really going on.
## Three moves
A bulleted list of 3 specific moves, each naming the capability to engage (recruitment, outsourcing/payroll, fractional advisory, or employer-of-record).
## One thing to watch
A single risk or trade-off the owner should not ignore.

Under 320 words. No preamble or sign-off.`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type":"application/json", "x-api-key":apiKey, "anthropic-version":"2023-06-01" },
      body: JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:1000, messages:[{role:"user",content:prompt}] }),
    });
    const data = await resp.json();
    const text = (data.content||[]).filter((b:any)=>b.type==="text").map((b:any)=>b.text).join("\n").trim();
    return NextResponse.json({ text });
  } catch(e) {
    return NextResponse.json({ error:"api error" }, { status:500 });
  }
}
