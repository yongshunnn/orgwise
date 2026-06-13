"use client";
import React, { useState } from "react";

const STYLE = `
  :root {
    --bg:#EBEEF2; --surface:#FFFFFF; --ink:#16203A; --ink2:#5A6580;
    --line:#DCE1E8; --amber:#DD8A2E; --teal:#1E6E6A;
    --recruit:#DD8A2E; --develop:#1E6E6A; --outsource:#3D6BB0;
    --automate:#6B4FA8; --regional:#B5546A;
  }
  * { box-sizing: border-box; }
  body { background: var(--bg); color: var(--ink); line-height: 1.5; -webkit-font-smoothing: antialiased; }
  .ow-root { font-family:'Inter',system-ui,sans-serif; min-height:100vh; }
  .ow-wrap { max-width:1040px; margin:0 auto; padding:32px 22px 80px; }
  .ow-mono { font-family:'JetBrains Mono',monospace; }
  .ow-display { font-family:'Space Grotesk',sans-serif; }
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
  .ow-btn { font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15px; cursor:pointer; border:none; border-radius:10px; padding:14px 24px; display:inline-flex; align-items:center; gap:10px; transition:transform .12s ease, box-shadow .12s ease; }
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
  .ow-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:10px; }
  .ow-opt { text-align:left; cursor:pointer; border:1px solid var(--line); background:#fff; border-radius:11px; padding:13px 15px; font-size:14px; font-weight:500; color:var(--ink); transition:all .12s ease; }
  .ow-opt:hover { border-color:var(--ink2); }
  .ow-opt.sel { border-color:var(--ink); background:var(--ink); color:#fff; }
  .ow-opt small { display:block; font-weight:400; font-size:12px; color:var(--ink2); margin-top:3px; }
  .ow-opt.sel small { color:#C9D0DE; }
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
  .ow-navrow { display:flex; justify-content:space-between; margin-top:30px; }
  .ow-rtop { display:flex; align-items:baseline; gap:12px; margin-bottom:6px; }
  .ow-verdict { font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:clamp(26px,4.5vw,40px); letter-spacing:-.03em; line-height:1.08; margin:6px 0 10px; max-width:22ch; }
  .ow-verdict em { font-style:normal; color:var(--amber); }
  .ow-rlede { color:var(--ink2); font-size:16px; max-width:60ch; margin-bottom:30px; }
  .ow-alloc { background:var(--surface); border:1px solid var(--line); border-radius:16px; padding:26px; margin-bottom:24px; }
  .ow-alloc h3 { font-family:'Space Grotesk',sans-serif; font-size:13px; letter-spacing:.04em; text-transform:uppercase; color:var(--ink2); margin:0 0 4px; }
  .ow-alloc .cap { font-size:13px; color:var(--ink2); margin-bottom:20px; }
  .ow-bar { display:flex; height:46px; border-radius:9px; overflow:hidden; margin-bottom:18px; }
  .ow-seg2 { display:flex; align-items:center; justify-content:center; color:#fff; font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:500; min-width:0; }
  .ow-legend { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:12px; }
  .ow-leg { display:flex; gap:10px; align-items:flex-start; }
  .ow-sw { width:12px; height:12px; border-radius:3px; margin-top:3px; flex:none; }
  .ow-leg b { font-family:'Space Grotesk',sans-serif; font-size:14px; }
  .ow-leg .pct { font-family:'JetBrains Mono',monospace; color:var(--ink2); font-size:12px; }
  .ow-leg p { margin:2px 0 0; font-size:12px; color:var(--ink2); }
  .ow-leg.primary b::after { content:' · START HERE'; color:var(--amber); font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.08em; }
  .ow-moves { display:grid; gap:14px; margin-bottom:24px; }
  .ow-move { background:var(--surface); border:1px solid var(--line); border-radius:14px; padding:22px; border-left:4px solid var(--ink); }
  .ow-move .lever { font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:.1em; text-transform:uppercase; color:var(--ink2); }
  .ow-move h4 { font-family:'Space Grotesk',sans-serif; font-size:18px; letter-spacing:-.01em; margin:6px 0 8px; }
  .ow-move p { font-size:14px; color:var(--ink2); margin:0 0 14px; }
  .ow-bridge { display:inline-flex; align-items:center; gap:8px; font-size:13px; font-weight:600; background:#F4F6F8; border:1px solid var(--line); border-radius:100px; padding:7px 14px; color:var(--ink); }
  .ow-bridge i { font-style:normal; color:var(--amber); }
  .ow-consider { background:#F6F8FA; border:1px solid var(--line); border-radius:14px; padding:24px; margin-bottom:24px; }
  .ow-consider h3 { font-family:'Space Grotesk',sans-serif; font-size:13px; letter-spacing:.04em; text-transform:uppercase; color:var(--ink2); margin:0 0 16px; }
  .ow-consider li { list-style:none; font-size:14px; display:flex; gap:11px; margin-bottom:13px; }
  .ow-consider li:last-child { margin-bottom:0; }
  .ow-cn { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--teal); flex:none; margin-top:2px; }
  .ow-consider ul { padding:0; margin:0; }
  .ow-ai { background:var(--ink); color:#E9ECF4; border-radius:16px; padding:26px; }
  .ow-ai h3 { font-family:'Space Grotesk',sans-serif; font-size:17px; color:#fff; margin:0 0 6px; }
  .ow-ai .sub { font-size:13px; color:#9AA4BD; margin-bottom:18px; }
  .ow-ai-out { font-size:14px; line-height:1.65; }
  .ow-ai-out h5 { font-family:'Space Grotesk',sans-serif; color:#fff; font-size:15px; margin:18px 0 6px; }
  .ow-ai-out p { margin:0 0 11px; color:#D4DAE8; }
  .ow-ai-out li { color:#D4DAE8; margin:0 0 7px; }
  .ow-ai-out strong { color:#fff; }
  .ow-spin { display:inline-block; width:15px; height:15px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:owspin .7s linear infinite; }
  @keyframes owspin { to { transform:rotate(360deg); } }
  .ow-foot { display:flex; gap:12px; flex-wrap:wrap; margin-top:26px; }
  .ow-disc { font-size:11px; color:var(--ink2); margin-top:30px; max-width:70ch; }
  .ow-cta-bar { margin-top:32px; padding:24px; background:linear-gradient(135deg,#16203A 0%,#1E3A5F 100%); border-radius:16px; display:flex; flex-wrap:wrap; gap:16px; align-items:center; justify-content:space-between; }
  .ow-cta-bar p { color:#D4DAE8; font-size:14px; margin:0; max-width:42ch; }
  .ow-cta-bar strong { color:#fff; display:block; font-family:'Space Grotesk',sans-serif; font-size:17px; margin-bottom:4px; }
  @media (prefers-reduced-motion:reduce){ *{ transition:none!important; animation:none!important; } }
  @media (max-width:560px){ .ow-card{ padding:22px; } .ow-move{ padding:18px; } }
`;

const INDUSTRIES = [
  ["services","Services"],["professional","Professional services"],
  ["retail","Retail / F&B"],["manufacturing","Manufacturing"],
  ["logistics","Logistics"],["construction","Construction"],
  ["tech","Tech / software"],["other","Other"],
];
const HEADCOUNT = [["micro","1–9"],["small","10–29"],["mid","30–99"],["large","100–199"]];
const MIX = [["local","Mostly local"],["balanced","Balanced"],["foreign","Heavily foreign"]];
const TRAJ = [["fast","Growing fast"],["slow","Growing slowly"],["flat","Flat"],["down","Declining"]];
const CHALLENGES = [
  ["talent","Can't find the right talent","scarce or slow to hire"],
  ["expensive","Labour is too expensive","wages & levies biting"],
  ["turnover","High turnover","people keep leaving"],
  ["scale","Can't scale operations","growth outpacing the team"],
  ["keyperson","Over-reliant on key people","too much in few heads"],
  ["margins","Margins are squeezed","costs eating profit"],
  ["expand","Want to expand regionally","eyeing SEA markets"],
  ["admin","Drowning in admin","back-office overload"],
  ["tech","Falling behind on tech / AI","manual, legacy processes"],
];
const FUNCTIONS = [
  ["sales","Sales / BD"],["delivery","Delivery / ops"],
  ["admin","Admin / finance / HR"],["service","Customer service"],["product","Product / tech"],
];
const MARGIN = [["healthy","Healthy"],["tight","Tight"],["loss","Loss-making"],["skip","Rather not say"]];
const MANPOWER = [["lt30","Under 30%"],["30to50","30–50%"],["gt50","Over 50%"],["skip","Rather not say"]];

const LEVERS: Record<string,{label:string;color:string;blurb:string}> = {
  recruit:  {label:"Recruit",   color:"var(--recruit)",   blurb:"Hire for the skill you can't grow in time."},
  develop:  {label:"Develop",   color:"var(--develop)",   blurb:"Hire raw and train; build a leverage pyramid."},
  outsource:{label:"Outsource", color:"var(--outsource)", blurb:"Move non-core work off your plate."},
  automate: {label:"Automate",  color:"var(--automate)",  blurb:"Adopt AI / tech for repeatable work."},
  regional: {label:"Go regional",color:"var(--regional)", blurb:"Hire across SEA where cost & market fit."},
};

type Answers = {
  industry:string; head:string; mix:string; traj:string;
  challenge:string; funcs:string[]; margin:string; manpower:string;
};

function analyse(a: Answers) {
  const s: Record<string,number> = {recruit:10,develop:10,outsource:10,automate:10,regional:10};
  const add = (k:string,n:number) => { s[k]+=n; };
  const cons: [string,string][] = [];

  switch(a.challenge) {
    case "talent":    add("recruit",30);add("regional",15);add("develop",10);break;
    case "expensive": add("regional",25);add("automate",20);add("outsource",10);break;
    case "turnover":  add("develop",25);add("recruit",5);
      cons.push(["RETENTION","Turnover is usually a design problem, not a pay problem. Check role clarity, career pathing and span of control before you re-hire into the same gap."]);break;
    case "scale":     add("outsource",15);add("automate",20);add("develop",12);add("recruit",6);break;
    case "keyperson": add("develop",25);add("recruit",6);add("outsource",5);
      cons.push(["KEY-PERSON RISK","Document and codify what lives in a few heads (SOPs), then build a second layer beneath them. A fractional senior can hold the bench while you grow it."]);break;
    case "margins":   add("automate",22);add("outsource",20);add("regional",10);break;
    case "expand":    add("regional",35);add("recruit",6);
      cons.push(["MARKET ENTRY","Test a new market with an EOR hire before you sink cost into an entity. MRA grant support can offset overseas set-up and BD."]);break;
    case "admin":     add("outsource",30);add("automate",20);break;
    case "tech":      add("automate",35);add("recruit",10);break;
  }
  switch(a.industry) {
    case "services":      add("regional",10);add("automate",10);break;
    case "professional":  add("develop",12);add("recruit",8);break;
    case "retail":        add("automate",10);add("outsource",5);add("develop",5);break;
    case "manufacturing": add("automate",12);add("develop",6);break;
    case "logistics":     add("automate",10);add("regional",8);break;
    case "construction":  add("regional",8);add("automate",6);break;
    case "tech":          add("recruit",12);add("regional",10);break;
  }
  if (a.mix==="foreign") { add("regional",12);add("automate",8);
    cons.push(["LEVY & QUOTA","Heavy Work Permit reliance is exposed to a tightening Dependency Ratio Ceiling. Services is the most restricted sector. Diversify toward compliant regional or automated capacity."]);
  } else if (a.mix==="balanced") add("regional",5);
  else if (a.mix==="local") add("develop",5);

  switch(a.traj) {
    case "fast": add("recruit",12);add("develop",8);break;
    case "slow": add("outsource",5);add("automate",5);break;
    case "flat": add("automate",8);add("outsource",8);break;
    case "down": add("outsource",12);add("regional",8);add("automate",6);add("recruit",-12);
      cons.push(["COST SHAPE","When revenue is soft, protect cash by converting fixed headcount into variable capacity. Fractional and outsourced functions flex with you. Avoid net-new FTEs until the trend turns."]);break;
  }
  if (a.margin==="tight") { add("outsource",8);add("automate",8); }
  else if (a.margin==="loss") { add("outsource",12);add("regional",10);add("recruit",-8); }
  else if (a.margin==="healthy") add("recruit",5);
  if (a.manpower==="gt50") { add("automate",10);add("regional",8);
    cons.push(["MANPOWER LOAD","Over half of revenue going to people is heavy for most models. Either lift output per head (automation) or rebalance the cost base regionally."]);
  }
  (a.funcs||[]).forEach(f => {
    if (f==="admin")    { add("outsource",15);add("automate",10); }
    if (f==="delivery") { add("develop",10);add("automate",8);add("recruit",5); }
    if (f==="sales")    { add("recruit",10);add("develop",5); }
    if (f==="service")  { add("automate",10);add("regional",8); }
    if (f==="product")  { add("recruit",10);add("automate",8); }
  });

  Object.keys(s).forEach(k=>{ if(s[k]<0)s[k]=0; });
  const total = Object.values(s).reduce((x,y)=>x+y,0)||1;
  const pct: Record<string,number> = {};
  Object.keys(s).forEach(k=>{ pct[k]=Math.round((s[k]/total)*100); });
  const drift = 100-Object.values(pct).reduce((x,y)=>x+y,0);
  const top = Object.keys(pct).sort((x,y)=>pct[y]-pct[x]);
  pct[top[0]]+=drift;

  const MOVE: Record<string,{title:string;p:string;svc:string;line:string;fw:string}> = {
    recruit:   {title:"Hire for the scarce skill — fast and structured",p:"The local specialist pool is thin and slow. Buy the capability you can't grow in time, with a tight brief and a real assessment so the hire sticks.",svc:"Recruitment",line:"StaffGo",fw:"Build-vs-buy talent"},
    develop:   {title:"Build a leverage pyramid, don't just hire seniors",p:"For repeatable delivery, hire raw, train hard and put AI under your people. Fewer expensive seniors, more capacity — and your knowledge stops walking out the door.",svc:"Fractional HR",line:"Advisory",fw:"Maister leverage model"},
    outsource: {title:"Take non-core work off your plate",p:"Payroll, HR admin and back-office are necessary but don't differentiate you. Standardise and hand them off so your team's hours go to what wins clients.",svc:"Outsourcing",line:"Elevate Payroll",fw:"Core vs Context"},
    automate:  {title:"Automate the repeatable before you re-hire",p:"Map the manual, rules-based work and let AI/tech absorb it. Grant support (PSG up to 50%, EIS deductions) lowers the bill on the way in.",svc:"Advisory + tech",line:"Fractional",fw:"Core vs Context"},
    regional:  {title:"Open a regional / remote layer",p:"Roles that don't need to sit in Singapore — and that the cost base struggles to carry — can be hired compliantly across SEA. Convert levy-exposed headcount into flexible regional capacity.",svc:"Employer of Record",line:"Straits EOR",fw:"Make-vs-buy / TCE"},
  };
  const moves = top.slice(0,3).map(k=>({lever:k,...MOVE[k],color:LEVERS[k].color}));

  cons.unshift(["POSITIONING (PORTER)","Decide your edge first: are you winning on price, or on being different? If price — lean into automation and regional cost. If difference — protect and grow the core talent that makes you hard to copy."]);
  if (moves.some(m=>m.lever==="automate"||m.lever==="outsource")&&a.margin!=="loss") {
    cons.push(["GRANTS","Productivity and digital moves can tap PSG (up to 50% of cost, capped S$30k/yr) and the Enterprise Innovation Scheme. Note: PSG/EDG/MRA are consolidating into the new EDGE framework in 2H2026 — apply under current schemes while they're open."]);
  }
  if (a.margin==="loss") {
    cons.push(["GRANTS","Even loss-making, you can convert the AI/innovation tax deduction into a cash payout (20% of qualifying spend, up to S$20k/yr). Worth structuring spend to qualify."]);
  }

  const verdicts: Record<string,string> = {
    recruit:   "You're short on capability. Lead with the right hires —",
    develop:   "Your constraint is depth, not headcount. Build from within —",
    outsource: "Too much energy on work that doesn't differentiate you. Offload it —",
    automate:  "You're paying people to do what software should. Automate first —",
    regional:  "Your cost base and quota exposure say go beyond Singapore —",
  };
  return {pct,top,moves,cons,verdict:verdicts[top[0]]||"Your priority is clear —",primary:top[0]};
}

function MD({text}:{text:string}) {
  const blocks: React.ReactNode[] = []; let list: string[] = [];
  const flush = (i: number|string) => {
    if(list.length){blocks.push(<ul key={"u"+i}>{list.map((t,j)=><li key={j}>{inline(t)}</li>)}</ul>);list=[];}
  };
  const inline = (t:string) => t.split(/(\*\*[^*]+\*\*)/g).map((p,i)=>
    p.startsWith("**")?<strong key={i}>{p.slice(2,-2)}</strong>:<React.Fragment key={i}>{p}</React.Fragment>);
  text.split("\n").forEach((raw,i)=>{
    const l=raw.trim();
    if(!l){flush(i);return;}
    if(l.startsWith("## ")){flush(i);blocks.push(<h5 key={i}>{l.slice(3)}</h5>);}
    else if(l.startsWith("# ")){flush(i);blocks.push(<h5 key={i}>{l.slice(2)}</h5>);}
    else if(/^[-*]\s/.test(l)){list.push(l.replace(/^[-*]\s/,""));}
    else{flush(i);blocks.push(<p key={i}>{inline(l)}</p>);}
  });
  flush("end");
  return <div className="ow-ai-out">{blocks}</div>;
}

export default function Page() {
  const [step,setStep]=useState(-1);
  const [a,setA]=useState<Answers>({industry:"",head:"",mix:"",traj:"",challenge:"",funcs:[],margin:"",manpower:""});
  const [openOpt,setOpenOpt]=useState(false);
  const [ai,setAi]=useState<{state:string;text:string}>({state:"idle",text:""});
  const set=(k:keyof Answers,v:string)=>setA(p=>({...p,[k]:v}));
  const toggle=(v:string)=>setA(p=>({...p,funcs:p.funcs.includes(v)?p.funcs.filter(x=>x!==v):[...p.funcs,v]}));

  const result=step===3?analyse(a):null;
  const step0ok=a.industry&&a.head&&a.mix&&a.traj;
  const step1ok=a.challenge;

  async function runAI() {
    setAi({state:"loading",text:""});
    const r=analyse(a);
    const L=(arr:[string,string][],v:string)=>(arr.find(x=>x[0]===v)||[,v])[1]||v;
    const chal=(CHALLENGES.find(c=>c[0]===a.challenge)||[,a.challenge])[1]||a.challenge;
    const funcs=a.funcs.map(f=>(FUNCTIONS.find(x=>x[0]===f)||[,f])[1]||f).join(", ")||"not specified";
    const alloc=r.top.map(k=>`${LEVERS[k].label} ${r.pct[k]}%`).join(", ");
    const body={
      industry:L(INDUSTRIES as [string,string][],a.industry),
      head:L(HEADCOUNT as [string,string][],a.head),
      mix:L(MIX as [string,string][],a.mix),
      traj:L(TRAJ as [string,string][],a.traj),
      challenge:chal,funcs,
      margin:a.margin&&a.margin!=="skip"?a.margin:"not shared",
      manpower:a.manpower&&a.manpower!=="skip"?a.manpower:"not shared",
      alloc,primary:LEVERS[r.primary].label,
    };
    try {
      const res=await fetch("/api/deepdive",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const data=await res.json();
      if(data.text) setAi({state:"done",text:data.text});
      else setAi({state:"error",text:""});
    } catch {
      setAi({state:"error",text:""});
    }
  }

  return (
    <div className="ow-root">
      <style>{STYLE}</style>
      <div className="ow-wrap">
        <div className="ow-brandbar">
          <div className="ow-logo">org<span>wise</span></div>
          <div className="ow-byline">a people-first strategy diagnostic</div>
        </div>

        {step===-1&&(
          <div className="ow-hero">
            <div className="ow-eyebrow">For Singapore SME owners</div>
            <h1>Rethink your business through a <em>people</em> lens.</h1>
            <p className="ow-lede">Answer a few questions about your business. Get back a clear read on where to put your energy — recruit, develop, outsource, automate, or go regional — and the moves that follow.</p>
            <div className="ow-frameworks">
              {["Core vs Context","Maister leverage","Build-vs-buy","Porter strategy"].map(f=><div key={f} className="ow-chip">{f}</div>)}
            </div>
            <button className="ow-btn ow-btn-primary" onClick={()=>setStep(0)}>Start the 3-minute read →</button>
            <div className="ow-note"><span className="ow-dot"/>Nothing is stored. Analysis runs in your browser; financial details are optional.</div>
          </div>
        )}

        {step===0&&(
          <div className="ow-card">
            <div className="ow-prog">{[0,1,2].map(i=><div key={i} className={i<=0?"on":""}/>)}</div>
            <div className="ow-eyebrow">Step 1 of 3</div>
            <div className="ow-steptitle">Your business</div>
            <div className="ow-subtitle">The shape of things — no numbers needed yet.</div>
            <div className="ow-q">What industry are you in?</div>
            <div className="ow-grid">{INDUSTRIES.map(([v,l])=><button key={v} className={"ow-opt"+(a.industry===v?" sel":"")} onClick={()=>set("industry",v)}>{l}</button>)}</div>
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

        {step===1&&(
          <div className="ow-card">
            <div className="ow-prog">{[0,1,2].map(i=><div key={i} className={i<=1?"on":""}/>)}</div>
            <div className="ow-eyebrow">Step 2 of 3</div>
            <div className="ow-steptitle">Where it hurts</div>
            <div className="ow-subtitle">This drives most of the recommendation.</div>
            <div className="ow-q">Your single biggest challenge right now</div>
            <div className="ow-grid">{CHALLENGES.map(([v,l,sub])=>(
              <button key={v} className={"ow-opt"+(a.challenge===v?" sel":"")} onClick={()=>set("challenge",v)}>
                {l}<small>{sub}</small>
              </button>
            ))}</div>
            <div className="ow-q">Where does the work pile up? <span className="opt">(optional, pick any)</span></div>
            <div className="ow-seg">{FUNCTIONS.map(([v,l])=><button key={v} className={a.funcs.includes(v)?"sel":""} onClick={()=>toggle(v)}>{l}</button>)}</div>
            <div className="ow-navrow">
              <button className="ow-btn ow-btn-ghost" onClick={()=>setStep(0)}>← Back</button>
              <button className="ow-btn ow-btn-primary" disabled={!step1ok} onClick={()=>setStep(2)}>Next →</button>
            </div>
          </div>
        )}

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
                  <div className="ow-q">Manpower cost as a share of revenue</div>
                  <div className="ow-seg">{MANPOWER.map(([v,l])=><button key={v} className={a.manpower===v?"sel":""} onClick={()=>set("manpower",v)}>{l}</button>)}</div>
                  <div className="ow-privacy">🔒 <span>Ranges only — never exact figures. Only used to weight this analysis. Nothing stored unless you request the AI deep-dive.</span></div>
                </div>
              )}
            </div>
            <div className="ow-navrow">
              <button className="ow-btn ow-btn-ghost" onClick={()=>setStep(1)}>← Back</button>
              <button className="ow-btn ow-btn-amber" onClick={()=>{setAi({state:"idle",text:""});setStep(3);}}>See my read →</button>
            </div>
          </div>
        )}

        {step===3&&result&&(
          <div>
            <div className="ow-eyebrow">Your read</div>
            <h2 className="ow-verdict">{result.verdict} <em>{LEVERS[result.primary].label.toLowerCase()}.</em></h2>
            <p className="ow-rlede">Here's how your attention should split across the five levers, the three moves that follow, and the strategy calls behind them.</p>

            <div className="ow-alloc">
              <h3>Energy allocation</h3>
              <div className="cap">Where to spend your next quarter of attention.</div>
              <div className="ow-bar">
                {result.top.map(k=>(
                  <div key={k} className="ow-seg2" style={{flex:result.pct[k],background:LEVERS[k].color}}>
                    {result.pct[k]>=9?result.pct[k]+"%":""}
                  </div>
                ))}
              </div>
              <div className="ow-legend">
                {result.top.map(k=>(
                  <div key={k} className={"ow-leg"+(k===result.primary?" primary":"")}>
                    <span className="ow-sw" style={{background:LEVERS[k].color}}/>
                    <div><b>{LEVERS[k].label}</b> <span className="pct">{result.pct[k]}%</span><p>{LEVERS[k].blurb}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ow-moves">
              {result.moves.map(m=>(
                <div key={m.lever} className="ow-move" style={{borderLeftColor:m.color}}>
                  <div className="lever">{LEVERS[m.lever].label} · {m.fw}</div>
                  <h4>{m.title}</h4>
                  <p>{m.p}</p>
                  <div className="ow-bridge"><i>→</i> {m.svc} · <span style={{color:"var(--ink2)"}}>{m.line}</span></div>
                </div>
              ))}
            </div>

            <div className="ow-consider">
              <h3>Strategy considerations</h3>
              <ul>{result.cons.map((c,i)=><li key={i}><span className="ow-cn">{c[0]}</span><span>{c[1]}</span></li>)}</ul>
            </div>

            <div className="ow-ai">
              <h3>AI deep-dive</h3>
              <div className="sub">Have Claude turn this into a tailored narrative for your exact situation.</div>
              {ai.state==="idle"&&<button className="ow-btn ow-btn-amber" onClick={runAI}>Generate deep-dive</button>}
              {ai.state==="loading"&&<button className="ow-btn ow-btn-amber" disabled><span className="ow-spin"/> Thinking…</button>}
              {ai.state==="error"&&<div><p style={{color:"#C9D0DE",fontSize:14,marginTop:0}}>Couldn't reach the model. Your read above still stands.</p><button className="ow-btn ow-btn-ghost" style={{color:"#fff",borderColor:"rgba(255,255,255,.3)"}} onClick={runAI}>Try again</button></div>}
              {ai.state==="done"&&<MD text={ai.text}/>}
            </div>

            <div className="ow-cta-bar">
              <div><strong>Want to talk through these moves?</strong><p>We offer recruitment, HR outsourcing, fractional advisory and employer-of-record across SEA.</p></div>
              <div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>
                <a href="mailto:hello@elevate-payroll.com" className="ow-btn ow-btn-amber" style={{textDecoration:"none"}}>Get in touch →</a>
                <button className="ow-btn ow-btn-ghost" style={{color:"#fff",borderColor:"rgba(255,255,255,.3)"}} onClick={()=>{setStep(-1);setA({industry:"",head:"",mix:"",traj:"",challenge:"",funcs:[],margin:"",manpower:""});setOpenOpt(false);}}>Start over</button>
              </div>
            </div>

            <p className="ow-disc">A general diagnostic, not regulated HR, legal, tax or financial advice. Grant figures and manpower rules change — verify before acting. Orgwise is a product of Elevate Payroll Pte Ltd.</p>
          </div>
        )}
      </div>
    </div>
  );
}
