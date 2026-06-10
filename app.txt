import { useState, useRef, useEffect } from "react";

// ── CONSTANTS ──────────────────────────────────────────────────────────────
const JLL_RED = "#E30613";
const BLACK = "#000000";
const BG = "#111111";
const CARD = "#1a1a1a";
const BORDER = "rgba(227,6,19,0.2)";

const SYSTEM_PROMPT = `You are MTS Assistant – Field Assistant, an expert AI tool built exclusively for JLL MTS mobile HVAC engineers and mechanics working in the field.

Your purpose: Help technicians diagnose HVAC issues faster, install parts correctly, work safely with correct PPE, and execute first-time-right repairs.

You specialize in four core areas:

1. STEP-BY-STEP HVAC DIAGNOSTICS
- Walk techs through systematic troubleshooting: rooftop units, chillers, air handlers, split systems, VRF/VRV, boilers, cooling towers, FCUs
- Ask clarifying questions: equipment type, symptoms, fault codes, age, refrigerant type
- Provide structured diagnostic steps with clear pass/fail checkpoints
- Suggest likely root causes ranked by probability
- Recommend when to escalate or call for backup

2. PARTS INSTALLATION GUIDANCE
Always ask for the equipment make, model, and the part being replaced. Then provide:
⚠️ SAFETY FIRST: PPE + LOTO steps
🔧 TOOLS NEEDED
📋 BEFORE YOU START
Numbered installation steps
✅ POST-INSTALL CHECKS

PARTS COVERED: capacitors, contactors, fan motors, TXV/EEV, filter driers, service valves, compressors, thermostats, control boards, pressure switches, gas valves, heat exchangers.

3. OEM MANUALS & DOCUMENTATION
- Major brands: Carrier, Trane, York, Lennox, Daikin, Mitsubishi, LG, Bosch, Goodman, Rheem
- Fault/error codes, wiring diagrams, refrigerant specs, torque values, startup procedures

4. PPE SAFETY GUIDANCE
- Task-specific PPE, LOTO, OSHA/ASHRAE standards
- Refrigerant safety (R-410A, R-22, R-32, R-454B)
- Arc flash, fall protection, confined space

Always: be concise, use numbered steps, flag ⚠️ safety items, ask for make/model when relevant.`;

const QUICK_PROMPTS = [
  { icon: "🔧", label: "Diagnose a fault", text: "I have an HVAC unit with a fault. Can you help me diagnose it step by step?" },
  { icon: "🔩", label: "Install a part", text: "I need step-by-step instructions to install a replacement part. Can you guide me?" },
  { icon: "⚡", label: "Capacitor swap", text: "I need to replace a capacitor. Walk me through the full procedure including safety." },
  { icon: "🌡️", label: "TXV / EEV install", text: "I need to replace a TXV or EEV expansion valve. What are the full installation steps?" },
  { icon: "🖥️", label: "Control board swap", text: "I need to replace a control board. How do I install it safely?" },
  { icon: "📋", label: "PPE requirements", text: "What PPE do I need for this task?" },
  { icon: "📖", label: "Error code lookup", text: "I need help decoding an error/fault code on my equipment." },
  { icon: "🏭", label: "OEM documentation", text: "I need to find documentation or specs for a specific brand/model." },
];

// PT Chart data — pressure (psig) vs temp (°F) for common refrigerants
const PT_DATA = {
  "R-410A": [[-60,-43],[-40,-29],[-20,-12],[0,8],[20,28],[40,50],[60,76],[80,104],[100,136],[120,172],[150,228],[200,314],[250,416]],
  "R-22":   [[-60,-56],[-40,-38],[-20,-16],[0,5],[20,28],[40,51],[60,78],[80,107],[100,140],[120,175],[150,226],[200,302],[250,388]],
  "R-32":   [[-60,-47],[-40,-31],[-20,-13],[0,7],[20,29],[40,53],[60,81],[80,113],[100,148],[120,188],[150,247],[200,338]],
  "R-454B": [[-60,-44],[-40,-29],[-20,-11],[0,9],[20,30],[40,53],[60,80],[80,110],[100,144],[120,182],[150,238],[200,325]],
  "R-407C": [[-60,-52],[-40,-35],[-20,-15],[0,6],[20,28],[40,52],[60,79],[80,109],[100,143],[120,180],[150,233],[200,312]],
  "R-134a": [[-60,-50],[-40,-31],[-20,-9],[0,14],[20,38],[40,64],[60,93],[80,126],[100,163],[120,203],[150,259],[200,340]],
};

const REFRIGERANTS = Object.keys(PT_DATA);

// Major HVAC brands for model lookup
const BRANDS = ["Carrier","Trane","York","Lennox","Daikin","Mitsubishi","LG","Bosch","Goodman","Rheem","Ruud","American Standard","Bryant","Payne","Coleman","Heil","Armstrong","Amana","Frigidaire","Nordyne"];

function genId() { return "id_" + Date.now() + "_" + Math.random().toString(36).slice(2,6); }
function timeAgo(ts) {
  const d = Date.now()-ts, m=Math.floor(d/60000), h=Math.floor(d/3600000), days=Math.floor(d/86400000);
  if(m<1) return "Just now"; if(m<60) return `${m}m ago`; if(h<24) return `${h}h ago`; return `${days}d ago`;
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=Barlow+Condensed:wght@700;800&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; }
  body { background:#111; }
  @keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-6px);opacity:1} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
  @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#E30613;border-radius:2px}
  .tab-btn:hover{background:rgba(227,6,19,0.12)!important}
  .tab-btn.active{color:#E30613!important}
  .card-hover:hover{background:rgba(227,6,19,0.08)!important;border-color:rgba(227,6,19,0.35)!important}
  .red-btn:hover{background:#c00010!important;transform:translateY(-1px)}
  .red-btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}
  .ghost-btn:hover{background:rgba(227,6,19,0.15)!important}
  .del-btn:hover{background:rgba(227,6,19,0.2)!important}
  .quick-btn:hover{background:rgba(227,6,19,0.18)!important;border-color:#E30613!important;transform:translateY(-1px)}
  .msg-anim{animation:fadeUp .3s ease forwards}
  input,textarea,select{font-family:'Barlow',sans-serif}
`;

// ── SHARED COMPONENTS ──────────────────────────────────────────────────────
function Header({ title, subtitle, right, onBack }) {
  return (
    <div style={{background:BLACK,borderBottom:`3px solid ${JLL_RED}`,padding:"11px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0,boxShadow:"0 4px 20px rgba(227,6,19,0.12)"}}>
      {onBack && <button onClick={onBack} className="ghost-btn" style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"#fff",fontSize:15,flexShrink:0,transition:"background .2s"}}>←</button>}
      <div style={{width:38,height:38,flexShrink:0,background:JLL_RED,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:"0 0 16px rgba(227,6,19,0.4)"}}>🔧</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:17,color:"#fff",letterSpacing:".04em",lineHeight:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{title}</div>
        <div style={{fontSize:10,color:JLL_RED,fontWeight:600,letterSpacing:".12em",textTransform:"uppercase",marginTop:2}}>{subtitle}</div>
      </div>
      {right}
    </div>
  );
}

function OnlineBadge() {
  return (
    <div style={{display:"flex",alignItems:"center",gap:5,background:"rgba(39,174,96,0.1)",border:"1px solid rgba(39,174,96,0.4)",borderRadius:20,padding:"3px 9px",flexShrink:0}}>
      <div style={{width:6,height:6,borderRadius:"50%",background:"#27AE60",animation:"pulse 2s infinite"}}/>
      <span style={{fontSize:10,color:"#27AE60",fontWeight:600}}>ONLINE</span>
    </div>
  );
}

function BottomTab({ tabs, active, onSelect }) {
  return (
    <div style={{background:BLACK,borderTop:`2px solid ${BORDER}`,display:"flex",flexShrink:0,boxShadow:"0 -4px 20px rgba(0,0,0,0.5)"}}>
      {tabs.map(t => (
        <button key={t.id} className={`tab-btn${active===t.id?" active":""}`} onClick={()=>onSelect(t.id)}
          style={{flex:1,background:"transparent",border:"none",padding:"8px 2px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"background .2s",color:active===t.id?JLL_RED:"rgba(255,255,255,0.4)"}}>
          <span style={{fontSize:18}}>{t.icon}</span>
          <span style={{fontSize:9,fontWeight:600,letterSpacing:".04em",fontFamily:"'Barlow',sans-serif"}}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

function SectionTitle({ children }) {
  return <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:".12em",fontWeight:700,textTransform:"uppercase",marginBottom:10}}>{children}</div>;
}

function Input({ label, value, onChange, placeholder, type="text" }) {
  return (
    <div style={{marginBottom:12}}>
      {label && <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4,letterSpacing:".04em"}}>{label}</div>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:"#fff",fontSize:13,outline:"none"}} />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows=3 }) {
  return (
    <div style={{marginBottom:12}}>
      {label && <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4,letterSpacing:".04em"}}>{label}</div>}
      <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{width:"100%",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:"#fff",fontSize:13,outline:"none",resize:"vertical"}} />
    </div>
  );
}

function RedBtn({ children, onClick, disabled, style={} }) {
  return (
    <button className="red-btn" onClick={onClick} disabled={disabled}
      style={{background:JLL_RED,border:"none",borderRadius:12,padding:"11px 18px",cursor:"pointer",color:"#fff",fontWeight:700,fontSize:13,fontFamily:"'Barlow',sans-serif",transition:"all .2s",boxShadow:"0 4px 12px rgba(227,6,19,0.35)",...style}}>
      {children}
    </button>
  );
}

// ── SCREEN: AI CHAT LIST ───────────────────────────────────────────────────
function ChatListScreen({ chats, onOpen, onCreate, onDelete, deletingId }) {
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="MTS ASSISTANT" subtitle="JLL · FIELD ASSISTANT · HVAC AI" right={<OnlineBadge/>}/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        {chats.length===0 ? (
          <div style={{textAlign:"center",padding:"50px 20px",animation:"slideIn .4s ease"}}>
            <div style={{fontSize:52,marginBottom:14}}>🛠️</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#fff",marginBottom:8}}>NO JOBS YET</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>Tap + NEW JOB to start. Chats save automatically.</div>
          </div>
        ) : (
          <>
            <SectionTitle>YOUR JOBS ({chats.length})</SectionTitle>
            {chats.map((c,i) => {
              const last = c.messages[c.messages.length-1];
              return (
                <div key={c.id} className="card-hover" onClick={()=>onOpen(c.id)}
                  style={{display:"flex",alignItems:"center",gap:12,background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:"13px",marginBottom:10,cursor:"pointer",transition:"all .2s",animation:`fadeUp .3s ease ${i*.04}s both`}}>
                  <div style={{width:42,height:42,borderRadius:10,background:JLL_RED,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🔧</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13,color:"#fff",marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.title}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{last?(last.content.length>55?last.content.slice(0,55)+"…":last.content):"No messages yet"}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>{timeAgo(c.updatedAt)}</div>
                    <button className="del-btn" onClick={e=>{e.stopPropagation();onDelete(c.id);}}
                      style={{background:"rgba(227,6,19,0.1)",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:JLL_RED,fontWeight:600,transition:"background .2s"}}>
                      {deletingId===c.id?"…":"Delete"}
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      <div style={{padding:"12px 14px",borderTop:`1px solid ${BORDER}`,background:BLACK,flexShrink:0}}>
        <RedBtn onClick={onCreate} style={{width:"100%",padding:14,fontSize:15}}>+ NEW JOB</RedBtn>
      </div>
    </div>
  );
}

// ── SCREEN: AI CHAT ────────────────────────────────────────────────────────
function ChatScreen({ chat, onBack, onSend, loading }) {
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const [input, setInput] = useState("");
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[chat?.messages,loading]);

  function send(text) {
    const t = text||input.trim(); if(!t||loading) return;
    onSend(t); setInput("");
  }
  function handleKey(e){ if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();} }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title={chat?.title||"New Job"} subtitle="JLL MTS ASSISTANT" onBack={onBack} right={<OnlineBadge/>}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px",display:"flex",flexDirection:"column"}}>
        {(!chat||chat.messages.length===0)&&(
          <div style={{animation:"fadeUp .5s ease"}}>
            <div style={{textAlign:"center",padding:"24px 16px 18px"}}>
              <div style={{width:68,height:68,background:JLL_RED,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 12px",boxShadow:"0 0 40px rgba(227,6,19,0.4)"}}>🛠️</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:22,color:"#fff",marginBottom:6}}>READY TO ASSIST</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.6,maxWidth:280,margin:"0 auto"}}>Diagnose faults, get install steps, safety guidance & OEM docs — instantly.</div>
            </div>
            <SectionTitle style={{textAlign:"center",marginBottom:10}}>QUICK START</SectionTitle>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {QUICK_PROMPTS.map((p,i)=>(
                <button key={i} className="quick-btn" onClick={()=>send(p.text)}
                  style={{background:"rgba(227,6,19,0.07)",border:`1px solid ${BORDER}`,borderRadius:12,padding:"11px 12px",cursor:"pointer",textAlign:"left",transition:"all .2s",color:"#fff"}}>
                  <div style={{fontSize:19,marginBottom:4}}>{p.icon}</div>
                  <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.85)"}}>{p.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        {chat?.messages.map((msg,i)=>{
          const isUser=msg.role==="user";
          return (
            <div key={i} className="msg-anim" style={{display:"flex",flexDirection:isUser?"row-reverse":"row",alignItems:"flex-start",gap:8,marginBottom:14,padding:"0 2px"}}>
              {!isUser&&<div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,background:JLL_RED,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🔧</div>}
              <div style={{maxWidth:"80%",background:isUser?JLL_RED:CARD,color:"#fff",borderRadius:isUser?"16px 16px 4px 16px":"16px 16px 16px 4px",padding:"11px 14px",fontSize:13,lineHeight:1.65,boxShadow:isUser?"0 4px 14px rgba(227,6,19,0.3)":"0 4px 14px rgba(0,0,0,0.4)",whiteSpace:"pre-wrap",border:isUser?"none":`1px solid ${BORDER}`}}>{msg.content}</div>
            </div>
          );
        })}
        {loading&&(
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,background:JLL_RED,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🔧</div>
            <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:"16px 16px 16px 4px",padding:"11px 15px",display:"flex",gap:5,alignItems:"center"}}>
              {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:JLL_RED,animation:"bounce 1.2s ease-in-out infinite",animationDelay:`${i*.2}s`}}/>)}
            </div>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>
      <div style={{borderTop:`1px solid ${BORDER}`,background:BLACK,padding:"10px 14px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"flex-end",gap:8,background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:"9px 12px"}}>
          <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey}
            placeholder="Describe your HVAC issue, ask about PPE, or request documentation..."
            rows={1} style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#fff",fontSize:13,resize:"none",lineHeight:1.5,maxHeight:110,overflowY:"auto"}}
            onInput={e=>{e.target.style.height="auto";e.target.style.height=Math.min(e.target.scrollHeight,110)+"px";}}/>
          <button className="red-btn" onClick={()=>send()} disabled={!input.trim()||loading}
            style={{width:36,height:36,borderRadius:"50%",background:JLL_RED,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,transition:"all .2s",flexShrink:0,boxShadow:"0 4px 12px rgba(227,6,19,0.45)"}}>➤</button>
        </div>
        <div style={{textAlign:"center",fontSize:9,color:"rgba(255,255,255,0.12)",marginTop:6,letterSpacing:".08em"}}>JLL MTS ASSISTANT · AUTHORIZED TECHNICIANS ONLY</div>
      </div>
    </div>
  );
}

// ── SCREEN: MODEL LOOKUP ───────────────────────────────────────────────────
function ModelLookupScreen({ storage }) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [notes, setNotes] = useState("");
  const [saved, setSaved] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{ loadSaved(); },[]);
  async function loadSaved() {
    try { const r=await storage.get("model_lookup"); if(r?.value) setSaved(JSON.parse(r.value)); } catch{}
  }
  async function saveEntry() {
    if(!model.trim()) return;
    setSaving(true);
    const entry={id:genId(),brand,model,serial,notes,savedAt:Date.now()};
    const updated=[entry,...saved].slice(0,50);
    setSaved(updated);
    try{ await storage.set("model_lookup",JSON.stringify(updated)); }catch{}
    setBrand(""); setModel(""); setSerial(""); setNotes("");
    setSaving(false);
  }
  async function deleteEntry(id) {
    const updated=saved.filter(e=>e.id!==id);
    setSaved(updated);
    try{ await storage.set("model_lookup",JSON.stringify(updated)); }catch{}
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="MODEL LOOKUP" subtitle="JLL · EQUIPMENT REGISTER"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:14,marginBottom:16}}>
          <SectionTitle>SAVE EQUIPMENT</SectionTitle>
          <div style={{marginBottom:10}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>BRAND</div>
            <select value={brand} onChange={e=>setBrand(e.target.value)}
              style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:brand?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
              <option value="">Select brand…</option>
              {BRANDS.map(b=><option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <Input label="MODEL NUMBER" value={model} onChange={setModel} placeholder="e.g. 48XC024-513"/>
          <Input label="SERIAL NUMBER" value={serial} onChange={setSerial} placeholder="e.g. 4819A12345"/>
          <Textarea label="NOTES" value={notes} onChange={setNotes} placeholder="Location, last service, issues…" rows={2}/>
          <RedBtn onClick={saveEntry} disabled={saving||!model.trim()} style={{width:"100%"}}>
            {saving?"Saving…":"Save Equipment"}
          </RedBtn>
        </div>
        {saved.length>0&&(
          <>
            <SectionTitle>SAVED EQUIPMENT ({saved.length})</SectionTitle>
            {saved.map(e=>(
              <div key={e.id} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:12,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div>
                    {e.brand&&<div style={{fontSize:10,color:JLL_RED,fontWeight:700,letterSpacing:".08em",marginBottom:2}}>{e.brand}</div>}
                    <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{e.model}</div>
                    {e.serial&&<div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginTop:2}}>S/N: {e.serial}</div>}
                  </div>
                  <button className="del-btn" onClick={()=>deleteEntry(e.id)}
                    style={{background:"rgba(227,6,19,0.1)",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:JLL_RED,fontWeight:600,transition:"background .2s",flexShrink:0}}>Delete</button>
                </div>
                {e.notes&&<div style={{fontSize:11,color:"rgba(255,255,255,0.4)",borderTop:`1px solid rgba(255,255,255,0.06)`,paddingTop:6,marginTop:4}}>{e.notes}</div>}
                <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",marginTop:4}}>{timeAgo(e.savedAt)}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── SCREEN: PT CHART ───────────────────────────────────────────────────────
function PTChartScreen() {
  const [ref, setRef] = useState("R-410A");
  const [mode, setMode] = useState("P→T"); // P→T or T→P
  const [inputVal, setInputVal] = useState("");
  const [result, setResult] = useState(null);

  function interpolate(data, x, col) {
    const srcCol = col===0?0:1, tgtCol = col===0?1:0;
    const sorted = [...data].sort((a,b)=>a[srcCol]-b[srcCol]);
    if(x <= sorted[0][srcCol]) return sorted[0][tgtCol];
    if(x >= sorted[sorted.length-1][srcCol]) return sorted[sorted.length-1][tgtCol];
    for(let i=0;i<sorted.length-1;i++){
      if(x>=sorted[i][srcCol]&&x<=sorted[i+1][srcCol]){
        const t=(x-sorted[i][srcCol])/(sorted[i+1][srcCol]-sorted[i][srcCol]);
        return sorted[i][tgtCol]+t*(sorted[i+1][tgtCol]-sorted[i][tgtCol]);
      }
    }
    return null;
  }

  function calculate() {
    const v = parseFloat(inputVal);
    if(isNaN(v)){ setResult("Invalid input"); return; }
    const data = PT_DATA[ref];
    if(mode==="P→T"){
      const t = interpolate(data,v,0);
      setResult(t!==null?`Saturation Temp: ${t.toFixed(1)} °F`:"Out of range");
    } else {
      const p = interpolate(data,v,1);
      setResult(p!==null?`Saturation Pressure: ${p.toFixed(1)} psig`:"Out of range");
    }
  }

  const data = PT_DATA[ref];

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="PT CHART" subtitle="JLL · PRESSURE-TEMPERATURE"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:14,marginBottom:14}}>
          <SectionTitle>REFRIGERANT CALCULATOR</SectionTitle>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>REFRIGERANT</div>
            <select value={ref} onChange={e=>{setRef(e.target.value);setResult(null);}}
              style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:"#fff",fontSize:13,outline:"none"}}>
              {REFRIGERANTS.map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div style={{display:"flex",gap:8,marginBottom:12}}>
            {["P→T","T→P"].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setResult(null);}}
                style={{flex:1,background:mode===m?JLL_RED:"#222",border:`1px solid ${mode===m?JLL_RED:BORDER}`,borderRadius:10,padding:"9px",cursor:"pointer",color:"#fff",fontSize:12,fontWeight:700,transition:"all .2s"}}>
                {m==="P→T"?"Pressure → Temp":"Temp → Pressure"}
              </button>
            ))}
          </div>
          <Input label={mode==="P→T"?"PRESSURE (psig)":"TEMPERATURE (°F)"} value={inputVal} onChange={v=>{setInputVal(v);setResult(null);}} placeholder={mode==="P→T"?"Enter psig…":"Enter °F…"} type="number"/>
          <RedBtn onClick={calculate} style={{width:"100%"}}>Calculate</RedBtn>
          {result&&(
            <div style={{marginTop:12,background:"rgba(227,6,19,0.1)",border:`1px solid rgba(227,6,19,0.3)`,borderRadius:10,padding:"12px 14px",textAlign:"center",fontSize:16,fontWeight:700,color:"#fff"}}>
              {result}
            </div>
          )}
        </div>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:14}}>
          <SectionTitle>FULL TABLE — {ref}</SectionTitle>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0,borderRadius:8,overflow:"hidden",border:`1px solid ${BORDER}`}}>
            <div style={{background:JLL_RED,padding:"8px 12px",fontSize:11,fontWeight:700,color:"#fff",letterSpacing:".06em"}}>PRESSURE (psig)</div>
            <div style={{background:JLL_RED,padding:"8px 12px",fontSize:11,fontWeight:700,color:"#fff",letterSpacing:".06em",borderLeft:"1px solid rgba(255,255,255,0.2)"}}>TEMP (°F)</div>
            {data.map(([p,t],i)=>[
              <div key={`p${i}`} style={{padding:"7px 12px",fontSize:12,color:"#fff",background:i%2===0?"#1f1f1f":CARD,borderTop:`1px solid ${BORDER}`}}>{p}</div>,
              <div key={`t${i}`} style={{padding:"7px 12px",fontSize:12,color:"rgba(255,255,255,0.7)",background:i%2===0?"#1f1f1f":CARD,borderTop:`1px solid ${BORDER}`,borderLeft:`1px solid ${BORDER}`}}>{t}</div>
            ])}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SCREEN: NOTES ──────────────────────────────────────────────────────────
function NotesScreen({ storage }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(()=>{ load(); },[]);
  async function load(){ try{ const r=await storage.get("notes"); if(r?.value) setNotes(JSON.parse(r.value)); }catch{} }
  async function save(){
    if(!body.trim()) return; setSaving(true);
    const note={id:genId(),title:title||"Untitled Note",body,createdAt:Date.now()};
    const updated=[note,...notes];
    setNotes(updated);
    try{ await storage.set("notes",JSON.stringify(updated)); }catch{}
    setTitle(""); setBody(""); setSaving(false);
  }
  async function del(id){
    const updated=notes.filter(n=>n.id!==id);
    setNotes(updated);
    try{ await storage.set("notes",JSON.stringify(updated)); }catch{}
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="JOB NOTES" subtitle="JLL · FIELD NOTES"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:14,marginBottom:16}}>
          <SectionTitle>NEW NOTE</SectionTitle>
          <Input label="TITLE (optional)" value={title} onChange={setTitle} placeholder="e.g. Rooftop Unit 3 — Carrier"/>
          <Textarea label="NOTE" value={body} onChange={setBody} placeholder="Write job notes, observations, actions taken…" rows={4}/>
          <RedBtn onClick={save} disabled={saving||!body.trim()} style={{width:"100%"}}>{saving?"Saving…":"Save Note"}</RedBtn>
        </div>
        {notes.length>0&&(
          <>
            <SectionTitle>SAVED NOTES ({notes.length})</SectionTitle>
            {notes.map(n=>(
              <div key={n.id} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:12,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#fff",flex:1,marginRight:8}}>{n.title}</div>
                  <button className="del-btn" onClick={()=>del(n.id)}
                    style={{background:"rgba(227,6,19,0.1)",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:JLL_RED,fontWeight:600,flexShrink:0}}>Delete</button>
                </div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{n.body}</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",marginTop:6}}>{timeAgo(n.createdAt)}</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── SCREEN: EQUIPMENT ─────────────────────────────────────────────────────
function EquipmentScreen({ storage }) {
  const [site, setSite] = useState("");
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [location, setLocation] = useState("");
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");

  const TYPES=["RTU","Chiller","Split System","VRF/VRV","Air Handler","FCU","Boiler","Cooling Tower","Heat Pump","Mini-Split","Other"];

  useEffect(()=>{ load(); },[]);
  async function load(){ try{ const r=await storage.get("equipment"); if(r?.value) setItems(JSON.parse(r.value)); }catch{} }
  async function save(){
    if(!model.trim()) return; setSaving(true);
    const eq={id:genId(),site,type,brand,model,serial,location,addedAt:Date.now()};
    const updated=[eq,...items];
    setItems(updated);
    try{ await storage.set("equipment",JSON.stringify(updated)); }catch{}
    setSite(""); setType(""); setBrand(""); setModel(""); setSerial(""); setLocation("");
    setSaving(false);
  }
  async function del(id){
    const updated=items.filter(e=>e.id!==id);
    setItems(updated);
    try{ await storage.set("equipment",JSON.stringify(updated)); }catch{}
  }

  const filtered = filter ? items.filter(e=>[e.site,e.type,e.brand,e.model,e.serial,e.location].join(" ").toLowerCase().includes(filter.toLowerCase())) : items;

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="EQUIPMENT" subtitle="JLL · SITE EQUIPMENT LIST"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:14,marginBottom:14}}>
          <SectionTitle>ADD EQUIPMENT</SectionTitle>
          <Input label="SITE / BUILDING" value={site} onChange={setSite} placeholder="e.g. 123 Main St — Floor 3"/>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>EQUIPMENT TYPE</div>
            <select value={type} onChange={e=>setType(e.target.value)}
              style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:type?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
              <option value="">Select type…</option>
              {TYPES.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>BRAND</div>
                <select value={brand} onChange={e=>setBrand(e.target.value)}
                  style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:brand?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Brand…</option>
                  {BRANDS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <Input label="MODEL #" value={model} onChange={setModel} placeholder="Model…"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Input label="SERIAL #" value={serial} onChange={setSerial} placeholder="Serial…"/>
            <Input label="LOCATION" value={location} onChange={setLocation} placeholder="Rooftop, B1…"/>
          </div>
          <RedBtn onClick={save} disabled={saving||!model.trim()} style={{width:"100%"}}>{saving?"Saving…":"Add Equipment"}</RedBtn>
        </div>
        {items.length>0&&(
          <>
            <Input value={filter} onChange={setFilter} placeholder="🔍  Search equipment…"/>
            <SectionTitle>{filtered.length} EQUIPMENT ITEM{filtered.length!==1?"S":""}</SectionTitle>
            {filtered.map(e=>(
              <div key={e.id} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:12,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1,minWidth:0,marginRight:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                      {e.type&&<span style={{fontSize:10,background:`rgba(227,6,19,0.15)`,color:JLL_RED,borderRadius:5,padding:"2px 6px",fontWeight:700}}>{e.type}</span>}
                      {e.brand&&<span style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:600}}>{e.brand}</span>}
                    </div>
                    <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:2}}>{e.model}</div>
                    {e.serial&&<div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>S/N: {e.serial}</div>}
                    {e.site&&<div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:2}}>📍 {e.site}{e.location?` · ${e.location}`:""}</div>}
                  </div>
                  <button className="del-btn" onClick={()=>del(e.id)}
                    style={{background:"rgba(227,6,19,0.1)",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:JLL_RED,fontWeight:600,flexShrink:0}}>Delete</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── SCREEN: PARTS LOG ──────────────────────────────────────────────────────
function PartsLogScreen({ storage }) {
  const [partName, setPartName] = useState("");
  const [partNum, setPartNum] = useState("");
  const [qty, setQty] = useState("1");
  const [jobRef, setJobRef] = useState("");
  const [cost, setCost] = useState("");
  const [logs, setLogs] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{ load(); },[]);
  async function load(){ try{ const r=await storage.get("parts_log"); if(r?.value) setLogs(JSON.parse(r.value)); }catch{} }
  async function save(){
    if(!partName.trim()) return; setSaving(true);
    const entry={id:genId(),partName,partNum,qty,jobRef,cost,loggedAt:Date.now()};
    const updated=[entry,...logs];
    setLogs(updated);
    try{ await storage.set("parts_log",JSON.stringify(updated)); }catch{}
    setPartName(""); setPartNum(""); setQty("1"); setJobRef(""); setCost("");
    setSaving(false);
  }
  async function del(id){
    const updated=logs.filter(l=>l.id!==id);
    setLogs(updated);
    try{ await storage.set("parts_log",JSON.stringify(updated)); }catch{}
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="PARTS LOG" subtitle="JLL · PARTS USED"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:14,marginBottom:14}}>
          <SectionTitle>LOG A PART</SectionTitle>
          <Input label="PART NAME" value={partName} onChange={setPartName} placeholder="e.g. Run Capacitor 45/5 µF 440V"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Input label="PART NUMBER" value={partNum} onChange={setPartNum} placeholder="Part #…"/>
            <Input label="QTY" value={qty} onChange={setQty} placeholder="1" type="number"/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Input label="JOB / UNIT REF" value={jobRef} onChange={setJobRef} placeholder="Unit ID or site…"/>
            <Input label="COST ($)" value={cost} onChange={setCost} placeholder="0.00" type="number"/>
          </div>
          <RedBtn onClick={save} disabled={saving||!partName.trim()} style={{width:"100%"}}>{saving?"Saving…":"Log Part"}</RedBtn>
        </div>
        {logs.length>0&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <SectionTitle>PARTS USED ({logs.length})</SectionTitle>
              {logs.filter(l=>l.cost).length>0&&(
                <div style={{fontSize:11,color:JLL_RED,fontWeight:700}}>
                  Total: ${logs.reduce((a,l)=>a+(parseFloat(l.cost)||0)*(parseInt(l.qty)||1),0).toFixed(2)}
                </div>
              )}
            </div>
            {logs.map(l=>(
              <div key={l.id} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:12,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                  <div style={{flex:1,minWidth:0,marginRight:8}}>
                    <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:3}}>{l.partName}</div>
                    <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                      {l.partNum&&<span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>#{l.partNum}</span>}
                      {l.qty&&<span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Qty: {l.qty}</span>}
                      {l.cost&&<span style={{fontSize:11,color:JLL_RED,fontWeight:600}}>${(parseFloat(l.cost)*(parseInt(l.qty)||1)).toFixed(2)}</span>}
                    </div>
                    {l.jobRef&&<div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:3}}>📍 {l.jobRef}</div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.2)"}}>{timeAgo(l.loggedAt)}</div>
                    <button className="del-btn" onClick={()=>del(l.id)}
                      style={{background:"rgba(227,6,19,0.1)",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:JLL_RED,fontWeight:600}}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── SCREEN: PHOTOS ─────────────────────────────────────────────────────────
function PhotoScreen({ storage }) {
  const [photos, setPhotos] = useState([]);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(()=>{ load(); },[]);
  async function load(){ try{ const r=await storage.get("photos"); if(r?.value) setPhotos(JSON.parse(r.value)); }catch{} }

  function onFile(e){
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>setPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function savePhoto(){
    if(!preview) return; setSaving(true);
    const photo={id:genId(),data:preview,caption,takenAt:Date.now()};
    const updated=[photo,...photos];
    setPhotos(updated);
    try{ await storage.set("photos",JSON.stringify(updated)); }catch{}
    setPreview(null); setCaption(""); if(fileRef.current) fileRef.current.value="";
    setSaving(false);
  }

  async function del(id){
    const updated=photos.filter(p=>p.id!==id);
    setPhotos(updated);
    try{ await storage.set("photos",JSON.stringify(updated)); }catch{}
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="PHOTOS" subtitle="JLL · SITE PHOTOS"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:14,marginBottom:14}}>
          <SectionTitle>CAPTURE PHOTO</SectionTitle>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile}
            style={{display:"none"}} id="photo-input"/>
          {!preview?(
            <label htmlFor="photo-input" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,background:"#222",border:`2px dashed ${BORDER}`,borderRadius:12,padding:"28px 20px",cursor:"pointer",transition:"border-color .2s"}}>
              <span style={{fontSize:36}}>📷</span>
              <span style={{fontSize:13,color:"rgba(255,255,255,0.5)",fontWeight:600}}>Tap to take photo or upload</span>
            </label>
          ):(
            <div>
              <img src={preview} alt="preview" style={{width:"100%",borderRadius:10,marginBottom:10,maxHeight:240,objectFit:"cover"}}/>
              <Input label="CAPTION (optional)" value={caption} onChange={setCaption} placeholder="Describe what this photo shows…"/>
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setPreview(null);setCaption("");}} className="ghost-btn"
                  style={{flex:1,background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:10,cursor:"pointer",color:"rgba(255,255,255,0.5)",fontSize:13,transition:"background .2s"}}>Retake</button>
                <RedBtn onClick={savePhoto} disabled={saving} style={{flex:1}}>{saving?"Saving…":"Save Photo"}</RedBtn>
              </div>
            </div>
          )}
        </div>
        {photos.length>0&&(
          <>
            <SectionTitle>SAVED PHOTOS ({photos.length})</SectionTitle>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {photos.map(p=>(
                <div key={p.id} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,overflow:"hidden"}}>
                  <div style={{position:"relative"}}>
                    <img src={p.data} alt={p.caption||"photo"} style={{width:"100%",height:130,objectFit:"cover",display:"block"}}/>
                    <button className="del-btn" onClick={()=>del(p.id)}
                      style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.7)",border:"none",borderRadius:6,padding:"3px 7px",cursor:"pointer",fontSize:11,color:JLL_RED,fontWeight:700}}>✕</button>
                  </div>
                  {p.caption&&<div style={{padding:"6px 8px",fontSize:11,color:"rgba(255,255,255,0.55)"}}>{p.caption}</div>}
                  <div style={{padding:"0 8px 6px",fontSize:10,color:"rgba(255,255,255,0.2)"}}>{timeAgo(p.takenAt)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── SCREEN: SERVICE HISTORY ────────────────────────────────────────────────
function ServiceHistoryScreen({ storage }) {
  const [unit, setUnit] = useState("");
  const [date, setDate] = useState("");
  const [tech, setTech] = useState("");
  const [work, setWork] = useState("");
  const [outcome, setOutcome] = useState("Completed");
  const [logs, setLogs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");

  const OUTCOMES=["Completed","Pending Parts","Escalated","Requires Follow-up","Completed – Monitor"];

  useEffect(()=>{ load(); },[]);
  async function load(){ try{ const r=await storage.get("service_history"); if(r?.value) setLogs(JSON.parse(r.value)); }catch{} }
  async function save(){
    if(!work.trim()) return; setSaving(true);
    const entry={id:genId(),unit,date,tech,work,outcome,loggedAt:Date.now()};
    const updated=[entry,...logs];
    setLogs(updated);
    try{ await storage.set("service_history",JSON.stringify(updated)); }catch{}
    setUnit(""); setDate(""); setTech(""); setWork(""); setOutcome("Completed");
    setSaving(false);
  }
  async function del(id){
    const updated=logs.filter(l=>l.id!==id);
    setLogs(updated);
    try{ await storage.set("service_history",JSON.stringify(updated)); }catch{}
  }

  const filtered=filter?logs.filter(l=>[l.unit,l.tech,l.work,l.outcome].join(" ").toLowerCase().includes(filter.toLowerCase())):logs;
  const outcomeColor=(o)=>({Completed:"#27AE60","Pending Parts":"#F39C12","Escalated":JLL_RED,"Requires Follow-up":"#E67E22","Completed – Monitor":"#2980B9"}[o]||"#fff");

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="SERVICE HISTORY" subtitle="JLL · MAINTENANCE LOG"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:14,marginBottom:14}}>
          <SectionTitle>LOG SERVICE VISIT</SectionTitle>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <Input label="UNIT / ASSET" value={unit} onChange={setUnit} placeholder="Unit ID…"/>
            <Input label="DATE" value={date} onChange={setDate} type="date"/>
          </div>
          <Input label="TECHNICIAN" value={tech} onChange={setTech} placeholder="Tech name / ID…"/>
          <Textarea label="WORK PERFORMED" value={work} onChange={setWork} placeholder="Describe fault found, work done, parts replaced…" rows={3}/>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>OUTCOME</div>
            <select value={outcome} onChange={e=>setOutcome(e.target.value)}
              style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:"#fff",fontSize:13,outline:"none"}}>
              {OUTCOMES.map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <RedBtn onClick={save} disabled={saving||!work.trim()} style={{width:"100%"}}>{saving?"Saving…":"Log Visit"}</RedBtn>
        </div>
        {logs.length>0&&(
          <>
            <Input value={filter} onChange={setFilter} placeholder="🔍  Search history…"/>
            <SectionTitle>{filtered.length} SERVICE RECORD{filtered.length!==1?"S":""}</SectionTitle>
            {filtered.map(l=>(
              <div key={l.id} style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:12,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                  <div style={{flex:1,minWidth:0,marginRight:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4,flexWrap:"wrap"}}>
                      {l.unit&&<span style={{fontSize:12,fontWeight:700,color:"#fff"}}>{l.unit}</span>}
                      {l.date&&<span style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>{l.date}</span>}
                    </div>
                    <div style={{display:"inline-flex",alignItems:"center",gap:5,marginBottom:6}}>
                      <span style={{width:7,height:7,borderRadius:"50%",background:outcomeColor(l.outcome),display:"inline-block",flexShrink:0}}/>
                      <span style={{fontSize:11,color:outcomeColor(l.outcome),fontWeight:700}}>{l.outcome}</span>
                    </div>
                    <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.5,whiteSpace:"pre-wrap"}}>{l.work}</div>
                    {l.tech&&<div style={{fontSize:11,color:"rgba(255,255,255,0.3)",marginTop:4}}>👤 {l.tech}</div>}
                  </div>
                  <button className="del-btn" onClick={()=>del(l.id)}
                    style={{background:"rgba(227,6,19,0.1)",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:JLL_RED,fontWeight:600,flexShrink:0}}>Delete</button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── AGENT HELPERS ─────────────────────────────────────────────────────────
async function callAgent(systemPrompt, userPrompt, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json",
          "x-api-key": "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",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  const data = await res.json();
  return data.content?.find(b => b.type === "text")?.text || "No response generated.";
}

function AgentCard({ icon, title, desc, color="#E30613", onClick }) {
  return (
    <div className="card-hover" onClick={onClick} style={{background:CARD,border:`1px solid rgba(227,6,19,0.2)`,borderRadius:14,padding:16,marginBottom:12,cursor:"pointer",transition:"all .2s",borderLeft:`4px solid ${color}`}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:46,height:46,borderRadius:12,background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:3}}>{title}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1.5}}>{desc}</div>
        </div>
      </div>
    </div>
  );
}

function AgentResult({ result, onReset, resetLabel="Run Again" }) {
  return (
    <div style={{animation:"fadeUp .3s ease"}}>
      <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:16,marginBottom:14,whiteSpace:"pre-wrap",fontSize:13,color:"#fff",lineHeight:1.7}}>
        {result}
      </div>
      <RedBtn onClick={onReset} style={{width:"100%"}}>{resetLabel}</RedBtn>
    </div>
  );
}

function AgentLoading({ label }) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"50px 20px",gap:16}}>
      <div style={{display:"flex",gap:6}}>
        {[0,1,2].map(i=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:JLL_RED,animation:"bounce 1.2s ease-in-out infinite",animationDelay:`${i*.2}s`}}/>)}
      </div>
      <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",fontWeight:600,letterSpacing:".06em"}}>{label}</div>
    </div>
  );
}

// ── AGENT 1: FAULT DIAGNOSIS ───────────────────────────────────────────────
function FaultDiagnosisAgent({ workflowCtx={}, onWorkflowComplete, onChainTo }) {
  const [step, setStep] = useState(0); // 0=form, 1=loading, 2=result
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [equipType, setEquipType] = useState("");
  const [symptom, setSymptom] = useState("");
  const [faultCode, setFaultCode] = useState("");
  const [refrigerant, setRefrigerant] = useState("");
  const [age, setAge] = useState("");
  const [result, setResult] = useState("");

  const EQUIP_TYPES = ["RTU","Chiller","Split System","VRF/VRV","Air Handler","FCU","Boiler","Heat Pump","Mini-Split","Cooling Tower"];

  async function runDiagnosis() {
    setStep(1);
    const prompt = `Run a complete HVAC fault diagnosis for the following equipment:

Brand: ${brand||"Unknown"}
Model: ${model||"Unknown"}
Equipment Type: ${equipType||"Unknown"}
Fault Code: ${faultCode||"None"}
Symptoms: ${symptom}
Refrigerant: ${refrigerant||"Unknown"}
Unit Age: ${age||"Unknown"}

Provide:
1. TOP 3 MOST LIKELY CAUSES (ranked by probability %, each with a brief reason)
2. IMMEDIATE CHECKS (3-5 quick things to verify first on site)
3. STEP-BY-STEP DIAGNOSTIC PROCEDURE (numbered, systematic)
4. ⚠️ SAFETY NOTES specific to this fault
5. WHEN TO ESCALATE (specific conditions that require a specialist)

Be direct and specific. This tech is in the field right now.`;

    const sys = `You are an expert HVAC fault diagnosis agent for JLL MTS. Given equipment details and symptoms, you produce a structured, ranked diagnosis with clear actionable steps. Always lead with the most likely cause. Flag safety-critical items with ⚠️. Be concise and field-ready.`;
    try {
      const r = await callAgent(sys, prompt);
      setResult(r); setStep(2);
    } catch { setResult("⚠️ Connection error. Please check your network and try again."); setStep(2); }
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="FAULT DIAGNOSIS" subtitle="JLL · AI DIAGNOSTIC AGENT"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        {step===0&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{background:`rgba(227,6,19,0.08)`,border:`1px solid rgba(227,6,19,0.2)`,borderRadius:12,padding:12,marginBottom:16,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>
              🤖 This agent runs a structured multi-step diagnosis and ranks the most likely causes by probability. Fill in as much as you know.
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>EQUIPMENT TYPE</div>
              <select value={equipType} onChange={e=>setEquipType(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:equipType?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                <option value="">Select type…</option>
                {EQUIP_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>BRAND</div>
                <select value={brand} onChange={e=>setBrand(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:brand?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Brand…</option>
                  {BRANDS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <Input label="MODEL #" value={model} onChange={setModel} placeholder="e.g. 48XC024"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <Input label="FAULT CODE" value={faultCode} onChange={setFaultCode} placeholder="e.g. E79"/>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>REFRIGERANT</div>
                <select value={refrigerant} onChange={e=>setRefrigerant(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:refrigerant?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Ref…</option>
                  {REFRIGERANTS.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <Input label="UNIT AGE (years)" value={age} onChange={setAge} placeholder="e.g. 7" type="number"/>
            <Textarea label="SYMPTOMS *" value={symptom} onChange={setSymptom} placeholder="Describe what the unit is doing / not doing. Be specific — noises, error lights, temperatures, recent events…" rows={4}/>
            <RedBtn onClick={runDiagnosis} disabled={!symptom.trim()} style={{width:"100%",padding:14,fontSize:14}}>🔍 Run Diagnosis</RedBtn>
          </div>
        )}
        {step===1 && <AgentLoading label="RUNNING DIAGNOSIS…"/>}
        {step===2 && (
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:14,padding:16,marginBottom:12,whiteSpace:"pre-wrap",fontSize:13,color:"#fff",lineHeight:1.7}}>{result}</div>
            {onChainTo && (
              <div style={{background:"rgba(227,6,19,0.07)",border:`1px solid rgba(227,6,19,0.25)`,borderRadius:12,padding:12,marginBottom:10}}>
                <div style={{fontSize:11,color:JLL_RED,fontWeight:700,marginBottom:8,letterSpacing:".08em"}}>⚡ CONTINUE WORKFLOW</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",marginBottom:10}}>Use the diagnosis above to pre-fill the next agent:</div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button onClick={()=>onChainTo("safety")} style={{background:JLL_RED,border:"none",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:11,fontWeight:700,color:"#fff"}}>🦺 Safety Briefing →</button>
                  <button onClick={()=>onChainTo("parts")} style={{background:"#222",border:`1px solid ${BORDER}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:11,fontWeight:700,color:"#fff"}}>🔩 Find Parts →</button>
                  <button onClick={()=>onChainTo("report")} style={{background:"#222",border:`1px solid ${BORDER}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:11,fontWeight:700,color:"#fff"}}>📄 Service Report →</button>
                </div>
              </div>
            )}
            <RedBtn onClick={()=>{setStep(0);setResult("");}} style={{width:"100%"}}>New Diagnosis</RedBtn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── AGENT 2: PARTS FINDER ─────────────────────────────────────────────────
function PartsFinderAgent({ workflowCtx={} }) {
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState(workflowCtx.diagBrand||"");
  const [model, setModel] = useState(workflowCtx.diagModel||"");
  const [serial, setSerial] = useState("");
  const [partType, setPartType] = useState("");
  const [partDesc, setPartDesc] = useState("");
  const [result, setResult] = useState("");

  const PART_TYPES = ["Run Capacitor","Start Capacitor","Contactor","Condenser Fan Motor","Evaporator Fan Motor","Compressor","TXV / Expansion Valve","Filter Drier","Control Board","Thermostat","Pressure Switch (High)","Pressure Switch (Low)","Gas Valve","Heat Exchanger","Reversing Valve","Crankcase Heater","Service Valve","Other"];

  async function findParts() {
    setStep(1);
    const prompt = `A JLL MTS field technician needs to find a replacement part for the following equipment:

Brand: ${brand||"Unknown"}
Model Number: ${model||"Unknown"}
Serial Number: ${serial||"Unknown"}
Failed Part Type: ${partType||"Unknown"}
Additional Description: ${partDesc||"None"}

Please provide:
1. OEM PART DETAILS — OEM part number(s), specifications (voltage, µF, HP, tonnage etc.)
2. COMPATIBLE AFTERMARKET OPTIONS — 2-3 compatible alternative part numbers with brands
3. KEY SPECIFICATIONS TO MATCH — critical specs the tech must verify before ordering
4. WHERE TO SOURCE — supplier names (Johnstone, Wesco, Ferguson, Grainger, OEM direct etc.)
5. INSTALL NOTES — any important notes specific to this part replacement
6. ⚠️ WARNINGS — things to watch out for with this specific part

If model is unknown, provide general specs for this part type and brand family.`;

    const sys = `You are an expert HVAC parts specialist agent for JLL MTS. Given equipment details and a failed component, you identify OEM and compatible replacement parts with full specifications. Provide real part numbers where possible. Be precise about electrical ratings, physical dimensions, and compatibility requirements. Flag any safety concerns.`;
    try {
      const r = await callAgent(sys, prompt);
      setResult(r); setStep(2);
    } catch { setResult("⚠️ Connection error. Please check your network and try again."); setStep(2); }
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="PARTS FINDER" subtitle="JLL · AI PARTS AGENT"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        {step===0&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{background:`rgba(227,6,19,0.08)`,border:`1px solid rgba(227,6,19,0.2)`,borderRadius:12,padding:12,marginBottom:16,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>
              🤖 Enter the equipment details and failed part. The agent will identify OEM and compatible replacement parts with full specs.
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>BRAND</div>
                <select value={brand} onChange={e=>setBrand(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:brand?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Brand…</option>
                  {BRANDS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <Input label="MODEL #" value={model} onChange={setModel} placeholder="e.g. 48XC024"/>
            </div>
            <Input label="SERIAL # (optional)" value={serial} onChange={setSerial} placeholder="e.g. 4819A12345"/>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>FAILED PART</div>
              <select value={partType} onChange={e=>setPartType(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:partType?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                <option value="">Select part type…</option>
                {PART_TYPES.map(p=><option key={p}>{p}</option>)}
              </select>
            </div>
            <Textarea label="ADDITIONAL DETAILS (optional)" value={partDesc} onChange={setPartDesc} placeholder="Any known specs — voltage, µF rating, HP, physical size, symptoms of failure…" rows={3}/>
            <RedBtn onClick={findParts} disabled={!partType} style={{width:"100%",padding:14,fontSize:14}}>🔩 Find Parts</RedBtn>
          </div>
        )}
        {step===1 && <AgentLoading label="SEARCHING PARTS…"/>}
        {step===2 && <AgentResult result={result} onReset={()=>{setStep(0);setResult("");}} resetLabel="Find Another Part"/>}
      </div>
    </div>
  );
}

// ── AGENT 3: SAFETY BRIEFING ──────────────────────────────────────────────
function SafetyBriefingAgent({ workflowCtx={} }) {
  const [step, setStep] = useState(0);
  const [jobType, setJobType] = useState("");
  const [equipType, setEquipType] = useState(workflowCtx.diagEquipType||"");
  const [brand, setBrand] = useState(workflowCtx.diagBrand||"");
  const [location, setLocation] = useState("");
  const [refrigerant, setRefrigerant] = useState(workflowCtx.diagRefrigerant||"");
  const [extras, setExtras] = useState([]);
  const [result, setResult] = useState("");

  const JOB_TYPES = ["Fault Diagnosis / Inspection","Electrical Work","Refrigerant Handling / Recovery","Compressor Replacement","Coil Cleaning","Filter / Drier Replacement","Control Board Replacement","Gas Heat Repair","Rooftop Access","Confined Space Entry","Commissioning / Startup","Preventive Maintenance"];
  const LOCATIONS = ["Rooftop","Basement / Plant Room","Roof / Elevated","Confined Space","Electrical Room","Outdoors","Indoor – Occupied Building","Indoor – Unoccupied"];
  const EXTRA_HAZARDS = ["Electrical (>50V)","Refrigerant present","Open gas/flame","Height > 6ft","Confined space","Asbestos risk","Occupied building","Working alone","Night / low light","Extreme heat (>95°F)"];

  function toggleExtra(h){ setExtras(prev=>prev.includes(h)?prev.filter(x=>x!==h):[...prev,h]); }

  async function generateBriefing() {
    setStep(1);
    const prompt = `Generate a complete pre-job safety briefing for a JLL MTS HVAC technician about to start the following work:

Job Type: ${jobType}
Equipment: ${equipType||"Not specified"} ${brand?`(${brand})`:""}
Work Location: ${location||"Not specified"}
Refrigerant: ${refrigerant||"Not specified"}
Additional Hazards Identified: ${extras.length>0?extras.join(", "):"None specified"}

Generate a complete safety briefing including:
1. ⚠️ CRITICAL SAFETY WARNINGS — job-specific risks that could cause injury or death
2. 🦺 REQUIRED PPE — specific PPE items required for THIS job (not generic)
3. 🔐 LOTO PROCEDURE — lockout/tagout steps specific to this equipment and job type
4. ☢️ REFRIGERANT SAFETY — if applicable, specific handling requirements
5. ⚡ ELECTRICAL SAFETY — specific electrical hazards and precautions
6. 🏔️ SITE-SPECIFIC HAZARDS — based on location and conditions provided
7. ✅ PRE-JOB CHECKLIST — 8-10 items to verify before starting work
8. 📞 EMERGENCY CONTACTS REMINDER — what to do if something goes wrong

This briefing should be read by the technician BEFORE starting work. Be specific, not generic.`;

    const sys = `You are an expert HVAC safety officer agent for JLL MTS. You generate thorough, task-specific pre-job safety briefings for field technicians. Your briefings are practical, specific to the job, and compliance-ready. Always cover OSHA and ASHRAE requirements. Never be generic — tailor every point to the specific job type and conditions.`;
    try {
      const r = await callAgent(sys, prompt);
      setResult(r); setStep(2);
    } catch { setResult("⚠️ Connection error. Please check your network and try again."); setStep(2); }
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="SAFETY BRIEFING" subtitle="JLL · AI SAFETY AGENT"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        {step===0&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{background:"rgba(227,6,19,0.08)",border:"1px solid rgba(227,6,19,0.2)",borderRadius:12,padding:12,marginBottom:16,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>
              🤖 Complete this before starting any job. The agent generates a task-specific safety briefing with PPE, LOTO, and site hazards.
            </div>
            {(workflowCtx.diagBrand||workflowCtx.diagEquipType)&&(
              <div style={{background:"rgba(39,174,96,0.08)",border:"1px solid rgba(39,174,96,0.25)",borderRadius:10,padding:10,marginBottom:12,fontSize:11,color:"rgba(255,255,255,0.6)"}}>
                ⚡ Pre-filled from your Fault Diagnosis: {[workflowCtx.diagBrand,workflowCtx.diagEquipType,workflowCtx.diagRefrigerant].filter(Boolean).join(" · ")}
              </div>
            )}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>JOB TYPE *</div>
              <select value={jobType} onChange={e=>setJobType(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:jobType?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                <option value="">Select job type…</option>
                {JOB_TYPES.map(j=><option key={j}>{j}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>EQUIPMENT TYPE</div>
                <select value={equipType} onChange={e=>setEquipType(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:equipType?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Type…</option>
                  {["RTU","Chiller","Split System","VRF/VRV","Air Handler","Boiler","Heat Pump","FCU"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>LOCATION</div>
                <select value={location} onChange={e=>setLocation(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:location?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Location…</option>
                  {LOCATIONS.map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>REFRIGERANT</div>
              <select value={refrigerant} onChange={e=>setRefrigerant(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:refrigerant?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                <option value="">Select if applicable…</option>
                {REFRIGERANTS.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:8}}>ADDITIONAL HAZARDS (select all that apply)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {EXTRA_HAZARDS.map(h=>(
                  <button key={h} onClick={()=>toggleExtra(h)} style={{background:extras.includes(h)?JLL_RED:"#222",border:`1px solid ${extras.includes(h)?JLL_RED:BORDER}`,borderRadius:20,padding:"5px 11px",cursor:"pointer",fontSize:11,color:"#fff",fontWeight:extras.includes(h)?700:400,transition:"all .15s"}}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <RedBtn onClick={generateBriefing} disabled={!jobType} style={{width:"100%",padding:14,fontSize:14}}>🦺 Generate Safety Briefing</RedBtn>
          </div>
        )}
        {step===1 && <AgentLoading label="GENERATING SAFETY BRIEFING…"/>}
        {step===2 && <AgentResult result={result} onReset={()=>{setStep(0);setResult("");setExtras([]);}} resetLabel="New Briefing"/>}
      </div>
    </div>
  );
}

// ── AGENT 4: SERVICE REPORT ───────────────────────────────────────────────
function ServiceReportAgent({ storage, profile={}, workflowCtx={} }) {
  const [step, setStep] = useState(0);
  const [techName, setTechName] = useState(profile?.name||"");
  const [siteAddr, setSiteAddr] = useState("");
  const [unitRef, setUnitRef] = useState(workflowCtx.diagModel||"");
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);
  const [jobNotes, setJobNotes] = useState(workflowCtx.diagSymptom?`Fault observed: ${workflowCtx.diagSymptom}`:"");
  const [partsUsed, setPartsUsed] = useState("");
  const [outcome, setOutcome] = useState("Completed");
  const [followUp, setFollowUp] = useState("");
  const [result, setResult] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [savedParts, setSavedParts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const OUTCOMES = ["Completed","Pending Parts","Requires Follow-up","Escalated to Specialist","Completed – Monitor"];

  useEffect(()=>{ loadStoredData(); },[]);
  async function loadStoredData(){
    try{
      const n=await storage.get("notes"); if(n?.value) setSavedNotes(JSON.parse(n.value));
      const p=await storage.get("parts_log"); if(p?.value) setSavedParts(JSON.parse(p.value));
    }catch{}
    setLoadingData(false);
  }

  async function generateReport() {
    setStep(1);
    const recentNotes = savedNotes.slice(0,5).map(n=>`- ${n.title}: ${n.body}`).join("\n");
    const recentParts = savedParts.slice(0,10).map(p=>`- ${p.partName} (${p.qty}x) ${p.partNum?`Part#${p.partNum}`:""} ${p.cost?`$${p.cost}`:""}`).join("\n");

    const prompt = `Generate a professional HVAC service report for JLL MTS based on the following information:

TECHNICIAN: ${techName||"Not specified"}
SITE / ADDRESS: ${siteAddr||"Not specified"}
UNIT / ASSET REFERENCE: ${unitRef||"Not specified"}
DATE OF VISIT: ${visitDate||"Not specified"}
JOB OUTCOME: ${outcome}
FOLLOW-UP REQUIRED: ${followUp||"None"}

WORK PERFORMED / NOTES:
${jobNotes||"See recent notes below"}

PARTS USED:
${partsUsed||recentParts||"None recorded"}

RECENT JOB NOTES FROM APP:
${recentNotes||"None"}

Generate a complete, professional service report including:
1. SERVICE REPORT HEADER (site, unit, tech, date, job number format)
2. FAULT DESCRIPTION — what was found on arrival
3. WORK PERFORMED — detailed account of work done
4. PARTS REPLACED — itemised list with part numbers where available
5. TEST & COMMISSIONING RESULTS — what was verified after repair
6. OUTCOME & STATUS — current status with any warnings
7. RECOMMENDATIONS — any follow-up work or monitoring required
8. TECHNICIAN SIGN-OFF SECTION

Format this as a professional report ready to send to a facilities manager or client.`;

    const sys = `You are a professional service report writer for JLL MTS HVAC operations. You generate clear, professional service reports from technician field notes. Reports must be suitable for sending to facilities managers, building owners, and JLL clients. Use professional language, clear structure, and include all relevant technical details.`;
    try {
      const r = await callAgent(sys, prompt);
      setResult(r); setStep(2);
    } catch { setResult("⚠️ Connection error. Please check your network and try again."); setStep(2); }
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="SERVICE REPORT" subtitle="JLL · AI REPORT AGENT"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        {step===0&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{background:"rgba(227,6,19,0.08)",border:"1px solid rgba(227,6,19,0.2)",borderRadius:12,padding:12,marginBottom:16,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>
              🤖 Fill in the job details. The agent pulls from your saved notes and parts log automatically to generate a professional report.
            </div>
            {!loadingData && (savedNotes.length>0||savedParts.length>0) && (
              <div style={{background:"rgba(39,174,96,0.08)",border:"1px solid rgba(39,174,96,0.25)",borderRadius:10,padding:10,marginBottom:14,fontSize:11,color:"rgba(255,255,255,0.55)"}}>
                ✅ Auto-importing {savedNotes.length} saved note{savedNotes.length!==1?"s":""} and {savedParts.length} part{savedParts.length!==1?"s":""} from your app
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <Input label="TECHNICIAN NAME" value={techName} onChange={setTechName} placeholder="Your name…"/>
              <Input label="DATE" value={visitDate} onChange={setVisitDate} type="date"/>
            </div>
            <Input label="SITE / ADDRESS" value={siteAddr} onChange={setSiteAddr} placeholder="Building name or address…"/>
            <Input label="UNIT / ASSET REF" value={unitRef} onChange={setUnitRef} placeholder="Unit ID, model, floor…"/>
            <Textarea label="WORK PERFORMED *" value={jobNotes} onChange={setJobNotes} placeholder="Describe the fault found, work done, tests performed. The more detail, the better the report." rows={4}/>
            <Textarea label="PARTS USED (optional — leave blank to auto-import)" value={partsUsed} onChange={setPartsUsed} placeholder="e.g. Run Capacitor 45/5µF 440V, Contactor 40A…" rows={2}/>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>JOB OUTCOME</div>
              <select value={outcome} onChange={e=>setOutcome(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:"#fff",fontSize:13,outline:"none"}}>
                {OUTCOMES.map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <Input label="FOLLOW-UP REQUIRED" value={followUp} onChange={setFollowUp} placeholder="Any outstanding work or monitoring needed…"/>
            <RedBtn onClick={generateReport} disabled={!jobNotes.trim()} style={{width:"100%",padding:14,fontSize:14}}>📄 Generate Service Report</RedBtn>
          </div>
        )}
        {step===1 && <AgentLoading label="GENERATING REPORT…"/>}
        {step===2 && <AgentResult result={result} onReset={()=>{setStep(0);setResult("");}} resetLabel="Generate New Report"/>}
      </div>
    </div>
  );
}

// ── AGENT 5: REFRIGERANT CALCULATOR ──────────────────────────────────────
function RefrigerantCalcAgent() {
  const [step, setStep] = useState(0);
  const [ref, setRef] = useState("");
  const [equipType, setEquipType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [tons, setTons] = useState("");
  const [suctionPressure, setSuctionPressure] = useState("");
  const [dischargePressure, setDischargePressure] = useState("");
  const [suctionTemp, setSuctionTemp] = useState("");
  const [liquidTemp, setLiquidTemp] = useState("");
  const [ambientTemp, setAmbientTemp] = useState("");
  const [result, setResult] = useState("");

  async function calculate() {
    setStep(1);
    const prompt = `A JLL MTS HVAC technician needs refrigerant charging calculations for the following system:

Refrigerant Type: ${ref}
Equipment Type: ${equipType||"Not specified"}
Brand/Model: ${brand||"Unknown"} ${model||""}
System Capacity: ${tons||"Unknown"} tons
Suction Pressure: ${suctionPressure||"Unknown"} psig
Discharge Pressure: ${dischargePressure||"Unknown"} psig
Suction Line Temperature: ${suctionTemp||"Unknown"} °F
Liquid Line Temperature: ${liquidTemp||"Unknown"} °F
Ambient Temperature: ${ambientTemp||"Unknown"} °F

Please provide:
1. SATURATION TEMPERATURES — suction and discharge sat temps from pressures provided
2. SUPERHEAT CALCULATION — actual superheat, target superheat range, and assessment (low/correct/high)
3. SUBCOOLING CALCULATION — actual subcooling, target subcooling range, and assessment
4. CHARGE ASSESSMENT — is the system undercharged, overcharged, or correctly charged? Why?
5. RECOMMENDED ACTION — exactly what to do (add refrigerant / recover refrigerant / check other causes)
6. ESTIMATED CHARGE WEIGHT — approximate oz/lbs to add or remove if applicable
7. ⚠️ IMPORTANT CHECKS — other causes to rule out before adjusting charge (TXV, airflow, etc.)
8. EPA 608 REMINDER — any regulatory notes for this refrigerant

Show all calculations clearly so the tech can verify them.`;

    const sys = `You are an expert HVAC refrigerant charging agent for JLL MTS. You perform precise superheat, subcooling, and charge calculations. Show your working clearly. Always state whether the system is undercharged, overcharged, or correct, and explain why. Flag when symptoms might indicate something other than a charge issue. Include EPA 608 compliance reminders for refrigerant handling.`;
    try {
      const r = await callAgent(sys, prompt);
      setResult(r); setStep(2);
    } catch { setResult("⚠️ Connection error. Please try again."); setStep(2); }
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="REFRIGERANT CALC" subtitle="JLL · CHARGING AGENT"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        {step===0&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{background:"rgba(227,6,19,0.08)",border:"1px solid rgba(227,6,19,0.2)",borderRadius:12,padding:12,marginBottom:14,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>
              🧊 Enter system pressures and temps. The agent calculates superheat, subcooling, and tells you exactly what to do with the charge.
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>REFRIGERANT TYPE *</div>
              <select value={ref} onChange={e=>setRef(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:ref?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                <option value="">Select refrigerant…</option>
                {REFRIGERANTS.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>EQUIPMENT TYPE</div>
                <select value={equipType} onChange={e=>setEquipType(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:equipType?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Type…</option>
                  {["RTU","Split System","Chiller","VRF/VRV","Heat Pump","Mini-Split"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <Input label="CAPACITY (tons)" value={tons} onChange={setTons} placeholder="e.g. 5" type="number"/>
            </div>
            <div style={{background:"#222",borderRadius:10,padding:12,marginBottom:12}}>
              <div style={{fontSize:11,color:JLL_RED,fontWeight:700,marginBottom:10,letterSpacing:".06em"}}>PRESSURE READINGS</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <Input label="SUCTION (psig)" value={suctionPressure} onChange={setSuctionPressure} placeholder="e.g. 130" type="number"/>
                <Input label="DISCHARGE (psig)" value={dischargePressure} onChange={setDischargePressure} placeholder="e.g. 380" type="number"/>
              </div>
            </div>
            <div style={{background:"#222",borderRadius:10,padding:12,marginBottom:12}}>
              <div style={{fontSize:11,color:JLL_RED,fontWeight:700,marginBottom:10,letterSpacing:".06em"}}>TEMPERATURE READINGS (°F)</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <Input label="SUCTION LINE" value={suctionTemp} onChange={setSuctionTemp} placeholder="e.g. 55" type="number"/>
                <Input label="LIQUID LINE" value={liquidTemp} onChange={setLiquidTemp} placeholder="e.g. 90" type="number"/>
              </div>
              <Input label="AMBIENT (outdoor)" value={ambientTemp} onChange={setAmbientTemp} placeholder="e.g. 95" type="number"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>BRAND</div>
                <select value={brand} onChange={e=>setBrand(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:brand?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Brand…</option>
                  {BRANDS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <Input label="MODEL #" value={model} onChange={setModel} placeholder="Optional"/>
            </div>
            <RedBtn onClick={calculate} disabled={!ref||(!suctionPressure&&!suctionTemp)} style={{width:"100%",padding:14,fontSize:14}}>🧊 Calculate Charge</RedBtn>
          </div>
        )}
        {step===1 && <AgentLoading label="CALCULATING REFRIGERANT CHARGE…"/>}
        {step===2 && <AgentResult result={result} onReset={()=>{setStep(0);setResult("");}} resetLabel="New Calculation"/>}
      </div>
    </div>
  );
}

// ── AGENT 6: COMMISSIONING ────────────────────────────────────────────────
function CommissioningAgent() {
  const [step, setStep] = useState(0);
  const [equipType, setEquipType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [ref, setRef] = useState("");
  const [tons, setTons] = useState("");
  const [scenario, setScenario] = useState("");
  const [extras, setExtras] = useState([]);
  const [result, setResult] = useState("");

  const SCENARIOS = ["New equipment installation","Compressor replacement","Full refrigerant recharge after repair","Post-winter startup","Post-summer shutdown restart","Controls/board replacement","VRF/VRV system commissioning"];
  const EXTRAS = ["Has economizer","Has VFD/variable speed","Heat pump reversing","Gas heat section","BMS/BAS integration","First startup ever","Occupied building"];

  function toggleExtra(h){ setExtras(prev=>prev.includes(h)?prev.filter(x=>x!==h):[...prev,h]); }

  async function generate() {
    setStep(1);
    const prompt = `Generate a complete commissioning and startup checklist for a JLL MTS technician:

Equipment Type: ${equipType}
Brand: ${brand||"Unknown"} | Model: ${model||"Unknown"}
Refrigerant: ${ref||"Unknown"}
Capacity: ${tons||"Unknown"} tons
Commissioning Scenario: ${scenario}
Additional Features: ${extras.length>0?extras.join(", "):"Standard"}

Generate a complete startup and commissioning procedure including:
1. ✅ PRE-STARTUP CHECKS (mechanical, electrical, refrigerant)
2. ⚡ ELECTRICAL VERIFICATION (voltages, amperages, phases, wiring checks)
3. 🔧 MECHANICAL INSPECTION (belt tensions, bearing lubrication, blade clearances)
4. ❄️ REFRIGERANT SYSTEM CHECKS (pressures, charge verification, leak check)
5. 🚀 STARTUP SEQUENCE (exact step-by-step power-on procedure)
6. 📊 PERFORMANCE VERIFICATION (what readings to take and acceptable ranges)
7. 🎛️ CONTROLS COMMISSIONING (thermostat/BMS setup, setpoints, scheduling)
8. 📋 DOCUMENTATION REQUIRED (what to record and sign off)
9. ⚠️ COMMON STARTUP ISSUES (what to watch for and how to respond)
10. ✅ SIGN-OFF CRITERIA (what must pass before handing over to client)

Be specific to the equipment type and scenario. Include actual target values where possible.`;

    const sys = `You are an expert HVAC commissioning agent for JLL MTS. You generate comprehensive, step-by-step startup and commissioning procedures tailored to specific equipment types and scenarios. Include actual target measurements, acceptable ranges, and clear pass/fail criteria. Flag anything that must be documented for warranty or compliance purposes.`;
    try {
      const r = await callAgent(sys, prompt);
      setResult(r); setStep(2);
    } catch { setResult("⚠️ Connection error. Please try again."); setStep(2); }
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="COMMISSIONING" subtitle="JLL · STARTUP AGENT"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        {step===0&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{background:"rgba(227,6,19,0.08)",border:"1px solid rgba(227,6,19,0.2)",borderRadius:12,padding:12,marginBottom:14,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>
              🚀 Generates a full startup and commissioning checklist tailored to your equipment and scenario — with target values and sign-off criteria.
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>EQUIPMENT TYPE *</div>
              <select value={equipType} onChange={e=>setEquipType(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:equipType?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                <option value="">Select type…</option>
                {["RTU","Chiller","Split System","VRF/VRV","Air Handler","FCU","Boiler","Heat Pump","Mini-Split","Cooling Tower"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>COMMISSIONING SCENARIO *</div>
              <select value={scenario} onChange={e=>setScenario(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:scenario?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                <option value="">Select scenario…</option>
                {SCENARIOS.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>BRAND</div>
                <select value={brand} onChange={e=>setBrand(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:brand?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Brand…</option>
                  {BRANDS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <Input label="MODEL #" value={model} onChange={setModel} placeholder="Optional"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>REFRIGERANT</div>
                <select value={ref} onChange={e=>setRef(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:ref?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Select…</option>
                  {REFRIGERANTS.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <Input label="CAPACITY (tons)" value={tons} onChange={setTons} placeholder="e.g. 10" type="number"/>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:8}}>ADDITIONAL FEATURES</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {EXTRAS.map(h=>(
                  <button key={h} onClick={()=>toggleExtra(h)} style={{background:extras.includes(h)?JLL_RED:"#222",border:`1px solid ${extras.includes(h)?JLL_RED:BORDER}`,borderRadius:20,padding:"5px 11px",cursor:"pointer",fontSize:11,color:"#fff",fontWeight:extras.includes(h)?700:400,transition:"all .15s"}}>
                    {h}
                  </button>
                ))}
              </div>
            </div>
            <RedBtn onClick={generate} disabled={!equipType||!scenario} style={{width:"100%",padding:14,fontSize:14}}>🚀 Generate Commissioning Checklist</RedBtn>
          </div>
        )}
        {step===1 && <AgentLoading label="GENERATING COMMISSIONING CHECKLIST…"/>}
        {step===2 && <AgentResult result={result} onReset={()=>{setStep(0);setResult("");setExtras([]);}} resetLabel="New Checklist"/>}
      </div>
    </div>
  );
}

// ── AGENT 7: ESCALATION ───────────────────────────────────────────────────
function EscalationAgent() {
  const [step, setStep] = useState(0);
  const [equipType, setEquipType] = useState("");
  const [brand, setBrand] = useState("");
  const [faultCode, setFaultCode] = useState("");
  const [situation, setSituation] = useState("");
  const [alreadyTried, setAlreadyTried] = useState("");
  const [techExp, setTechExp] = useState("");
  const [urgency, setUrgency] = useState("");
  const [result, setResult] = useState("");

  const URGENCY = ["Critical — building uninhabitable","High — essential systems down","Medium — partial loss of service","Low — minor issue, building functional"];
  const EXPERIENCE = ["Less than 2 years","2-5 years","5-10 years","10+ years"];

  async function assess() {
    setStep(1);
    const prompt = `A JLL MTS field technician needs an escalation assessment for the following situation:

Equipment: ${equipType||"Not specified"} — ${brand||"Unknown brand"}
Fault Code: ${faultCode||"None"}
Situation Description: ${situation}
What Has Already Been Tried: ${alreadyTried||"Nothing yet"}
Technician Experience Level: ${techExp||"Not specified"}
Urgency Level: ${urgency||"Not specified"}

Provide a complete escalation assessment:
1. 🚦 ESCALATION DECISION — Should this be escalated? (Yes / No / Maybe with conditions). State clearly.
2. 📊 REASONING — Why escalate or not? What factors drove this decision?
3. 👤 WHO TO ESCALATE TO — If yes: Senior Tech / Specialist / OEM / Structural Engineer / Emergency Services / JLL Management?
4. ⏰ ESCALATION URGENCY — Escalate now / Within 2 hours / End of shift / Next business day?
5. 📋 BEFORE ESCALATING — What should the tech do right now while waiting for backup?
6. 📞 INFORMATION TO HAVE READY — What details will the specialist need when they arrive?
7. 🔒 SITE SECURITY — Should the equipment be isolated/shut down while waiting?
8. 📝 DOCUMENTATION — What must be logged before escalating for liability and warranty purposes?
9. 💡 ALTERNATIVE — Is there anything else the tech could try first that might resolve it without escalation?

Be decisive. This tech needs a clear answer, not ambiguity.`;

    const sys = `You are an expert HVAC escalation assessment agent for JLL MTS. You make clear, decisive escalation recommendations based on the situation, equipment type, and technician experience. You always state your decision clearly (escalate / don't escalate / conditional). You prioritize safety and client impact. You give practical guidance on who to contact and how to prepare for handover.`;
    try {
      const r = await callAgent(sys, prompt);
      setResult(r); setStep(2);
    } catch { setResult("⚠️ Connection error. Please try again."); setStep(2); }
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="ESCALATION" subtitle="JLL · ESCALATION AGENT"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        {step===0&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{background:"rgba(227,6,19,0.08)",border:"1px solid rgba(227,6,19,0.2)",borderRadius:12,padding:12,marginBottom:14,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>
              ⚠️ Not sure if you need backup? Describe the situation and this agent gives you a clear escalation decision — who to call, when, and what to do in the meantime.
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>URGENCY *</div>
              <select value={urgency} onChange={e=>setUrgency(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:urgency?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                <option value="">Select urgency…</option>
                {URGENCY.map(u=><option key={u}>{u}</option>)}
              </select>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>EQUIPMENT TYPE</div>
                <select value={equipType} onChange={e=>setEquipType(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:equipType?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Type…</option>
                  {["RTU","Chiller","Split System","VRF/VRV","Air Handler","Boiler","Heat Pump","Other"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>BRAND</div>
                <select value={brand} onChange={e=>setBrand(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:brand?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Brand…</option>
                  {BRANDS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <Input label="FAULT CODE" value={faultCode} onChange={setFaultCode} placeholder="e.g. E79"/>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>YOUR EXPERIENCE</div>
                <select value={techExp} onChange={e=>setTechExp(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:techExp?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Select…</option>
                  {EXPERIENCE.map(e=><option key={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <Textarea label="DESCRIBE THE SITUATION *" value={situation} onChange={setSituation} placeholder="What is happening? What did you find? What is the impact on the building/client?" rows={4}/>
            <Textarea label="WHAT HAVE YOU ALREADY TRIED?" value={alreadyTried} onChange={setAlreadyTried} placeholder="Steps already taken, checks already done…" rows={2}/>
            <RedBtn onClick={assess} disabled={!situation.trim()||!urgency} style={{width:"100%",padding:14,fontSize:14}}>⚠️ Get Escalation Decision</RedBtn>
          </div>
        )}
        {step===1 && <AgentLoading label="ASSESSING ESCALATION…"/>}
        {step===2 && <AgentResult result={result} onReset={()=>{setStep(0);setResult("");}} resetLabel="New Assessment"/>}
      </div>
    </div>
  );
}

// ── AGENT 8: PREDICTIVE MAINTENANCE ──────────────────────────────────────
function PredictiveMaintenanceAgent({ storage }) {
  const [step, setStep] = useState(0);
  const [equipType, setEquipType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [age, setAge] = useState("");
  const [ref, setRef] = useState("");
  const [lastService, setLastService] = useState("");
  const [runHours, setRunHours] = useState("");
  const [knownIssues, setKnownIssues] = useState("");
  const [observations, setObservations] = useState([]);
  const [result, setResult] = useState("");
  const [serviceHistory, setServiceHistory] = useState([]);

  const OBSERVATIONS = ["Unusual noise","Higher than normal running amps","Frequent cycling","Reduced airflow","Ice formation","Oil stains","Vibration","Increased energy use","Longer run times","Delayed startup","Refrigerant loss history","Water leaks"];

  useEffect(()=>{ loadHistory(); },[]);
  async function loadHistory(){ try{ const r=await storage.get("service_history"); if(r?.value) setServiceHistory(JSON.parse(r.value)); }catch{} }

  function toggleObs(o){ setObservations(prev=>prev.includes(o)?prev.filter(x=>x!==o):[...prev,o]); }

  async function predict() {
    setStep(1);
    const historyText = serviceHistory.slice(0,5).map(h=>`- ${h.date||"Unknown date"}: ${h.work} (${h.outcome})`).join("\n");

    const prompt = `Perform a predictive maintenance analysis for a JLL MTS HVAC system:

Equipment: ${equipType||"Unknown"} — ${brand||"Unknown"} ${model||""}
Age: ${age||"Unknown"} years
Refrigerant: ${ref||"Unknown"}
Last Full Service: ${lastService||"Unknown"}
Estimated Run Hours: ${runHours||"Unknown"}
Current Observations: ${observations.length>0?observations.join(", "):"None reported"}
Known Issues: ${knownIssues||"None"}

Service History from App:
${historyText||"No history recorded"}

Provide a complete predictive maintenance analysis:
1. 🔴 IMMEDIATE RISK ITEMS — components likely to fail within 30 days (with reasoning)
2. 🟡 SHORT-TERM RISKS — components likely to fail within 3 months
3. 🟢 SCHEDULE SOON — maintenance due within 6 months
4. 📊 COMPONENT HEALTH ASSESSMENT — rate key components (Compressor, Capacitors, Contactors, Coils, Motors, Controls, Refrigerant circuit)
5. 🔮 PREDICTED FAILURE MODES — what is most likely to fail first and why
6. 🛠️ RECOMMENDED MAINTENANCE ACTIONS — ranked by priority with estimated frequency
7. 💰 RISK TO MARGIN — impact on JLL MTS operations if failures are not addressed
8. 📋 RECOMMENDED PM SCHEDULE — what to check and when over the next 12 months

Base predictions on equipment age, service history, observations, and known failure patterns for this equipment type and brand.`;

    const sys = `You are an expert HVAC predictive maintenance agent for JLL MTS. You analyze equipment data, service history, and field observations to predict component failures before they occur. You prioritize by risk level (immediate/short-term/scheduled). You quantify the operational and financial risk of inaction. Your recommendations are specific, actionable, and tied to JLL MTS's goal of first-time-right execution and margin protection.`;
    try {
      const r = await callAgent(sys, prompt);
      setResult(r); setStep(2);
    } catch { setResult("⚠️ Connection error. Please try again."); setStep(2); }
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="PREDICTIVE MAINT." subtitle="JLL · FAILURE PREDICTION AGENT"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        {step===0&&(
          <div style={{animation:"fadeUp .3s ease"}}>
            <div style={{background:"rgba(227,6,19,0.08)",border:"1px solid rgba(227,6,19,0.2)",borderRadius:12,padding:12,marginBottom:14,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>
              📈 Analyses equipment age, service history, and observations to predict what will fail next — before it happens. Auto-imports your service history.
            </div>
            {serviceHistory.length>0&&(
              <div style={{background:"rgba(39,174,96,0.08)",border:"1px solid rgba(39,174,96,0.25)",borderRadius:10,padding:10,marginBottom:12,fontSize:11,color:"rgba(255,255,255,0.55)"}}>
                ✅ Auto-importing {serviceHistory.length} service record{serviceHistory.length!==1?"s":""} from your history log
              </div>
            )}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>EQUIPMENT TYPE *</div>
                <select value={equipType} onChange={e=>setEquipType(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:equipType?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Type…</option>
                  {["RTU","Chiller","Split System","VRF/VRV","Air Handler","Boiler","Heat Pump","Cooling Tower","FCU"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>BRAND</div>
                <select value={brand} onChange={e=>setBrand(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:brand?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Brand…</option>
                  {BRANDS.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <Input label="MODEL #" value={model} onChange={setModel} placeholder="Optional"/>
              <Input label="UNIT AGE (years)" value={age} onChange={setAge} placeholder="e.g. 12" type="number"/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>REFRIGERANT</div>
                <select value={ref} onChange={e=>setRef(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:ref?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                  <option value="">Select…</option>
                  {REFRIGERANTS.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <Input label="EST. RUN HOURS" value={runHours} onChange={setRunHours} placeholder="e.g. 35000" type="number"/>
            </div>
            <Input label="LAST FULL SERVICE DATE" value={lastService} onChange={setLastService} type="date"/>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:8}}>CURRENT OBSERVATIONS (select all that apply)</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                {OBSERVATIONS.map(o=>(
                  <button key={o} onClick={()=>toggleObs(o)} style={{background:observations.includes(o)?JLL_RED:"#222",border:`1px solid ${observations.includes(o)?JLL_RED:BORDER}`,borderRadius:20,padding:"5px 11px",cursor:"pointer",fontSize:11,color:"#fff",fontWeight:observations.includes(o)?700:400,transition:"all .15s"}}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <Textarea label="KNOWN ISSUES / HISTORY" value={knownIssues} onChange={setKnownIssues} placeholder="Any recurring problems, past repairs, or concerns about this unit…" rows={3}/>
            <RedBtn onClick={predict} disabled={!equipType} style={{width:"100%",padding:14,fontSize:14}}>📈 Predict Failures</RedBtn>
          </div>
        )}
        {step===1 && <AgentLoading label="ANALYSING EQUIPMENT HEALTH…"/>}
        {step===2 && <AgentResult result={result} onReset={()=>{setStep(0);setResult("");setObservations([]);}} resetLabel="New Analysis"/>}
      </div>
    </div>
  );
}

// ── AGENTS HUB SCREEN ─────────────────────────────────────────────────────
function AgentsHubScreen({ onSelect }) {
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="AI AGENTS" subtitle="JLL · 8 SPECIALIST AGENTS"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        <div style={{background:"rgba(227,6,19,0.07)",border:"1px solid rgba(227,6,19,0.2)",borderRadius:12,padding:12,marginBottom:14,fontSize:12,color:"rgba(255,255,255,0.55)",lineHeight:1.6}}>
          8 specialist AI agents — each one handles a specific task end-to-end and delivers a complete structured output.
        </div>
        <SectionTitle>DIAGNOSTIC AGENTS</SectionTitle>
        <AgentCard icon="🔍" title="Fault Diagnosis Agent" desc="Structured diagnosis — ranks most likely causes by probability with full procedure and escalation triggers." onClick={()=>onSelect("diag")}/>
        <AgentCard icon="⚠️" title="Escalation Agent" desc="Not sure if you need backup? Get a clear escalation decision — who to call, when, and what to do in the meantime." color="#E67E22" onClick={()=>onSelect("escalate")}/>
        <AgentCard icon="📈" title="Predictive Maintenance Agent" desc="Predicts what will fail next based on equipment age, runtime, service history and observations." color="#9B59B6" onClick={()=>onSelect("predict")}/>
        <SectionTitle style={{marginTop:4}}>TECHNICAL AGENTS</SectionTitle>
        <AgentCard icon="🔩" title="Parts Finder Agent" desc="Enter model and failed component — returns OEM + compatible part numbers with full specs and suppliers." onClick={()=>onSelect("parts")}/>
        <AgentCard icon="🧊" title="Refrigerant Calculator Agent" desc="Enter pressures and temps — calculates superheat, subcooling, and tells you exactly what to do with the charge." color="#2980B9" onClick={()=>onSelect("refcalc")}/>
        <AgentCard icon="🚀" title="Commissioning Agent" desc="Full startup checklist for new or replaced equipment — with target values, pass/fail criteria, and sign-off." color="#16A085" onClick={()=>onSelect("commission")}/>
        <SectionTitle style={{marginTop:4}}>DOCUMENTATION AGENTS</SectionTitle>
        <AgentCard icon="🦺" title="Safety Briefing Agent" desc="Pre-job safety briefing — task-specific PPE, LOTO procedure, and hazard checklist before you start." color="#F39C12" onClick={()=>onSelect("safety")}/>
        <AgentCard icon="📄" title="Service Report Agent" desc="End-of-job professional report — auto-imports notes and parts log. Ready to send to a client." color="#27AE60" onClick={()=>onSelect("report")}/>
      </div>
    </div>
  );
}

// ── DOCUMENT LIBRARY SCREEN ───────────────────────────────────────────────
const SAMPLE_DOCS = [
  { id:"sample_1", name:"Carrier 48/50XC Series Service Manual", brand:"Carrier", type:"Service Manual", equipType:"RTU", tags:["RTU","fault codes","refrigerant","electrical"], size:"2.4 MB", sampleContent:"Carrier 48/50XC Commercial Packaged Units. R-410A refrigerant. Cooling capacity 3-12.5 tons. Fault code E79: High pressure lockout — check refrigerant charge, condenser coil, fan motor. E31: Low pressure fault — check refrigerant charge, filter, TXV. Electrical: 208/230V, 460V, 575V three-phase. Compressor locked rotor amp: 156A (3T), 208A (5T). Startup checklist: verify supply voltage ±10%, check all wiring connections, confirm refrigerant charge via subcooling method (10-15°F target subcooling at 95°F ambient).", addedAt: Date.now()-86400000*5 },
  { id:"sample_2", name:"Trane YCD/YCH Fault Code Reference", brand:"Trane", type:"Fault Code Library", equipType:"RTU", tags:["RTU","fault codes","Trane","diagnostics"], size:"890 KB", sampleContent:"Trane YCD/YCH Fault Codes. Code 1: High pressure cutout — inspect condenser coil for blockage, check fan blade rotation, verify refrigerant charge. Code 2: Low pressure cutout — check suction pressure, inspect TXV bulb, check filter drier restriction. Code 4: Compressor over-temperature — check discharge temp sensor, verify oil level, inspect compressor terminals. Code 6: High discharge temp — check condenser airflow, refrigerant charge, TXV operation. Code 10: Loss of charge — check for refrigerant leaks, repair and recharge per nameplate specifications.", addedAt: Date.now()-86400000*3 },
  { id:"sample_3", name:"Daikin VRV IV Commissioning Guide", brand:"Daikin", type:"Commissioning", equipType:"VRF/VRV", tags:["VRF","VRV","commissioning","startup","Daikin"], size:"3.1 MB", sampleContent:"Daikin VRV IV Commissioning Procedure. Pre-startup: verify all refrigerant piping connections, check nitrogen pressure test (minimum 4 hours at 300 psig), verify electrical connections and voltage. Startup sequence: power on outdoor unit 12 hours before commissioning to energize crankcase heaters. Initial startup: set to test run mode using BRC1H52/BRC1H62 controller. Check operating pressures: suction 100-180 psig, discharge 350-450 psig at standard conditions. Required documentation: complete commissioning report, refrigerant charge log, operating parameters at 30/60/90 minutes.", addedAt: Date.now()-86400000*2 },
  { id:"sample_4", name:"R-410A Refrigerant Safety & Handling SOP", brand:"General", type:"JLL SOP", equipType:"All", tags:["R-410A","safety","refrigerant","EPA 608","LOTO","PPE"], size:"445 KB", sampleContent:"JLL MTS Standard Operating Procedure: R-410A Refrigerant Handling. PPE Required: safety glasses, gloves (cryogenic rated), long sleeves. EPA 608 certification required for all handling. Recovery required before any system opening — use certified recovery equipment. Cylinder handling: never heat cylinders, store upright, secure to prevent falling. Leak detection: electronic detector preferred, soap bubbles acceptable for confirmation. Disposal: recovered refrigerant must go to certified reclamation facility. Maximum allowable leak rate per EPA Section 608: 10% for commercial refrigeration, 15% for comfort cooling over 50 lbs.", addedAt: Date.now()-86400000*1 },
  { id:"sample_5", name:"Low Voltage Control Wiring Reference Guide", brand:"General", type:"Wiring Reference", equipType:"All", tags:["controls","low voltage","wiring","thermostat","24V","troubleshooting"], size:"1.2 MB", sampleContent:"Low Voltage Control Circuit Reference (24VAC). Standard terminal designations: R = 24V power from transformer, C = common return, Y = cooling call, W = heating call, G = fan call, O = reversing valve energize cool (heat pump), B = reversing valve energize heat. Troubleshooting sequence: 1) Check transformer output 24-28VAC R to C. 2) Check fuse on control board. 3) Verify R to C voltage at thermostat. 4) Check for shorts to ground on all control wires. 5) Verify sequence: R to G = fan, R to Y = compressor, R to W = heat. Common faults: shorted Y wire to ground causes compressor lockout, open C wire causes intermittent operation, failed transformer shows 0VAC R to C.", addedAt: Date.now() },
];

function DocumentLibraryScreen({ storage }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("library"); // library | upload | read | ask
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [uploading, setUploading] = useState(false);
  // Upload form
  const [upName, setUpName] = useState("");
  const [upBrand, setUpBrand] = useState("");
  const [upType, setUpType] = useState("");
  const [upEquip, setUpEquip] = useState("");
  const [upTags, setUpTags] = useState("");
  const [upContent, setUpContent] = useState("");
  const fileRef = useRef(null);

  const DOC_TYPES = ["Service Manual","Fault Code Library","Wiring Reference","Commissioning","JLL SOP","Refrigerant Specs","Safety Data Sheet","Other"];
  const EQUIP_TYPES_DOC = ["RTU","Chiller","Split System","VRF/VRV","Air Handler","Boiler","Heat Pump","FCU","All"];

  useEffect(()=>{ loadDocs(); },[]);
  async function loadDocs(){
    try{
      const r = await storage.get("doc_library");
      const saved = r?.value ? JSON.parse(r.value) : [];
      setDocs([...SAMPLE_DOCS, ...saved]);
    } catch { setDocs(SAMPLE_DOCS); }
    setLoading(false);
  }
  async function saveDocs(updated){
    const userDocs = updated.filter(d=>!SAMPLE_DOCS.find(s=>s.id===d.id));
    try{ await storage.set("doc_library", JSON.stringify(userDocs)); } catch{}
  }

  async function handleFileUpload(e){
    const file = e.target.files[0]; if(!file) return;
    setUploading(true);
    let content = "";
    if(file.type==="application/pdf"){
      content = `[PDF Document: ${file.name}] — AI will answer questions about this document based on its name and any context you provide below.`;
    } else if(file.type.startsWith("text/")||file.name.endsWith(".txt")){
      content = await file.text();
    }
    setUpName(prev=>prev||file.name.replace(/\.[^.]+$/,""));
    setUpContent(prev=>prev||content);
    setUploading(false);
  }

  async function saveUpload(){
    if(!upName.trim()) return;
    const doc = {
      id: genId(), name: upName, brand: upBrand||"Unknown", type: upType||"Other",
      equipType: upEquip||"All", tags: upTags.split(",").map(t=>t.trim()).filter(Boolean),
      size: "Uploaded", sampleContent: upContent, addedAt: Date.now(), userUploaded: true,
    };
    const updated = [doc, ...docs];
    setDocs(updated); await saveDocs(updated);
    setUpName(""); setUpBrand(""); setUpType(""); setUpEquip(""); setUpTags(""); setUpContent("");
    if(fileRef.current) fileRef.current.value="";
    setView("library");
  }

  async function deleteDoc(id){
    const updated = docs.filter(d=>d.id!==id);
    setDocs(updated); await saveDocs(updated);
  }

  async function askDoc(doc, q){
    if(!q.trim()) return;
    setAsking(true); setAnswer("");
    const sys = `You are an expert HVAC technical documentation assistant for JLL MTS. You answer questions about specific HVAC documents. Be precise, cite specific values and procedures from the document. If the document doesn't contain the answer, say so clearly and provide general guidance.`;
    const prompt = `Document: "${doc.name}" (${doc.type} — ${doc.brand} ${doc.equipType})

Document content/excerpt:
${doc.sampleContent}

Technician question: ${q}

Answer the question as specifically as possible using information from this document. Include specific values, fault codes, procedures, or specifications where available.`;
    try{
      const r = await callAgent(sys, prompt);
      setAnswer(r);
    } catch { setAnswer("⚠️ Connection error. Please try again."); }
    setAsking(false);
  }

  const allTypes = [...new Set(docs.map(d=>d.type))];
  const allBrands = [...new Set(docs.map(d=>d.brand))];
  const filtered = docs.filter(d=>{
    const matchSearch = !search || [d.name,d.brand,d.type,...(d.tags||[])].join(" ").toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || d.type===filterType;
    const matchBrand = !filterBrand || d.brand===filterBrand;
    return matchSearch && matchType && matchBrand;
  });

  const typeColors = {"Service Manual":JLL_RED,"Fault Code Library":"#E67E22","Commissioning":"#16A085","JLL SOP":"#2980B9","Wiring Reference":"#8E44AD","Refrigerant Specs":"#27AE60","Safety Data Sheet":"#F39C12","Other":"#555"};

  // ── DOC READER + AI Q&A ──
  if(view==="read"&&selectedDoc){
    return (
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:BLACK,borderBottom:`3px solid ${JLL_RED}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <button onClick={()=>{setView("library");setAnswer("");setQuestion("");}} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"#fff",fontSize:15}}>←</button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{selectedDoc.name}</div>
            <div style={{fontSize:10,color:JLL_RED,fontWeight:600}}>{selectedDoc.brand} · {selectedDoc.type}</div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:14}}>
          {/* Tags */}
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
            {(selectedDoc.tags||[]).map(tag=>(
              <span key={tag} style={{background:"rgba(227,6,19,0.12)",border:`1px solid rgba(227,6,19,0.25)`,borderRadius:20,padding:"3px 10px",fontSize:10,color:JLL_RED,fontWeight:600}}>{tag}</span>
            ))}
          </div>
          {/* Content preview */}
          <div style={{background:CARD,border:`1px solid ${BORDER}`,borderRadius:12,padding:14,marginBottom:14}}>
            <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",fontWeight:600,letterSpacing:".08em",marginBottom:8}}>DOCUMENT CONTENT</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.7,whiteSpace:"pre-wrap"}}>{selectedDoc.sampleContent}</div>
          </div>
          {/* AI Q&A */}
          <div style={{background:CARD,border:`1px solid rgba(227,6,19,0.3)`,borderRadius:12,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
              <div style={{width:32,height:32,background:JLL_RED,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>Ask AI About This Document</div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)"}}>Ask any question — the AI answers from this document specifically</div>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              <input value={question} onChange={e=>setQuestion(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();askDoc(selectedDoc,question);}}}
                placeholder="e.g. What is fault code E79? What PPE is required?"
                style={{flex:1,background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:"#fff",fontSize:13,outline:"none"}}/>
              <button onClick={()=>askDoc(selectedDoc,question)} disabled={!question.trim()||asking}
                style={{background:JLL_RED,border:"none",borderRadius:10,padding:"10px 16px",cursor:"pointer",color:"#fff",fontWeight:700,fontSize:13,flexShrink:0,opacity:(!question.trim()||asking)?0.4:1}}>
                {asking?"…":"Ask"}
              </button>
            </div>
            {/* Quick questions */}
            <div style={{marginBottom:12}}>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginBottom:6,fontWeight:600}}>QUICK QUESTIONS</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {["What are the fault codes?","What PPE is required?","What are the startup steps?","What are the refrigerant specs?","What are the electrical specs?"].map(q=>(
                  <button key={q} onClick={()=>{setQuestion(q);askDoc(selectedDoc,q);}}
                    style={{background:"#222",border:`1px solid ${BORDER}`,borderRadius:20,padding:"5px 10px",cursor:"pointer",fontSize:10,color:"rgba(255,255,255,0.7)",transition:"all .15s"}}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
            {asking && (
              <div style={{display:"flex",gap:5,alignItems:"center",padding:"12px 0"}}>
                {[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:JLL_RED,animation:"bounce 1.2s ease-in-out infinite",animationDelay:`${i*.2}s`}}/>)}
                <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginLeft:6}}>Reading document…</span>
              </div>
            )}
            {answer && (
              <div style={{background:"rgba(227,6,19,0.06)",border:`1px solid rgba(227,6,19,0.2)`,borderRadius:10,padding:12,marginTop:8,fontSize:12,color:"#fff",lineHeight:1.7,whiteSpace:"pre-wrap"}}>
                {answer}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── UPLOAD FORM ──
  if(view==="upload"){
    return (
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:BLACK,borderBottom:`3px solid ${JLL_RED}`,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
          <button onClick={()=>setView("library")} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"5px 10px",cursor:"pointer",color:"#fff",fontSize:15}}>←</button>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:17,color:"#fff"}}>ADD DOCUMENT</div>
            <div style={{fontSize:10,color:JLL_RED,fontWeight:600,letterSpacing:".1em"}}>DOCUMENT LIBRARY</div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:14}}>
          <div style={{background:"rgba(227,6,19,0.07)",border:`1px solid rgba(227,6,19,0.2)`,borderRadius:12,padding:12,marginBottom:14,fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6}}>
            Upload a PDF, text file, or paste content directly. The AI will be able to answer questions about this document.
          </div>
          {/* File upload */}
          <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileUpload} style={{display:"none"}} id="doc-input"/>
          <label htmlFor="doc-input" style={{display:"flex",alignItems:"center",gap:12,background:"#222",border:`2px dashed rgba(227,6,19,0.3)`,borderRadius:12,padding:"14px 16px",cursor:"pointer",marginBottom:14,transition:"border-color .2s"}}>
            <span style={{fontSize:28}}>{uploading?"⏳":"📄"}</span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:2}}>{uploading?"Processing…":"Upload PDF or text file"}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>Tap to select from device</div>
            </div>
          </label>
          <Input label="DOCUMENT NAME *" value={upName} onChange={setUpName} placeholder="e.g. Carrier 48XC Service Manual"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>BRAND</div>
              <select value={upBrand} onChange={e=>setUpBrand(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:upBrand?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                <option value="">Brand…</option>
                {BRANDS.map(b=><option key={b}>{b}</option>)}
                <option>General</option>
              </select>
            </div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>DOCUMENT TYPE</div>
              <select value={upType} onChange={e=>setUpType(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:upType?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
                <option value="">Type…</option>
                {DOC_TYPES.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>EQUIPMENT TYPE</div>
            <select value={upEquip} onChange={e=>setUpEquip(e.target.value)} style={{width:"100%",background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:upEquip?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
              <option value="">Select…</option>
              {EQUIP_TYPES_DOC.map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <Input label="TAGS (comma separated)" value={upTags} onChange={setUpTags} placeholder="e.g. fault codes, RTU, startup, R-410A"/>
          <Textarea label="DOCUMENT CONTENT / KEY SECTIONS" value={upContent} onChange={setUpContent} placeholder="Paste key sections, fault codes, specs, procedures. The more content, the better the AI can answer questions." rows={6}/>
          <RedBtn onClick={saveUpload} disabled={!upName.trim()} style={{width:"100%",padding:14,fontSize:14}}>📥 Add to Library</RedBtn>
        </div>
      </div>
    );
  }

  // ── LIBRARY VIEW ──
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Header title="DOCUMENT LIBRARY" subtitle="JLL · MANUALS & DOCUMENTATION"/>
      <div style={{flex:1,overflowY:"auto",padding:14}}>
        {/* Search & filters */}
        <div style={{marginBottom:12}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍  Search manuals, fault codes, SOPs…"
            style={{width:"100%",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:"#fff",fontSize:13,outline:"none",marginBottom:8}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"8px 10px",color:filterType?"#fff":"rgba(255,255,255,0.35)",fontSize:12,outline:"none"}}>
              <option value="">All types</option>
              {allTypes.map(t=><option key={t}>{t}</option>)}
            </select>
            <select value={filterBrand} onChange={e=>setFilterBrand(e.target.value)} style={{background:"#222",border:`1px solid ${BORDER}`,borderRadius:10,padding:"8px 10px",color:filterBrand?"#fff":"rgba(255,255,255,0.35)",fontSize:12,outline:"none"}}>
              <option value="">All brands</option>
              {allBrands.map(b=><option key={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[{label:`${filtered.length} Documents`,icon:"📚"},{label:`${allBrands.length} Brands`,icon:"🏭"},{label:`${allTypes.length} Types`,icon:"📂"}].map(s=>(
            <div key={s.label} style={{flex:1,background:CARD,border:`1px solid rgba(227,6,19,0.12)`,borderRadius:8,padding:"7px 8px",textAlign:"center"}}>
              <div style={{fontSize:16}}>{s.icon}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.4)",fontWeight:600,marginTop:2}}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add document button */}
        <button onClick={()=>setView("upload")} className="card-hover" style={{width:"100%",background:"rgba(227,6,19,0.07)",border:`2px dashed rgba(227,6,19,0.3)`,borderRadius:12,padding:"13px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,marginBottom:14,transition:"all .2s"}}>
          <div style={{width:36,height:36,background:JLL_RED,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>+</div>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>Upload Document</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.4)"}}>PDF, text, or paste content — AI indexes it instantly</div>
          </div>
        </button>

        {/* Sample docs label */}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
          <SectionTitle>{filtered.length} DOCUMENTS</SectionTitle>
          {filtered.some(d=>!d.userUploaded)&&<span style={{fontSize:9,background:"rgba(39,174,96,0.15)",color:"#27AE60",borderRadius:10,padding:"2px 8px",fontWeight:700}}>INCLUDES SAMPLE DOCS</span>}
        </div>

        {loading ? (
          <div style={{textAlign:"center",color:"rgba(255,255,255,0.3)",padding:40}}>Loading…</div>
        ) : filtered.length===0 ? (
          <div style={{textAlign:"center",padding:"40px 20px",color:"rgba(255,255,255,0.3)",fontSize:13}}>No documents match your search</div>
        ) : (
          filtered.map(doc=>(
            <div key={doc.id} style={{background:CARD,border:`1px solid rgba(227,6,19,0.12)`,borderRadius:12,padding:12,marginBottom:10,animation:"fadeUp .3s ease"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:40,height:40,borderRadius:9,background:typeColors[doc.type]||"#555",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                  {{"Service Manual":"📖","Fault Code Library":"⚠️","Commissioning":"🚀","JLL SOP":"🏢","Wiring Reference":"⚡","Refrigerant Specs":"❄️","Safety Data Sheet":"🦺","Other":"📄"}[doc.type]||"📄"}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:3,lineHeight:1.3}}>{doc.name}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginBottom:6}}>
                    <span style={{fontSize:10,background:`rgba(227,6,19,0.15)`,color:JLL_RED,borderRadius:5,padding:"2px 7px",fontWeight:700}}>{doc.type}</span>
                    <span style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:600}}>{doc.brand}</span>
                    {doc.equipType&&doc.equipType!=="All"&&<span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{doc.equipType}</span>}
                    {doc.userUploaded&&<span style={{fontSize:9,background:"rgba(39,174,96,0.15)",color:"#27AE60",borderRadius:10,padding:"1px 6px",fontWeight:700}}>UPLOADED</span>}
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:8}}>
                    {(doc.tags||[]).slice(0,4).map(tag=>(
                      <span key={tag} style={{fontSize:9,background:"rgba(255,255,255,0.06)",color:"rgba(255,255,255,0.45)",borderRadius:10,padding:"2px 7px"}}>{tag}</span>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{setSelectedDoc(doc);setView("read");setAnswer("");setQuestion("");}}
                      style={{flex:1,background:JLL_RED,border:"none",borderRadius:8,padding:"8px",cursor:"pointer",fontSize:11,fontWeight:700,color:"#fff",transition:"all .2s"}}>
                      📖 Open & Ask AI
                    </button>
                    {doc.userUploaded&&(
                      <button onClick={()=>deleteDoc(doc.id)} className="del-btn"
                        style={{background:"rgba(227,6,19,0.1)",border:"none",borderRadius:8,padding:"8px 12px",cursor:"pointer",fontSize:11,color:JLL_RED,fontWeight:600,transition:"background .2s"}}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
        <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",textAlign:"center",marginTop:8,lineHeight:1.6,paddingBottom:8}}>
          Sample documents included for demonstration. Upload your own OEM manuals, wiring diagrams, and JLL SOPs.
        </div>
      </div>
    </div>
  );
}
function OnboardingScreen({ onComplete }) {
  const [name, setName] = useState("");
  const [techId, setTechId] = useState("");
  const [region, setRegion] = useState("");
  const [specialty, setSpecialty] = useState([]);
  const REGIONS = ["AMER – North","AMER – South","AMER – East","AMER – West","APAC","EMEA"];
  const SPECIALTIES = ["Commercial HVAC","Chillers","VRF/VRV Systems","Controls/BMS","Refrigeration","Gas Heating","Electrical"];
  function toggle(s){ setSpecialty(prev=>prev.includes(s)?prev.filter(x=>x!==s):[...prev,s]); }
  function submit(){
    if(!name.trim()) return;
    onComplete({ name: name.trim(), techId: techId.trim(), region, specialty, joinedAt: Date.now() });
  }
  return (
    <div style={{height:"100vh",background:BLACK,display:"flex",flexDirection:"column",fontFamily:"'Barlow',sans-serif",maxWidth:480,margin:"0 auto"}}>
      <style>{CSS}</style>
      <div style={{background:JLL_RED,padding:"40px 24px 28px",flexShrink:0}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",fontWeight:600,letterSpacing:".15em",marginBottom:8}}>JLL MTS</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:36,color:"#fff",lineHeight:1,marginBottom:6}}>MTS ASSISTANT</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.8)"}}>AI Field Assistant · HVAC Operations</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:20}}>
        <div style={{marginBottom:20}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:800,color:"#fff",marginBottom:6}}>Welcome. Let's set you up.</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>This takes 30 seconds. Your profile personalises the app and appears on service reports.</div>
        </div>
        <Input label="YOUR NAME *" value={name} onChange={setName} placeholder="e.g. Marcus Johnson"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <Input label="TECH ID (optional)" value={techId} onChange={setTechId} placeholder="e.g. MTS-4421"/>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:4}}>REGION</div>
            <select value={region} onChange={e=>setRegion(e.target.value)} style={{width:"100%",background:CARD,border:`1px solid ${BORDER}`,borderRadius:10,padding:"10px 12px",color:region?"#fff":"rgba(255,255,255,0.35)",fontSize:13,outline:"none"}}>
              <option value="">Region…</option>
              {REGIONS.map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600,marginBottom:8}}>SPECIALTIES (optional)</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {SPECIALTIES.map(s=>(
              <button key={s} onClick={()=>toggle(s)} style={{background:specialty.includes(s)?JLL_RED:CARD,border:`1px solid ${specialty.includes(s)?JLL_RED:BORDER}`,borderRadius:20,padding:"6px 12px",cursor:"pointer",fontSize:11,color:"#fff",fontWeight:specialty.includes(s)?700:400,transition:"all .15s"}}>{s}</button>
            ))}
          </div>
        </div>
        <RedBtn onClick={submit} disabled={!name.trim()} style={{width:"100%",padding:16,fontSize:15}}>Get Started →</RedBtn>
        <div style={{textAlign:"center",fontSize:10,color:"rgba(255,255,255,0.2)",marginTop:14,lineHeight:1.6}}>Your data stays on your device. JLL MTS Authorized Technicians Only.</div>
      </div>
    </div>
  );
}

// ── DASHBOARD SCREEN ───────────────────────────────────────────────────────
function DashboardScreen({ profile, stats, onNav, onStartJob, recentChats, onOpenChat }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const QUICK_AGENTS = [
    { id:"diag",     icon:"🔍", label:"Diagnose Fault",    color:JLL_RED  },
    { id:"safety",   icon:"🦺", label:"Safety Briefing",   color:"#F39C12"},
    { id:"refcalc",  icon:"🧊", label:"Refrigerant Calc",  color:"#2980B9"},
    { id:"report",   icon:"📄", label:"Service Report",    color:"#27AE60"},
  ];
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* Hero Header */}
      <div style={{background:`linear-gradient(135deg, ${BLACK} 0%, #1a0000 100%)`,borderBottom:`3px solid ${JLL_RED}`,padding:"16px 16px 14px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:600,letterSpacing:".1em"}}>{greeting},</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:22,color:"#fff",lineHeight:1.1}}>{profile.name.toUpperCase()}</div>
            {(profile.techId||profile.region)&&<div style={{fontSize:10,color:JLL_RED,fontWeight:600,marginTop:2}}>{[profile.techId,profile.region].filter(Boolean).join(" · ")}</div>}
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{width:46,height:46,borderRadius:12,background:JLL_RED,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🔧</div>
          </div>
        </div>
        {/* Stats row */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6}}>
          {[
            {label:"Jobs",value:stats.chats},
            {label:"Parts",value:stats.parts},
            {label:"Notes",value:stats.notes},
            {label:"Docs",value:stats.docs||5},
          ].map(s=>(
            <div key={s.label} style={{background:"rgba(255,255,255,0.05)",borderRadius:8,padding:"7px 6px",textAlign:"center",border:`1px solid rgba(227,6,19,0.15)`}}>
              <div style={{fontSize:18,fontWeight:800,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif"}}>{s.value}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,0.35)",fontWeight:600,letterSpacing:".06em"}}>{s.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:14}}>
        {/* Start new job */}
        <button onClick={onStartJob} className="red-btn" style={{width:"100%",background:JLL_RED,border:"none",borderRadius:14,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,boxShadow:"0 4px 20px rgba(227,6,19,0.35)",transition:"all .2s"}}>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:15,fontWeight:800,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:".04em"}}>+ START NEW JOB</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:1}}>Open AI chat for a new job</div>
          </div>
          <span style={{fontSize:24}}>💬</span>
        </button>

        {/* Quick agent launch */}
        <SectionTitle>QUICK LAUNCH AGENTS</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          {QUICK_AGENTS.map(a=>(
            <button key={a.id} onClick={()=>onNav("agents",a.id)} style={{background:CARD,border:`1px solid rgba(227,6,19,0.15)`,borderRadius:12,padding:"13px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all .2s",textAlign:"left"}} className="card-hover">
              <div style={{width:36,height:36,borderRadius:9,background:a.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{a.icon}</div>
              <div style={{fontSize:12,fontWeight:700,color:"#fff",lineHeight:1.3}}>{a.label}</div>
            </button>
          ))}
        </div>

        {/* Connected workflow callout */}
        <div style={{background:`linear-gradient(135deg,rgba(227,6,19,0.12),rgba(227,6,19,0.05))`,border:`1px solid rgba(227,6,19,0.3)`,borderRadius:14,padding:14,marginBottom:16}}>
          <div style={{fontSize:11,color:JLL_RED,fontWeight:700,letterSpacing:".08em",marginBottom:6}}>⚡ CONNECTED WORKFLOW</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6,marginBottom:10}}>Run a Fault Diagnosis → it pre-fills your Safety Briefing → which pre-fills your Service Report. One job, three agents, zero re-entry.</div>
          <button onClick={()=>onNav("agents","diag")} style={{background:JLL_RED,border:"none",borderRadius:8,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700,color:"#fff"}}>Start Workflow →</button>
        </div>

        {/* Recent jobs */}
        {recentChats.length>0&&(
          <>
            <SectionTitle>RECENT JOBS</SectionTitle>
            {recentChats.slice(0,3).map(c=>{
              const last=c.messages[c.messages.length-1];
              return (
                <div key={c.id} className="card-hover" onClick={()=>onOpenChat(c.id)} style={{background:CARD,border:`1px solid rgba(227,6,19,0.12)`,borderRadius:12,padding:"11px 12px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all .2s"}}>
                  <div style={{width:34,height:34,background:JLL_RED,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🔧</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#fff",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{c.title}</div>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{last?(last.content.length>45?last.content.slice(0,45)+"…":last.content):"No messages"}</div>
                  </div>
                  <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",flexShrink:0}}>{timeAgo(c.updatedAt)}</div>
                </div>
              );
            })}
          </>
        )}

        {/* Tools grid */}
        <SectionTitle style={{marginTop:4}}>ALL TOOLS</SectionTitle>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:6}}>
          {[
            {tab:"docs",icon:"📚",label:"Docs"},
            {tab:"model",icon:"🔍",label:"Models"},
            {tab:"pt",icon:"🌡️",label:"PT Chart"},
            {tab:"notes",icon:"📝",label:"Notes"},
            {tab:"equip",icon:"🏭",label:"Equipment"},
            {tab:"parts",icon:"🔩",label:"Parts Log"},
            {tab:"photos",icon:"📷",label:"Photos"},
            {tab:"history",icon:"📋",label:"History"},
            {tab:"agents",icon:"🤖",label:"All Agents"},
          ].map(t=>(
            <button key={t.tab} onClick={()=>onNav(t.tab)} style={{background:CARD,border:`1px solid rgba(227,6,19,0.12)`,borderRadius:10,padding:"11px 6px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all .2s"}} className="card-hover">
              <span style={{fontSize:20}}>{t.icon}</span>
              <span style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.6)"}}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────────────────
const TABS = [
  { id:"home",    icon:"🏠", label:"Home"    },
  { id:"chat",    icon:"💬", label:"Chat"    },
  { id:"agents",  icon:"🤖", label:"Agents"  },
  { id:"docs",    icon:"📚", label:"Docs"    },
  { id:"model",   icon:"🔍", label:"Models"  },
  { id:"pt",      icon:"🌡️", label:"PT Chart"},
  { id:"notes",   icon:"📝", label:"Notes"   },
  { id:"equip",   icon:"🏭", label:"Equip"   },
  { id:"parts",   icon:"🔩", label:"Parts"   },
  { id:"photos",  icon:"📷", label:"Photos"  },
  { id:"history", icon:"📋", label:"History" },
];

function MTSAssistant() {
  const [tab, setTab] = useState("home");
  const [chatView, setChatView] = useState("list");
  const [agentView, setAgentView] = useState("hub");
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [stats, setStats] = useState({chats:0,parts:0,notes:0,history:0});
  // Connected workflow context — agents share this
  const [workflowCtx, setWorkflowCtx] = useState({});

  useEffect(()=>{ init(); },[]);
  async function init(){
    try{
      // Load profile
      const p=await window.storage.get("profile");
      if(p?.value) setProfile(JSON.parse(p.value));
      // Load chats
      const r=await window.storage.list("chat:");
      const keys=r?.keys||[];
      const loaded=[];
      for(const k of keys){ try{ const rv=await window.storage.get(k); if(rv?.value) loaded.push(JSON.parse(rv.value)); }catch{} }
      loaded.sort((a,b)=>b.updatedAt-a.updatedAt);
      setChats(loaded);
      // Load stats
      const [partsR,notesR,histR]=await Promise.allSettled([
        window.storage.get("parts_log"),
        window.storage.get("notes"),
        window.storage.get("service_history"),
      ]);
      setStats({
        chats:loaded.length,
        parts:partsR.status==="fulfilled"&&partsR.value?.value?JSON.parse(partsR.value.value).length:0,
        notes:notesR.status==="fulfilled"&&notesR.value?.value?JSON.parse(notesR.value.value).length:0,
        history:histR.status==="fulfilled"&&histR.value?.value?JSON.parse(histR.value.value).length:0,
      });
    }catch{}
    setStorageReady(true);
    setProfileLoading(false);
  }

  async function saveProfile(p){
    setProfile(p);
    try{ await window.storage.set("profile",JSON.stringify(p)); }catch{}
  }
  async function saveChat(chat){ try{ await window.storage.set("chat:"+chat.id,JSON.stringify(chat)); }catch{} }

  async function createChat(){
    const chat={id:genId(),title:"New Job",messages:[],updatedAt:Date.now()};
    setChats(prev=>[chat,...prev]);
    setStats(s=>({...s,chats:s.chats+1}));
    setActiveChatId(chat.id);
    setChatView("chat");
    setTab("chat");
    await saveChat(chat);
  }
  async function deleteChat(id){
    setDeletingId(id);
    try{ await window.storage.delete("chat:"+id); }catch{}
    setChats(prev=>prev.filter(c=>c.id!==id));
    setStats(s=>({...s,chats:Math.max(0,s.chats-1)}));
    if(activeChatId===id){ setActiveChatId(null); setChatView("list"); }
    setDeletingId(null);
  }

  const activeChat = chats.find(c=>c.id===activeChatId);

  async function sendMessage(text){
    if(!text||loading||!activeChatId) return;
    const newMsg={role:"user",content:text};
    const msgs=[...(activeChat?.messages||[]),newMsg];
    let title=activeChat?.title||"New Job";
    if((activeChat?.messages||[]).length===0) title=text.length>40?text.slice(0,40)+"…":text;
    const updated={...activeChat,title,messages:msgs,updatedAt:Date.now()};
    setChats(prev=>prev.map(c=>c.id===activeChatId?updated:c));
    setLoading(true);
    await saveChat(updated);
    try{
      const sysWithProfile = SYSTEM_PROMPT + (profile?`\n\nTechnician: ${profile.name}${profile.techId?` (ID: ${profile.techId})`:""}${profile.region?`, Region: ${profile.region}`:""}${profile.specialty?.length?`, Specialties: ${profile.specialty.join(", ")}`:""}`:``);
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":"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","anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sysWithProfile,messages:msgs.map(m=>({role:m.role,content:m.content}))})});
      const data=await res.json();
      const reply=data.content?.find(b=>b.type==="text")?.text||"Sorry, couldn't generate a response.";
      const withReply={...updated,messages:[...msgs,{role:"assistant",content:reply}],updatedAt:Date.now()};
      setChats(prev=>prev.map(c=>c.id===activeChatId?withReply:c).sort((a,b)=>b.updatedAt-a.updatedAt));
      await saveChat(withReply);
    }catch{
      const err={...updated,messages:[...msgs,{role:"assistant",content:"⚠️ Connection error. Check your network and try again."}],updatedAt:Date.now()};
      setChats(prev=>prev.map(c=>c.id===activeChatId?err:c));
      await saveChat(err);
    }finally{ setLoading(false); }
  }

  function navTo(targetTab, agentId=null){
    setTab(targetTab);
    if(targetTab==="chat") setChatView("list");
    if(targetTab==="agents"){ setAgentView(agentId||"hub"); }
  }

  const storage = window.storage;

  // Show loading until profile check done
  if(profileLoading){
    return (
      <div style={{height:"100vh",background:BLACK,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow',sans-serif"}}>
        <style>{CSS}</style>
        <div style={{textAlign:"center"}}>
          <div style={{width:56,height:56,background:JLL_RED,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 14px"}}>🔧</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.3)"}}>Loading MTS Assistant…</div>
        </div>
      </div>
    );
  }

  // Show onboarding if no profile
  if(!profile){
    return <OnboardingScreen onComplete={saveProfile}/>;
  }

  return (
    <div style={{height:"100vh",background:BG,display:"flex",flexDirection:"column",fontFamily:"'Barlow',sans-serif",maxWidth:480,margin:"0 auto",position:"relative"}}>
      <style>{CSS}</style>

      {/* MAIN CONTENT */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {tab==="home" && storageReady &&
          <DashboardScreen
            profile={profile}
            stats={stats}
            recentChats={chats.slice(0,3)}
            onStartJob={createChat}
            onNav={navTo}
            onOpenChat={id=>{setActiveChatId(id);setChatView("chat");setTab("chat");}}
          />}
        {tab==="chat" && chatView==="list" && storageReady &&
          <ChatListScreen chats={chats} onOpen={id=>{setActiveChatId(id);setChatView("chat");}} onCreate={createChat} onDelete={deleteChat} deletingId={deletingId}/>}
        {tab==="chat" && chatView==="list" && !storageReady &&
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,0.3)",fontSize:14}}>Loading…</div>}
        {tab==="chat" && chatView==="chat" &&
          <ChatScreen chat={activeChat} onBack={()=>setChatView("list")} onSend={sendMessage} loading={loading}/>}

        {tab==="agents" && agentView==="hub"        && <AgentsHubScreen onSelect={v=>setAgentView(v)}/>}
        {tab==="agents" && agentView==="diag"       && <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}><button onClick={()=>setAgentView("hub")} style={{background:BLACK,border:"none",borderBottom:`1px solid ${BORDER}`,padding:"8px 14px",cursor:"pointer",color:JLL_RED,fontSize:12,fontWeight:700,textAlign:"left",flexShrink:0}}>← Back to Agents</button><FaultDiagnosisAgent workflowCtx={workflowCtx} onWorkflowComplete={ctx=>setWorkflowCtx(prev=>({...prev,...ctx}))} onChainTo={id=>setAgentView(id)}/></div>}
        {tab==="agents" && agentView==="escalate"   && <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}><button onClick={()=>setAgentView("hub")} style={{background:BLACK,border:"none",borderBottom:`1px solid ${BORDER}`,padding:"8px 14px",cursor:"pointer",color:JLL_RED,fontSize:12,fontWeight:700,textAlign:"left",flexShrink:0}}>← Back to Agents</button><EscalationAgent/></div>}
        {tab==="agents" && agentView==="predict"    && <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}><button onClick={()=>setAgentView("hub")} style={{background:BLACK,border:"none",borderBottom:`1px solid ${BORDER}`,padding:"8px 14px",cursor:"pointer",color:JLL_RED,fontSize:12,fontWeight:700,textAlign:"left",flexShrink:0}}>← Back to Agents</button><PredictiveMaintenanceAgent storage={storage}/></div>}
        {tab==="agents" && agentView==="parts"      && <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}><button onClick={()=>setAgentView("hub")} style={{background:BLACK,border:"none",borderBottom:`1px solid ${BORDER}`,padding:"8px 14px",cursor:"pointer",color:JLL_RED,fontSize:12,fontWeight:700,textAlign:"left",flexShrink:0}}>← Back to Agents</button><PartsFinderAgent workflowCtx={workflowCtx}/></div>}
        {tab==="agents" && agentView==="refcalc"    && <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}><button onClick={()=>setAgentView("hub")} style={{background:BLACK,border:"none",borderBottom:`1px solid ${BORDER}`,padding:"8px 14px",cursor:"pointer",color:JLL_RED,fontSize:12,fontWeight:700,textAlign:"left",flexShrink:0}}>← Back to Agents</button><RefrigerantCalcAgent/></div>}
        {tab==="agents" && agentView==="commission" && <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}><button onClick={()=>setAgentView("hub")} style={{background:BLACK,border:"none",borderBottom:`1px solid ${BORDER}`,padding:"8px 14px",cursor:"pointer",color:JLL_RED,fontSize:12,fontWeight:700,textAlign:"left",flexShrink:0}}>← Back to Agents</button><CommissioningAgent workflowCtx={workflowCtx}/></div>}
        {tab==="agents" && agentView==="safety"     && <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}><button onClick={()=>setAgentView("hub")} style={{background:BLACK,border:"none",borderBottom:`1px solid ${BORDER}`,padding:"8px 14px",cursor:"pointer",color:JLL_RED,fontSize:12,fontWeight:700,textAlign:"left",flexShrink:0}}>← Back to Agents</button><SafetyBriefingAgent workflowCtx={workflowCtx}/></div>}
        {tab==="agents" && agentView==="report"     && <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}><button onClick={()=>setAgentView("hub")} style={{background:BLACK,border:"none",borderBottom:`1px solid ${BORDER}`,padding:"8px 14px",cursor:"pointer",color:JLL_RED,fontSize:12,fontWeight:700,textAlign:"left",flexShrink:0}}>← Back to Agents</button><ServiceReportAgent storage={storage} profile={profile} workflowCtx={workflowCtx}/></div>}

        {tab==="docs"     && <DocumentLibraryScreen storage={storage}/>}
        {tab==="model"   && <ModelLookupScreen storage={storage}/>}
        {tab==="pt"      && <PTChartScreen/>}
        {tab==="notes"   && <NotesScreen storage={storage}/>}
        {tab==="equip"   && <EquipmentScreen storage={storage}/>}
        {tab==="parts"   && <PartsLogScreen storage={storage}/>}
        {tab==="photos"  && <PhotoScreen storage={storage}/>}
        {tab==="history" && <ServiceHistoryScreen storage={storage}/>}
      </div>

      {/* BOTTOM TAB BAR */}
      <BottomTab tabs={TABS} active={tab} onSelect={id=>{setTab(id);if(id==="chat")setChatView("list");if(id==="agents")setAgentView("hub");}}/>
    </div>
  );
}




// Make available globally for browser
window.MTSAssistant = MTSAssistant;
