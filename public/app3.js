// React hooks already destructured in app1.js, so we can use them directly

// Minimal global toast for surfacing errors (e.g. storage save failures)
// without prop-drilling through every component that persists data.
const _toastListeners = [];
function showToast(message) {
  _toastListeners.forEach(fn => fn(message));
}
function Toast() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    let hideTimer;
    const handler = m => {
      clearTimeout(hideTimer);
      setMsg(m);
      hideTimer = setTimeout(() => setMsg(null), 4000);
    };
    _toastListeners.push(handler);
    return () => {
      clearTimeout(hideTimer);
      const i = _toastListeners.indexOf(handler);
      if (i >= 0) _toastListeners.splice(i, 1);
    };
  }, []);
  if (!msg) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      bottom: 74,
      left: "50%",
      transform: "translateX(-50%)",
      background: "#b00010",
      color: "#fff",
      padding: "10px 16px",
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 600,
      zIndex: 99999,
      maxWidth: "90%",
      textAlign: "center",
      boxShadow: "0 4px 20px rgba(0,0,0,.4)"
    }
  }, msg);
}
// Wraps S.set with error handling so a full/blocked localStorage surfaces a
// toast instead of silently discarding data the UI already shows as saved.
async function safeSave(key, value) {
  try {
    await S.set(key, value);
    return true;
  } catch (e) {
    showToast("⚠️ Couldn't save — storage may be full. Free up space and try again.");
    return false;
  }
}

function Docs() {
  const [view, setView] = useState("list");
  const [doc, setDoc] = useState(null);
  const [q, setQ] = useState("");
  const [ans, setAns] = useState("");
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = DOCS.filter(d => !search || [d.name, d.brand, d.type, ...d.tags].join(" ").toLowerCase().includes(search.toLowerCase()));
  async function askDoc() {
    if (!q.trim()) return;
    setBusy(true);
    setAns("");
    const r = await ai("You are an HVAC technical documentation expert. Answer precisely from the document provided.", `Document: "${doc.name}"\nContent: ${doc.content}\n\nQuestion: ${q}`);
    setAns(r);
    setBusy(false);
  }
  if (view === "read" && doc) return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: DARK,
      borderBottom: `3px solid ${RED}`,
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setView("list");
      setAns("");
      setQ("");
    },
    style: {
      background: GREY1,
      border: "none",
      borderRadius: 8,
      padding: "6px 12px",
      color: TXT,
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\u2190"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: TXT,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, doc.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: RED,
      fontWeight: 600
    }
  }, doc.brand, " \xB7 ", doc.type)), /*#__PURE__*/React.createElement("button", {
    onClick: () => _nav.go && _nav.go("home"),
    style: {
      background: GREY1,
      border: "none",
      borderRadius: 8,
      padding: "6px 12px",
      color: TXT,
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\uD83C\uDFE0")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 12
    }
  }, doc.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      background: "rgba(227,6,19,.12)",
      border: `1px solid rgba(227,6,19,.25)`,
      borderRadius: 20,
      padding: "3px 10px",
      fontSize: 10,
      color: RED,
      fontWeight: 600
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 8,
      background: "rgba(230,126,34,.1)",
      border: "1px solid rgba(230,126,34,.35)",
      borderRadius: 10,
      padding: "8px 10px",
      fontSize: 11,
      color: "#E67E22",
      lineHeight: 1.5,
      marginBottom: 12
    }
  }, "\u26a0\ufe0f", /*#__PURE__*/React.createElement("span", null, "Reference material built into the app \u2014 not a live or verified manufacturer source. Confirm fault codes, ratings, and procedures against the OEM's official documentation before acting.")), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 14
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: GTXT2,
        fontWeight: 700,
        marginBottom: 8
      }
    }, "CONTENT"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: GTXT1,
        lineHeight: 1.7
      }
    }, doc.content))
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      border: `1px solid rgba(227,6,19,.3)`
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        background: RED,
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16
      }
    }, "\uD83E\uDD16"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: TXT
      }
    }, "Ask AI About This Document"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: GTXT2
      }
    }, "AI answers from this document specifically"))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: GTXT2,
        marginBottom: 6,
        fontWeight: 600
      }
    }, "QUICK QUESTIONS"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }
    }, ["What are the fault codes?", "What PPE is required?", "Startup steps?", "Electrical specs?"].map(qk => /*#__PURE__*/React.createElement("button", {
      key: qk,
      onClick: () => {
        setQ(qk);
      },
      style: {
        background: GREY1,
        border: `1px solid ${GREY2}`,
        borderRadius: 20,
        padding: "5px 10px",
        cursor: "pointer",
        fontSize: 10,
        color: GTXT1
      }
    }, qk)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("input", {
      value: q,
      onChange: e => setQ(e.target.value),
      onKeyDown: e => {
        if (e.key === "Enter") askDoc();
      },
      placeholder: "Ask a question\u2026",
      style: {
        flex: 1,
        background: GREY1,
        border: `1px solid ${GREY2}`,
        borderRadius: 10,
        padding: "10px 12px",
        color: TXT,
        fontSize: 13,
        outline: "none"
      }
    }), /*#__PURE__*/React.createElement("button", {
      onClick: askDoc,
      disabled: !q.trim() || busy,
      style: {
        background: RED,
        border: "none",
        borderRadius: 10,
        padding: "0 16px",
        cursor: "pointer",
        color: TXT,
        fontWeight: 700,
        fontSize: 13,
        opacity: !q.trim() || busy ? .4 : 1
      }
    }, busy ? "…" : "Ask")), busy && /*#__PURE__*/React.createElement(Spin, {
      label: "Reading\u2026"
    }), ans && /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(227,6,19,.06)",
        border: `1px solid rgba(227,6,19,.2)`,
        borderRadius: 10,
        padding: 12,
        marginTop: 10,
        fontSize: 13,
        color: TXT,
        lineHeight: 1.7,
        whiteSpace: "pre-wrap"
      }
    }, ans))
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: "DOCUMENT LIBRARY",
    sub: "MANUALS \xB7 FAULT CODES \xB7 SOPs",
    onHome: () => _nav.go && _nav.go("home")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: search,
    onChange: e => setSearch(e.target.value),
    placeholder: "\uD83D\uDD0D Search\u2026",
    style: {
      width: "100%",
      background: GREY1,
      border: `1px solid ${GREY2}`,
      borderRadius: 10,
      padding: "10px 12px",
      color: TXT,
      fontSize: 13,
      outline: "none",
      marginBottom: 12,
      fontFamily: "inherit"
    }
  }), filtered.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.id,
    onClick: () => {
      setDoc(d);
      setView("read");
    },
    style: {
      width: "100%",
      background: CARD,
      border: `1px solid ${GREY2}`,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      cursor: "pointer",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: TXT,
      marginBottom: 5
    }
  }, d.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: RED,
      borderRadius: 5,
      padding: "2px 8px",
      fontSize: 10,
      color: TXT,
      fontWeight: 700
    }
  }, d.type), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: GTXT2,
      fontWeight: 600
    }
  }, d.brand), d.tags.slice(0, 3).map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: {
      fontSize: 9,
      background: GREY1,
      color: GTXT2,
      borderRadius: 10,
      padding: "2px 7px"
    }
  }, t)))))));
}

// ── DEMO MODE ─────────────────────────────────────────────────────────────
const DEMO_STEPS = [
  {
    id: "intro",
    title: "Welcome to FieldPro",
    subtitle: "FieldPro HVAC AI Field Tool",
    desc: "An AI expert in every engineer's pocket. Let's walk through a real job scenario.",
    icon: "🔧",
    duration: 3000,
  },
  {
    id: "problem",
    title: "The Problem",
    subtitle: "What techs face every day",
    desc: "A Carrier RTU showing fault code E79. High pressure lockout. Unit is down. Building is hot. What do you do?",
    icon: "⚠️",
    duration: 4000,
  },
  {
    id: "diagnosis",
    title: "Step 1 — Fault Diagnosis",
    subtitle: "AI DIAGNOSTIC AGENT",
    desc: "Enter the fault code, equipment, and symptoms. The AI ranks probable causes by likelihood and gives a step-by-step procedure.",
    icon: "🔍",
    duration: 3500,
    demo: {
      type: "agent",
      fields: [
        { label: "Equipment", value: "RTU — Carrier 48XC060" },
        { label: "Fault Code", value: "E79" },
        { label: "Refrigerant", value: "R-410A" },
        { label: "Symptoms", value: "High pressure lockout. Condenser fan running. Unit off on high pressure." },
      ],
      result: `TOP CAUSES — E79 HIGH PRESSURE LOCKOUT

1. 🔴 Dirty/blocked condenser coil (65%) — Check coil for debris, cottonwood, dirt buildup. Measure discharge pressure — target <430 psig at 95°F ambient.

2. 🟡 Condenser fan motor fault (20%) — Verify fan RPM, check amp draw vs nameplate (1.0–2.5A). Check capacitor µF within ±6%.

3. 🟢 Refrigerant overcharge (10%) — Check subcooling. Target 10–15°F. If >18°F, recover excess charge.

IMMEDIATE CHECKS
⚠️ Verify supply voltage within ±10% before starting
• Check discharge pressure with manifold gauges
• Inspect condenser coil — clean if needed
• Verify all condenser fans running correct direction

SAFETY
⚠️ Lock out / tag out before opening electrical panel
⚠️ R-410A at 95°F: discharge ~430 psig — wear safety glasses and gloves`
    }
  },
  {
    id: "safety",
    title: "Step 2 — Safety Briefing",
    subtitle: "PRE-JOB SAFETY AGENT",
    desc: "One tap pre-fills from the diagnosis. Generates task-specific PPE list, LOTO procedure, and hazard checklist.",
    icon: "🦺",
    duration: 3500,
    demo: {
      type: "agent",
      fields: [
        { label: "Job Type", value: "Fault Diagnosis — RTU" },
        { label: "Location", value: "Rooftop" },
        { label: "Refrigerant", value: "R-410A" },
        { label: "Hazards", value: "Electrical >50V · Refrigerant present · Height >6ft" },
      ],
      result: `⚠️ CRITICAL SAFETY WARNINGS
• Working at height on rooftop — fall arrest required
• R-410A at operating pressure — cryogenic PPE required
• Electrical panels >240V — NFPA 70E Category 2 minimum

🦺 REQUIRED PPE
• Safety glasses ANSI Z87.1 — mandatory
• Cryogenic gloves for refrigerant handling
• Hard hat — rooftop work
• High-vis vest — occupied building
• Steel-toe boots ASTM F2413
• Fall harness + lanyard — anchor to rated point
• Arc flash gear 8 cal/cm² for electrical work

🔐 LOTO PROCEDURE
1. Notify building manager — unit going offline
2. Locate main disconnect at unit
3. Turn to OFF position
4. Apply personal lock — tag with name and date
5. Verify de-energised with CAT III meter L1-L2-L3
6. Test before touch

✅ PRE-JOB CHECKLIST
☐ PPE donned and inspected
☐ Fall protection anchored
☐ LOTO applied and verified
☐ Manifold gauges connected
☐ Leak detector calibrated
☐ Phone charged, supervisor notified`
    }
  },
  {
    id: "parts",
    title: "Step 3 — Parts Finder",
    subtitle: "OEM PARTS + NEARBY SUPPLIERS",
    desc: "GPS locates nearby Johnstone, Wesco, and Grainger. AI returns OEM part numbers, compatible alternatives, and pricing.",
    icon: "🔩",
    duration: 3500,
    demo: {
      type: "parts",
      result: `CONDENSER FAN MOTOR — Carrier 48XC060

OEM PART: HC39GE237 (Carrier/Bryant)
• 1/4 HP, 208-230V, 1-phase, 1100 RPM
• 48 frame, 1 speed, CCW rotation
• Typical price: $185–$220

COMPATIBLE ALTERNATIVES
1. Fasco D7909 — Direct replacement, same specs — $95–$115
2. Mars 10587 — 1/4HP 1100RPM 48fr — $89–$105
3. AO Smith FD6001 — OEM equiv, 5yr warranty — $110–$130

KEY SPECS TO VERIFY
• Rotation: CCW (viewed from shaft end)
• Shaft diameter: 1/2"
• Frame: 48, totally enclosed

📍 STORES NEAR YOU
🔴 Johnstone Supply — 2.1 miles — open now
🟠 Grainger — 3.8 miles — open now
🔵 Wesco — 5.2 miles — open now`
    }
  },
  {
    id: "closing",
    title: "Step 4 — Closing Comment",
    subtitle: "WORK ORDER SUMMARY",
    desc: "AI writes a professional CMMS-ready closing comment. One tap to copy into any work order system.",
    icon: "📋",
    duration: 3500,
    demo: {
      type: "closing",
      result: `Responded to high pressure lockout fault (E79) on rooftop Carrier 48XC RTU. Found condenser coil heavily fouled with cottonwood and debris, causing restricted airflow and elevated head pressure. Cleaned condenser coil with coil cleaner and low-pressure rinse. Verified all three condenser fans operational with correct amp draw. Checked refrigerant charge — subcooling 12°F, within spec. Reset high pressure lockout and tested unit through full cooling cycle. Unit operating normally at time of departure with discharge pressure 415 psig at 92°F ambient. Recommend quarterly coil cleaning to prevent recurrence.`
    }
  },
  {
    id: "more",
    title: "And there's more…",
    subtitle: "FULL FEATURE SET",
    desc: "23 technical documents with AI Q&A · Belt & PT calculators · Equipment log · Refrigerant charging · Predictive maintenance",
    icon: "📱",
    duration: 3500,
  },
  {
    id: "impact",
    title: "The Impact",
    subtitle: "WHY THIS MATTERS FOR FieldPro",
    desc: "Faster fault resolution · Consistent safety compliance · Accurate work orders · Knowledge in every engineer's hands · Zero paper, zero phone calls",
    icon: "🚀",
    duration: 4000,
  },
];

function DemoMode({ onExit }) {
  const [step, setStep] = React.useState(0);
  const [phase, setPhase] = React.useState("title"); // title | fields | result
  const [fieldIdx, setFieldIdx] = React.useState(0);
  const [typedText, setTypedText] = React.useState("");
  const [showResult, setShowResult] = React.useState(false);
  const [autoPlay, setAutoPlay] = React.useState(true);
  const timerRef = React.useRef(null);
  const typeRef = React.useRef(null);

  const current = DEMO_STEPS[step];
  const progress = ((step) / (DEMO_STEPS.length - 1)) * 100;

  function clearTimers() {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (typeRef.current) clearInterval(typeRef.current);
  }

  function typeText(text, onDone) {
    setTypedText("");
    let i = 0;
    const speed = text.length > 200 ? 8 : 18;
    typeRef.current = setInterval(() => {
      i++;
      setTypedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(typeRef.current);
        if (onDone) onDone();
      }
    }, speed);
  }

  function goToStep(idx) {
    clearTimers();
    setStep(idx);
    setPhase("title");
    setFieldIdx(0);
    setTypedText("");
    setShowResult(false);
  }

  function next() { if (step < DEMO_STEPS.length - 1) goToStep(step + 1); }
  function prev() { if (step > 0) goToStep(step - 1); }

  React.useEffect(() => {
    if (!autoPlay) return;
    const s = DEMO_STEPS[step];
    clearTimers();
    setPhase("title");
    setShowResult(false);
    setTypedText("");
    setFieldIdx(0);

    if (!s.demo) {
      // Simple slide — auto advance
      timerRef.current = setTimeout(() => {
        if (step < DEMO_STEPS.length - 1) goToStep(step + 1);
      }, s.duration);
    } else {
      // Demo slide — animate fields then result
      timerRef.current = setTimeout(() => {
        setPhase("fields");
        let fi = 0;
        function nextField() {
          if (fi < s.demo.fields.length) {
            setFieldIdx(fi);
            fi++;
            timerRef.current = setTimeout(nextField, 600);
          } else {
            timerRef.current = setTimeout(() => {
              setPhase("result");
              typeText(s.demo.result, () => {
                setShowResult(true);
                timerRef.current = setTimeout(() => {
                  if (step < DEMO_STEPS.length - 1) goToStep(step + 1);
                }, 2500);
              });
            }, 500);
          }
        }
        nextField();
      }, 1200);
    }
    return () => clearTimers();
  }, [step, autoPlay]);

  const isDark = _darkMode;
  const bg = isDark ? "#0a0a0a" : "#f4f4f5";
  const card = isDark ? "#161616" : "#ffffff";
  const border = isDark ? "#2a2a2a" : "#d4d4d8";
  const txt = isDark ? "#ffffff" : "#111111";
  const txt2 = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)";
  const txt3 = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";

  return React.createElement("div", {style:{
    position:"fixed", inset:0, zIndex:10000,
    background:bg, display:"flex", flexDirection:"column",
    fontFamily:"system-ui,-apple-system,sans-serif"
  }},

    /* Top bar */
    React.createElement("div", {style:{
      background: isDark?"#000":card,
      borderBottom:`3px solid ${RED}`,
      padding:"10px 16px",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      flexShrink:0
    }},
      React.createElement("div", {style:{display:"flex",alignItems:"center",gap:8}},
        React.createElement("div", {style:{
          background:RED, borderRadius:6, padding:"3px 8px",
          fontSize:10, fontWeight:900, color:"#fff", letterSpacing:".1em"
        }}, "▶ DEMO"),
        React.createElement("div", {style:{fontSize:12,fontWeight:700,color:RED}},
          `${step + 1} / ${DEMO_STEPS.length}`)
      ),
      React.createElement("div", {style:{display:"flex",gap:8,alignItems:"center"}},
        React.createElement("button", {
          onClick:()=>setAutoPlay(p=>!p),
          style:{background:autoPlay?"rgba(227,6,19,.15)":"rgba(255,255,255,.08)",
            border:`1px solid ${autoPlay?RED:border}`,
            borderRadius:20, padding:"4px 12px",
            fontSize:11, fontWeight:700,
            color:autoPlay?RED:txt2, cursor:"pointer", fontFamily:"inherit"}
        }, autoPlay ? "⏸ Pause" : "▶ Play"),
        React.createElement("button", {
          onClick:onExit,
          style:{background:"none",border:`1px solid ${border}`,
            borderRadius:20, padding:"4px 12px",
            fontSize:11, fontWeight:700, color:txt2,
            cursor:"pointer", fontFamily:"inherit"}
        }, "✕ Exit")
      )
    ),

    /* Progress bar */
    React.createElement("div", {style:{height:3,background:border,flexShrink:0}},
      React.createElement("div", {style:{
        height:"100%", background:RED,
        width:progress+"%",
        transition:"width 0.6s ease"
      }})
    ),

    /* Main content */
    React.createElement("div", {style:{
      flex:1, overflowY:"auto", padding:"20px 16px 16px",
      display:"flex", flexDirection:"column", gap:14
    }},

      /* Step icon + title */
      React.createElement("div", {style:{textAlign:"center",paddingBottom:4}},
        React.createElement("div", {style:{
          width:64,height:64,
          background:isDark?"rgba(227,6,19,.12)":"rgba(227,6,19,.08)",
          border:`2px solid rgba(227,6,19,.3)`,
          borderRadius:18,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:30,margin:"0 auto 12px"
        }}, current.icon),
        React.createElement("div", {style:{
          fontSize:20,fontWeight:900,color:txt,
          letterSpacing:".01em",lineHeight:1.2,marginBottom:4
        }}, current.title),
        React.createElement("div", {style:{
          fontSize:11,color:RED,fontWeight:700,letterSpacing:".1em"
        }}, current.subtitle)
      ),

      /* Description */
      React.createElement("div", {style:{
        background:card, border:`1px solid ${border}`,
        borderRadius:14,padding:"14px 16px",
        fontSize:14, color:txt2, lineHeight:1.7, textAlign:"center"
      }}, current.desc),

      /* Demo fields */
      current.demo && (phase==="fields"||phase==="result") && React.createElement("div", {style:{
        background:card, border:`1px solid ${border}`,
        borderRadius:14, padding:14
      }},
        React.createElement("div", {style:{
          fontSize:10,color:RED,fontWeight:700,
          letterSpacing:".1em",marginBottom:10
        }}, "INPUT"),
        current.demo.fields && current.demo.fields.slice(0, fieldIdx+1).map((f,i)=>
          React.createElement("div", {key:i,style:{
            display:"flex",gap:8,padding:"6px 0",
            borderBottom:i<fieldIdx?`1px solid ${border}`:"none",
            animation:"fadeIn 0.3s ease"
          }},
            React.createElement("div", {style:{
              fontSize:11,color:txt3,fontWeight:700,
              minWidth:90,flexShrink:0
            }}, f.label),
            React.createElement("div", {style:{
              fontSize:12,color:txt,fontWeight:600,flex:1
            }}, f.value)
          )
        )
      ),

      /* Typing result */
      phase==="result" && current.demo && React.createElement("div", {style:{
        background:isDark?"#0d0d0d":card,
        border:`1px solid ${showResult?RED:border}`,
        borderRadius:14, padding:14,
        fontSize:12, color:txt, lineHeight:1.8,
        whiteSpace:"pre-wrap",
        transition:"border-color 0.4s ease",
        position:"relative"
      }},
        showResult && React.createElement("div", {style:{
          position:"absolute",top:-10,right:14,
          background:RED,borderRadius:20,
          padding:"2px 10px",fontSize:9,fontWeight:700,color:"#fff"
        }}, "✓ COMPLETE"),
        typedText,
        !showResult && React.createElement("span", {style:{
          display:"inline-block",width:2,height:14,
          background:RED,marginLeft:2,
          animation:"bounce 0.7s infinite"
        }})
      ),

      /* Nav buttons */
      React.createElement("div", {style:{display:"flex",gap:10,marginTop:4}},
        React.createElement("button", {
          onClick:prev, disabled:step===0,
          style:{
            flex:1,background:card,border:`1px solid ${border}`,
            borderRadius:12,padding:"12px",cursor:step===0?"not-allowed":"pointer",
            fontSize:14,color:step===0?txt3:txt,fontFamily:"inherit",
            opacity:step===0?.4:1
          }
        }, "← Prev"),
        step < DEMO_STEPS.length-1
          ? React.createElement("button", {
              onClick:()=>{setAutoPlay(false);next();},
              style:{
                flex:2,background:RED,border:"none",
                borderRadius:12,padding:"12px",cursor:"pointer",
                fontSize:14,fontWeight:700,color:"#fff",fontFamily:"inherit",
                boxShadow:"0 4px 14px rgba(227,6,19,.4)"
              }
            }, "Next →")
          : React.createElement("button", {
              onClick:onExit,
              style:{
                flex:2,background:RED,border:"none",
                borderRadius:12,padding:"12px",cursor:"pointer",
                fontSize:14,fontWeight:700,color:"#fff",fontFamily:"inherit",
                boxShadow:"0 4px 14px rgba(227,6,19,.4)"
              }
            }, "🚀 Try It Live")
    ),

      /* Step dots */
      React.createElement("div", {style:{
        display:"flex",justifyContent:"center",gap:6,paddingBottom:8
      }},
        DEMO_STEPS.map((_,i)=>React.createElement("button",{
          key:i,
          onClick:()=>{setAutoPlay(false);goToStep(i);},
          style:{
            width:i===step?20:6,height:6,
            borderRadius:3,border:"none",cursor:"pointer",
            background:i===step?RED:border,
            transition:"all 0.3s ease",padding:0
          }
        }))
      )
    )
  );
}

// ── PT CHART ─────────────────────────────────────────────────────────────
// PT is now defined once, shared with the Refrigerant Calc agent, in app1.js

// ── BELT CALCULATOR ─────────────────────────────────────────────────────
function BeltCalc() {
  const [dDriver, setDDriver] = React.useState("");
  const [dDriven, setDDriven] = React.useState("");
  const [cDist,   setCDist]   = React.useState("");
  const [unit,    setUnit]    = React.useState("in");
  const [result,  setResult]  = React.useState(null);

  const STD = {
    "A":  [26,28,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,50,52,54,56,58,60,62,64,66,68,72,75,78,80,84,90,96],
    "B":  [35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,74,75,76,78,80,81,82,83,84,85,86,87,88,90,92,95,96,100,103,105,108,110,112,120,128,144],
    "C":  [51,52,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,92,95,96,100,105,108,110,112,115,120,122,124,128,132,136,138,140,144,150,158,162,168,180,195,210,240,270],
    "D":  [90,96,102,105,108,110,112,115,120,122,124,128,133,136,138,140,144,150,158,162,168,180,195,210,240,270,300,330,360,390],
    "4L": [25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,60,62,64,66,68,70,72,75,78,80,84,90,96],
    "5L": [33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,54,56,58,60,62,64,66,68,70,72,74,75,76,78,80,82,84,86,88,90,92,95,96,100,105,110,115,120,130,140],
  };
  const MIN_PULLEY = {A:3,B:5,C:7,D:12,"4L":3,"5L":4.5};

  function toIn(v) { const n=parseFloat(v); return unit==="mm"?n/25.4:n; }

  function calc() {
    const D=toIn(dDriver), d=toIn(dDriven), C=toIn(cDist);
    if ([D,d,C].some(x=>isNaN(x)||x<=0)) { setResult({err:"Enter valid positive values for all fields."}); return; }
    if (C < (D+d)/2) { setResult({err:"Center distance too small — pulleys would overlap. Check measurements."}); return; }
    const Lc = 2*C + (Math.PI/2)*(D+d) + Math.pow(D-d,2)/(4*C);
    const ratio = D/d;
    const wrap  = 180 - 60*(D-d)/C;
    const sects = Object.keys(MIN_PULLEY).filter(s=>D>=MIN_PULLEY[s]);
    let matches=[];
    sects.forEach(s=>{
      const sorted=[...STD[s]].sort((a,b)=>Math.abs(a-Lc)-Math.abs(b-Lc)).slice(0,3);
      sorted.forEach(sl=>{
        const bv=4*sl-2*Math.PI*(D+d);
        const disc=bv*bv-32*Math.pow(D-d,2);
        if(disc>=0){ const Ca=(bv+Math.sqrt(disc))/16; matches.push({s,sl,pn:s+sl,diff:sl-Lc,Ca,Cadj:Ca-C}); }
      });
    });
    matches.sort((a,b)=>Math.abs(a.diff)-Math.abs(b.diff));
    const seen=new Set(), top=matches.filter(m=>{if(seen.has(m.pn))return false;seen.add(m.pn);return true;}).slice(0,5);
    setResult({Lc:Lc.toFixed(2),ratio:ratio.toFixed(2),wrap:wrap.toFixed(1),top});
  }

  const u = unit==="in" ? '"' : "mm";

  return React.createElement("div",{style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}},
    React.createElement(Hdr,{title:"BELT CALCULATOR",sub:"V-BELT SIZE FROM MEASUREMENTS"}),
    React.createElement("div",{style:{flex:1,overflowY:"auto",padding:14}},

      /* Unit toggle */
      React.createElement("div",{style:{display:"flex",gap:8,marginBottom:14}},
        ["in","mm"].map(u2=>React.createElement("button",{key:u2,
          onClick:()=>{setUnit(u2);setResult(null);},
          style:{flex:1,padding:"8px 0",borderRadius:10,border:"none",cursor:"pointer",
            fontWeight:700,fontSize:13,fontFamily:"inherit",
            background:unit===u2?RED:GREY1,color:unit===u2?"#fff":TXT}
        }, u2==="in"?"Inches":"Millimetres"))
      ),

      /* SVG diagram */
      React.createElement("div",{style:{background:GREY1,border:"1px solid "+GREY2,borderRadius:14,padding:14,marginBottom:14,textAlign:"center"}},
        React.createElement("svg",{viewBox:"0 0 300 120",width:"100%",style:{maxWidth:300,display:"block",margin:"0 auto"}},
          React.createElement("circle",{cx:62,cy:60,r:46,fill:"none",stroke:RED,strokeWidth:3}),
          React.createElement("circle",{cx:62,cy:60,r:3,fill:RED}),
          React.createElement("text",{x:62,y:118,textAnchor:"middle",fill:GTXT1,fontSize:10},"Driver (motor)"),
          React.createElement("text",{x:62,y:12,textAnchor:"middle",fill:RED,fontSize:11,fontWeight:"bold"},dDriver?dDriver+u:"D"),
          React.createElement("circle",{cx:228,cy:60,r:28,fill:"none",stroke:GTXT1,strokeWidth:3}),
          React.createElement("circle",{cx:228,cy:60,r:3,fill:GTXT1}),
          React.createElement("text",{x:228,y:104,textAnchor:"middle",fill:GTXT1,fontSize:10},"Driven (blower)"),
          React.createElement("text",{x:228,y:12,textAnchor:"middle",fill:GTXT1,fontSize:11,fontWeight:"bold"},dDriven?dDriven+u:"d"),
          React.createElement("line",{x1:62,y1:14,x2:228,y2:32,stroke:_darkMode?"rgba(255,200,0,.5)":"rgba(200,100,0,.5)",strokeWidth:2,strokeDasharray:"5,3"}),
          React.createElement("line",{x1:62,y1:106,x2:228,y2:88,stroke:_darkMode?"rgba(255,200,0,.5)":"rgba(200,100,0,.5)",strokeWidth:2,strokeDasharray:"5,3"}),
          React.createElement("line",{x1:62,y1:60,x2:228,y2:60,stroke:GREY2,strokeWidth:1,strokeDasharray:"4,3"}),
          React.createElement("text",{x:145,y:52,textAnchor:"middle",fill:GTXT2,fontSize:10},cDist?cDist+u+" C-C":"C = center-to-center")
        ),
        React.createElement("div",{style:{fontSize:10,color:GTXT2,marginTop:6}},"Measure pulley OD and shaft-to-shaft center distance")
      ),

      /* Inputs */
      React.createElement("div",{style:{background:GREY1,border:"1px solid "+GREY2,borderTop:"1px solid rgba(255,255,255,.09)",borderRadius:14,padding:14,marginBottom:10,boxShadow:"0 2px 12px rgba(0,0,0,.4)"}},
        React.createElement("div",{style:{fontSize:11,color:RED,fontWeight:700,marginBottom:12,letterSpacing:".08em"}},"MEASUREMENTS"),
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}},
          React.createElement("div",null,
            React.createElement("div",{style:{fontSize:11,color:GTXT2,fontWeight:700,marginBottom:4}},"DRIVER OD ("+u+")"),
            React.createElement("input",{type:"number",step:"0.125",min:"0",value:dDriver,
              onChange:e=>{setDDriver(e.target.value);setResult(null);},
              placeholder:unit==="in"?"e.g. 6.5":"e.g. 165",
              style:{width:"100%",background:_darkMode?DARK:GREY1,border:"1px solid "+GREY2,borderRadius:8,padding:"10px 12px",color:TXT,fontSize:15,outline:"none",fontFamily:"inherit"}}),
            React.createElement("div",{style:{fontSize:10,color:GTXT2,marginTop:3}},"Motor / fan shaft side")
          ),
          React.createElement("div",null,
            React.createElement("div",{style:{fontSize:11,color:GTXT2,fontWeight:700,marginBottom:4}},"DRIVEN OD ("+u+")"),
            React.createElement("input",{type:"number",step:"0.125",min:"0",value:dDriven,
              onChange:e=>{setDDriven(e.target.value);setResult(null);},
              placeholder:unit==="in"?"e.g. 10":"e.g. 254",
              style:{width:"100%",background:_darkMode?DARK:GREY1,border:"1px solid "+GREY2,borderRadius:8,padding:"10px 12px",color:TXT,fontSize:15,outline:"none",fontFamily:"inherit"}}),
            React.createElement("div",{style:{fontSize:10,color:GTXT2,marginTop:3}},"Blower / equipment side")
          )
        ),
        React.createElement("div",null,
          React.createElement("div",{style:{fontSize:11,color:GTXT2,fontWeight:700,marginBottom:4}},"CENTER-TO-CENTER DISTANCE ("+u+")"),
          React.createElement("input",{type:"number",step:"0.25",min:"0",value:cDist,
            onChange:e=>{setCDist(e.target.value);setResult(null);},
            placeholder:unit==="in"?"e.g. 22.5":"e.g. 572",
            style:{width:"100%",background:_darkMode?DARK:GREY1,border:"1px solid "+GREY2,borderRadius:8,padding:"10px 12px",color:TXT,fontSize:15,outline:"none",fontFamily:"inherit"}}),
          React.createElement("div",{style:{fontSize:10,color:GTXT2,marginTop:3}},"Shaft center to shaft center")
        )
      ),

      React.createElement(Btn,{red:true,c:"⚙️  Calculate Belt Size",disabled:!dDriver||!dDriven||!cDist,
        style:{width:"100%",padding:13,marginBottom:14},onClick:calc}),

      /* Error */
      result&&result.err&&React.createElement("div",{style:{background:"rgba(227,6,19,.12)",border:"1px solid rgba(227,6,19,.4)",borderRadius:12,padding:14,fontSize:13,color:"#ff6b6b"}},result.err),

      /* Results */
      result&&!result.err&&React.createElement(React.Fragment,null,

        /* Stats row */
        React.createElement("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}},
          [{l:"CALC LENGTH",v:result.Lc+'"',s:"outside circumference"},
           {l:"SPEED RATIO",v:result.ratio+":1",s:"driver : driven"},
           {l:"WRAP ANGLE",v:result.wrap+"°",s:"on smaller pulley"}
          ].map(x=>React.createElement("div",{key:x.l,style:{background:GREY1,border:"1px solid "+GREY2,borderTop:"1px solid rgba(255,255,255,.09)",borderRadius:10,padding:"10px 6px",textAlign:"center"}},
            React.createElement("div",{style:{fontSize:15,fontWeight:900,color: TXT,lineHeight:1,marginBottom:3}},x.v),
            React.createElement("div",{style:{fontSize:9,color:GTXT2,letterSpacing:".04em"}},x.s)
          ))
        ),

        /* Match list */
        React.createElement("div",{style:{fontSize:11,color:RED,fontWeight:700,letterSpacing:".08em",marginBottom:8}},"RECOMMENDED BELT SIZES"),
        result.top.map((m,i)=>React.createElement("div",{key:m.pn,style:{
          background:i===0?"rgba(227,6,19,.1)":GREY1,
          border:"1px solid "+(i===0?RED:GREY2),
          borderLeft:"4px solid "+(i===0?RED:GREY3),
          borderRadius:12,padding:"12px 14px",marginBottom:8,
          display:"flex",justifyContent:"space-between",alignItems:"center"
        }},
          React.createElement("div",null,
            React.createElement("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:4}},
              React.createElement("div",{style:{fontSize:20,fontWeight:900,color:i===0?RED:TXT}},m.pn),
              i===0&&React.createElement("div",{style:{background:RED,borderRadius:20,padding:"2px 8px",fontSize:9,fontWeight:700,color: TXT}},"BEST MATCH")
            ),
            React.createElement("div",{style:{display:"flex",gap:12,flexWrap:"wrap"}},
              React.createElement("div",{style:{fontSize:11,color:GTXT2}},"Length: ",React.createElement("span",{style:{color: TXT,fontWeight:600}},m.sl+'"')),
              React.createElement("div",{style:{fontSize:11,color:GTXT2}},"Section: ",React.createElement("span",{style:{color: TXT,fontWeight:600}},m.s)),
              React.createElement("div",{style:{fontSize:11,color:m.diff>0?"#F39C12":m.diff<0?"#2980B9":GTXT2}},
                m.diff>0?"+"+m.diff.toFixed(2)+'" longer':m.diff<0?m.diff.toFixed(2)+'" shorter':"Exact match")
            )
          ),
          React.createElement("div",{style:{textAlign:"right",flexShrink:0,marginLeft:8}},
            React.createElement("div",{style:{fontSize:10,color:GTXT3,marginBottom:2}},"adj C-C"),
            React.createElement("div",{style:{fontSize:13,fontWeight:700,color: TXT}},m.Ca.toFixed(2)+'"'),
            React.createElement("div",{style:{fontSize:10,color:m.Cadj>0?"#F39C12":"#2980B9"}},
              m.Cadj>0?"+"+m.Cadj.toFixed(2)+'" out':m.Cadj.toFixed(2)+'" in')
          )
        )),

        /* Tips */
        React.createElement("div",{style:{background:"rgba(39,174,96,.07)",border:"1px solid rgba(39,174,96,.25)",borderRadius:12,padding:12,marginTop:4}},
          React.createElement("div",{style:{fontSize:11,color:"#27AE60",fontWeight:700,marginBottom:6}},"⚙️  FIELD TIPS"),
          ["Wrap a tape or string around both pulleys to double-check the calculated length.",
           "Adjust motor base or tensioner to set the adjusted center distance for your chosen belt.",
           "Wrap angle below 120° — consider adding a belt idler to improve grip.",
           "Always replace matched sets together — never mix old and new on multi-belt drives.",
           "Correct tension: belt deflects ½\" per foot of span under moderate thumb pressure."
          ].map((t,i)=>React.createElement("div",{key:i,style:{fontSize:11,color: GTXT1,marginBottom:i<4?4:0,lineHeight:1.5,paddingLeft:12,position:"relative"}},
            React.createElement("span",{style:{position:"absolute",left:0,color:"#27AE60"}},"·"),t
          ))
        ),

        React.createElement("button",{onClick:()=>{setDDriver("");setDDriven("");setCDist("");setResult(null);},
          style:{width:"100%",background:GREY1,border:"1px solid "+GREY2,borderRadius:10,
            padding:11,cursor:"pointer",fontSize:13,color:GTXT1,fontFamily:"inherit",marginTop:12}
        },"↩  New Calculation")
      )
    )
  );
}

function PTChart() {
  const [ref, setRef] = useState("R-410A");
  const [mode, setMode] = useState("pt");
  const [temp, setTemp] = useState("");
  const [press, setPress] = useState("");
  const [result, setResult] = useState(null);
  const [shSuctPress, setShSuctPress] = useState("");
  const [shSuctLineTemp, setShSuctLineTemp] = useState("");
  const [shOAT, setShOAT] = useState("");
  const [shResult, setShResult] = useState(null);
  const [scLiqPress, setScLiqPress] = useState("");
  const [scLiqLineTemp, setScLiqLineTemp] = useState("");
  const [scResult, setScResult] = useState(null);

  // getSatTemp, getSatPress, SH_TARGETS, SC_TARGETS are shared globals defined
  // once in app1.js (also used by the Refrigerant Calc agent).

  function calcPT() {
    if (press !== "") {
      const p = parseFloat(press);
      if (isNaN(p)) { setResult({type:"Error",output:"Invalid pressure"}); return; }
      const sat = getSatTemp(ref, p);
      setResult({type:"Press\u2192Sat Temp",output:sat.toFixed(1)+"\u00b0F"});
    } else if (temp !== "") {
      const t = parseFloat(temp);
      if (isNaN(t)) { setResult({type:"Error",output:"Invalid temperature"}); return; }
      const sat = getSatPress(ref, t);
      setResult({type:"Sat Temp\u2192Press",output:sat.toFixed(1)+" psig"});
    }
  }

  function calcSuperheat() {
    const p = parseFloat(shSuctPress);
    const lt = parseFloat(shSuctLineTemp);
    const oat = parseFloat(shOAT);
    if (isNaN(p) || isNaN(lt)) { setShResult({error:"Enter suction pressure and suction line temp"}); return; }
    const satT = getSatTemp(ref, p);
    if (satT === null) { setShResult({error:"Pressure out of range"}); return; }
    const sh = lt - satT;
    const target = SH_TARGETS[ref];
    const status = sh < 5 ? "LOW \u2014 Risk of liquid slugging" : sh > 20 ? "HIGH \u2014 Possible low charge or restriction" : "NORMAL \u2014 Good charge";
    const color = sh < 5 ? RED : sh > 20 ? "#E67E22" : "#27AE60";
    const oatHint = !isNaN(oat) ? ("At "+oat+"\u00b0F OAT, target suction sat temp \u2248 "+(oat-35).toFixed(0)+"\u00b0F") : "";
    setShResult({satT:satT.toFixed(1), sh:sh.toFixed(1), status, color, target, oatHint});
  }

  function calcSubcool() {
    const p = parseFloat(scLiqPress);
    const lt = parseFloat(scLiqLineTemp);
    if (isNaN(p) || isNaN(lt)) { setScResult({error:"Enter liquid pressure and liquid line temp"}); return; }
    const satT = getSatTemp(ref, p);
    if (satT === null) { setScResult({error:"Pressure out of range"}); return; }
    const sc = satT - lt;
    const target = SC_TARGETS[ref];
    const status = sc < 5 ? "LOW \u2014 Possible undercharge or restriction" : sc > 20 ? "HIGH \u2014 Possible overcharge" : "NORMAL \u2014 Good charge";
    const color = sc < 5 ? RED : sc > 20 ? "#E67E22" : "#27AE60";
    setScResult({satT:satT.toFixed(1), sc:sc.toFixed(1), status, color, target});
  }

  const modeBtn = (id, label) => React.createElement("button", {
    onClick: () => { setMode(id); setResult(null); setShResult(null); setScResult(null); },
    style: {
      flex:1, padding:"8px 4px",
      background: mode===id ? RED : GREY1,
      color: mode===id ? "#fff" : TXT,
      border: "1px solid "+(mode===id ? RED : GREY2),
      borderRadius:8, fontSize:11, fontWeight:700,
      cursor:"pointer", fontFamily:"inherit"
    }
  }, label);

  return React.createElement("div", {style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}},
    React.createElement(Hdr, {title:"PT CHART", sub:"REFRIGERANT CHARGING TOOL", onHome:()=>_nav.go&&_nav.go("home")}),
    React.createElement("div", {style:{flex:1,overflowY:"auto",overflowX:"hidden",padding:14}},
      React.createElement(Sel, {label:"REFRIGERANT", val:ref, set:r=>{setRef(r);setResult(null);setShResult(null);setScResult(null);}, opts:Object.keys(PT)}),
      React.createElement("div", {style:{display:"flex",gap:6,marginBottom:14}},
        modeBtn("pt","PT Lookup"),
        modeBtn("superheat","Superheat"),
        modeBtn("subcool","Subcooling")
      ),
      mode==="pt" && React.createElement(Card, {style:{marginBottom:14},
        c: React.createElement(React.Fragment, null,
          React.createElement("div", {style:{fontSize:11,color:RED,fontWeight:700,marginBottom:12}}, "ENTER ONE VALUE"),
          React.createElement(Inp, {label:"GAUGE PRESSURE (psig)", val:press, set:v=>{setPress(v);setTemp("");}, ph:"e.g. 130", type:"number"}),
          React.createElement("div", {style:{textAlign:"center",color:GTXT2,fontSize:12,margin:"4px 0 12px"}}, "\u2014 or \u2014"),
          React.createElement(Inp, {label:"SATURATION TEMP (\u00b0F)", val:temp, set:v=>{setTemp(v);setPress("");}, ph:"e.g. 40", type:"number"}),
          React.createElement(Btn, {red:true, c:"Calculate", onClick:calcPT, disabled:!temp&&!press, style:{width:"100%",marginTop:4}})
        )
      }),
      mode==="pt" && result && React.createElement(Card, {
        style:{background:result.type==="Error"?"rgba(227,6,19,.12)":"rgba(39,174,96,.12)",border:"1px solid "+(result.type==="Error"?"rgba(227,6,19,.4)":"rgba(39,174,96,.4)")},
        c: React.createElement(React.Fragment, null,
          React.createElement("div", {style:{fontSize:12,color:GTXT2,marginBottom:4}}, ref, " \u00b7 ", result.type),
          React.createElement("div", {style:{fontSize:24,fontWeight:900,color:result.type==="Error"?RED:"#27AE60"}}, result.output)
        )
      }),
      mode==="superheat" && React.createElement(Card, {style:{marginBottom:14},
        c: React.createElement(React.Fragment, null,
          React.createElement("div", {style:{fontSize:11,color:RED,fontWeight:700,marginBottom:4}}, "SUPERHEAT CALCULATOR"),
          React.createElement("div", {style:{fontSize:11,color:GTXT2,marginBottom:12}}, "Read suction gauge + clamp suction line near compressor. Confirms metering device operation."),
          React.createElement(Inp, {label:"SUCTION PRESSURE (psig)", val:shSuctPress, set:setShSuctPress, ph:"e.g. 130", type:"number"}),
          React.createElement(Inp, {label:"SUCTION LINE TEMP (\u00b0F)", val:shSuctLineTemp, set:setShSuctLineTemp, ph:"e.g. 55", type:"number"}),
          React.createElement(Inp, {label:"OUTDOOR AIR TEMP (\u00b0F) \u2014 optional", val:shOAT, set:setShOAT, ph:"e.g. 95", type:"number"}),
          React.createElement(Btn, {red:true, c:"Calculate Superheat", onClick:calcSuperheat, disabled:!shSuctPress||!shSuctLineTemp, style:{width:"100%",marginTop:4}})
        )
      }),
      mode==="superheat" && shResult && !shResult.error && React.createElement(Card, {
        style:{background:shResult.color+"22",border:"1px solid "+shResult.color+"66"},
        c: React.createElement(React.Fragment, null,
          React.createElement("div", {style:{fontSize:11,color:GTXT2,marginBottom:8}}, ref+" SUPERHEAT RESULT"),
          React.createElement("div", {style:{display:"flex",gap:12,marginBottom:10}},
            React.createElement("div", {style:{flex:1,textAlign:"center"}},
              React.createElement("div", {style:{fontSize:10,color:GTXT2,marginBottom:2}}, "Sat Temp"),
              React.createElement("div", {style:{fontSize:18,fontWeight:900,color:TXT}}, shResult.satT+"\u00b0F")
            ),
            React.createElement("div", {style:{flex:1,textAlign:"center"}},
              React.createElement("div", {style:{fontSize:10,color:GTXT2,marginBottom:2}}, "Superheat"),
              React.createElement("div", {style:{fontSize:26,fontWeight:900,color:shResult.color}}, shResult.sh+"\u00b0F")
            ),
            React.createElement("div", {style:{flex:1,textAlign:"center"}},
              React.createElement("div", {style:{fontSize:10,color:GTXT2,marginBottom:2}}, "Target"),
              React.createElement("div", {style:{fontSize:13,fontWeight:700,color:GTXT1}}, shResult.target)
            )
          ),
          React.createElement("div", {style:{fontSize:13,fontWeight:700,color:shResult.color,marginBottom:4}}, shResult.status),
          shResult.oatHint && React.createElement("div", {style:{fontSize:11,color:GTXT2}}, shResult.oatHint)
        )
      }),
      mode==="superheat" && shResult && shResult.error && React.createElement(Card, {
        style:{background:"rgba(227,6,19,.12)",border:"1px solid rgba(227,6,19,.4)"},
        c: React.createElement("div", {style:{color:RED,fontSize:13}}, shResult.error)
      }),
      mode==="subcool" && React.createElement(Card, {style:{marginBottom:14},
        c: React.createElement(React.Fragment, null,
          React.createElement("div", {style:{fontSize:11,color:RED,fontWeight:700,marginBottom:4}}, "SUBCOOLING CALCULATOR"),
          React.createElement("div", {style:{fontSize:11,color:GTXT2,marginBottom:12}}, "Read liquid line gauge + clamp liquid line before TXV. Confirms proper charge on TXV systems."),
          React.createElement(Inp, {label:"LIQUID LINE PRESSURE (psig)", val:scLiqPress, set:setScLiqPress, ph:"e.g. 400", type:"number"}),
          React.createElement(Inp, {label:"LIQUID LINE TEMP (\u00b0F)", val:scLiqLineTemp, set:setScLiqLineTemp, ph:"e.g. 100", type:"number"}),
          React.createElement(Btn, {red:true, c:"Calculate Subcooling", onClick:calcSubcool, disabled:!scLiqPress||!scLiqLineTemp, style:{width:"100%",marginTop:4}})
        )
      }),
      mode==="subcool" && scResult && !scResult.error && React.createElement(Card, {
        style:{background:scResult.color+"22",border:"1px solid "+scResult.color+"66"},
        c: React.createElement(React.Fragment, null,
          React.createElement("div", {style:{fontSize:11,color:GTXT2,marginBottom:8}}, ref+" SUBCOOLING RESULT"),
          React.createElement("div", {style:{display:"flex",gap:12,marginBottom:10}},
            React.createElement("div", {style:{flex:1,textAlign:"center"}},
              React.createElement("div", {style:{fontSize:10,color:GTXT2,marginBottom:2}}, "Sat Temp"),
              React.createElement("div", {style:{fontSize:18,fontWeight:900,color:TXT}}, scResult.satT+"\u00b0F")
            ),
            React.createElement("div", {style:{flex:1,textAlign:"center"}},
              React.createElement("div", {style:{fontSize:10,color:GTXT2,marginBottom:2}}, "Subcooling"),
              React.createElement("div", {style:{fontSize:26,fontWeight:900,color:scResult.color}}, scResult.sc+"\u00b0F")
            ),
            React.createElement("div", {style:{flex:1,textAlign:"center"}},
              React.createElement("div", {style:{fontSize:10,color:GTXT2,marginBottom:2}}, "Target"),
              React.createElement("div", {style:{fontSize:13,fontWeight:700,color:GTXT1}}, scResult.target)
            )
          ),
          React.createElement("div", {style:{fontSize:13,fontWeight:700,color:scResult.color}}, scResult.status)
        )
      }),
      mode==="subcool" && scResult && scResult.error && React.createElement(Card, {
        style:{background:"rgba(227,6,19,.12)",border:"1px solid rgba(227,6,19,.4)"},
        c: React.createElement("div", {style:{color:RED,fontSize:13}}, scResult.error)
      })
    )
  );
}

function Notes() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  useEffect(() => {
    S.get("notes").then(r => setNotes(JSON.parse(r.value))).catch(() => {});
  }, []);
  async function add() {
    if (!text.trim()) return;
    const n = [{
      id: gid(),
      title: title || "Note",
      body: text,
      ts: Date.now()
    }, ...notes];
    setNotes(n);
    setText("");
    setTitle("");
    await safeSave("notes", JSON.stringify(n));
  }
  async function del(id) {
    const n = notes.filter(x => x.id !== id);
    setNotes(n);
    await safeSave("notes", JSON.stringify(n));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: "JOB NOTES",
    sub: "FIELD NOTES",
    onHome: () => _nav.go && _nav.go("home")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 14
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Inp, {
      label: "TITLE",
      val: title,
      set: setTitle,
      ph: "Optional"
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "NOTE",
      val: text,
      set: setText,
      ph: "Write your note\u2026",
      rows: 3
    }), /*#__PURE__*/React.createElement(Btn, {
      red: true,
      c: "+ Add Note",
      onClick: add,
      disabled: !text.trim(),
      style: {
        width: "100%"
      }
    }))
  }), notes.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: 40,
      color: GTXT2
    }
  }, "No notes yet"), notes.map(n => /*#__PURE__*/React.createElement(Card, {
    key: n.id,
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: TXT
      }
    }, n.title), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: GTXT2
      }
    }, ago(n.ts), " ago"), /*#__PURE__*/React.createElement("button", {
      onClick: () => del(n.id),
      style: {
        background: "none",
        border: "none",
        color: GTXT3,
        cursor: "pointer",
        fontSize: 16
      }
    }, "\xD7"))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: GTXT1,
        lineHeight: 1.6
      }
    }, n.body))
  }))));
}

// ── MODELS ───────────────────────────────────────────────────────────────
// ── EQUIPMENT LOG ─────────────────────────────────────────────────────────
function EquipmentLog() {
  const [sites, setSites] = useState([]);
  const [view, setView] = useState("sites"); // sites | addSite | siteDetail | addEquip | equipDetail
  const [activeSite, setActiveSite] = useState(null);
  const [activeEquip, setActiveEquip] = useState(null);

  // Site form
  const [siteName, setSiteName] = useState("");
  const [siteAddr, setSiteAddr] = useState("");
  const [siteContact, setSiteContact] = useState("");

  // Equipment form
  const [eqBrand, setEqBrand] = useState("");
  const [eqModel, setEqModel] = useState("");
  const [eqSerial, setEqSerial] = useState("");
  const [eqType, setEqType] = useState("");
  const [eqLocation, setEqLocation] = useState("");
  const [eqVoltage, setEqVoltage] = useState("");
  const [eqRefrig, setEqRefrig] = useState("");
  const [eqTonnage, setEqTonnage] = useState("");
  const [eqFilterSize, setEqFilterSize] = useState("");
  const [eqFilterQty, setEqFilterQty] = useState("");
  const [eqFilterType, setEqFilterType] = useState("");
  const [eqBeltSize, setEqBeltSize] = useState("");
  const [eqBeltQty, setEqBeltQty] = useState("");
  const [eqNotes, setEqNotes] = useState("");
  useEffect(() => {
    S.get("equip-log").then(r => setSites(JSON.parse(r.value))).catch(() => {});
  }, []);
  async function persist(updated) {
    setSites(updated);
    await safeSave("equip-log", JSON.stringify(updated));
  }
  function resetEqForm() {
    setEqBrand("");
    setEqModel("");
    setEqSerial("");
    setEqType("");
    setEqLocation("");
    setEqVoltage("");
    setEqRefrig("");
    setEqTonnage("");
    setEqFilterSize("");
    setEqFilterQty("");
    setEqFilterType("");
    setEqBeltSize("");
    setEqBeltQty("");
    setEqNotes("");
  }
  async function addSite() {
    if (!siteName.trim()) return;
    const s = {
      id: gid(),
      name: siteName,
      address: siteAddr,
      contact: siteContact,
      equipment: [],
      ts: Date.now()
    };
    const updated = [s, ...sites];
    await persist(updated);
    setSiteName("");
    setSiteAddr("");
    setSiteContact("");
    setView("sites");
  }
  async function delSite(id) {
    await persist(sites.filter(s => s.id !== id));
  }
  async function addEquip() {
    if (!eqModel.trim() && !eqBrand.trim()) return;
    const eq = {
      id: gid(),
      brand: eqBrand,
      model: eqModel,
      serial: eqSerial,
      type: eqType,
      location: eqLocation,
      voltage: eqVoltage,
      refrigerant: eqRefrig,
      tonnage: eqTonnage,
      filterSize: eqFilterSize,
      filterQty: eqFilterQty,
      filterType: eqFilterType,
      beltSize: eqBeltSize,
      beltQty: eqBeltQty,
      notes: eqNotes,
      ts: Date.now()
    };
    const updated = sites.map(s => s.id === activeSite.id ? {
      ...s,
      equipment: [eq, ...s.equipment]
    } : s);
    await persist(updated);
    setActiveSite(updated.find(s => s.id === activeSite.id));
    resetEqForm();
    setView("siteDetail");
  }
  async function delEquip(siteId, eqId) {
    const updated = sites.map(s => s.id === siteId ? {
      ...s,
      equipment: s.equipment.filter(e => e.id !== eqId)
    } : s);
    await persist(updated);
    setActiveSite(updated.find(s => s.id === siteId));
    setView("siteDetail");
  }
  const ROW = (label, val) => val ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      padding: "7px 0",
      borderBottom: `1px solid ${GREY2}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: GTXT2,
      fontWeight: 700,
      minWidth: 110,
      flexShrink: 0
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: TXT,
      flex: 1,
      wordBreak: "break-word"
    }
  }, val)) : null;
  const SECTION = (title, color = RED) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: color,
      fontWeight: 700,
      letterSpacing: ".1em",
      marginTop: 14,
      marginBottom: 6,
      paddingBottom: 4,
      borderBottom: `1px solid ${color}33`
    }
  }, title);

  // ── SITE LIST ──
  if (view === "sites") return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: "EQUIPMENT LOG",
    sub: "BY SITE / ADDRESS",
    onHome: () => _nav.go && _nav.go("home")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: "+ Add Site",
    onClick: () => setView("addSite"),
    style: {
      width: "100%",
      marginBottom: 14
    }
  }), sites.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: 40,
      color: GTXT2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      marginBottom: 8
    }
  }, "\uD83C\uDFE2"), /*#__PURE__*/React.createElement("div", null, "No sites yet. Add a site to start logging equipment.")), sites.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    role: "button",
    tabIndex: 0,
    onClick: () => {
      setActiveSite(s);
      setView("siteDetail");
    },
    onKeyDown: e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setActiveSite(s);
        setView("siteDetail");
      }
    },
    style: {
      width: "100%",
      background: CARD,
      border: `1px solid ${GREY2}`,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      cursor: "pointer",
      textAlign: "left",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: TXT,
      marginBottom: 3
    }
  }, s.name), s.address && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: GTXT1,
      marginBottom: 2
    }
  }, "\uD83D\uDCCD ", s.address), s.contact && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: GTXT2
    }
  }, "\uD83D\uDC64 ", s.contact)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 4,
      marginLeft: 8,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: `rgba(227,6,19,.15)`,
      border: `1px solid ${BORDER}`,
      borderRadius: 20,
      padding: "2px 10px",
      fontSize: 11,
      color: RED,
      fontWeight: 700
    }
  }, s.equipment.length, " unit", s.equipment.length !== 1 ? "s" : ""), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      delSite(s.id);
    },
    style: {
      background: "none",
      border: "none",
      color: GTXT3,
      cursor: "pointer",
      fontSize: 16,
      padding: "2px 4px"
    }
  }, "\xD7")))))));

  // ── ADD SITE ──
  if (view === "addSite") return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: "ADD SITE",
    sub: "NEW LOCATION",
    onBack: () => setView("sites")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(Inp, {
    label: "SITE NAME *",
    val: siteName,
    set: setSiteName,
    ph: "e.g. Tower One, 123 Main St"
  }), /*#__PURE__*/React.createElement(Inp, {
    label: "ADDRESS",
    val: siteAddr,
    set: setSiteAddr,
    ph: "Full address"
  }), /*#__PURE__*/React.createElement(Inp, {
    label: "CONTACT / MANAGER",
    val: siteContact,
    set: setSiteContact,
    ph: "Name and phone"
  }), /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: "Save Site",
    onClick: addSite,
    disabled: !siteName.trim(),
    style: {
      width: "100%",
      marginTop: 4
    }
  })));

  // ── SITE DETAIL ──
  if (view === "siteDetail" && activeSite) return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: activeSite.name,
    sub: activeSite.address || "SITE EQUIPMENT",
    onBack: () => setView("sites")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, activeSite.contact && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: GTXT2,
      marginBottom: 12
    }
  }, "\uD83D\uDC64 ", activeSite.contact), /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: "+ Add Equipment",
    onClick: () => {
      resetEqForm();
      setView("addEquip");
    },
    style: {
      width: "100%",
      marginBottom: 14
    }
  }), activeSite.equipment.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: 30,
      color: GTXT2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 28,
      marginBottom: 8
    }
  }, "\uD83D\uDD27"), /*#__PURE__*/React.createElement("div", null, "No equipment logged yet.")), activeSite.equipment.map(eq => /*#__PURE__*/React.createElement("button", {
    key: eq.id,
    onClick: () => {
      setActiveEquip(eq);
      setView("equipDetail");
    },
    style: {
      width: "100%",
      background: CARD,
      border: `1px solid ${GREY2}`,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      cursor: "pointer",
      textAlign: "left",
      borderLeft: `3px solid ${RED}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: TXT
    }
  }, eq.brand, " ", eq.model), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 3,
      flexWrap: "wrap"
    }
  }, eq.type && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      background: "rgba(227,6,19,.12)",
      color: RED,
      borderRadius: 4,
      padding: "1px 7px",
      fontWeight: 700
    }
  }, eq.type), eq.location && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: GTXT2
    }
  }, "\uD83D\uDCCD ", eq.location), eq.serial && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: GTXT2
    }
  }, "S/N ", eq.serial)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 4,
      flexWrap: "wrap"
    }
  }, eq.filterSize && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: GTXT1
    }
  }, "\uD83D\uDD32 Filter: ", eq.filterSize, eq.filterQty ? " ×" + eq.filterQty : ""), eq.beltSize && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: GTXT1
    }
  }, "\u2699\uFE0F Belt: ", eq.beltSize, eq.beltQty ? " ×" + eq.beltQty : ""))), /*#__PURE__*/React.createElement("span", {
    style: {
      color: GTXT2,
      fontSize: 16,
      marginLeft: 8
    }
  }, "\u203A"))))));

  // ── ADD EQUIPMENT ──
  if (view === "addEquip") return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: "ADD EQUIPMENT",
    sub: activeSite?.name || "",
    onBack: () => setView("siteDetail")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 10
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: RED,
        fontWeight: 700,
        marginBottom: 10,
        letterSpacing: ".08em"
      }
    }, "UNIT INFO"), /*#__PURE__*/React.createElement(Sel, {
      label: "EQUIPMENT TYPE",
      val: eqType,
      set: setEqType,
      opts: ["RTU", "Chiller", "Split System", "Heat Pump", "VRF/VRV", "Air Handler", "FCU", "Furnace", "Boiler", "Condenser", "Mini-Split", "DOAS", "Cooling Tower", "Exhaust Fan"]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Sel, {
      label: "BRAND",
      val: eqBrand,
      set: setEqBrand,
      opts: BRANDS
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "MODEL #",
      val: eqModel,
      set: setEqModel,
      ph: "e.g. 48XC024"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Inp, {
      label: "SERIAL #",
      val: eqSerial,
      set: setEqSerial,
      ph: "e.g. 1234A"
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "TONNAGE / CAPACITY",
      val: eqTonnage,
      set: setEqTonnage,
      ph: "e.g. 5T / 100MBH"
    })), /*#__PURE__*/React.createElement(Inp, {
      label: "LOCATION ON SITE",
      val: eqLocation,
      set: setEqLocation,
      ph: "e.g. Rooftop NW corner, Rm 202"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Sel, {
      label: "REFRIGERANT",
      val: eqRefrig,
      set: setEqRefrig,
      opts: REFS
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "VOLTAGE",
      val: eqVoltage,
      set: setEqVoltage,
      ph: "e.g. 208/230V 3ph"
    })))
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 10
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#F39C12",
        fontWeight: 700,
        marginBottom: 10,
        letterSpacing: ".08em"
      }
    }, "\uD83D\uDD32 FILTERS"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Inp, {
      label: "FILTER SIZE",
      val: eqFilterSize,
      set: setEqFilterSize,
      ph: "e.g. 20\xD725\xD72, 16\xD725\xD71"
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "QTY",
      val: eqFilterQty,
      set: setEqFilterQty,
      ph: "e.g. 4",
      type: "number"
    })), /*#__PURE__*/React.createElement(Sel, {
      label: "FILTER TYPE",
      val: eqFilterType,
      set: setEqFilterType,
      opts: ["MERV 8 Pleated", "MERV 11 Pleated", "MERV 13 Pleated", "MERV 16 Pleated", "HEPA", "Fiberglass 1\"", "Washable", "Carbon / Odor", "Bag Filter", "Mini-Pleat", "Electrostatic"]
    }))
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 10
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "#2980B9",
        fontWeight: 700,
        marginBottom: 10,
        letterSpacing: ".08em"
      }
    }, "\u2699\uFE0F BELTS"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Inp, {
      label: "BELT SIZE / PART #",
      val: eqBeltSize,
      set: setEqBeltSize,
      ph: "e.g. A38, 4L380, B-section"
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "QTY",
      val: eqBeltQty,
      set: setEqBeltQty,
      ph: "e.g. 2",
      type: "number"
    })))
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      marginBottom: 14
    },
    c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: GTXT1,
        fontWeight: 700,
        marginBottom: 8,
        letterSpacing: ".08em"
      }
    }, "NOTES"), /*#__PURE__*/React.createElement(Inp, {
      label: "",
      val: eqNotes,
      set: setEqNotes,
      ph: "Special notes, last service date, known issues\u2026",
      rows: 3
    }))
  }), /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: "Save Equipment",
    onClick: addEquip,
    disabled: !eqModel.trim() && !eqBrand.trim(),
    style: {
      width: "100%",
      padding: 13
    }
  })));

  // ── EQUIPMENT DETAIL ──
  if (view === "equipDetail" && activeEquip) return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: `${activeEquip.brand || ""} ${activeEquip.model || "Equipment"}`.trim(),
    sub: activeSite?.name || "",
    onBack: () => setView("siteDetail")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      marginBottom: 12
    }
  }, activeEquip.type && /*#__PURE__*/React.createElement("span", {
    style: {
      background: `rgba(227,6,19,.15)`,
      border: `1px solid ${BORDER}`,
      borderRadius: 20,
      padding: "3px 10px",
      fontSize: 11,
      color: RED,
      fontWeight: 700
    }
  }, activeEquip.type), activeEquip.location && /*#__PURE__*/React.createElement("span", {
    style: {
      background: GREY1,
      borderRadius: 20,
      padding: "3px 10px",
      fontSize: 11,
      color: GTXT1
    }
  }, "\uD83D\uDCCD ", activeEquip.location)), /*#__PURE__*/React.createElement(Card, {
    c: /*#__PURE__*/React.createElement(React.Fragment, null, SECTION("UNIT INFO"), ROW("Brand", activeEquip.brand), ROW("Model", activeEquip.model), ROW("Serial #", activeEquip.serial), ROW("Tonnage", activeEquip.tonnage), ROW("Voltage", activeEquip.voltage), ROW("Refrigerant", activeEquip.refrigerant))
  }), (activeEquip.filterSize || activeEquip.filterType) && /*#__PURE__*/React.createElement(Card, {
    c: /*#__PURE__*/React.createElement(React.Fragment, null, SECTION("FILTERS", "#F39C12"), ROW("Filter size", activeEquip.filterSize), ROW("Quantity", activeEquip.filterQty), ROW("Filter type", activeEquip.filterType))
  }), activeEquip.beltSize && /*#__PURE__*/React.createElement(Card, {
    c: /*#__PURE__*/React.createElement(React.Fragment, null, SECTION("BELTS", "#2980B9"), ROW("Belt size / part #", activeEquip.beltSize), ROW("Quantity", activeEquip.beltQty))
  }), activeEquip.notes && /*#__PURE__*/React.createElement(Card, {
    c: /*#__PURE__*/React.createElement(React.Fragment, null, SECTION("NOTES", "rgba(255,255,255,.4)"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: GTXT1,
        lineHeight: 1.7,
        marginTop: 6
      }
    }, activeEquip.notes))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => delEquip(activeSite.id, activeEquip.id),
    style: {
      width: "100%",
      background: "rgba(227,6,19,.08)",
      border: `1px solid rgba(227,6,19,.3)`,
      borderRadius: 12,
      padding: 12,
      color: RED,
      fontSize: 13,
      fontWeight: 700,
      cursor: "pointer"
    }
  }, "Delete Equipment"))));
  return null;
}

// ── MAIN APP ─────────────────────────────────────────────────────────────
function App() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("home");
  const [chatView, setChatView] = useState("list");
  const [agentView, setAgentView] = useState("hub");
  const [toolView, setToolView] = useState("hub");
  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [wCtx, setWCtx] = useState({});
  const [showDemo, setShowDemo] = useState(false);
  useTheme(); // re-render App on theme change, which re-renders all children
  useEffect(() => {
    init();
  }, []);
  const busyRef = useRef(false);
  const newChatInProgress = useRef(false);
  useEffect(() => {
    _nav.go = nav;
  }); // keep global nav ref current every render
  async function init() {
    try {
      const p = await S.get("profile");
      if (p?.value) setProfile(JSON.parse(p.value));
    } catch {}
    try {
      const keys = await S.list("chat:");
      const loaded = [];
      for (const k of keys) {
        try {
          const r = await S.get(k);
          if (r?.value) loaded.push(JSON.parse(r.value));
        } catch {}
      }
      loaded.sort((a, b) => b.updatedAt - a.updatedAt);
      setChats(loaded);
    } catch {}
    setLoading(false);
    setTimeout(() => {
      const s = document.getElementById("splash");
      if (s) {
        s.style.opacity = "0";
        setTimeout(() => s.remove(), 500);
      }
    }, 2200);
  }
  async function doOnboard(p) {
    setProfile(p);
    await safeSave("profile", JSON.stringify(p));
  }
  async function startChat(prompt) {
    if (busyRef.current || newChatInProgress.current) return;
    newChatInProgress.current = true;
    const c = {id: gid(), title: prompt.length > 40 ? prompt.slice(0,40)+"…" : prompt, messages: [], updatedAt: Date.now()};
    const snapshot = [c, ...chats];
    setChats(snapshot);
    setActiveId(c.id);
    setChatView("chat");
    setTab("chat");
    newChatInProgress.current = false;
    await safeSave("chat:" + c.id, JSON.stringify(c));
    await sendMsg(prompt, c.id, snapshot);
  }
  async function newChat() {
    if (newChatInProgress.current) return;
    newChatInProgress.current = true;
    try {
      const c = {
        id: gid(),
        title: "New Job",
      messages: [],
      updatedAt: Date.now()
    };
    setChats(prev => [c, ...prev]);
    setActiveId(c.id);
    setChatView("chat");
    setTab("chat");
      await safeSave("chat:" + c.id, JSON.stringify(c));
    } finally {
      newChatInProgress.current = false;
    }
  }
  async function delChat(id) {
    const u = chats.filter(c => c.id !== id);
    setChats(u);
    if (activeId === id) {
      setActiveId(null);
      setChatView("list");
    }
    await S.del("chat:" + id);
  }
  const activeChat = chats.find(c => c.id === activeId);
  async function sendMsg(text, _chatId, _chats) {
    const currentId = _chatId || activeId;
    const currentChats = _chats || chats;
    if (!text || !currentId) return;
    if (busyRef.current) return; // prevent double-send
    busyRef.current = true;
    setBusy(true);
    const currentChat = currentChats.find(c => c.id === currentId);
    if (!currentChat) {
      busyRef.current = false;
      setBusy(false);
      return;
    }
    try {
    const msg = {
      role: "user",
      content: text
    };
    const msgs = [...(currentChat.messages || []), msg];
    const title = (currentChat.messages || []).length === 0 ? text.length > 40 ? text.slice(0, 40) + "…" : text : currentChat.title;
    const updated = {
      ...currentChat,
      title,
      messages: msgs,
      updatedAt: Date.now()
    };
    setChats(prev => prev.map(c => c.id === currentId ? updated : c));
    await safeSave("chat:" + currentId, JSON.stringify(updated));
    const sys = `You are MTS Assistant — an expert AI field assistant for FieldPro Managed Technology Services HVAC engineers.

Your role: help technicians in the field solve problems fast. Be their expert colleague on the job.

You specialize in:
- HVAC fault diagnosis (RTUs, chillers, split systems, VRF/VRV, heat pumps, boilers, furnaces, FCUs)
- Refrigerant systems (R-410A, R-22, R-32, R-454B, R-407C, R-134a) — charging, leak detection, EPA 608
- Electrical troubleshooting (controls, contactors, capacitors, boards, low-voltage wiring)
- Preventive maintenance procedures and schedules
- OEM and compatible part numbers (Carrier, Trane, York, Lennox, Daikin, Mitsubishi, Rheem, Burnham)
- Safety protocols — PPE, LOTO, NFPA 70E arc flash, OSHA, confined space
- Service report writing and job documentation
- Pressure-temperature relationships, superheat and subcooling calculations
- Belt and filter sizing, equipment specifications

Response style:
- Be concise and direct — techs are in the field, not at a desk
- Use numbered steps for procedures
- Flag ALL safety hazards with ⚠️ at the start of the relevant step
- Give specific values, part numbers, and torque specs when you know them
- If you're not certain about a specific model detail, say so clearly
- Prioritize safety over speed — never skip safety steps to save time
${profile ? `\nTechnician: ${profile.name}${profile.region ? `, ${profile.region}` : ""}` : ""}`;

    // Build full conversation history for multi-turn context
    const history = msgs.slice(0, -1).map(m => ({
      role: m.role,
      parts: [{
        text: m.content
      }]
    }));
    const reply = await ai(sys, text, 2, history);
    const withReply = {
      ...updated,
      messages: [...msgs, {
        role: "assistant",
        content: reply
      }],
      updatedAt: Date.now()
    };
    setChats(prev => prev.map(c => c.id === currentId ? withReply : c).sort((a, b) => b.updatedAt - a.updatedAt));
    await safeSave("chat:" + currentId, JSON.stringify(withReply));
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }
  function nav(t, sub) {
    setTab(t);
    if (t === "chat") setChatView("list");
    if (t === "agents") setAgentView(sub || "hub");
    if (t === "tools") setToolView(sub || "hub");
  }
  if (loading) return null;
  if (!profile) return /*#__PURE__*/React.createElement(Onboarding, {
    onDone: doOnboard
  });
  if (showDemo) return /*#__PURE__*/React.createElement(DemoMode, {
    onExit: () => setShowDemo(false)
  });
  const TABS = [{
    id: "home",
    i: "🏠",
    l: "Home"
  }, {
    id: "chat",
    i: "💬",
    l: "Chat"
  }, {
    id: "agents",
    i: "🤖",
    l: "Agents"
  }, {
    id: "docs",
    i: "📚",
    l: "Docs"
  }, {
    id: "tools",
    i: "🛠️",
    l: "Tools"
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      background: BG,
      display: "flex",
      flexDirection: "column",
      maxWidth: 480,
      width: "100%",
      overflow: "hidden",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, tab === "home" && /*#__PURE__*/React.createElement(Dashboard, {
    profile: profile,
    jobs: chats.length,
    onNewJob: newChat,
    onStartChat: startChat,
    onNav: nav,
    onDemo: () => setShowDemo(true)
  }), tab === "chat" && chatView === "list" && /*#__PURE__*/React.createElement(ChatList, {
    chats: chats,
    onOpen: id => {
      setActiveId(id);
      setChatView("chat");
    },
    onCreate: newChat,
    onStartChat: startChat,
    onDel: delChat
  }), tab === "chat" && chatView === "chat" && /*#__PURE__*/React.createElement(ChatConvo, {
    chat: activeChat,
    onBack: () => setChatView("list"),
    onSend: sendMsg,
    busy: busy,
  }), tab === "agents" && agentView === "hub" && /*#__PURE__*/React.createElement(AgentsHub, {
    onSel: v => setAgentView(v),
    onHome: () => nav("home")
  }), tab === "agents" && agentView !== "hub" && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: DARK,
      borderBottom: `1px solid ${BORDER}`,
      display: "flex",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => nav("home"),
    "aria-label": "Home",
    style: {
      background: "none",
      border: "none",
      borderRight: `1px solid ${BORDER}`,
      padding: "10px 14px",
      color: GTXT1,
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\uD83C\uDFE0"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAgentView("hub"),
    style: {
      background: "none",
      border: "none",
      padding: "10px 16px",
      color: RED,
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      flex: 1,
      textAlign: "left"
    }
  }, "\u2190 All Agents")), agentView === "diag" && /*#__PURE__*/React.createElement(DiagAgent, {
    ctx: wCtx,
    setCtx: c => setWCtx(p => ({
      ...p,
      ...c
    })),
    onChain: id => setAgentView(id)
  }), agentView === "predict" && /*#__PURE__*/React.createElement(PredAgent, null), agentView === "parts" && /*#__PURE__*/React.createElement(PartsAgent, {
    ctx: wCtx
  }), agentView === "refcalc" && /*#__PURE__*/React.createElement(RefAgent, null), agentView === "safety" && /*#__PURE__*/React.createElement(SafetyAgent, {
    ctx: wCtx,
    onChain: id => setAgentView(id)
  }), agentView === "report" && /*#__PURE__*/React.createElement(ClosingComment, {
    ctx: wCtx,
    profile: profile
  })), tab === "docs" && /*#__PURE__*/React.createElement(Docs, null), tab === "tools" && toolView === "hub" && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: DARK,
      borderBottom: `3px solid ${RED}`,
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => nav("home"),
    "aria-label": "Home",
    style: {
      background: GREY1,
      border: "none",
      borderRadius: 8,
      padding: "6px 12px",
      color: TXT,
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\uD83C\uDFE0"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 800,
      color: TXT
    }
  }, "TOOLS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: RED,
      fontWeight: 600,
      marginTop: 2
    }
  }, "FIELD TOOLS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: 14,
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      alignContent: "start"
    }
  }, [{
    id: "pt",
    i: "🌡️",
    l: "PT Chart",
    d: "Pressure-temp calculator"
  }, {
    id: "belt",
    i: "⚙️",
    l: "Belt Calculator",
    d: "Size belt from pulley measurements"
  }, {
    id: "equip",
    i: "🏢",
    l: "Equipment Log",
    d: "Sites, units, filters, belts"
  }, {
    id: "notes",
    i: "📝",
    l: "Job Notes",
    d: "Field notes"
  }].map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => setToolView(t.id),
    style: {
      background: CARD,
      border: `1px solid ${BORDER}`,
      borderRadius: 14,
      padding: 16,
      cursor: "pointer",
      textAlign: "left",
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28
    }
  }, t.i), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: TXT
    }
  }, t.l), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: GTXT2,
      lineHeight: 1.4
    }
  }, t.d))))), tab === "tools" && toolView !== "hub" && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: DARK,
      borderBottom: `1px solid ${BORDER}`,
      display: "flex",
      alignItems: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => nav("home"),
    "aria-label": "Home",
    style: {
      background: "none",
      border: "none",
      borderRight: `1px solid ${BORDER}`,
      padding: "10px 14px",
      color: GTXT1,
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\uD83C\uDFE0"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setToolView("hub"),
    style: {
      background: "none",
      border: "none",
      padding: "10px 16px",
      color: RED,
      fontWeight: 700,
      fontSize: 13,
      cursor: "pointer",
      flex: 1,
      textAlign: "left"
    }
  }, "\u2190 All Tools")), toolView === "pt" && /*#__PURE__*/React.createElement(PTChart, null), toolView === "belt" && /*#__PURE__*/React.createElement(BeltCalc, null), toolView === "equip" && /*#__PURE__*/React.createElement(EquipmentLog, null), toolView === "notes" && /*#__PURE__*/React.createElement(Notes, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: _darkMode?"linear-gradient(180deg,#0a0a0a 0%,#000 100%)":"#ffffff",
      borderTop: `1px solid rgba(227,6,19,${_darkMode?".25":".3"})`,
      display: "flex",
      flexShrink: 0,
      boxShadow: "0 -1px 0 rgba(227,6,19,.15), 0 -20px 40px rgba(0,0,0,.8), inset 0 1px 0 rgba(227,6,19,.08)"
    }
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => nav(t.id),
    style: {
      flex: 1,
      background: "transparent",
      border: "none",
      padding: "8px 2px 6px",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      color: tab === t.id ? RED : _darkMode ? GTXT2 : "rgba(0,0,0,0.45)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20
    }
  }, t.i), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: ".03em"
    }
  }, t.l), tab === t.id && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 18,
      height: 2,
      background: RED,
      borderRadius: 1,
      marginTop: 1
    }
  }))))), /*#__PURE__*/React.createElement(Toast, null));
}
// Removed direct ReactDOM mount - this module is loaded as a dependency, not standalone
window.App3 = App;

