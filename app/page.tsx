"use client";
import React, { useState } from "react";

/* ============================================================
   ORGWISE — page.tsx
   Changes from v1:
   - Challenges: top-3 ranking (weighted 100/60/35%) + industry prevalence data
   - 9 new challenges: succession, modernise, scalepain, founder, distress, M&A, newline, compliance, marketing
   - New inputs: marketing investment + growth ambition (Step 2, optional)
   - 6th lever: Market (digital marketing / PSG)
   - Scoring: weighted multi-challenge engine
   - Move tags: capability keywords, no brand names
   - Download results as .txt
   - Results: ranked pills header, no bridge brand names
   ============================================================ */

const STYLE = `
  :root {
    --bg:#EBEEF2; --surface:#FFFFFF; --ink:#16203A; --ink2:#5A6580;
    --line:#DCE1E8; --amber:#DD8A2E; --teal:#1E6E6A;
    --recruit:#DD8A2E; --develop:#1E6E6A; --outsource:#3D6BB0;
    --automate:#6B4FA8; --regional:#B5546A; --market:#2A7A5C;
  }
  * { box-sizing: border-box; }
  body { background: var(--bg); color: var(--ink); line-height: 1.5; -webkit-font-smoothing: antialiased; }
  .ow-root { font-family:'Inter',system-ui,sans-serif; min-height:100vh; }
  .ow-wrap { max-width:1040px; margin:0 auto; padding:32px 22px 80px; }
  .ow-eyebrow { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.18em; text-transform:uppercase; color:var(--ink2); }
  .ow-brandbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:40px; }
  .ow-logo { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:20px; letter-spacing:-.02em; }
  .ow-logo span { color:var(--amber); }
  .ow-byline { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--ink2); }
  .ow-hero h1 { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:clamp(34px,6vw,58px); line-height:1.02; letter-spacing:-.03em; margin:18px 0 18px; max-width:14ch; }
  .ow-hero h1 em { font-style:normal; color:var(--amber); }
  .ow-lede { font-size:18px; color:var(--ink2); max-width:54ch; margin-bottom:30px; }
  .ow-frameworks { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:34px; }
  .ow-chip { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--ink2); border:1px solid var(--line); background:var(--surface); padding:5px 10px; border-radius:100px; }
  .ow-note { font-size:13px; color:var(--ink2); margin-top:18px; display:flex; gap:8px; align-items:flex-start; }
  .ow-dot { width:7px; height:7px; border-radius:50%; background:var(--teal); margin-top:6px; flex:none; }
  .ow-btn { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15px; cursor:pointer; border:none; border-radius:10px; padding:14px 24px; display:inline-flex; align-items:center; gap:10px; transition:transform .12s ease, box-shadow .12s ease; text-decoration:none; }
  .ow-btn:hover { transform:translateY(-1px); }
  .ow-btn-primary { background:var(--ink); color:#fff; }
  .ow-btn-primary:hover { box-shadow:0 8px 22px rgba(22,32,58,.22); }
  .ow-btn-amber { background:var(--amber); color:#231400; }
  .ow-btn-amber:hover { box-shadow:0 8px 22px rgba(221,138,46,.32); }
  .ow-btn-ghost { background:transparent; color:var(--ink); border:1px solid var(--line); }
  .ow-btn:disabled { opacity:.45; cursor:not-allowed; transform:none; }
  .ow-prog { display:flex; gap:6px; margin-bottom:26px; }
  .ow-prog div { height:4px; border-radius:4px; flex:1; background:var(--line); transition:background .3s; }
  .ow-prog div.on { background:var(--ink); }
  .ow-card { background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:28px; }
  .ow-steptitle { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:24px; letter-spacing:-.02em; margin:4px 0 4px; }
  .ow-subtitle { color:var(--ink2); font-size:14px; margin-bottom:24px; }
  .ow-q { font-weight:600; font-size:14px; margin:22px 0 10px; }
  .ow-q .opt { font-weight:400; color:var(--ink2); }
  .ow-seg { display:flex; gap:8px; flex-wrap:wrap; }
  .ow-seg button { cursor:pointer; border:1px solid var(--line); background:#fff; border-radius:9px; padding:10px 16px; font-size:14px; font-weight:500; color:var(--ink); transition:all .12s; }
  .ow-seg button.sel { background:var(--ink); color:#fff; border-color:var(--ink); }
  .ow-seg button:hover:not(.sel) { border-color:var(--ink2); }
  .ow-optional { margin-top:28px; border:1px dashed var(--line); border-radius:13px; overflow:hidden; }
  .ow-opthead { width:100%; text-align:left; cursor:pointer; background:#F6F8FA; border:none; padding:16px 20px; display:flex; justify-content:space-between; align-items:center; }
  .ow-opthead b { font-family:'Space Grotesk',sans-serif; font-size:15px; }
  .ow-opthead span { font-size:12px; color:var(--ink2); }
  .ow-optbody { padding:6px 20px 22px; }
  .ow-privacy { font-size:12px; color:var(--ink2); margin-top:14px; display:flex; gap:8px; align-items:flex-start; }
  .ow-ind-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; }
  .ow-navrow { display:flex; justify-content:space-between; align-items:center; margin-top:30px; }
  /* challenge ranking grid */
  .ow-ch-hint { font-size:12px; color:var(--ink2); background:#F6F8FA; border:1px solid var(--line); border-radius:9px; padding:10px 14px; margin-bottom:14px; }
  .ow-rank-legend { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:14px; }
  .ow-rl { font-size:11px; font-weight:500; border-radius:100px; padding:3px 10px; display:flex; align-items:center; gap:5px; }
  .ow-rl1 { background:#FFF3E0; color:#8B5000; border:1px solid #DD8A2E44; }
  .ow-rl2 { background:#E0F5F0; color:#0D4A46; border:1px solid #1E6E6A44; }
  .ow-rl3 { background:#E8EFF8; color:#1A3B6A; border:1px solid #3D6BB044; }
  .ow-ch-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(185px,1fr)); gap:9px; margin-bottom:16px; }
  .ow-ch-card { position:relative; cursor:pointer; text-align:left; border:1px solid var(--line); background:#fff; border-radius:11px; padding:13px 14px 11px; transition:border-color .12s, background .12s; user-select:none; }
  .ow-ch-card:hover { border-color:var(--ink2); }
  .ow-ch-card.r1 { border-color:var(--amber); background:#FFF8F0; }
  .ow-ch-card.r2 { border-color:var(--teal); background:#F0FAF7; }
  .ow-ch-card.r3 { border-color:#3D6BB0; background:#EFF4FB; }
  .ow-ch-badge { position:absolute; top:9px; right:9px; width:20px; height:20px; border-radius:50%; font-size:11px; font-weight:600; display:flex; align-items:center; justify-content:center; color:#fff; }
  .r1 .ow-ch-badge { background:var(--amber); }
  .r2 .ow-ch-badge { background:var(--teal); }
  .r3 .ow-ch-badge { background:#3D6BB0; }
  .ow-ch-name { font-size:13px; font-weight:600; color:var(--ink); margin-bottom:2px; padding-right:24px; line-height:1.3; }
  .ow-ch-sub { font-size:11px; color:var(--ink2); margin-bottom:8px; }
  .ow-ch-divider { height:1px; background:var(--line); margin-bottom:7px; }
  .ow-ch-stat { font-size:11px; color:var(--ink2); display:flex; align-items:center; gap:5px; }
  .ow-ch-pct { font-weight:600; font-size:11px; }
  .ow-ch-bar { flex:1; height:3px; background:var(--line); border-radius:2px; overflow:hidden; }
  .ow-ch-fill { height:3px; background:var(--line); border-radius:2px; transition:width .3s; }
  .r1 .ow-ch-fill { background:var(--amber); }
  .r2 .ow-ch-fill { background:var(--teal); }
  .r3 .ow-ch-fill { background:#3D6BB0; }
  .ow-status-row { display:flex; align-items:center; justify-content:space-between; min-height:28px; margin-bottom:14px; flex-wrap:wrap; gap:8px; }
  .ow-status-pills { display:flex; gap:6px; flex-wrap:wrap; }
  .ow-sp { font-size:12px; font-weight:500; border-radius:100px; padding:4px 10px; }
  .ow-sp1 { background:#FFF3E0; color:#8B5000; }
  .ow-sp2 { background:#E0F5F0; color:#0D4A46; }
  .ow-sp3 { background:#E8EFF8; color:#1A3B6A; }
  .ow-status-hint { font-size:12px; color:var(--ink2); }
  .ow-nav-meta { font-size:12px; color:var(--ink2); }
  /* results */
  .ow-ranked-chips { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
  .ow-rc { font-size:12px; font-weight:500; border-radius:100px; padding:4px 12px; display:flex; align-items:center; gap:5px; }
  .ow-rc1 { background:#FFF3E0; color:#8B5000; border:1px solid #DD8A2E44; }
  .ow-rc2 { background:#E0F5F0; color:#0D4A46; border:1px solid #1E6E6A44; }
  .ow-rc3 { background:#E8EFF8; color:#1A3B6A; border:1px solid #3D6BB044; }
  .ow-rc-num { font-size:10px; opacity:.65; }
  .ow-verdict { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:clamp(24px,4.5vw,38px); letter-spacing:-.03em; line-height:1.1; margin:6px 0 10px; max-width:22ch; }
  .ow-verdict em { font-style:normal; color:var(--amber); }
  .ow-rlede { color:var(--ink2); font-size:16px; max-width:60ch; margin-bottom:24px; }
  .ow-divider { height:1px; background:var(--line); margin:4px 0 20px; }
  .ow-section-label { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--ink2); margin-bottom:4px; }
  .ow-section-cap { font-size:12px; color:var(--ink2); margin-bottom:14px; }
  .ow-alloc { background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:22px; margin-bottom:24px; }
  .ow-bar { display:flex; height:42px; border-radius:8px; overflow:hidden; margin-bottom:16px; gap:2px; }
  .ow-seg2 { display:flex; align-items:center; justify-content:center; color:#fff; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:500; min-width:0; }
  .ow-legend { display:grid; grid-template-columns:repeat(auto-fit,minmax(155px,1fr)); gap:10px; }
  .ow-leg { display:flex; gap:9px; align-items:flex-start; }
  .ow-sw { width:10px; height:10px; border-radius:2px; margin-top:3px; flex:none; }
  .ow-leg b { font-family:'Space Grotesk',sans-serif; font-size:13px; }
  .ow-leg .pct { font-family:'JetBrains Mono',monospace; color:var(--ink2); font-size:11px; margin-left:3px; }
  .ow-leg p { margin:2px 0 0; font-size:11px; color:var(--ink2); }
  .ow-leg.primary b::after { content:' · start here'; color:var(--amber); font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.06em; }
  .ow-moves { display:grid; gap:12px; margin-bottom:24px; }
  .ow-move { background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:20px 22px; border-left:3px solid var(--ink); }
  .ow-move-meta { display:flex; align-items:center; gap:7px; margin-bottom:6px; flex-wrap:wrap; }
  .ow-move-lever { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink2); }
  .ow-move-fw { font-size:10px; color:var(--ink2); }
  .ow-move h4 { font-family:'Space Grotesk',sans-serif; font-size:17px; letter-spacing:-.01em; margin:0 0 7px; }
  .ow-move-body { font-size:13px; color:var(--ink2); line-height:1.7; margin-bottom:12px; }
  .ow-move-body em { font-style:normal; color:var(--ink); font-weight:600; }
  .ow-tags { display:flex; gap:7px; flex-wrap:wrap; }
  .ow-tag { display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:500; border-radius:100px; padding:4px 11px; border:1px solid; }
  .ow-tag-n { background:#F4F6F8; border-color:var(--line); color:var(--ink2); }
  .ow-tag-a { background:#FFF8F0; border-color:#DD8A2E44; color:#8B5000; }
  .ow-tag-t { background:#F0FAF7; border-color:#1E6E6A44; color:#0D4A46; }
  .ow-tag-b { background:#EFF4FB; border-color:#3D6BB044; color:#1A3B6A; }
  .ow-consider { background:#F6F8FA; border:1px solid var(--line); border-radius:14px; padding:22px; margin-bottom:24px; }
  .ow-consider ul { padding:0; margin:0; list-style:none; }
  .ow-consider li { display:flex; gap:11px; margin-bottom:13px; font-size:13px; }
  .ow-consider li:last-child { margin-bottom:0; }
  .ow-cn { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--teal); flex:none; margin-top:2px; white-space:nowrap; }
  .ow-con-text { color:var(--ink2); line-height:1.65; }
  .ow-con-text strong { color:var(--ink); font-weight:600; }
  .ow-ai { background:var(--ink); color:#E9ECF4; border-radius:16px; padding:24px; margin-bottom:20px; }
  .ow-ai h3 { font-family:'Space Grotesk',sans-serif; font-size:17px; color:#fff; margin:0 0 4px; }
  .ow-ai .sub { font-size:13px; color:#9AA4BD; margin-bottom:16px; }
  .ow-ai-out { font-size:14px; line-height:1.65; }
  .ow-ai-out h5 { font-family:'Space Grotesk',sans-serif; color:#fff; font-size:14px; margin:16px 0 5px; }
  .ow-ai-out p { margin:0 0 10px; color:#D4DAE8; }
  .ow-ai-out li { color:#D4DAE8; margin:0 0 6px; }
  .ow-ai-out strong { color:#fff; }
  .ow-spin { display:inline-block; width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:owspin .7s linear infinite; }
  @keyframes owspin { to { transform:rotate(360deg); } }
  .ow-action-row { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-bottom:20px; }
  .ow-btn-dl { font-size:13px; font-weight:600; background:var(--surface); color:var(--ink); border:1px solid var(--line); border-radius:10px; padding:10px 18px; cursor:pointer; display:inline-flex; align-items:center; gap:7px; transition:background .12s; }
  .ow-btn-dl:hover { background:#F0F2F5; }
  .ow-btn-restart { font-size:13px; color:var(--ink2); background:transparent; border:none; cursor:pointer; padding:10px 4px; text-decoration:underline; text-underline-offset:3px; }
  .ow-toast { display:none; font-size:12px; color:var(--teal); background:#E0F5F0; border:1px solid #1E6E6A44; border-radius:8px; padding:6px 12px; align-items:center; gap:6px; }
  .ow-toast.show { display:inline-flex; }
  .ow-cta-bar { padding:22px; background:var(--ink); border-radius:16px; display:flex; flex-wrap:wrap; gap:16px; align-items:center; justify-content:space-between; margin-bottom:24px; }
  .ow-cta-bar p { color:#D4DAE8; font-size:13px; margin:0; max-width:44ch; }
  .ow-cta-bar strong { color:#fff; display:block; font-family:'Space Grotesk',sans-serif; font-size:16px; margin-bottom:3px; }
  .ow-disc { font-size:11px; color:var(--ink2); max-width:70ch; line-height:1.6; }
  @media (prefers-reduced-motion:reduce){ *{ transition:none!important; animation:none!important; } }
  @media (max-width:560px){
    .ow-card{ padding:18px; }
    .ow-move{ padding:16px; }
    .ow-lede{ font-size:16px; }
    .ow-rlede{ font-size:15px; }
  }
  @media (max-width:480px){
    .ow-wrap{ padding:20px 16px 48px; }
    .ow-brandbar{ margin-bottom:24px; }
    .ow-steptitle{ font-size:20px; }
    .ow-btn{ font-size:14px; padding:12px 18px; }
    .ow-seg{ display:grid; grid-template-columns:1fr 1fr; }
    .ow-ind-grid{ grid-template-columns:1fr 1fr; }
    .ow-ch-grid{ grid-template-columns:1fr 1fr; }
    .ow-navrow{ gap:10px; }
    .ow-alloc{ padding:16px; }
    .ow-bar{ height:34px; }
    .ow-legend{ grid-template-columns:1fr 1fr; }
    .ow-consider{ padding:16px; }
    .ow-ai{ padding:16px; }
    .ow-cta-bar{ padding:18px; flex-direction:column; align-items:flex-start; }
    .ow-rank-legend{ gap:6px; }
    .ow-ranked-chips{ gap:6px; }
  }
`;

/* ── DATA ─────────────────────────────────────────────────── */

const INDUSTRIES = [
  ["services","Services"],["professional","Professional services"],
  ["retail","Retail / F&B"],["manufacturing","Manufacturing"],
  ["logistics","Logistics"],["construction","Construction"],
  ["tech","Tech / software"],["other","Other"],
];
const HEADCOUNT = [["micro","1–9"],["small","10–29"],["mid","30–99"],["large","100–199"]];
const MIX       = [["local","Mostly local"],["balanced","Balanced"],["foreign","Heavily foreign"]];
const TRAJ      = [["fast","Growing fast"],["slow","Growing slowly"],["flat","Flat"],["down","Declining"]];
const FUNCTIONS = [
  ["sales","Sales / BD"],["delivery","Delivery / ops"],
  ["admin","Admin / finance / HR"],["service","Customer service"],["product","Product / tech"],
];
const MARGIN   = [["healthy","Healthy"],["tight","Tight"],["loss","Loss-making"],["skip","Rather not say"]];
const MANPOWER = [["lt30","Under 30%"],["30to50","30–50%"],["gt50","Over 50%"],["skip","Rather not say"]];
const MARKETING_INV = [
  ["none","Not investing yet"],["adhoc","Ad-hoc / inconsistent"],
  ["some","Some spend, no clear strategy"],["active","Active spend, want more ROI"],
  ["strong","Strong and scaling"],
];
const GROWTH_AMB = [
  ["no","No, focused locally"],["exploring","Exploring the idea"],
  ["planning","Actively planning expansion"],["expanding","Already expanding, scaling up"],
];

const CHALLENGES: [string,string,string][] = [
  ["expensive","Labour is too expensive","wages & levies biting"],
  ["talent","Can't find the right talent","scarce or slow to hire"],
  ["margins","Margins are squeezed","costs eating profit"],
  ["turnover","High turnover","people keep leaving"],
  ["admin","Drowning in admin","back-office overload"],
  ["scale","Can't scale operations","growth outpacing the team"],
  ["tech","Falling behind on tech / AI","manual, legacy processes"],
  ["keyperson","Over-reliant on key people","too much in few heads"],
  ["expand","Want to expand regionally","eyeing SEA markets"],
  ["marketing","Weak marketing engine","no digital presence or strategy"],
  ["succession","Planning succession or exit","owner transition, next-gen handover"],
  ["modernise","Business needs to modernise","model change, reposition"],
  ["scalepain","Scaling pains","outgrowing informal management"],
  ["founder","Founder bandwidth ceiling","business limited by the owner"],
  ["distress","Business in distress / turnaround","revenue falling, model broken"],
  ["ma","Going through M&A or merger","integration, org overlap"],
  ["newline","Launching a new line","new product or service stream"],
  ["compliance","Compliance step-change","new regulation forcing restructure"],
];

/* prevalence % per industry — shown on challenge cards */
const PREVALENCE: Record<string, Record<string,number>> = {
  all:          { expensive:72,talent:70,margins:66,turnover:55,admin:48,scale:46,tech:47,keyperson:42,expand:38,marketing:44,succession:22,modernise:35,scalepain:38,founder:41,distress:28,ma:12,newline:31,compliance:38 },
  services:     { expensive:61,talent:67,margins:63,turnover:48,admin:52,scale:41,tech:43,keyperson:44,expand:42,marketing:51,succession:24,modernise:32,scalepain:36,founder:49,distress:26,ma:11,newline:33,compliance:36 },
  retail:       { expensive:68,talent:65,margins:74,turnover:71,admin:41,scale:38,tech:39,keyperson:32,expand:29,marketing:55,succession:21,modernise:38,scalepain:30,founder:37,distress:38,ma:9, newline:28,compliance:33 },
  professional: { expensive:52,talent:71,margins:55,turnover:44,admin:47,scale:48,tech:44,keyperson:54,expand:39,marketing:42,succession:31,modernise:36,scalepain:47,founder:58,distress:22,ma:16,newline:38,compliance:41 },
  manufacturing:{ expensive:73,talent:58,margins:57,turnover:41,admin:38,scale:44,tech:61,keyperson:38,expand:36,marketing:33,succession:28,modernise:38,scalepain:35,founder:32,distress:27,ma:14,newline:29,compliance:42 },
  tech:         { expensive:68,talent:76,margins:52,turnover:49,admin:39,scale:55,tech:31,keyperson:46,expand:49,marketing:48,succession:19,modernise:41,scalepain:61,founder:52,distress:18,ma:18,newline:44,compliance:35 },
  construction: { expensive:78,talent:72,margins:62,turnover:38,admin:36,scale:48,tech:55,keyperson:34,expand:28,marketing:29,succession:26,modernise:33,scalepain:31,founder:28,distress:24,ma:10,newline:22,compliance:44 },
  logistics:    { expensive:69,talent:63,margins:61,turnover:42,admin:44,scale:52,tech:58,keyperson:36,expand:41,marketing:35,succession:22,modernise:31,scalepain:40,founder:34,distress:25,ma:12,newline:27,compliance:39 },
};

/* ── LEVERS ───────────────────────────────────────────────── */

const LEVERS: Record<string,{label:string;color:string;blurb:string}> = {
  recruit:  {label:"Recruit",     color:"var(--recruit)",   blurb:"Hire for the skill you can't grow in time."},
  develop:  {label:"Develop",     color:"var(--develop)",   blurb:"Build a leverage pyramid from within."},
  outsource:{label:"Outsource",   color:"var(--outsource)", blurb:"Move non-core work off your plate."},
  automate: {label:"Automate",    color:"var(--automate)",  blurb:"Adopt AI / tech for repeatable work."},
  regional: {label:"Go regional", color:"var(--regional)",  blurb:"Hire compliantly across SEA."},
  market:   {label:"Market",      color:"var(--market)",    blurb:"Build your digital marketing engine."},
};

/* ── TYPES ────────────────────────────────────────────────── */

type Answers = {
  industry:string; head:string; mix:string; traj:string;
  challenges:string[];   // ordered: [#1, #2, #3]
  funcs:string[]; margin:string; manpower:string;
  marketing:string; growth:string;
};

/* ── MOVE COPY ────────────────────────────────────────────── */

type MoveData = { title:string; body:string; tags:[string,string][]; fw?:string };

const MOVE_COPY: Record<string,MoveData> = {
  recruit: {
    fw:"Build-vs-buy talent",
    title:"Hire for the scarce skill — fast and structured",
    body:"The local specialist pool is thin and slow. Buy the capability you can't grow in time. Brief tightly, assess properly, and consider a <em>fractional hire</em> to validate fit before committing to a full-time role.",
    tags:[["n","Executive search"],["t","Fractional hire"],["n","Structured assessment"]],
  },
  develop: {
    fw:"Maister leverage model",
    title:"Build a leverage pyramid — don't just hire seniors",
    body:"For repeatable delivery, hire raw, train hard, and put AI under your people. Fewer expensive seniors, more capacity. If no one is ready internally, a <em>fractional leader</em> can hold the centre while you develop them.",
    tags:[["n","Internal succession"],["t","Fractional leadership"],["n","Leadership development"]],
  },
  outsource: {
    fw:"Core vs Context",
    title:"Take non-core work off your plate",
    body:"Payroll, HR admin and back-office are necessary but don't differentiate you. Standardise and hand them off via <em>HR outsourcing</em> so your team's hours go to what wins clients.",
    tags:[["n","Payroll outsourcing"],["n","HR admin"],["t","Managed services"]],
  },
  automate: {
    fw:"Core vs Context",
    title:"Automate the repeatable before you re-hire",
    body:"Map the manual, rules-based work and let AI/tech absorb it. <em>Fractional advisory</em> can scope the right tools without overcommitting to a vendor. PSG co-funds up to 50% of pre-approved solutions (S$30k/yr cap).",
    tags:[["n","Process automation"],["t","Fractional advisory"],["a","PSG grant · up to 50%"]],
  },
  regional: {
    fw:"Transaction Cost Economics",
    title:"Open a regional layer — compliantly and asset-light",
    body:"Roles that don't need to sit in Singapore can be hired across SEA via an <em>employer of record</em> — no subsidiary, no entity risk. Pair with <em>HR outsourcing</em> to keep the home base lean. MRA covers up to 70% of overseas BD costs (Budget 2026, S$100k/market cap).",
    tags:[["b","Employer of record"],["n","HR outsourcing"],["a","MRA grant · up to 70%"],["n","SEA market entry"]],
  },
  market: {
    fw:"Core vs Context",
    title:"Build the marketing engine before you scale headcount",
    body:"Growth without a digital presence is headcount-dependent and expensive. Get SEO, SEM and content working first. PSG co-funds up to 50% of pre-approved <em>digital marketing solutions</em> — 55 approved vendors, S$30k/yr cap. Apply via the Business Grants Portal.",
    tags:[["n","Digital marketing"],["n","SEO · SEM · content"],["a","PSG grant · up to 50%"],["n","Brand building"]],
  },
  succession: {
    fw:"Maister leverage model",
    title:"Build the business to run without you",
    body:"A <em>fractional GM or COO</em> can hold the centre during transition while you develop internal successors or prepare for handover. Start the org audit now — what lives only in your head? Map it, document it, and begin delegating before the exit timeline is set.",
    tags:[["t","Fractional GM / COO"],["n","Succession planning"],["n","Org audit"],["n","Knowledge transfer"]],
  },
  founder: {
    fw:"Core vs Context",
    title:"Delegate structurally, not just temporarily",
    body:"The fix is structural, not motivational. Outsource payroll and HR admin first — that alone recovers 4–6 hours a week. Then bring in a <em>fractional operator</em> to absorb the management load while you build the permanent layer.",
    tags:[["n","HR outsourcing"],["t","Fractional operator"],["n","Delegation framework"]],
  },
  scalepain: {
    fw:"Maister leverage model",
    title:"Hire the management layer, not more executors",
    body:"The founder-does-everything model has a hard ceiling. You need one strong operator before you hire five more doers. A <em>fractional COO</em> can install the systems and rhythm while you recruit the permanent team.",
    tags:[["t","Fractional COO"],["n","Org design"],["n","Systems & process"]],
  },
  modernise: {
    fw:"Core vs Context",
    title:"Redesign the org around the new model",
    body:"Modernisation fails when the org doesn't change with the model. <em>Fractional advisory</em> can scope the new operating model — what to keep, what to outsource, what to automate — without a long consulting engagement.",
    tags:[["t","Fractional advisory"],["n","Business model redesign"],["n","Change management"]],
  },
  distress: {
    fw:"Transaction Cost Economics",
    title:"Convert fixed cost to variable capacity now",
    body:"Before any people decisions, diagnose whether the model is broken or just the execution. Outsource non-core functions to make the cost base flex with revenue. A <em>fractional CFO or advisor</em> can run the triage without adding permanent overhead.",
    tags:[["t","Fractional CFO / advisor"],["n","Cost restructure"],["n","Variable capacity"]],
  },
  ma: {
    fw:"Core vs Context",
    title:"Consolidate back-office before you integrate culture",
    body:"People and culture are where most mergers fail — not finances. Consolidate duplicate back-office functions via <em>payroll outsourcing</em> and managed HR first, freeing leadership to focus on the people integration.",
    tags:[["n","Payroll consolidation"],["n","HR integration"],["t","Managed HR services"]],
  },
  newline: {
    fw:"Build-vs-buy talent",
    title:"Test the line lean before you staff it permanently",
    body:"Run the new line with a <em>fractional hire</em> and outsourced support before building a permanent team. Only hire permanently once the line proves itself. Avoid building a second org before you have second revenue.",
    tags:[["t","Fractional hire"],["n","Lean market test"],["n","Outsourced support"]],
  },
  compliance: {
    fw:"Core vs Context",
    title:"Bring in the specialist, don't train your way to it",
    body:"The fastest path is <em>HR outsourcing</em> to an experienced compliance specialist — faster than internal training and immediately audit-ready. Build internal capability in parallel, not as the primary plan.",
    tags:[["n","HR compliance"],["n","Outsourced specialist"],["n","Payroll compliance"]],
  },
};

/* ── ENGINE ───────────────────────────────────────────────── */

function analyse(a: Answers) {
  const s: Record<string,number> = {recruit:10,develop:10,outsource:10,automate:10,regional:10,market:10};
  const add = (k:string,n:number) => { if(s[k]!==undefined) s[k]+=n; };
  const cons: [string,string][] = [];

  /* weighted challenge scoring: #1=100%, #2=60%, #3=35% */
  const weights = [1.0, 0.6, 0.35];
  a.challenges.forEach((ch, idx) => {
    const w = weights[idx] || 0;
    const wa = (k:string,n:number) => add(k, Math.round(n*w));
    switch(ch) {
      case "talent":     wa("recruit",30);wa("regional",15);wa("develop",10); break;
      case "expensive":  wa("regional",25);wa("automate",20);wa("outsource",10); break;
      case "turnover":   wa("develop",25);wa("recruit",5);
        if(idx===0) cons.push(["RETENTION","Turnover is usually a design problem, not a pay problem. Check role clarity, career pathing and span of control before you re-hire into the same gap."]); break;
      case "scale":      wa("outsource",15);wa("automate",20);wa("develop",12);wa("recruit",6); break;
      case "keyperson":  wa("develop",25);wa("recruit",6);wa("outsource",5);
        if(idx===0) cons.push(["KEY-PERSON RISK","Document and codify what lives in a few heads (SOPs), then build a second layer beneath them. A fractional senior can hold the bench while you grow it."]); break;
      case "margins":    wa("automate",22);wa("outsource",20);wa("regional",10); break;
      case "expand":     wa("regional",35);wa("recruit",6);
        if(idx===0) cons.push(["MARKET ENTRY","Test a new market with an employer-of-record hire before you sink cost into an entity. MRA grant support can offset overseas set-up and BD."]); break;
      case "admin":      wa("outsource",30);wa("automate",20); break;
      case "tech":       wa("automate",35);wa("recruit",10); break;
      case "marketing":  wa("market",35);wa("automate",10);
        if(idx===0) cons.push(["DIGITAL MARKETING (PSG)","Growth without a marketing engine is headcount-dependent. PSG co-funds up to 50% of pre-approved digital marketing solutions (SEO, SEM, content, automation) — 55 approved vendors, S$30k/yr cap. Apply via Business Grants Portal."]); break;
      case "succession": wa("develop",25);wa("recruit",15);wa("outsource",10);
        if(idx===0) cons.push(["SUCCESSION","The business needs to run without you for a buyer or successor to value it properly. Start with an org audit: what lives only in your head? Map it, document it, and begin delegating before the exit timeline is set — forced succession under time pressure destroys value."]); break;
      case "modernise":  wa("automate",25);wa("recruit",15);wa("develop",10);
        if(idx===0) cons.push(["TRANSFORMATION","Modernisation fails when the org doesn't change with the model. Map the new operating model first, then decide what skills to buy, build or borrow. Don't automate a broken process."]); break;
      case "scalepain":  wa("develop",20);wa("recruit",15);wa("outsource",15);
        if(idx===0) cons.push(["SCALING","The founder-does-everything model has a hard ceiling. The fix isn't more headcount — it's a management layer and documented processes. Hire one strong operator before you hire five more executors."]); break;
      case "founder":    wa("outsource",20);wa("recruit",20);wa("develop",10);
        if(idx===0) cons.push(["FOUNDER CEILING","The business is limited by one person's hours. The answer is structural: map what only you can do, hand off everything else. Outsource payroll and HR admin first — that alone recovers 4–6 hours a week."]); break;
      case "distress":   wa("outsource",20);wa("automate",15);wa("regional",10);wa("recruit",-10);
        if(idx===0) cons.push(["TURNAROUND","Before any people decisions, diagnose whether the model is broken or just the execution. If the model is broken, adding or cutting people won't fix it. Convert fixed cost to variable while you rebuild."]); break;
      case "ma":         wa("develop",15);wa("outsource",15);wa("recruit",10);
        if(idx===0) cons.push(["M&A INTEGRATION","People and culture are where most mergers fail — not finances. Map role overlaps early, communicate before rumours do, and consolidate back-office quickly. A fractional HR lead can manage the integration without adding permanent cost."]); break;
      case "newline":    wa("recruit",20);wa("develop",15);wa("outsource",10); break;
      case "compliance": wa("recruit",20);wa("outsource",20);wa("automate",10);
        if(idx===0) cons.push(["COMPLIANCE","Regulatory change is a forcing function to professionalise. The fastest path is outsourcing specialist compliance work while you build internal capability. Don't try to train your way to compliance speed."]); break;
    }
  });

  /* industry modifier */
  switch(a.industry) {
    case "services":      add("regional",10);add("automate",10); break;
    case "professional":  add("develop",12);add("recruit",8); break;
    case "retail":        add("automate",10);add("outsource",5);add("develop",5); break;
    case "manufacturing": add("automate",12);add("develop",6); break;
    case "logistics":     add("automate",10);add("regional",8); break;
    case "construction":  add("regional",8);add("automate",6); break;
    case "tech":          add("recruit",12);add("regional",10); break;
  }

  /* workforce mix */
  if (a.mix==="foreign") { add("regional",12);add("automate",8);
    cons.push(["LEVY & QUOTA","Heavy Work Permit reliance is exposed to a tightening Dependency Ratio Ceiling. Services is the most restricted sector. Diversify toward compliant regional or automated capacity."]);
  } else if (a.mix==="balanced") add("regional",5);
  else if (a.mix==="local") add("develop",5);

  /* trajectory */
  switch(a.traj) {
    case "fast": add("recruit",12);add("develop",8); break;
    case "slow": add("outsource",5);add("automate",5); break;
    case "flat": add("automate",8);add("outsource",8); break;
    case "down": add("outsource",12);add("regional",8);add("automate",6);add("recruit",-12);
      cons.push(["COST SHAPE","When revenue is soft, protect cash by converting fixed headcount into variable capacity. Fractional and outsourced functions flex with you. Avoid net-new FTEs until the trend turns."]); break;
  }

  /* financials */
  if (a.margin==="tight") { add("outsource",8);add("automate",8); }
  else if (a.margin==="loss") { add("outsource",12);add("regional",10);add("recruit",-8); }
  else if (a.margin==="healthy") add("recruit",5);
  if (a.manpower==="gt50") { add("automate",10);add("regional",8);
    cons.push(["MANPOWER LOAD","Over half of revenue going to people is heavy for most models. Either lift output per head (automation) or rebalance the cost base regionally."]);
  }

  /* functions */
  (a.funcs||[]).forEach(f => {
    if (f==="admin")    { add("outsource",15);add("automate",10); }
    if (f==="delivery") { add("develop",10);add("automate",8);add("recruit",5); }
    if (f==="sales")    { add("recruit",10);add("develop",5); }
    if (f==="service")  { add("automate",10);add("regional",8); }
    if (f==="product")  { add("recruit",10);add("automate",8); }
  });

  /* marketing investment */
  switch(a.marketing) {
    case "none":   add("market",35);
      cons.push(["DIGITAL MARKETING (PSG)","Growth without a marketing engine is headcount-dependent. PSG co-funds up to 50% of pre-approved digital marketing solutions — 55 approved vendors, S$30k/yr. Apply via Business Grants Portal before the scheme consolidates into EDGE in 2H2026."]); break;
    case "adhoc":  add("market",25);
      if(!cons.find(c=>c[0]==="DIGITAL MARKETING (PSG)")) cons.push(["DIGITAL MARKETING (PSG)","Ad-hoc marketing is expensive and hard to measure. PSG can fund up to 50% of a proper digital marketing solution (SEO, SEM, automation) to replace the scatter-gun approach."]); break;
    case "some":   add("market",15);
      if(!cons.find(c=>c[0]==="DIGITAL MARKETING (PSG)")) cons.push(["MARKETING ROI","You're spending but without a clear strategy. PSG-approved solutions can sharpen SEO, SEM and automation. Consider whether spend is going to performance (measurable return) or brand — both matter, but the sequencing should match your growth stage."]); break;
    case "active": add("market",8); break;
  }

  /* growth ambition */
  switch(a.growth) {
    case "no":        add("regional",-5); break;
    case "exploring": add("regional",10);
      cons.push(["OVERSEAS EXPANSION (MRA)","The Market Readiness Assistance grant is worth exploring if you're thinking about SEA. It co-funds up to 70% of overseas market promotion, BD and set-up costs (raised from 50%, effective April 2026), capped at S$100k per new market. MRA merges into EDGE in 2H2026 — current terms are the best they've been."]); break;
    case "planning":  add("regional",25);
      cons.push(["OVERSEAS EXPANSION (MRA)","MRA is your primary funding instrument. Up to 70% co-funding (Budget 2026) across three pillars: Overseas Market Promotion (S$20k cap), Business Development (S$50k cap), Market Set-up (S$30k cap). Each application covers one activity in one market — sequence your markets deliberately. Apply before the EDGE consolidation in 2H2026. Pair with an employer-of-record hire to test the market before committing to an entity."]); break;
    case "expanding": add("regional",15);
      cons.push(["SCALING OVERSEAS (MRA)","You can reapply for MRA in the same market if annual sales there remain below S$100k — useful for deepening early-stage presence. At 70% co-funding, the economics of in-market BD staff, trade fair participation and market set-up are significantly improved. Structure spend per-market per-application to maximise total drawdown."]); break;
  }

  /* floor at 0 */
  Object.keys(s).forEach(k=>{ if(s[k]<0) s[k]=0; });
  const total = Object.values(s).reduce((x,y)=>x+y,0)||1;
  const pct: Record<string,number> = {};
  Object.keys(s).forEach(k=>{ pct[k]=Math.round((s[k]/total)*100); });
  const drift = 100-Object.values(pct).reduce((x,y)=>x+y,0);
  const top = Object.keys(pct).sort((x,y)=>pct[y]-pct[x]);
  pct[top[0]]+=drift;

  /* top 3 moves — map challenge-specific moves where relevant */
  const challengeMoveMap: Record<string,string> = {
    succession:"succession", founder:"founder", scalepain:"scalepain",
    modernise:"modernise", distress:"distress", ma:"ma",
    newline:"newline", compliance:"compliance",
  };
  const primaryChallenge = a.challenges[0]||"";
  const moveLever = challengeMoveMap[primaryChallenge];

  let moveLevers = top.slice(0,3);
  if (moveLever && !moveLevers.includes(moveLever)) {
    moveLevers = [moveLever, ...moveLevers.slice(0,2)];
  }
  const moves = moveLevers.slice(0,3).map(k => ({
    lever:k,
    color:LEVERS[k]?.color||"var(--ink)",
    ...(MOVE_COPY[k]||MOVE_COPY[top[0]]),
  }));

  /* always-on strategy note */
  cons.unshift(["POSITIONING (PORTER)","Decide your edge first: are you winning on price, or on being different? If price — lean into automation and regional cost. If difference — protect and grow the core talent that makes you hard to copy. Your people strategy must follow that choice, not fight it."]);

  /* grant notes */
  if (moves.some(m=>m.lever==="automate"||m.lever==="outsource") && a.margin!=="loss") {
    if(!cons.find(c=>c[0].startsWith("GRANTS")))
      cons.push(["GRANTS (PSG/EIS)","Productivity and digital moves can tap PSG (up to 50%, capped S$30k/yr) and the Enterprise Innovation Scheme tax deduction. Note: PSG/EDG/MRA are consolidating into EDGE in 2H2026 — apply under current schemes while they're open."]);
  }
  if (a.margin==="loss") {
    cons.push(["GRANTS (EIS)","Even loss-making, you can convert the AI/innovation tax deduction into a 20% cash payout (up to S$20k/yr). Worth structuring spend to qualify."]);
  }

  const verdicts: Record<string,string> = {
    recruit:   "You're short on capability. Lead with the right hires —",
    develop:   "Your constraint is depth, not headcount. Build from within —",
    outsource: "Too much energy on work that doesn't differentiate you. Offload it —",
    automate:  "You're paying people to do what software should. Automate first —",
    regional:  "Your cost base and quota exposure say go beyond Singapore —",
    market:    "You can't scale what people can't find. Build the marketing engine —",
    succession:"The business needs to run without you. Build the layer beneath you —",
    founder:   "One person's bandwidth is the ceiling. Fix the structure, not the person —",
    scalepain: "You've outgrown how you run. Install the management layer —",
    modernise: "The model needs to change before the team does —",
    distress:  "Protect cash, convert fixed to variable. Stabilise first —",
    ma:        "Integration is a people problem first. Get the structure right —",
  };

  return {pct,top,moves,cons,primary:top[0],verdict:verdicts[moveLever||top[0]]||verdicts[top[0]]||"Your priority is clear —"};
}

/* ── MARKDOWN RENDERER ────────────────────────────────────── */

function MD({text}:{text:string}) {
  const blocks: React.ReactNode[] = []; let list: string[] = [];
  const flush=(i:number|string)=>{
    if(list.length){blocks.push(<ul key={"u"+i}>{list.map((t,j)=><li key={j}>{inline(t)}</li>)}</ul>);list=[];}
  };
  const inline=(t:string)=>t.split(/(\*\*[^*]+\*\*)/g).map((p,i)=>
    p.startsWith("**")?<strong key={i}>{p.slice(2,-2)}</strong>:<React.Fragment key={i}>{p}</React.Fragment>);
  text.split("\n").forEach((raw,i)=>{
    const l=raw.trim(); if(!l){flush(i);return;}
    if(l.startsWith("## ")){flush(i);blocks.push(<h5 key={i}>{l.slice(3)}</h5>);}
    else if(l.startsWith("# ")){flush(i);blocks.push(<h5 key={i}>{l.slice(2)}</h5>);}
    else if(/^[-*]\s/.test(l)){list.push(l.replace(/^[-*]\s/,""));}
    else{flush(i);blocks.push(<p key={i}>{inline(l)}</p>);}
  });
  flush("end");
  return <div className="ow-ai-out">{blocks}</div>;
}

/* ── DOWNLOAD HELPER ──────────────────────────────────────── */

function buildDownload(a:Answers, result:ReturnType<typeof analyse>) {
  const chNames = a.challenges.map(id=>{
    const ch = CHALLENGES.find(c=>c[0]===id); return ch?ch[1]:id;
  });
  const alloc = result.top.map(k=>`${LEVERS[k]?.label||k}`.padEnd(16)+result.pct[k]+"%").join("\n");
  const movesText = result.moves.map((m,i)=>`${i+1}. ${LEVERS[m.lever]?.label?.toUpperCase()||m.lever}\n   ${m.title}\n   ${m.body.replace(/<em>/g,"").replace(/<\/em>/g,"")}`).join("\n\n");
  const consText = result.cons.map(c=>`${c[0].padEnd(22)}${c[1]}`).join("\n\n");
  return `ORGWISE — YOUR STRATEGY READ
Generated: ${new Date().toLocaleDateString("en-SG",{day:"numeric",month:"long",year:"numeric"})}

YOUR CHALLENGES (RANKED)
${chNames.map((n,i)=>`#${i+1}  ${n}`).join("\n")}

${"─".repeat(44)}

VERDICT
${result.verdict} ${LEVERS[result.primary]?.label?.toLowerCase()||result.primary}.

${"─".repeat(44)}

ENERGY ALLOCATION
${alloc}

${"─".repeat(44)}

THREE MOVES TO MAKE

${movesText}

${"─".repeat(44)}

STRATEGY CONSIDERATIONS

${consText}

${"─".repeat(44)}

Diagnostic only — not regulated HR, legal, tax or financial advice.
Grant figures verified June 2026; verify before acting.
Orgwise · orgwise.sg`;
}

/* ── TAG COLOUR HELPER ────────────────────────────────────── */

const TAG_CLASS: Record<string,string> = {n:"ow-tag-n",a:"ow-tag-a",t:"ow-tag-t",b:"ow-tag-b"};

/* ── MAIN COMPONENT ───────────────────────────────────────── */

export default function Page() {
  const [step,setStep]     = useState(-1);
  const [a,setA]           = useState<Answers>({industry:"",head:"",mix:"",traj:"",challenges:[],funcs:[],margin:"",manpower:"",marketing:"",growth:""});
  const [openOpt,setOpenOpt] = useState(false);
  const [ai,setAi]         = useState<{state:string;text:string}>({state:"idle",text:""});
  const [toast,setToast]   = useState(false);

  const set=(k:keyof Answers,v:string)=>setA(p=>({...p,[k]:v}));
  const toggleFn=(v:string)=>setA(p=>({...p,funcs:p.funcs.includes(v)?p.funcs.filter((x:string)=>x!==v):[...p.funcs,v]}));

  /* challenge rank toggle */
  const toggleChallenge=(id:string)=>{
    setA(p=>{
      const idx=p.challenges.indexOf(id);
      if(idx>-1){ const n=[...p.challenges]; n.splice(idx,1); return {...p,challenges:n}; }
      if(p.challenges.length>=3){ const n=[...p.challenges.slice(1),id]; return {...p,challenges:n}; }
      return {...p,challenges:[...p.challenges,id]};
    });
  };

  const result = step===3 ? analyse(a) : null;
  const step0ok = a.industry && a.head && a.mix && a.traj;
  const step1ok = a.challenges.length >= 1;

  /* prevalence data keyed by selected industry */
  const indKey = (a.industry && PREVALENCE[a.industry]) ? a.industry : "all";
  const prevData = PREVALENCE[indKey];

  /* AI deep-dive */
  async function runAI() {
    if(!result) return;
    setAi({state:"loading",text:""});
    const L=(arr:[string,string][],v:string)=>(arr.find(x=>x[0]===v)||[,v])[1]||v;
    const chNames=a.challenges.map(id=>{const ch=CHALLENGES.find(c=>c[0]===id);return ch?ch[1]:id;});
    const alloc=result.top.map(k=>`${LEVERS[k]?.label} ${result.pct[k]}%`).join(", ");
    const body={
      industry:L(INDUSTRIES as [string,string][],a.industry),
      head:L(HEADCOUNT as [string,string][],a.head),
      mix:L(MIX as [string,string][],a.mix),
      traj:L(TRAJ as [string,string][],a.traj),
      challenges:chNames.map((n,i)=>`#${i+1}: ${n}`).join(", "),
      funcs:a.funcs.map(f=>(FUNCTIONS.find(x=>x[0]===f)||[,f])[1]||f).join(", ")||"not specified",
      margin:a.margin!=="skip"?a.margin:"not shared",
      manpower:a.manpower!=="skip"?a.manpower:"not shared",
      marketing:L(MARKETING_INV as [string,string][],a.marketing)||"not specified",
      growth:L(GROWTH_AMB as [string,string][],a.growth)||"not specified",
      alloc,primary:LEVERS[result.primary]?.label||result.primary,
    };
    try {
      const res=await fetch("/api/deepdive",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const data=await res.json();
      if(data.text) setAi({state:"done",text:data.text});
      else setAi({state:"error",text:""});
    } catch { setAi({state:"error",text:""}); }
  }

  function handleDownload() {
    if(!result) return;
    const content=buildDownload(a,result);
    const blob=new Blob([content],{type:"text/plain"});
    const url=URL.createObjectURL(blob);
    const el=document.createElement("a");
    el.href=url; el.download="orgwise-results.txt"; el.click();
    URL.revokeObjectURL(url);
    setToast(true); setTimeout(()=>setToast(false),3000);
  }

  function resetAll() {
    setStep(-1);
    setA({industry:"",head:"",mix:"",traj:"",challenges:[],funcs:[],margin:"",manpower:"",marketing:"",growth:""});
    setOpenOpt(false); setAi({state:"idle",text:""});
  }

  const rankClass=(id:string)=>{
    const i=a.challenges.indexOf(id);
    return i===0?"r1":i===1?"r2":i===2?"r3":"";
  };

  return (
    <div className="ow-root">
      <style>{STYLE}</style>
      <div className="ow-wrap">

        {/* BRANDBAR */}
        <div className="ow-brandbar">
          <div className="ow-logo">org<span>wise</span></div>
          <div style={{fontFamily:"JetBrains Mono,monospace",fontSize:11,color:"var(--ink2)"}}>a people-first strategy diagnostic</div>
        </div>

        {/* ── INTRO ── */}
        {step===-1&&(
          <div className="ow-hero">
            <div className="ow-eyebrow">For Singapore SME owners</div>
            <h1>Rethink your business through a <em>people</em> lens.</h1>
            <p className="ow-lede">Answer a few questions. Get back a clear read on where to put your energy — and the moves that follow.</p>
            <div className="ow-frameworks">
              {["Core vs Context","Maister leverage","Build-vs-buy","Porter strategy","MRA · PSG grants"].map(f=><div key={f} className="ow-chip">{f}</div>)}
            </div>
            <button className="ow-btn ow-btn-primary" onClick={()=>setStep(0)}>Start the 3-minute read →</button>
            <div className="ow-note"><span className="ow-dot"/>Nothing is stored. Analysis runs in your browser; financial details are optional.</div>
          </div>
        )}

        {/* ── STEP 0: Business basics ── */}
        {step===0&&(
          <div className="ow-card">
            <div className="ow-prog">{[0,1,2].map(i=><div key={i} className={i<=0?"on":""}/>)}</div>
            <div className="ow-eyebrow">Step 1 of 3</div>
            <div className="ow-steptitle">Your business</div>
            <div className="ow-subtitle">The shape of things — no numbers needed yet.</div>

            <div className="ow-q">What industry are you in?</div>
            <div className="ow-ind-grid">
              {INDUSTRIES.map(([v,l])=>(
                <button key={v} onClick={()=>set("industry",v)} style={{textAlign:"left",cursor:"pointer",border:`1px solid ${a.industry===v?"var(--ink)":"var(--line)"}`,background:a.industry===v?"var(--ink)":"#fff",color:a.industry===v?"#fff":"var(--ink)",borderRadius:11,padding:"13px 15px",fontSize:14,fontWeight:500,transition:"all .12s"}}>
                  {l}
                </button>
              ))}
            </div>

            <div className="ow-q">How many people?</div>
            <div className="ow-seg">{HEADCOUNT.map(([v,l])=><button key={v} className={a.head===v?"sel":""} onClick={()=>set("head",v)}>{l}</button>)}</div>

            <div className="ow-q">Workforce mix</div>
            <div className="ow-seg">{MIX.map(([v,l])=><button key={v} className={a.mix===v?"sel":""} onClick={()=>set("mix",v)}>{l}</button>)}</div>

            <div className="ow-q">Revenue trajectory</div>
            <div className="ow-seg">{TRAJ.map(([v,l])=><button key={v} className={a.traj===v?"sel":""} onClick={()=>set("traj",v)}>{l}</button>)}</div>

            <div className="ow-navrow">
              <button className="ow-btn ow-btn-ghost" onClick={()=>setStep(-1)}>← Back</button>
              <button className="ow-btn ow-btn-primary" disabled={!step0ok} onClick={()=>setStep(1)}>Next →</button>
            </div>
          </div>
        )}

        {/* ── STEP 1: Challenges ── */}
        {step===1&&(
          <div className="ow-card">
            <div className="ow-prog">{[0,1,2].map(i=><div key={i} className={i<=1?"on":""}/>)}</div>
            <div className="ow-eyebrow">Step 2 of 3</div>
            <div className="ow-steptitle">What's holding you back?</div>
            <div className="ow-subtitle">Rank your top 3 in order — first click is your #1. The percentages are industry context, not a suggestion.</div>

            <div className="ow-rank-legend">
              <span className="ow-rl ow-rl1">· #1 biggest challenge</span>
              <span className="ow-rl ow-rl2">· #2 significant</span>
              <span className="ow-rl ow-rl3">· #3 also present</span>
            </div>

            <div className="ow-status-row">
              <div className="ow-status-pills">
                {a.challenges.map((id,i)=>{
                  const ch=CHALLENGES.find(c=>c[0]===id);
                  return <span key={id} className={`ow-sp ow-sp${i+1}`}>{`#${i+1} ${ch?ch[1]:id}`}</span>;
                })}
              </div>
              <div className="ow-status-hint">
                {a.challenges.length===0?"Select at least 1 to continue":
                 a.challenges.length===1?"Add 1–2 more for a sharper read":
                 a.challenges.length===2?"Add 1 more or continue":
                 "3 of 3 ranked ✓"}
              </div>
            </div>

            <div className="ow-ch-grid">
              {CHALLENGES.map(([id,name,sub])=>{
                const rc=rankClass(id);
                const pct=prevData[id]||0;
                return (
                  <div key={id} className={`ow-ch-card${rc?" "+rc:""}`} onClick={()=>toggleChallenge(id)}>
                    {rc&&<div className="ow-ch-badge">{a.challenges.indexOf(id)+1}</div>}
                    <div className="ow-ch-name">{name}</div>
                    <div className="ow-ch-sub">{sub}</div>
                    <div className="ow-ch-divider"/>
                    <div className="ow-ch-stat">
                      <span className="ow-ch-pct">{pct}%</span>
                      <div className="ow-ch-bar"><div className={`ow-ch-fill${rc?" "+rc:""}`} style={{width:`${pct}%`}}/></div>
                      <span>in your sector</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="ow-q">Where does the work pile up? <span className="opt">(optional, pick any)</span></div>
            <div className="ow-seg">{FUNCTIONS.map(([v,l])=><button key={v} className={a.funcs.includes(v)?"sel":""} onClick={()=>toggleFn(v)}>{l}</button>)}</div>

            <div style={{marginTop:22,borderTop:"1px solid var(--line)",paddingTop:18}}>
              <div className="ow-q">Marketing investment <span className="opt">(optional)</span></div>
              <div className="ow-seg">{MARKETING_INV.map(([v,l])=><button key={v} className={a.marketing===v?"sel":""} onClick={()=>set("marketing",v)}>{l}</button>)}</div>
              <div className="ow-q">Growth beyond Singapore? <span className="opt">(optional)</span></div>
              <div className="ow-seg">{GROWTH_AMB.map(([v,l])=><button key={v} className={a.growth===v?"sel":""} onClick={()=>set("growth",v)}>{l}</button>)}</div>
            </div>

            <div className="ow-navrow">
              <button className="ow-btn ow-btn-ghost" onClick={()=>setStep(0)}>← Back</button>
              <span className="ow-nav-meta">{a.challenges.length>0?`${a.challenges.length} of 3 ranked`:""}</span>
              <button className="ow-btn ow-btn-primary" disabled={!step1ok} onClick={()=>setStep(2)}>Next →</button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Optional financials ── */}
        {step===2&&(
          <div className="ow-card">
            <div className="ow-prog">{[0,1,2].map(i=><div key={i} className="on"/>)}</div>
            <div className="ow-eyebrow">Step 3 of 3</div>
            <div className="ow-steptitle">Sharpen the read <span style={{color:"var(--ink2)",fontWeight:400,fontSize:16}}>(optional)</span></div>
            <div className="ow-subtitle">Skip this for a full read. Add it for a tighter cost-and-margin view.</div>
            <div className="ow-optional">
              <button className="ow-opthead" onClick={()=>setOpenOpt(o=>!o)}>
                <b>Financial signals</b><span>{openOpt?"Hide −":"Add (optional) +"}</span>
              </button>
              {openOpt&&(
                <div className="ow-optbody">
                  <div className="ow-q">Margin health</div>
                  <div className="ow-seg">{MARGIN.map(([v,l])=><button key={v} className={a.margin===v?"sel":""} onClick={()=>set("margin",v)}>{l}</button>)}</div>
                  <div className="ow-q">Manpower cost as % of revenue</div>
                  <div className="ow-seg">{MANPOWER.map(([v,l])=><button key={v} className={a.manpower===v?"sel":""} onClick={()=>set("manpower",v)}>{l}</button>)}</div>
                  <div className="ow-privacy">🔒 <span>Ranges only. Used to weight this analysis. Nothing stored unless you request the AI deep-dive.</span></div>
                </div>
              )}
            </div>
            <div className="ow-navrow">
              <button className="ow-btn ow-btn-ghost" onClick={()=>setStep(1)}>← Back</button>
              <button className="ow-btn ow-btn-amber" onClick={()=>{setAi({state:"idle",text:""});setStep(3);}}>See my read →</button>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {step===3&&result&&(
          <div>
            <div className="ow-eyebrow">Your read</div>

            {/* ranked challenge pills */}
            <div className="ow-ranked-chips">
              {a.challenges.map((id,i)=>{
                const ch=CHALLENGES.find(c=>c[0]===id);
                return <span key={id} className={`ow-rc ow-rc${i+1}`}><span className="ow-rc-num">#{i+1}</span>{ch?ch[1]:id}</span>;
              })}
            </div>

            <h2 className="ow-verdict">{result.verdict} <em>{LEVERS[result.primary]?.label?.toLowerCase()||result.primary}.</em></h2>
            <p className="ow-rlede">Here's how your attention should split, the three moves that follow, and the strategy calls behind them.</p>

            <div className="ow-divider"/>

            {/* energy allocation */}
            <div className="ow-section-label">Energy allocation</div>
            <div className="ow-section-cap">Where to spend your next quarter of attention, weighted by your ranked challenges.</div>
            <div className="ow-alloc">
              <div className="ow-bar">
                {result.top.map(k=>(
                  <div key={k} className="ow-seg2" style={{flex:result.pct[k],background:LEVERS[k]?.color||"var(--ink)"}}>
                    {result.pct[k]>=9?result.pct[k]+"%":""}
                  </div>
                ))}
              </div>
              <div className="ow-legend">
                {result.top.map(k=>(
                  <div key={k} className={"ow-leg"+(k===result.primary?" primary":"")}>
                    <span className="ow-sw" style={{background:LEVERS[k]?.color||"var(--ink)"}}/>
                    <div><b>{LEVERS[k]?.label||k}</b><span className="pct">{result.pct[k]}%</span><p>{LEVERS[k]?.blurb||""}</p></div>
                  </div>
                ))}
              </div>
            </div>

            {/* three moves */}
            <div className="ow-section-label" style={{marginBottom:4}}>Three moves to make</div>
            <div className="ow-section-cap">In order of priority, grounded in your ranked challenges.</div>
            <div className="ow-moves">
              {result.moves.map(m=>(
                <div key={m.lever} className="ow-move" style={{borderLeftColor:m.color}}>
                  <div className="ow-move-meta">
                    <span className="ow-move-lever">{LEVERS[m.lever]?.label||m.lever}</span>
                    <span style={{color:"var(--ink2)",fontSize:10}}>·</span>
                    <span className="ow-move-fw">{m.fw||""}</span>
                  </div>
                  <h4>{m.title}</h4>
                  <div className="ow-move-body" dangerouslySetInnerHTML={{__html:m.body}}/>
                  <div className="ow-tags">
                    {(m.tags||[]).map(([type,label],ti)=>(
                      <span key={ti} className={`ow-tag ${TAG_CLASS[type]||"ow-tag-n"}`}>{label}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* strategy considerations */}
            <div className="ow-section-label" style={{marginBottom:14}}>Strategy considerations</div>
            <div className="ow-consider">
              <ul>
                {result.cons.map((c,i)=>(
                  <li key={i}>
                    <span className="ow-cn">{c[0]}</span>
                    <span className="ow-con-text" dangerouslySetInnerHTML={{__html:c[1].replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")}}/>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI deep-dive */}
            <div className="ow-ai">
              <h3>AI deep-dive</h3>
              <div className="sub">A tailored narrative generated on demand — not stored, not shared.</div>
              {ai.state==="idle"&&<button className="ow-btn ow-btn-amber" onClick={runAI}>Generate deep-dive</button>}
              {ai.state==="loading"&&<button className="ow-btn ow-btn-amber" disabled><span className="ow-spin"/> Thinking…</button>}
              {ai.state==="error"&&<div><p style={{color:"#C9D0DE",fontSize:14,marginTop:0}}>Couldn't reach the model. Your read above still stands.</p><button className="ow-btn ow-btn-ghost" style={{color:"#fff",borderColor:"rgba(255,255,255,.3)"}} onClick={runAI}>Try again</button></div>}
              {ai.state==="done"&&<MD text={ai.text}/>}
            </div>

            {/* actions */}
            <div className="ow-action-row">
              <button className="ow-btn-dl" onClick={handleDownload}>↓ Download results</button>
              {toast&&<span className="ow-toast show">✓ Saved to downloads</span>}
            </div>

            {/* CTA */}
            <div className="ow-cta-bar">
              <div>
                <strong>Want to talk through these moves?</strong>
                <p>We offer recruitment, HR outsourcing, fractional advisory and employer-of-record across SEA.</p>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <a href="mailto:business@staffgo.sg" className="ow-btn ow-btn-amber" style={{textDecoration:"none"}}>Get in touch →</a>
                <button className="ow-btn-restart" onClick={resetAll}>Start over</button>
              </div>
            </div>

            <p className="ow-disc">Diagnostic only — not regulated HR, legal, tax or financial advice. Grant figures and manpower rules change; verify before acting. Orgwise is a product of Elevate Payroll Pte Ltd.</p>
          </div>
        )}

      </div>
    </div>
  );
}
