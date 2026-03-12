import { useState } from "react";

const MOCK_TXS = [
  { id:1,  merchant:"Whole Foods",    date:"Mar 11", amount:67.42,  category:"Groceries",     ai:0.98, pending:false },
  { id:2,  merchant:"Shell Gas",      date:"Mar 11", amount:52.10,  category:"Gas",           ai:0.97, pending:false },
  { id:3,  merchant:"Chipotle",       date:"Mar 10", amount:14.75,  category:"Eating Out",    ai:0.99, pending:false },
  { id:4,  merchant:"Netflix",        date:"Mar 10", amount:15.99,  category:"Subscriptions", ai:0.99, pending:false },
  { id:5,  merchant:"Spotify",        date:"Mar 09", amount:9.99,   category:"Subscriptions", ai:0.99, pending:false },
  { id:6,  merchant:"Electric Co.",   date:"Mar 09", amount:124.00, category:"Bills",         ai:0.96, pending:false },
  { id:7,  merchant:"St. Luke's",     date:"Mar 08", amount:50.00,  category:"Tithe/Charity", ai:0.94, pending:false },
  { id:8,  merchant:"Starbucks",      date:"Mar 08", amount:6.85,   category:"Eating Out",    ai:0.98, pending:false },
  { id:9,  merchant:"Amazon",         date:"Mar 07", amount:38.99,  category:"Shopping",      ai:0.91, pending:false },
  { id:10, merchant:"Visa Payment",   date:"Mar 07", amount:250.00, category:"Debt Payments", ai:0.99, pending:false },
  { id:11, merchant:"Trader Joe's",   date:"Mar 06", amount:44.22,  category:"Groceries",     ai:0.97, pending:false },
  { id:12, merchant:"McDonald's",     date:"Mar 06", amount:9.43,   category:"Eating Out",    ai:0.99, pending:false },
  { id:13, merchant:"BP Gas",         date:"Mar 05", amount:45.00,  category:"Gas",           ai:0.97, pending:false },
  { id:14, merchant:"Target",         date:"Mar 05", amount:73.56,  category:"Shopping",      ai:0.88, pending:true  },
  { id:15, merchant:"Hulu",           date:"Mar 04", amount:17.99,  category:"Subscriptions", ai:0.99, pending:false },
];

const BUDGETS = [
  { category:"Groceries",     limit:200, icon:"🛒", color:"#34d399" },
  { category:"Gas",           limit:120, icon:"⛽", color:"#fbbf24" },
  { category:"Eating Out",    limit:100, icon:"🍽️", color:"#f87171" },
  { category:"Subscriptions", limit:60,  icon:"📺", color:"#a78bfa" },
  { category:"Bills",         limit:300, icon:"💡", color:"#60a5fa" },
  { category:"Tithe/Charity", limit:150, icon:"🙏", color:"#f472b6" },
  { category:"Debt Payments", limit:500, icon:"💳", color:"#818cf8" },
  { category:"Shopping",      limit:150, icon:"🛍️", color:"#2dd4bf" },
];

const CAT_COLORS = {
  "Groceries":"#34d399","Gas":"#fbbf24","Eating Out":"#f87171",
  "Subscriptions":"#a78bfa","Bills":"#60a5fa","Tithe/Charity":"#f472b6",
  "Debt Payments":"#818cf8","Shopping":"#2dd4bf","Other":"#94a3b8",
};
const CATS = Object.keys(CAT_COLORS);

const INSIGHTS = [
  { type:"warn",    icon:"⚠️", msg:"80% through your Gas budget this week." },
  { type:"alert",   icon:"🔔", msg:"Eating Out is 31% over last week's pace." },
  { type:"success", icon:"✅", msg:"Subscriptions on track — $43.97 of $60." },
  { type:"info",    icon:"💡", msg:"Projected weekly total: $412 — $38 under budget!" },
  { type:"trend",   icon:"📈", msg:"Groceries trending 12% higher than last week." },
];

const WEEKLY = [
  {week:"F10",amount:387},{week:"F17",amount:452},
  {week:"F24",amount:318},{week:"M3",amount:490},{week:"M10",amount:374},
];

function getSpent(txs) {
  return txs.reduce((a,t)=>{a[t.category]=(a[t.category]||0)+t.amount;return a;},{});
}

function Pie({ data }) {
  const total = data.reduce((s,d)=>s+d.v,0);
  const [hov, setHov] = useState(null);
  let cum = -Math.PI/2;
  const slices = data.map(d=>{const a=(d.v/total)*2*Math.PI,s=cum;cum+=a;return{...d,s,e:cum};});
  const cx=80,cy=80,R=70,r=46;
  const arc=(s,e,or,ir)=>{
    const x1=cx+or*Math.cos(s),y1=cy+or*Math.sin(s),x2=cx+or*Math.cos(e),y2=cy+or*Math.sin(e);
    const ix1=cx+ir*Math.cos(e),iy1=cy+ir*Math.sin(e),ix2=cx+ir*Math.cos(s),iy2=cy+ir*Math.sin(s);
    return `M${x1} ${y1}A${or} ${or} 0 ${e-s>Math.PI?1:0} 1 ${x2} ${y2}L${ix1} ${iy1}A${ir} ${ir} 0 ${e-s>Math.PI?1:0} 0 ${ix2} ${iy2}Z`;
  };
  return (
    <div style={{display:"flex",alignItems:"center",gap:14}}>
      <svg width={160} height={160} style={{flexShrink:0}} viewBox="0 0 160 160">
        {slices.map((s,i)=>(
          <path key={i} d={arc(s.s,s.e,hov===i?R+5:R,r)} fill={s.c}
            opacity={hov!==null&&hov!==i?0.4:1}
            style={{cursor:"pointer",transition:"all 0.18s"}}
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
            onTouchStart={()=>setHov(hov===i?null:i)}/>
        ))}
        <text x={cx} y={cy-5} textAnchor="middle" fill="#f1f5f9" fontSize={11} fontWeight="700" fontFamily="'DM Sans',sans-serif">
          {hov!==null?slices[hov].label.split(" ")[0]:"Total"}
        </text>
        <text x={cx} y={cy+9} textAnchor="middle" fill="#64748b" fontSize={10} fontFamily="'DM Mono',monospace">
          ${hov!==null?slices[hov].v.toFixed(0):total.toFixed(0)}
        </text>
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:6,flex:1}}>
        {slices.slice(0,6).map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:6}}
            onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
            <div style={{width:8,height:8,borderRadius:2,background:s.c,flexShrink:0,opacity:hov!==null&&hov!==i?0.3:1}}/>
            <span style={{fontSize:10,color:"#94a3b8",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif"}}>{s.label}</span>
            <span style={{fontSize:10,color:"#64748b",fontFamily:"'DM Mono',monospace"}}>${s.v.toFixed(0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bars({ data }) {
  const max = Math.max(...data.map(d=>d.amount));
  const [hov,setHov] = useState(null);
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:6,height:86}}>
      {data.map((d,i)=>(
        <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,cursor:"pointer"}}
          onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
          onTouchStart={()=>setHov(hov===i?null:i)}>
          {hov===i&&<span style={{fontSize:9,color:"#e2e8f0",background:"rgba(15,23,42,0.95)",padding:"2px 4px",borderRadius:4,fontFamily:"'DM Mono',monospace"}}>${d.amount}</span>}
          <div style={{width:"100%",borderRadius:"3px 3px 0 0",background:hov===i?"#818cf8":"rgba(99,102,241,0.4)",height:`${(d.amount/max)*66}px`,transition:"all 0.2s"}}/>
          <span style={{fontSize:9,color:"#475569",fontFamily:"'DM Sans',sans-serif"}}>{d.week}</span>
        </div>
      ))}
    </div>
  );
}

function BudRow({ b, spent }) {
  const pct=Math.min((spent/b.limit)*100,100);
  const over=spent>b.limit;
  const col=pct>90?"#f87171":pct>70?"#fbbf24":b.color;
  return (
    <div style={{marginBottom:15}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <span style={{fontSize:15}}>{b.icon}</span>
          <span style={{fontSize:12,color:"#cbd5e1",fontFamily:"'DM Sans',sans-serif"}}>{b.category}</span>
          {over&&<span style={{fontSize:8,background:"rgba(239,68,68,0.2)",color:"#f87171",padding:"1px 5px",borderRadius:8}}>OVER</span>}
        </div>
        <span style={{fontSize:11,color:"#94a3b8",fontFamily:"'DM Mono',monospace"}}>
          <span style={{color:over?"#f87171":"#e2e8f0"}}>${spent.toFixed(0)}</span>/${b.limit}
        </span>
      </div>
      <div style={{height:5,background:"rgba(255,255,255,0.06)",borderRadius:10,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:col,borderRadius:10,transition:"width 0.9s cubic-bezier(0.16,1,0.3,1)"}}/>
      </div>
      <div style={{fontSize:9,color:"#475569",marginTop:2,textAlign:"right",fontFamily:"'DM Mono',monospace"}}>
        {over?`$${(spent-b.limit).toFixed(0)} over`:`$${(b.limit-spent).toFixed(0)} left`}
      </div>
    </div>
  );
}

const Card = ({children, style={}}) => (
  <div style={{background:"rgba(15,23,42,0.85)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:16,padding:"18px 16px",marginBottom:12,...style}}>
    {children}
  </div>
);

const SectionLabel = ({children}) => (
  <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:13,fontFamily:"'DM Sans',sans-serif"}}>{children}</div>
);

function PlaidConnect({ onConnected }) {
  const [step, setStep] = useState("idle");
  const [clientId, setClientId] = useState("");
  const [secret, setSecret] = useState("");
  const [env, setEnv] = useState("sandbox");
  const [show, setShow] = useState(false);

  const SETUP_STEPS = [
    { n:1, icon:"🌐", title:"Create Free Plaid Account", desc:"Sign up at dashboard.plaid.com — takes 2 min", link:"https://dashboard.plaid.com/signup", cta:"Sign up →" },
    { n:2, icon:"🔑", title:"Copy Your API Keys", desc:"Go to Team → Keys and copy your Client ID + Secret", link:"https://dashboard.plaid.com/team/keys", cta:"Open Keys →" },
    { n:3, icon:"🏦", title:"Chase is Ready", desc:"Chase is supported by default. No extra setup needed in sandbox mode.", link:null, cta:null },
    { n:4, icon:"⚙️", title:"Paste Keys Below", desc:"Enter your credentials and tap Connect.", link:null, cta:null },
  ];

  function connect() {
    if (!clientId.trim()||!secret.trim()) return;
    setStep("loading");
    setTimeout(()=>setStep("done"), 2600);
  }

  if (step==="done") return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"48px 24px",textAlign:"center"}}>
      <div style={{fontSize:60,marginBottom:16}}>🎉</div>
      <h2 style={{fontSize:22,fontWeight:700,color:"#34d399",fontFamily:"'Playfair Display',serif",marginBottom:8}}>Chase Connected!</h2>
      <p style={{fontSize:13,color:"#64748b",marginBottom:28,lineHeight:1.6,maxWidth:280}}>
        Plaid link active in <strong style={{color:"#94a3b8"}}>{env}</strong> mode.<br/>Your transactions will sync automatically.
      </p>
      <button onClick={onConnected} style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",border:"none",borderRadius:14,color:"#fff",padding:"15px 36px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",letterSpacing:"-0.2px"}}>
        Open Dashboard →
      </button>
    </div>
  );

  return (
    <div style={{padding:"24px 18px 32px",maxWidth:480,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
        <div style={{width:36,height:36,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>◈</div>
        <div>
          <h1 style={{fontSize:18,fontWeight:700,fontFamily:"'Playfair Display',serif",color:"#f1f5f9",lineHeight:1}}>Connect Chase</h1>
          <p style={{fontSize:10,color:"#475569",marginTop:2}}>Powered by Plaid</p>
        </div>
      </div>

      <div style={{background:"rgba(52,211,153,0.08)",border:"1px solid rgba(52,211,153,0.2)",borderRadius:12,padding:"10px 14px",marginBottom:22,marginTop:12,display:"flex",gap:8,alignItems:"flex-start"}}>
        <span style={{fontSize:14,flexShrink:0}}>🔒</span>
        <p style={{fontSize:11,color:"#6ee7b7",lineHeight:1.6}}>Read-only access. FinanceOS <strong>never</strong> sees your Chase login. Plaid uses bank-grade OAuth — your credentials go directly to Chase.</p>
      </div>

      <p style={{fontSize:9,color:"#334155",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:10}}>Setup Guide · 5 minutes</p>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:22}}>
        {SETUP_STEPS.map(s=>(
          <div key={s.n} style={{display:"flex",gap:12,background:"rgba(15,23,42,0.8)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"14px",alignItems:"flex-start"}}>
            <div style={{width:28,height:28,borderRadius:8,background:"rgba(99,102,241,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#a5b4fc",flexShrink:0,fontFamily:"'DM Mono',monospace"}}>{s.n}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                <span style={{fontSize:13}}>{s.icon}</span>
                <span style={{fontSize:12,fontWeight:600,color:"#e2e8f0",fontFamily:"'DM Sans',sans-serif"}}>{s.title}</span>
              </div>
              <p style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{s.desc}</p>
              {s.link&&(
                <a href={s.link} target="_blank" rel="noopener noreferrer"
                  style={{display:"inline-block",marginTop:7,fontSize:11,color:"#818cf8",textDecoration:"none",fontWeight:600,background:"rgba(99,102,241,0.12)",padding:"4px 10px",borderRadius:6}}>
                  {s.cta}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <p style={{fontSize:9,color:"#334155",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>Environment</p>
      <div style={{display:"flex",gap:7,marginBottom:8}}>
        {["sandbox","development","production"].map(e=>(
          <button key={e} onClick={()=>setEnv(e)} style={{flex:1,padding:"9px 6px",borderRadius:9,border:`1px solid ${env===e?"rgba(99,102,241,0.5)":"rgba(255,255,255,0.07)"}`,background:env===e?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.02)",color:env===e?"#a5b4fc":"#475569",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:env===e?600:400,transition:"all 0.15s"}}>
            {e}
          </button>
        ))}
      </div>
      <p style={{fontSize:10,color:env==="sandbox"?"#34d399":env==="production"?"#fbbf24":"#94a3b8",marginBottom:18,minHeight:16}}>
        {env==="sandbox"&&"✓ Free · test data · no approval needed"}
        {env==="development"&&"Real bank data · free up to 100 items"}
        {env==="production"&&"⚠ Requires Plaid approval before going live"}
      </p>

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <p style={{fontSize:9,color:"#334155",textTransform:"uppercase",letterSpacing:"0.5px"}}>API Credentials</p>
        <button onClick={()=>setShow(!show)} style={{fontSize:10,color:"#475569",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
          {show?"Hide":"Reveal"}
        </button>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
        {[
          {label:"PLAID_CLIENT_ID", val:clientId, set:setClientId, ph:"5f3a8c2b1d4e6f7a8b9c0d1e"},
          {label:`PLAID_SECRET (${env})`, val:secret, set:setSecret, ph:"Your Plaid secret key"},
        ].map((f,i)=>(
          <div key={i}>
            <label style={{fontSize:10,color:"#64748b",display:"block",marginBottom:4,fontFamily:"'DM Sans',sans-serif"}}>{f.label}</label>
            <input type={show?"text":"password"} value={f.val} onChange={e=>f.set(e.target.value)} placeholder={f.ph}
              style={{width:"100%",background:"rgba(15,23,42,0.9)",border:`1px solid ${f.val?"rgba(99,102,241,0.4)":"rgba(255,255,255,0.08)"}`,borderRadius:10,color:"#f1f5f9",padding:"12px 14px",fontSize:12,fontFamily:"'DM Mono',monospace",boxSizing:"border-box",transition:"border 0.2s"}}/>
          </div>
        ))}
      </div>

      <button onClick={connect} disabled={!clientId||!secret||step==="loading"}
        style={{width:"100%",padding:"16px",background:clientId&&secret?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(99,102,241,0.15)",border:"none",borderRadius:14,color:clientId&&secret?"#fff":"#334155",fontSize:14,fontWeight:700,cursor:clientId&&secret?"pointer":"not-allowed",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:10,transition:"all 0.2s",letterSpacing:"-0.2px"}}>
        {step==="loading"
          ?<><span style={{animation:"spin 1s linear infinite",display:"inline-block",fontSize:16}}>↻</span>Linking Chase via Plaid…</>
          :<>🏦 Connect Chase Bank</>}
      </button>
      <p style={{fontSize:10,color:"#334155",textAlign:"center",marginTop:10,lineHeight:1.5}}>
        Keys stay in this session only. In production, use server-side env vars.
      </p>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("connect");
  const [tab, setTab] = useState("home");
  const [txs, setTxs] = useState(MOCK_TXS);
  const [editTx, setEditTx] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState(null);
  const [aiQ, setAiQ] = useState("");
  const [aiR, setAiR] = useState("");
  const [aiLoad, setAiLoad] = useState(false);

  const spent = getSpent(txs);
  const totalSpent = Object.values(spent).reduce((s,v)=>s+v,0);
  const totalBudget = BUDGETS.reduce((s,b)=>s+b.limit,0);
  const balance = 4287.53;
  const pieData = BUDGETS.filter(b=>spent[b.category]).map(b=>({label:b.category,v:spent[b.category],c:b.color}));

  function showToast(msg,t="ok"){ setToast({msg,t}); setTimeout(()=>setToast(null),2800); }

  function sync() {
    setSyncing(true);
    setTimeout(()=>{ setSyncing(false); showToast("✓ 3 new transactions synced"); }, 2000);
  }

  function changeCat(id,cat) {
    setTxs(p=>p.map(t=>t.id===id?{...t,category:cat,manual:true}:t));
    setEditTx(null);
    showToast("Category updated");
  }

  async function askAI() {
    if (!aiQ.trim()) return;
    setAiLoad(true); setAiR("");
    try {
      const sum = BUDGETS.map(b=>`${b.category}:$${(spent[b.category]||0).toFixed(0)}/$${b.limit}`).join(", ");
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:`You're a concise personal finance coach. Spending: ${sum}. Total $${totalSpent.toFixed(0)}/$${totalBudget}. Answer in 2-3 sentences: ${aiQ}`}]})
      });
      const d = await res.json();
      setAiR(d.content?.map(c=>c.text||"").join("")||"No response.");
    } catch { setAiR("Connection error. Try again."); }
    setAiLoad(false);
  }

  const NAV = [
    {id:"home",  icon:"◈", label:"Home"},
    {id:"txns",  icon:"≡", label:"Txns"},
    {id:"budget",icon:"◎", label:"Budget"},
    {id:"ai",    icon:"✦", label:"AI"},
    {id:"bank",  icon:"🏦", label:"Bank"},
  ];

  const insightBg = t => t==="warn"?"rgba(251,191,36,0.07)":t==="alert"?"rgba(248,113,113,0.07)":t==="success"?"rgba(52,211,153,0.07)":"rgba(99,102,241,0.07)";
  const insightBorder = t => t==="warn"?"1px solid rgba(251,191,36,0.2)":t==="alert"?"1px solid rgba(248,113,113,0.2)":t==="success"?"1px solid rgba(52,211,153,0.2)":"1px solid rgba(99,102,241,0.2)";

  return (
    <div style={{minHeight:"100vh",background:"#0b0f1a",color:"#f1f5f9",fontFamily:"'DM Sans',sans-serif",maxWidth:480,margin:"0 auto",position:"relative",display:"flex",flexDirection:"column"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0b0f1a}
        input,select,textarea{outline:none;font-family:'DM Sans',sans-serif}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#334155;border-radius:4px}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp 0.3s ease both}
        .press:active{transform:scale(0.96)}
        .txr:active{background:rgba(255,255,255,0.04)!important}
      `}</style>

      {toast&&(
        <div style={{position:"fixed",top:14,left:"50%",transform:"translateX(-50%)",background:toast.t==="ok"?"rgba(16,185,129,0.15)":"rgba(239,68,68,0.12)",border:`1px solid ${toast.t==="ok"?"rgba(16,185,129,0.3)":"rgba(239,68,68,0.3)"}`,color:toast.t==="ok"?"#6ee7b7":"#fca5a5",padding:"9px 18px",borderRadius:20,fontSize:12,zIndex:9999,backdropFilter:"blur(10px)",whiteSpace:"nowrap",boxShadow:"0 4px 20px rgba(0,0,0,0.4)"}}>
          {toast.msg}
        </div>
      )}

      {screen==="connect" ? (
        <div style={{flex:1,overflowY:"auto"}}>
          <PlaidConnect onConnected={()=>{setScreen("app");setTab("home");}}/>
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{padding:"14px 18px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.05)",position:"sticky",top:0,background:"rgba(11,15,26,0.96)",backdropFilter:"blur(12px)",zIndex:50,flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <div style={{width:28,height:28,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>◈</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9",letterSpacing:"-0.3px"}}>FinanceOS</div>
                <div style={{fontSize:9,color:"#34d399"}}>● Chase Live</div>
              </div>
            </div>
            <button className="press" onClick={sync} disabled={syncing}
              style={{display:"flex",alignItems:"center",gap:5,background:"rgba(99,102,241,0.14)",border:"1px solid rgba(99,102,241,0.28)",borderRadius:9,color:"#a5b4fc",padding:"7px 13px",fontSize:11,cursor:"pointer",transition:"all 0.15s"}}>
              <span style={{fontSize:13,display:"inline-block",animation:syncing?"spin 1s linear infinite":"none"}}>↻</span>
              {syncing?"Syncing…":"Sync"}
            </button>
          </div>

          {/* Content */}
          <div style={{flex:1,overflowY:"auto",paddingBottom:76}}>

            {/* HOME */}
            {tab==="home"&&(
              <div className="fu" style={{padding:"18px 16px"}}>
                <div style={{background:"linear-gradient(135deg,rgba(99,102,241,0.22),rgba(139,92,246,0.14))",border:"1px solid rgba(99,102,241,0.18)",borderRadius:18,padding:"22px 20px",marginBottom:12,position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",top:-24,right:-24,width:110,height:110,background:"rgba(99,102,241,0.09)",borderRadius:"50%"}}/>
                  <div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:4}}>Chase Checking</div>
                  <div style={{fontSize:34,fontWeight:700,color:"#f1f5f9",fontFamily:"'DM Mono',monospace",letterSpacing:"-2px",marginBottom:4}}>${balance.toLocaleString("en-US",{minimumFractionDigits:2})}</div>
                  <div style={{fontSize:10,color:"#94a3b8"}}>Available Balance</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                  {[
                    {l:"Spent",v:`$${totalSpent.toFixed(0)}`,s:`of $${totalBudget}`,c:"#f87171"},
                    {l:"Remaining",v:`$${(totalBudget-totalSpent).toFixed(0)}`,s:`${((1-totalSpent/totalBudget)*100).toFixed(0)}% left`,c:"#34d399"},
                  ].map((s,i)=>(
                    <div key={i} style={{background:"rgba(15,23,42,0.85)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"14px 15px"}}>
                      <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:"0.4px",marginBottom:5}}>{s.l}</div>
                      <div style={{fontSize:24,fontWeight:700,color:s.c,fontFamily:"'DM Mono',monospace",letterSpacing:"-1px"}}>{s.v}</div>
                      <div style={{fontSize:9,color:"#475569",marginTop:2}}>{s.s}</div>
                    </div>
                  ))}
                </div>
                <Card><SectionLabel>Spending Breakdown</SectionLabel><Pie data={pieData}/></Card>
                <Card><SectionLabel>Weekly Trend</SectionLabel><Bars data={WEEKLY}/></Card>
                <Card>
                  <SectionLabel>Smart Alerts</SectionLabel>
                  {INSIGHTS.map((ins,i)=>(
                    <div key={i} style={{display:"flex",gap:10,padding:"10px 12px",borderRadius:10,marginBottom:i<INSIGHTS.length-1?8:0,background:insightBg(ins.type),border:insightBorder(ins.type)}}>
                      <span style={{fontSize:14,flexShrink:0}}>{ins.icon}</span>
                      <span style={{fontSize:12,color:"#cbd5e1",lineHeight:1.5}}>{ins.msg}</span>
                    </div>
                  ))}
                </Card>
                <Card>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <SectionLabel>Recent Transactions</SectionLabel>
                    <button onClick={()=>setTab("txns")} style={{fontSize:10,color:"#818cf8",background:"none",border:"none",cursor:"pointer",marginTop:-13}}>See all →</button>
                  </div>
                  {txs.slice(0,5).map((tx,i)=>(
                    <div key={tx.id} className="txr" style={{display:"flex",alignItems:"center",padding:"10px 2px",borderBottom:i<4?"1px solid rgba(255,255,255,0.04)":"none"}}>
                      <div style={{width:36,height:36,borderRadius:10,background:`${CAT_COLORS[tx.category]}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                        {BUDGETS.find(b=>b.category===tx.category)?.icon||"💸"}
                      </div>
                      <div style={{flex:1,marginLeft:11,minWidth:0}}>
                        <div style={{fontSize:12,color:"#e2e8f0",fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tx.merchant}</div>
                        <div style={{fontSize:10,color:"#475569",marginTop:1}}>{tx.date} · {tx.category}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0,marginLeft:8}}>
                        <div style={{fontSize:13,fontFamily:"'DM Mono',monospace",color:"#f1f5f9",fontWeight:600}}>-${tx.amount.toFixed(2)}</div>
                        {tx.pending&&<div style={{fontSize:8,color:"#fbbf24"}}>PENDING</div>}
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* TRANSACTIONS */}
            {tab==="txns"&&(
              <div className="fu" style={{padding:"18px 16px"}}>
                <div style={{marginBottom:16}}>
                  <h2 style={{fontSize:18,fontWeight:700,fontFamily:"'Playfair Display',serif"}}>Transactions</h2>
                  <p style={{fontSize:11,color:"#475569",marginTop:3}}>{txs.length} this week · tap category to edit</p>
                </div>
                <Card style={{padding:0}}>
                  {txs.map((tx,i)=>(
                    <div key={tx.id} className="txr" style={{padding:"13px 16px",borderBottom:i<txs.length-1?"1px solid rgba(255,255,255,0.04)":"none",display:"flex",alignItems:"flex-start",gap:11}}>
                      <div style={{width:38,height:38,borderRadius:10,background:`${CAT_COLORS[tx.category]}18`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                        {BUDGETS.find(b=>b.category===tx.category)?.icon||"💸"}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:6,marginBottom:5}}>
                          <span style={{fontSize:12,fontWeight:500,color:"#e2e8f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tx.merchant}</span>
                          <div style={{textAlign:"right",flexShrink:0}}>
                            <div style={{fontSize:13,fontFamily:"'DM Mono',monospace",color:"#f1f5f9",fontWeight:600}}>-${tx.amount.toFixed(2)}</div>
                            {tx.pending&&<div style={{fontSize:8,color:"#fbbf24"}}>PENDING</div>}
                          </div>
                        </div>
                        <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
                          {editTx===tx.id
                            ?<select value={tx.category} onChange={e=>changeCat(tx.id,e.target.value)} style={{background:"#1e293b",border:"1px solid #6366f1",borderRadius:6,color:"#a5b4fc",fontSize:10,padding:"3px 6px",cursor:"pointer"}}>
                               {CATS.map(c=><option key={c} value={c}>{c}</option>)}
                             </select>
                            :<button onClick={()=>setEditTx(editTx===tx.id?null:tx.id)} style={{fontSize:10,padding:"3px 8px",borderRadius:6,background:`${CAT_COLORS[tx.category]}16`,color:CAT_COLORS[tx.category]||"#94a3b8",border:"none",cursor:"pointer"}}>
                               {tx.category}
                             </button>
                          }
                          <span style={{fontSize:9,color:"#334155"}}>{tx.date}</span>
                          <span style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:tx.ai>0.95?"#34d399":tx.ai>0.85?"#fbbf24":"#f87171"}}>AI {(tx.ai*100).toFixed(0)}%</span>
                          {tx.manual&&<span style={{fontSize:9,color:"#a5b4fc"}}>edited</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* BUDGET */}
            {tab==="budget"&&(
              <div className="fu" style={{padding:"18px 16px"}}>
                <div style={{marginBottom:16}}>
                  <h2 style={{fontSize:18,fontWeight:700,fontFamily:"'Playfair Display',serif"}}>Budget Buckets</h2>
                  <p style={{fontSize:11,color:"#475569",marginTop:3}}>Weekly limits</p>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
                  {[
                    {l:"Budget",v:`$${totalBudget}`,c:"#818cf8"},
                    {l:"Spent",v:`$${totalSpent.toFixed(0)}`,c:"#f87171"},
                    {l:"Left",v:`$${(totalBudget-totalSpent).toFixed(0)}`,c:"#34d399"},
                  ].map((s,i)=>(
                    <div key={i} style={{background:"rgba(15,23,42,0.85)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:12,padding:"12px 10px",textAlign:"center"}}>
                      <div style={{fontSize:9,color:"#475569",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.3px"}}>{s.l}</div>
                      <div style={{fontSize:18,fontWeight:700,color:s.c,fontFamily:"'DM Mono',monospace",letterSpacing:"-1px"}}>{s.v}</div>
                    </div>
                  ))}
                </div>
                <Card>
                  {BUDGETS.map(b=><BudRow key={b.category} b={b} spent={spent[b.category]||0}/>)}
                </Card>
              </div>
            )}

            {/* AI */}
            {tab==="ai"&&(
              <div className="fu" style={{padding:"18px 16px"}}>
                <div style={{marginBottom:16}}>
                  <h2 style={{fontSize:18,fontWeight:700,fontFamily:"'Playfair Display',serif"}}>AI Finance Coach</h2>
                  <p style={{fontSize:11,color:"#475569",marginTop:3}}>Ask anything about your money</p>
                </div>
                <Card style={{border:"1px solid rgba(99,102,241,0.2)"}}>
                  <textarea value={aiQ} onChange={e=>setAiQ(e.target.value)} rows={3}
                    placeholder="e.g. How can I cut back on eating out? Am I on track this week?"
                    style={{width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,color:"#f1f5f9",padding:"11px 13px",fontSize:12,resize:"none",lineHeight:1.5,boxSizing:"border-box"}}/>
                  <button className="press" onClick={askAI} disabled={aiLoad||!aiQ.trim()}
                    style={{width:"100%",marginTop:10,padding:"13px",background:aiQ.trim()?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(99,102,241,0.15)",border:"none",borderRadius:10,color:aiQ.trim()?"#fff":"#475569",fontSize:13,fontWeight:700,cursor:aiQ.trim()?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s"}}>
                    {aiLoad?<><span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>↻</span>Thinking…</>:"Ask AI ✦"}
                  </button>
                  {aiR&&(
                    <div style={{marginTop:14,background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.15)",borderRadius:10,padding:"13px"}}>
                      <div style={{fontSize:9,color:"#6366f1",marginBottom:6,textTransform:"uppercase",letterSpacing:"0.5px"}}>✦ Claude</div>
                      <p style={{fontSize:13,color:"#e2e8f0",lineHeight:1.7}}>{aiR}</p>
                    </div>
                  )}
                </Card>
                <div style={{marginBottom:12}}>
                  <p style={{fontSize:9,color:"#334155",textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:8}}>Quick Questions</p>
                  {["Am I on track this week?","Where can I cut spending?","Predict my month-end total","How's my gas budget?"].map(q=>(
                    <button key={q} className="press" onClick={()=>{setAiQ(q);setAiR("");}}
                      style={{width:"100%",textAlign:"left",background:"rgba(15,23,42,0.85)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:10,color:"#94a3b8",padding:"12px 14px",fontSize:12,cursor:"pointer",marginBottom:8,display:"block",transition:"all 0.15s"}}>
                      {q} →
                    </button>
                  ))}
                </div>
                <Card>
                  <SectionLabel>Automated Alerts</SectionLabel>
                  {INSIGHTS.map((ins,i)=>(
                    <div key={i} style={{display:"flex",gap:10,padding:"10px 12px",borderRadius:10,marginBottom:i<INSIGHTS.length-1?8:0,background:insightBg(ins.type),border:insightBorder(ins.type)}}>
                      <span style={{fontSize:14,flexShrink:0}}>{ins.icon}</span>
                      <span style={{fontSize:12,color:"#cbd5e1",lineHeight:1.5}}>{ins.msg}</span>
                    </div>
                  ))}
                </Card>
              </div>
            )}

            {/* BANK */}
            {tab==="bank"&&(
              <div className="fu">
                <PlaidConnect onConnected={()=>{showToast("✓ Chase reconnected!");setTab("home");}}/>
              </div>
            )}
          </div>

          {/* Bottom Nav */}
          <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"rgba(11,15,26,0.97)",backdropFilter:"blur(16px)",borderTop:"1px solid rgba(255,255,255,0.05)",display:"flex",zIndex:100,paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
            {NAV.map(n=>(
              <button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",cursor:"pointer",padding:"9px 4px 8px",transition:"all 0.15s"}}>
                <span style={{fontSize:17,opacity:tab===n.id?1:0.35,transition:"opacity 0.15s"}}>{n.icon}</span>
                <span style={{fontSize:9,fontFamily:"'DM Sans',sans-serif",color:tab===n.id?"#a5b4fc":"#334155",fontWeight:tab===n.id?600:400,transition:"color 0.15s"}}>{n.label}</span>
                {tab===n.id&&<div style={{width:4,height:4,borderRadius:"50%",background:"#6366f1"}}/>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
