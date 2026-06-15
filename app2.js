function AgentsHub({
  onSel,
  onHome
}) {
  const A = [{
    id: "diag",
    i: "🔍",
    c: RED,
    t: "Fault Diagnosis",
    d: "Ranks causes by probability with full procedure"
  }, {
    id: "predict",
    i: "📈",
    c: "#9B59B6",
    t: "Predictive Maintenance",
    d: "Predicts failures before they happen"
  }, {
    id: "parts",
    i: "🔩",
    c: "#E67E22",
    t: "Parts Finder",
    d: "OEM + compatible parts with specs"
  }, {
    id: "refcalc",
    i: "🧊",
    c: "#2980B9",
    t: "Refrigerant Calc",
    d: "Superheat, subcooling, charge"
  }, {
    id: "safety",
    i: "🦺",
    c: "#F39C12",
    t: "Safety Briefing",
    d: "Task-specific PPE + LOTO checklist"
  }, {
    id: "report",
    i: "📋",
    c: "#27AE60",
    t: "Closing Comment",
    d: "Copyable work order closing summary"
  }];
  return /*#__PURE__*/React.createElement("div", {
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
    onClick: onHome,
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
  }, "AI AGENTS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: RED,
      fontWeight: 600,
      marginTop: 2
    }
  }, "6 SPECIALIST AGENTS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: GTXT2,
      lineHeight: 1.5,
      marginBottom: 14
    }
  }, "Each agent delivers a complete structured result end-to-end."), A.map(a => /*#__PURE__*/React.createElement("button", {
    key: a.id,
    onClick: () => onSel(a.id),
    style: {
      width: "100%",
      background: CARD,
      border: `1px solid ${GREY2}`,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 12,
      textAlign: "left",
      borderLeft: `4px solid ${a.c}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: 11,
      background: a.c,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 22,
      flexShrink: 0
    }
  }, a.i), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: TXT,
      marginBottom: 3
    }
  }, a.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: GTXT2
    }
  }, a.d))))));
}

// ── CHAT ─────────────────────────────────────────────────────────────────
// ── MARKDOWN RENDERER ────────────────────────────────────────────────────
function renderMarkdown(text) {
  // Split into lines, process each
  const lines = text.split('\n');
  const elements = [];
  let key = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Render inline markdown within a line
    function renderInline(str) {
      const parts = [];
      let remaining = str;
      let k = 0;
      // Bold **text**
      while (remaining.length > 0) {
        const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/s);
        if (boldMatch) {
          if (boldMatch[1]) parts.push(React.createElement('span', {key: k++}, boldMatch[1]));
          parts.push(React.createElement('strong', {key: k++, style:{color:TXT,fontWeight:700}}, boldMatch[2]));
          remaining = boldMatch[3];
        } else {
          parts.push(React.createElement('span', {key: k++}, remaining));
          break;
        }
      }
      return parts;
    }
    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (numMatch) {
      elements.push(React.createElement('div', {key: key++, style:{display:'flex',gap:6,marginBottom:3}},
        React.createElement('span', {style:{color:GTXT2,minWidth:16,flexShrink:0,fontWeight:700}}, numMatch[1]+'.'),
        React.createElement('span', {style:{flex:1}}, renderInline(numMatch[2]))
      ));
      continue;
    }
    // Bullet ⚠️ warning line
    if (line.startsWith('⚠️')) {
      elements.push(React.createElement('div', {key: key++, style:{background:'rgba(255,200,0,.1)',borderLeft:'3px solid #F39C12',padding:'4px 8px',borderRadius:'0 6px 6px 0',marginBottom:4}},
        renderInline(line)
      ));
      continue;
    }
    // Section header (all caps line or ends with :)
    if (line.match(/^[A-Z⚠️🔴🟡🟢✅📞🔐☢️⚡][^a-z]{2,}:?$/) && line.length < 40) {
      elements.push(React.createElement('div', {key: key++, style:{color:GTXT1,fontSize:10,fontWeight:700,letterSpacing:'.08em',marginTop:8,marginBottom:3}},
        line
      ));
      continue;
    }
    // Empty line = spacer
    if (line.trim() === '') {
      elements.push(React.createElement('div', {key: key++, style:{height:6}}));
      continue;
    }
    // Normal line
    elements.push(React.createElement('div', {key: key++, style:{marginBottom:2}}, renderInline(line)));
  }
  return elements;
}

function ChatList({
  chats,
  onOpen,
  onCreate,
  onStartChat,
  onDel
}) {
  return /*#__PURE__*/React.createElement("div", {
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
      padding: "14px 16px",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {style:{flex:1,minWidth:0}}, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontWeight: 800,
      color: TXT
    }
  }, "AI CHAT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: RED,
      fontWeight: 600,
      marginTop: 1
    }
  }, "HVAC FIELD ASSISTANT")), /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: "+ New Job",
    onClick: onCreate,
    style: {
      padding: "9px 16px",
      fontSize: 13,
      flexShrink: 0
    }
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onCreate,
    style: {
      width: "100%",
      background: _darkMode?GREY1:"#f8f8f8",
      border: `1px solid ${GREY2}`,
      borderRadius: 10,
      padding: "10px 14px",
      cursor: "pointer",
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: GTXT1
    }
  }, "Ask anything about HVAC\u2026"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, chats.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "40px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 40,
      marginBottom: 12
    }
  }, "\uD83D\uDD27"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: TXT,
      marginBottom: 6
    }
  }, "Your expert is ready"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: GTXT2,
      lineHeight: 1.6,
      marginBottom: 20
    }
  }, "Fault diagnosis, refrigerant charging, part numbers, safety checklists \u2014 tap New Job to start."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, [{
    i: "🔍",
    t: "Diagnose a fault",
    p: "I have a fault on an HVAC unit. Let me describe it and you help diagnose."
  }, {
    i: "🧊",
    t: "Check refrigerant charge",
    p: "I need help checking the refrigerant charge. Walk me through superheat and subcooling."
  }, {
    i: "⚡",
    t: "Electrical troubleshooting",
    p: "I'm troubleshooting an electrical problem. Help me work through it step by step."
  }, {
    i: "🦺",
    t: "Safety & PPE guidance",
    p: "What PPE and safety steps do I need before starting this job?"
  }].map(q => /*#__PURE__*/React.createElement("button", {
    key: q.t,
    onClick: () => onStartChat ? onStartChat(q.p) : onCreate(),
    style: {
      background: CARD,
      border: `1px solid ${GREY2}`,
      borderRadius: 10,
      padding: "12px 10px",
      cursor: "pointer",
      textAlign: "left",
      fontSize: 12,
      color: GTXT1,
      lineHeight: 1.4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      display: "block",
      marginBottom: 4
    }
  }, q.i), q.t)))), chats.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: GTXT1,
      fontWeight: 700,
      letterSpacing: ".08em",
      marginBottom: 10
    }
  }, "RECENT JOBS"), chats.map(c => {
    const last = c.messages?.[c.messages.length - 1];
    return /*#__PURE__*/React.createElement("div", {
      key: c.id,
      onClick: () => onOpen(c.id),
      style: {
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        padding: "12px 14px",
        marginBottom: 8,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
        background: `rgba(227,6,19,.15)`,
        border: `1px solid rgba(227,6,19,.3)`,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        flexShrink: 0
      }
    }, last?.role === "assistant" ? "🔧" : "💬"), /*#__PURE__*/React.createElement("div", {
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
        textOverflow: "ellipsis",
        marginBottom: 3
      }
    }, c.title), last && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: GTXT1,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, last.role === "assistant" ? "🔧 " : "You: ", last.content.slice(0, 60), last.content.length > 60 ? "…" : ""), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: GTXT3,
        marginTop: 2
      }
    }, ago(c.updatedAt), " ago \xB7 ", c.messages?.length || 0, " messages")), /*#__PURE__*/React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        onDel(c.id);
      },
      style: {
        background: "none",
        border: "none",
        color: GTXT3,
        cursor: "pointer",
        fontSize: 18,
        padding: "4px 8px",
        flexShrink: 0
      }
    }, "\xD7"));
  })));
}function ChatConvo({
  chat,
  onBack,
  onSend,
  busy
}) {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [chat?.messages, busy]);
  const isComposing = useRef(false);
  const send = () => {
    if (text.trim() && !busy) {
      onSend(text.trim());
      setText("");
    }
  };
  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing.current) {
      e.preventDefault();
      send();
    }
  };
  function copyMsg(content, idx) {
    navigator.clipboard?.writeText(content).then(() => {
      setCopied(idx);
      setTimeout(() => setCopied(null), 1500);
    });
  }
  const QUICK = [{
    i: "🔍",
    t: "Diagnose fault",
    p: "I have a fault on an HVAC unit. Let me describe it and you help diagnose."
  }, {
    i: "🧊",
    t: "Refrigerant charge",
    p: "I need help checking the refrigerant charge. Walk me through superheat and subcooling."
  }, {
    i: "⚡",
    t: "Electrical issue",
    p: "I'm troubleshooting an electrical problem. Help me work through it step by step."
  }, {
    i: "🦺",
    t: "Safety checklist",
    p: "What PPE and safety steps do I need before starting this job?"
  }, {
    i: "🔩",
    t: "Find a part",
    p: "I need to find a replacement part. What information do you need?"
  }, {
    i: "📄",
    t: "Write report",
    p: "Help me write a service report for the job I just completed."
  }];
  const hasMessages = chat?.messages?.length > 0;
  return /*#__PURE__*/React.createElement("div", {
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
    onClick: onBack,
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
      fontSize: 14,
      fontWeight: 700,
      color: TXT,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, chat?.title || "New Job"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: RED,
      fontWeight: 600,
      marginTop: 1
    }
  }, "JLL MTS AI ASSISTANT")), hasMessages && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: GTXT2
    }
  }, chat.messages.length, " msg", chat.messages.length !== 1 ? "s" : "")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14,
      background: BG
    }
  }, !hasMessages && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "20px 0 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 52,
      height: 52,
      background: _darkMode?"rgba(227,6,19,.15)":GREY1,
      border: `1px solid ${GREY2}`,
      borderRadius: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 26,
      margin: "0 auto 10px"
    }
  }, "\uD83D\uDD27"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: TXT,
      marginBottom: 4
    }
  }, "MTS Field Assistant"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: GTXT2,
      lineHeight: 1.6
    }
  }, "Expert HVAC help in the field.", /*#__PURE__*/React.createElement("br", null), "Diagnosis, parts, safety, reports.")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: GTXT2,
      fontWeight: 700,
      letterSpacing: ".08em",
      marginBottom: 8,
      textAlign: "center"
    }
  }, "QUICK START"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginBottom: 4
    }
  }, QUICK.map(q => /*#__PURE__*/React.createElement("button", {
    key: q.t,
    onClick: () => onSend(q.p),
    style: {
      background: CARD,
      border: `1px solid ${GREY2}`,
      borderRadius: 10,
      padding: "11px 10px",
      cursor: "pointer",
      textAlign: "left",
      lineHeight: 1.4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      display: "block",
      marginBottom: 5
    }
  }, q.i), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: TXT,
      display: "block",
      marginBottom: 2
    }
  }, q.t), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: GTXT2,
      lineHeight: 1.4
    }
  }, q.p.slice(0, 45), "\u2026"))))), chat?.messages?.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      justifyContent: m.role === "user" ? "flex-end" : "flex-start",
      marginBottom: 12,
      alignItems: "flex-end",
      gap: 8
    }
  }, m.role === "assistant" && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      background: _darkMode?"rgba(227,6,19,.2)":GREY1,
      border: `1px solid ${GREY2}`,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 15,
      flexShrink: 0,
      marginBottom: 2
    }
  }, "\uD83D\uDD27"), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "82%",
      display: "flex",
      flexDirection: "column",
      alignItems: m.role === "user" ? "flex-end" : "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: m.role === "user" ? RED : _darkMode ? GREY1 : "#e8e8eb",
      borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
      padding: "10px 14px",
      fontSize: 13,
      color: m.role === "user" ? "#fff" : _darkMode ? TXT : "#111111",
      lineHeight: 1.65,
      whiteSpace: m.role === "user" ? "pre-wrap" : "normal",
      wordBreak: "break-word",
      boxShadow: m.role === "user" ? "0 2px 8px rgba(227,6,19,.25)" : "none"
    }
  }, m.role === "assistant" ? renderMarkdown(m.content) : m.content), m.role === "assistant" && /*#__PURE__*/React.createElement("button", {
    onClick: () => copyMsg(m.content, i),
    style: {
      background: "none",
      border: "none",
      color: copied === i ? "#27AE60" : GTXT2,
      cursor: "pointer",
      fontSize: 10,
      padding: "4px 2px",
      marginTop: 2,
      fontFamily: "inherit"
    }
  }, copied === i ? "✓ Copied" : "Copy")))), busy && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 8,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      background: _darkMode?"rgba(227,6,19,.2)":GREY1,
      border: `1px solid ${GREY2}`,
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 15,
      flexShrink: 0
    }
  }, "\uD83D\uDD27"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: CARD,
      borderRadius: "14px 14px 14px 4px",
      padding: "12px 16px",
      display: "flex",
      gap: 5,
      alignItems: "center"
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: RED,
      animation: "bounce 1.2s infinite",
      animationDelay: i * .2 + "s"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    ref: endRef
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: DARK,
      borderTop: `2px solid rgba(227,6,19,.2)`,
      padding: "10px 12px",
      flexShrink: 0
    }
  }, hasMessages && !busy && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      overflowX: "auto",
      marginBottom: 8,
      paddingBottom: 2
    }
  }, ["More detail", "Step by step", "Parts needed", "Safety check", "Summarise"].map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => onSend(s),
    style: {
      background: GREY1,
      border: `1px solid ${GREY2}`,
      borderRadius: 20,
      padding: "4px 12px",
      cursor: "pointer",
      fontSize: 11,
      color: GTXT1,
      whiteSpace: "nowrap",
      fontFamily: "inherit"
    }
  }, s))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => setText(e.target.value),
    onKeyDown: handleKey,
    onCompositionStart: () => {
      isComposing.current = true;
    },
    onCompositionEnd: () => {
      isComposing.current = false;
    },
    placeholder: "Ask anything about HVAC\u2026",
    ref: inputRef,
    "aria-label": "Chat message input",
    rows: text.split("\n").length > 1 ? Math.min(text.split("\n").length, 4) : 1,
    style: {
      flex: 1,
      background: GREY1,
      border: `1px solid ${GREY2}`,
      borderRadius: 12,
      padding: "10px 14px",
      color: TXT,
      fontSize: 14,
      outline: "none",
      fontFamily: "inherit",
      resize: "none",
      lineHeight: 1.5,
      maxHeight: 100,
      overflowY: "auto"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: send,
    disabled: !text.trim() || busy,
    style: {
      background: !text.trim() || busy ? "#222" : RED,
      border: "none",
      borderRadius: 12,
      width: 44,
      height: 44,
      cursor: "pointer",
      color: TXT,
      fontSize: 20,
      opacity: !text.trim() || busy ? .5 : 1,
      flexShrink: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all .15s",
      boxShadow: !text.trim() || busy ? "none" : "0 2px 10px rgba(227,6,19,.4)"
    }
  }, "\u25B6"))));
}

// ── DOCS ─────────────────────────────────────────────────────────────────
const DOCS = [{
  id: "d1",
  name: "Carrier 48/50XC RTU — Full Service Reference",
  brand: "Carrier",
  type: "Service Manual",
  tags: ["RTU", "fault codes", "R-410A", "serial decode", "48XC", "50XC"],
  content: `CARRIER 48/50XC PACKAGED RTU — FIELD SERVICE REFERENCE

SERIAL NUMBER DECODE (Carrier format: 4 digits + letter + 7 digits)
Position 1-4: Factory code. Position 5: Year of manufacture (A=2011, B=2012, C=2013, D=2014, E=2015, F=2016, G=2017, H=2018, J=2019, K=2020, L=2021, M=2022, N=2023, P=2024, R=2025). Position 6-7: Week of manufacture (01–52). Remaining digits: sequence number.
Example: 0920G223456 = manufactured Week 22, 2017.
Model number decode: 48XC = gas heat/electric cool packaged unit. 50XC = electric heat/electric cool. Digits following: tonnage (024=2T, 030=2.5T, 036=3T, 042=3.5T, 048=4T, 060=5T, 070=6T). Voltage code: A=208/230V 1ph, B=208/230V 3ph, C=460V 3ph, D=575V 3ph.

FAULT CODES (ComfortLink II / WeatherExpert control board)
E1 – Indoor blower overload: Check blower motor amps vs nameplate. Check for blocked filters, dirty coil, dampers closed. Motor FLA typically 3.2–8.5A depending on size.
E2 – Indoor blower VFD fault (if equipped): Check VFD display for sub-fault. Common: DC bus overvoltage, current limit.
E3 – Outdoor fan overload: Check condenser fan motor. Typical FLA 1.0–2.5A. Check for debris, seized bearing.
E4 – Compressor #1 high discharge temp: Discharge temp >260°F. Check: low charge, high ambient, non-condensables, compressor valve failure.
E5 – Compressor #2 high discharge temp (dual compressor models only).
E6 – Low ambient lockout: Unit locked out below configured ambient (default 45°F). Adjust low ambient control if needed.
E7 – High ambient lockout: Ambient >125°F. Check condenser airflow, verify discharge temp.
E8 – Compressor #1 over-temperature protection: Internal thermostat tripped. Let cool 30 min before reset. If recurring: check charge, head pressure, crankcase heater.
E9 – Compressor #2 over-temperature.
E10 – Compressor #1 overcurrent: Check amp draw vs RLA. Typical compressor RLA: 13–28A depending on tonnage. Check for single-phasing, low voltage, tight scroll.
E11 – Compressor #2 overcurrent.
E12 – Phase loss or phase reversal: Check all three phases at compressor contactor. Phase reversal will cause immediate lockout on 3ph models.
E13 – Ignition failure (48XC only): Gas valve opens but no flame. Check: gas pressure (3.5" WC min), igniter continuity (typically 45–90 ohms), flame sensor, pressure switches.
E14 – Rollout switch open (48XC only): Check for cracked heat exchanger, blocked flue, oversized burner orifice.
E15 – High limit switch open (48XC only): Check: dirty filter, blocked return air, low gas pressure, limit switch contacts.
E16 – Pressure switch — inducer circuit: Check inducer motor, blocked condensate trap, blocked flue, pressure switch tubing for cracks.
E17 – Igniter failure: Check igniter resistance. Replace if >200 ohms or open.
E18 – Flame rollout: Immediate lockout. Do not reset without inspecting heat exchanger.
E31 – Low pressure switch open (cooling): Suction pressure <46 psig R-410A. Check: refrigerant charge, filter/coil restriction, TXV, low ambient.
E79 – High pressure switch open: Discharge pressure >640 psig R-410A. Check: condenser coil blockage, fan motor, overcharge, high ambient, non-condensables.
LED flash codes (older boards without LCD): 1 flash=high pressure, 2 flashes=low pressure, 3 flashes=loss of charge, 4 flashes=compressor overtemp, 5 flashes=locked out.

REFRIGERANT CHARGING — R-410A
Target subcooling (liquid line): 10–15°F at ARI conditions (95°F ambient, 80°F/67°F indoor).
Target superheat (suction line at unit): 10–20°F. Higher superheat = undercharged. Lower = overcharged or TXV issue.
Suction pressure target at 95°F ambient: 118–135 psig (40–45°F saturated suction).
Discharge pressure target: 380–430 psig (115–125°F saturated discharge).
Add charge in liquid phase. Never add in vapor phase — fractionation.
Weigh in charge on initial setup. Use subcooling method for TXV systems.

ELECTRICAL
Control voltage: 24VAC from 40VA transformer. Fuse: 3A.
Compressor contactor coil: 24V. Check coil resistance 8–15 ohms.
Low voltage wiring: R=24V, C=common, Y1=compressor stage 1, Y2=stage 2, G=fan, W1=heat stage 1, W2=stage 2, B/O=reversing valve (not used on straight-cool).
Supply voltage limits: 208/230V — acceptable range 187–253V. 460V — acceptable range 414–506V. Check all phases.
Crankcase heater: 40–75W, 240VAC. Must be energised minimum 4 hours before startup after off season. Verify with clamp meter.

STARTUP CHECKLIST
1. Verify supply voltage ±10% of nameplate, all phases balanced within 2%.
2. Energise crankcase heater — check with clamp meter (0.2–0.4A draw).
3. Check and record: return air temp, supply air temp, outdoor ambient.
4. Verify all filters clean, coil free of debris.
5. Start unit, let stabilise 15 minutes before taking refrigerant readings.
6. Record: suction pressure, discharge pressure, liquid line temp, suction line temp, subcooling, superheat.
7. Verify temperature split: should be 16–22°F across evaporator at design conditions.`
}, {
  id: "d2",
  name: "Trane Fault Codes — RTU/AHU/Chiller Reference",
  brand: "Trane",
  type: "Fault Code Library",
  tags: ["RTU", "fault codes", "Trane", "YCD", "YCH", "CGAM", "serial decode"],
  content: `TRANE FAULT CODE REFERENCE — RTU, AHU, CHILLER

SERIAL NUMBER DECODE (Trane format)
Trane serial: First two digits = year, next two = week, remaining = sequence.
Example: 2304xxxxx = manufactured Week 04, 2023.
Model nomenclature (YCD/YCH example): Y=Packaged, C=Commercial cooling, D=Gas heat, H=Electric heat. Tonnage: 024=2T to 150=12.5T. Voltage: A=208/230-1ph, B=208/230-3ph, C=460-3ph, D=575-3ph.
CGAM (air-cooled chiller): C=Chiller, G=Air-cooled, A=Standard, M=Medium temp. Tonnage in model: 020=20T to 150=150T.

TRANE YCD/YCH PACKAGED RTU FAULT CODES (Voyager/Precedent)
Code 1 – High pressure cutout: Trip >610 psig (R-410A) / >406 psig (R-22). Manual reset required. Check: condenser coil fouling, fan motor, charge, non-condensables.
Code 2 – Low pressure cutout: Trip <54 psig (R-410A at 32°F sat.) / <30 psig (R-22). Check: charge, evaporator airflow, TXV, filter drier.
Code 3 – Freeze stat: Evaporator coil temp <26°F. Check: airflow, filter, fan motor, low charge.
Code 4 – Compressor over-temperature: Internal thermostat. Allow 30 min cooldown. Check charge, head pressure, oil.
Code 5 – Compressor overload: Current draw exceeded trip point. Check: voltage, RLA, tight scroll valve, single-phasing.
Code 6 – High discharge temperature: >270°F. Check: low suction pressure, low charge, damaged valves.
Code 7 – Loss of charge (low pressure stat—manual reset): <20 psig. System is critically low. Find and repair leak before recharging.
Code 8 – Outdoor fan motor fault: Check motor winding resistance. Phase-to-phase should be equal within 5%.
Code 9 – Damper actuator fault (economizer models): Check actuator travel, wiring, 24V signal.
Code 10 – Ignition lockout (gas heat): 3 failed ignition attempts. Check gas pressure (3.5" WC natural gas), igniter, flame sensor.
Code 11 – High limit rollout (gas heat): Rollout switch open. Do NOT reset without full heat exchanger inspection.
Code 12 – Inducer failure: Check motor, pressure switch, condensate trap, flue restriction.
Code 13 – Condensate overflow: Float switch activated. Check drain pan, trap, drain line.
Code 14 – Communication failure (BACnet/DDC): Check wiring, address settings, termination resistors.
Code 15 – VAV fan VFD fault: Check VFD display. Common faults: ground fault, overcurrent, high temperature, undervoltage.
Code 16 – Filter status (if equipped with differential pressure switch): Change filters.
Code 17 – Phase reversal: Check phase sequence. A-B-C rotation required.
Code 18 – Unit power cycling detected: Checks for 5+ power cycles in 24 hours. Investigate power quality.
Code 19 – Compressor start failure: Compressor fails to reach run speed. Check: start capacitor, start assist, low voltage.
Code 20 – Economizer high limit: Mixed air temp too high. Check damper, outdoor air conditions.

TRANE INTELLIPAK / LARGE RTU DIAGNOSTIC CODES
AL001 – Compressor A high pressure: Same as Code 1 above.
AL002 – Compressor B high pressure.
AL010 – Supply air high limit: >90°F supply temp. Check heating stages, damper, sensors.
AL020 – Return air sensor failure: Check 10K thermistor, wiring.
AL021 – Supply air sensor failure.
AL030 – Compressor A fails to start: Check contactor, voltage, crankcase heater, compressor winding resistance.
AL040 – Low ambient lockout: Default 40°F. Adjust for winter operation.
AL050 – Refrigerant leak detected (if equipped): Check electronic leak detector concentration.
AL060 – High static pressure (VAV): Check duct static, VFD, dampers.
AL070 – Low static pressure (VAV): Check belt, fan, filters, VFD.

TRANE CHILLER — CGAM AIR-COOLED SCREW
CH01 – High pressure trip: >450 psig R-134a / >380 psig HFO-1234ze. Check condenser fans, coil, charge.
CH02 – Low pressure trip: <20 psig. Check charge, evaporator fouling, water flow.
CH03 – Motor over-temperature: Check compressor motor winding temps. Max continuous 250°F winding.
CH04 – Oil pressure differential fault: Low oil pressure or high differential. Check oil separator, oil heater.
CH05 – Chilled water flow fault: Check flow switch, pump, strainer, GPM vs design.
CH06 – High chilled water temp: Return water >65°F. Check load, setpoint, staging.
CH07 – Low chilled water temp: Supply water <35°F. Check setpoint, low ambient, antifreeze concentration.
CH08 – Economizer fault (if equipped): Check economizer valve, refrigerant side flow.
CH09 – Compressor discharge overtemp: >225°F. Check oil cooling, superheat, capacity control.
CH10 – Phase loss: Check all three phases at compressor terminal block.

REFRIGERANT TARGETS — TRANE RTU R-410A
Suction pressure at 75°F ambient: 130–150 psig.
Discharge pressure at 75°F ambient: 280–320 psig.
Subcooling target: 10–15°F (fixed orifice) or 10–12°F (TXV).
Superheat at suction service valve: 12–18°F (fixed orifice) or 8–12°F (TXV).`
}, {
  id: "d3",
  name: "Daikin VRV/VRF Systems — Commissioning & Fault Codes",
  brand: "Daikin",
  type: "Service Manual",
  tags: ["VRF", "VRV", "Daikin", "fault codes", "commissioning", "serial decode"],
  content: `DAIKIN VRV/VRF SYSTEMS — FIELD COMMISSIONING & FAULT CODES

SERIAL NUMBER DECODE (Daikin)
Format: [Factory][Year][Month][Sequence]. Year code: G=2016, H=2017, J=2018, K=2019, L=2020, M=2021, N=2022, P=2023, Q=2024. Month: 1–9=Jan–Sep, X=Oct, Y=Nov, Z=Dec.
Example: T-K-5-xxxxx = Tochigi factory, 2019, May.
Model: RXYQ = VRV IV outdoor unit (Q=heat pump). Capacity in MBH follows (072=72,000 BTU=6T, 096=8T, 120=10T, 144=12T, 168=14T, 192=16T). REYQ = VRV IV-s Heat Recovery.

PRE-STARTUP REQUIREMENTS
1. Crankcase heaters: Energise outdoor units minimum 12 hours before first startup. 24 hours preferred in ambient <40°F. Verify heater operation with clamp meter (typical 1.5–3A draw per unit).
2. Refrigerant charge: VRV IV ships with factory charge for 164 feet (50m) equivalent pipe. Additional charge required per spec: R-410A at 0.6 oz/ft (18g/m) for pipe diameter ≥5/8".
3. Pipe pressure test: Nitrogen pressure test to 551 psig (38 kg/cm²) for 24 hours. Maximum allowable drop: 1 psig (0.07 kg/cm²) over 24 hours after temperature stabilisation.
4. Leak check: Electronic detector at all joints plus brazing points after pressure test.
5. Evacuation: Pull to <500 microns (<0.67 mbar). Hold 30 minutes. Rise >1000 microns indicates moisture or leak.
6. Pipe length input: Program total equivalent pipe length and height difference via BRC1H52 or PC configurator. Affects charging algorithm.

COMMISSIONING PROCEDURE
Step 1: Complete wiring check — power wiring, F1/F2 communication bus (polarity matters), addressing.
Step 2: Addressing — each indoor unit must have unique address. Set via DIP switches on indoor PCB or via BRC remote.
Step 3: Indoor unit count: Outdoor unit auto-detects connected indoor units during test run.
Step 4: Test run initiation: Press MODE + FAN simultaneously on BRC1H52 for 3 seconds. Enter test run code. Unit runs 30–60 minutes for auto-commissioning.
Step 5: During test run: Record suction pressure (100–180 psig), discharge pressure (350–450 psig), discharge superheat (target 18–25°F), subcooling (8–15°F at outdoor unit service port).
Step 6: Parameters to document at 30, 60, 90 minutes: suction/discharge pressures, outdoor ambient, indoor entering/leaving temps, all indoor unit temperatures.
Step 7: Refrigerant quantity check: VRV calculates charge automatically. If auto-charge mode available, system will display charge required.

DAIKIN VRV IV FAULT CODES
A0 – Protection device activation (check all safety devices: HP/LP switches, float switches).
A1 – PCB (main control board) fault: Replace PCB if fault persists after power cycle.
A3 – Drain level control fault (indoor): Check float switch, condensate pump, drain line.
A5 – Freeze protection (indoor coil <32°F): Check airflow, filter, low charge.
A6 – Fan motor overload (indoor): Check fan motor, capacitor, blower wheel.
A7 – Flap motor fault (indoor): Check swing flap motor wiring and mechanical binding.
A9 – EEV (electronic expansion valve) fault: Check EEV coil resistance (typically 46 ohms), mechanical operation.
AA – Humidifier fault (if equipped).
AF – Drain pump fault: Check pump operation, float switch, wiring.
AH – Dirty filter indicator (if equipped with differential pressure sensor).
C4 – Heat exchanger thermistor fault (indoor): Check thermistor resistance. Liquid pipe sensor: 10K at 77°F. Gas pipe sensor: 10K at 77°F.
C5 – Gas pipe thermistor fault (indoor).
C9 – Remote controller thermistor fault.
CA – Return air thermistor fault.
E1 – PCB fault (outdoor): Replace outdoor main PCB.
E3 – Discharge pressure too high: >609 psig (42 kg/cm²). Check: condenser coil, fans, charge, ambient temp.
E4 – Discharge temperature too high: >230°F (110°C). Check: low suction pressure, low charge, compressor valve.
E5 – Compressor motor overcurrent: Check compressor winding resistance phase to phase (should be equal, typically 0.5–2 ohms). Check inverter output voltage.
E6 – Compressor startup failure: Check power supply voltage, inverter, refrigerant charge, crankcase heater.
E7 – Outdoor fan motor fault: Check fan motor winding, capacitor (single-phase fans), inverter (VFD fans).
E8 – Input current protection: Check supply voltage, power factor, all phases present and balanced.
E9 – Transmission (communication) fault between inverter board and main PCB.
EA – Reversing valve fault (heat pump): Check 4-way valve coil, stuck valve, system pressures.
F3 – Discharge pipe thermistor fault (outdoor): Check thermistor resistance.
F6 – Refrigerant overcharge or liquid back: Suction superheat <5°F. Check: EEV, charge, hot gas bypass.
H0 – Sensor fault (general): Run self-diagnostics via remote.
H6 – Compressor position sensor fault (inverter compressor): Check position sensor PCB.
H7 – Fan motor position sensor: Check fan motor encoder signal.
H8 – Input current transformer fault: Check CT sensor.
H9 – Outdoor air thermistor fault: Check thermistor resistance (10K at 77°F).
HJ – Capacity control fault.
J1 – Pressure sensor fault (high or low side): Check wiring, replace transducer if shorted.
J3 – Discharge thermistor fault.
J6 – Suction thermistor fault.
L0 – Inverter protection activation (outdoor): Check inverter temperature, airflow through inverter section.
L1 – Inverter PCB fault: Check DC bus voltage (should be 1.41 × AC input).
L4 – Inverter heat sink overtemperature: Check cooling fan, fin fouling, ambient temp.
L5 – Inverter DC overcurrent: Check compressor windings, refrigerant charge.
L8 – Compressor overcurrent (detected at inverter): Same checks as E5.
L9 – Compressor startup failure (inverter): Check position sensor, refrigerant charge.
LC – Communication fault (outdoor inverter to main PCB).
P1 – Voltage imbalance: Check all three phases. Maximum allowable imbalance: 2%.
P4 – Heat sink thermistor fault.
U0 – Refrigerant shortage: Add refrigerant, find and repair leak.
U2 – Low voltage or instantaneous power failure: Check supply voltage, check for sags.
U4 – Communication fault between outdoor and indoor units: Check F1/F2 wiring, polarity, termination.
UA – Trial operation incomplete: Complete commissioning sequence.
UF – System mismatch: Indoor/outdoor combination not in compatibility matrix. Check model combination.

REFRIGERANT — R-410A VRV IV
Suction pressure: 100–140 psig (25–35°F sat.) in cooling mode.
Discharge pressure: 350–420 psig (110–120°F sat.) in cooling mode at 95°F ambient.
Discharge superheat: 18–25°F.
Subcooling at outdoor unit liquid service port: 8–15°F.`
}, {
  id: "d4",
  name: "Refrigerant Safety & Handling — R-410A, R-22, R-454B",
  brand: "General",
  type: "JLL SOP",
  tags: ["R-410A", "R-22", "R-454B", "safety", "EPA 608", "PPE", "recovery", "GWP"],
  content: `REFRIGERANT SAFETY & HANDLING SOP — JLL MTS

SCOPE: All JLL MTS technicians handling refrigerants. Compliance with EPA Section 608, ASHRAE 15, OSHA 29 CFR 1910.1000, and local codes required.

REFRIGERANT IDENTIFICATION & PROPERTIES

R-410A (Most common in use):
Type: HFC blend (R-32/R-125 50/50). GWP: 2088. ODP: 0.
Cylinder: Pink/rose. Pressure at 77°F: 201 psig. Critical temp: 160.7°F.
Boiling point: -61.9°F. Mildly flammable (A1 — non-flammable per ASHRAE 34).
Being phased out per AIM Act. New equipment after 2025 must use lower-GWP alternatives.

R-22 (Legacy systems only):
Type: HCFC. GWP: 1810. ODP: 0.034.
Cylinder: Green. Pressure at 77°F: 123 psig. Critical temp: 204.9°F.
Production ended 2020. Reclaimed R-22 only. Document purchase/use. Cost: $50–120/lb.
Never mix with R-410A or other refrigerants.

R-454B (Puron Advance — new equipment replacement for R-410A):
Type: HFO/HFC blend (R-32/R-1234yf). GWP: 467. ODP: 0.
Cylinder: Light green. Pressure at 77°F: 186 psig. Mildly flammable (A2L classification).
ASHRAE 34 Class A2L: Low burning velocity (<10 cm/s). Requires spark-free tools in confined spaces.
Charge limit per ASHRAE 15: 35 lbs in occupied spaces without additional ventilation.

R-32 (Pure refrigerant, increasingly common):
Type: HFC. GWP: 675. ODP: 0.
Cylinder: Red. Pressure at 77°F: 174 psig. A2L flammable classification.
Higher pressure and lower charge weight than R-410A.

R-407C (Drop-in for R-22 in some applications):
Type: HFC blend. GWP: 1774. ODP: 0.
Cylinder: Brown/tan. Pressure at 77°F: 130 psig. Temperature glide: ~9°F.
Must charge as liquid (bottom of cylinder) due to glide.

R-134a (Chillers, some RTUs):
Type: HFC. GWP: 1430. ODP: 0.
Cylinder: Light blue. Pressure at 77°F: 71 psig. Non-flammable (A1).

PPE REQUIREMENTS
Minimum for all refrigerant work:
- Safety glasses (ANSI Z87.1) — mandatory always
- Nitrile or neoprene gloves (cryogenic rated for liquid refrigerant contact)
- Long sleeves — frostbite protection from liquid refrigerant
- No open flames — arc flash risk, and A2L refrigerant flammability

Additional for A2L refrigerants (R-454B, R-32, R-1234yf):
- Non-sparking tools in confined spaces
- Refrigerant detector set to alert at 25% LFL
- Natural ventilation or forced ventilation in enclosed machine rooms

High-concentration exposure:
- Full face shield if servicing open systems
- Air-supplied respirator if concentration >1000 ppm in confined space
- Never enter a space with oxygen <19.5% without SCBA

RECOVERY REQUIREMENTS (EPA 608)
Required before opening any system — no exceptions.
Certified recovery equipment required. Technician EPA 608 certification required.
Recovery efficiency required:
- Systems >200 lbs: 90% if compressor works, 80% if not.
- Systems 50–200 lbs: 90% / 80%.
- Systems <50 lbs: 90% / 80%.
- MVAC: 90%.
Recovery cylinder fill: Maximum 80% of capacity by weight. Never overfill.
Never vent refrigerant — federal violation, fines up to $44,539 per day per violation.

LEAK DETECTION
Electronic leak detector: Required for systems >50 lbs. Calibrate before use.
Maximum leak rate allowed:
- Comfort cooling >50 lbs: 15% per year.
- Process refrigeration: 35% per year.
- Commercial refrigeration: 20% per year.
Leak found: Repair within 30 days (comfort cooling) or 120 days with refrigerant retrofit plan.
Document all leaks, repairs, and refrigerant added.

CYLINDER HANDLING
- Always store upright, capped, and chained.
- Never heat cylinders above 125°F.
- Never refill disposable cylinders — federal violation.
- Recover cylinders: Yellow top, grey body — clearly label contents.
- Transport: Cylinder valve caps installed, secured from rolling or falling, not in passenger compartment.

REFRIGERANT LOG (Required)
Record for each service call: Date, equipment ID, type/amount recovered, type/amount added, leak test results, technician name and 608 cert number. Retain records 3 years.`
}, {
  id: "d5",
  name: "HVAC Electrical — Controls, Wiring & Troubleshooting",
  brand: "General",
  type: "Wiring Reference",
  tags: ["controls", "24V", "thermostat", "VFD", "electrical", "NFPA 70E", "low voltage", "three phase"],
  content: `HVAC ELECTRICAL REFERENCE — CONTROLS, WIRING & TROUBLESHOOTING

LOW VOLTAGE CONTROL WIRING (24VAC Standard)
Transformer: Primary 120V or 208/240V. Secondary 24VAC. Typical VA ratings: 20VA (residential), 40VA (light commercial), 75VA (commercial RTU).
Fusing: 3A fuse on secondary — always check before assuming transformer failed.

Standard terminal designations:
R  = 24V hot from transformer secondary (split system: Rh=heat, Rc=cool)
C  = Common (return to transformer). Missing C = floating common = intermittent operation
Y  = Cooling stage 1 / compressor contactor
Y2 = Cooling stage 2 (second compressor or unloading)
G  = Indoor fan (continuous fan)
W  = Heat stage 1 (gas valve, electric heat, HP auxiliary)
W2 = Heat stage 2
E  = Emergency heat (heat pump)
O  = Reversing valve — energised in COOLING (Carrier, Trane, Lennox, most brands)
B  = Reversing valve — energised in HEATING (Rheem, Ruud, some older units)
L  = Indicator / fault signal
X  = Auxiliary / accessory
DH = Dehumidify signal
V  = Ventilation damper
S  = Sensor / occupancy input

VOLTAGE CHECKS — 24V SYSTEM
Good: 24–28VAC measured R-to-C at air handler/furnace with no load.
Under load (contactor pulled in): Should not drop below 22V. If <22V: check transformer VA rating vs load, check for shorts on secondary.
Check transformer: 24VAC R-to-C at air handler, NOT at stat. Voltage at stat drops over long wire runs.
Thermostat wire resistance: Max 2 ohms for reliable signal. Test with ohmmeter wire-to-wire.

COMMON LOW VOLTAGE FAULTS
1. No C wire: Modern smart stats need C. Symptoms: stat display dims, random restarts, Wi-Fi drops. Solution: Run C wire or use adapter kit.
2. Shorted Y to ground: Compressor runs continuously or contactor buzzes. Check outdoor unit wiring, TXV coil grounding.
3. Open W circuit: No heat. Check: gas valve coil (24VAC across terminals), furnace limit switches, high limit switch (manual reset on some models).
4. R-to-C blown fuse: Unit completely dead. Replace 3A fuse. If blows again: isolate each circuit (Y, W, G) to find short.
5. Intermittent C: Common with wire nuts or spade connectors. Vibration causes arcing. Replace with proper wire nut or terminal block connection.
6. G terminal energised without call: Check stat subbase contacts, board, or wiring short.

THREE-PHASE POWER — COMMERCIAL HVAC
Voltage standards: 208V (three-phase four-wire wye), 230V, 460V, 480V, 575V.
Acceptable voltage tolerance: ±10% of nameplate.
Phase imbalance: Maximum 2% voltage imbalance. Calculate: (Max deviation from average / Average) × 100.
Example: 457V, 461V, 454V. Average=457.3V. Max deviation=461-457.3=3.7V. Imbalance=3.7/457.3×100=0.8%. Acceptable.
Effect of imbalance on motor: 1% voltage imbalance causes ~6–7% current imbalance. Can overheat windings.
Phase reversal: Compressors and fans will run backwards. Install phase loss/reversal relay. Motor will not start or trips immediately.
Phase loss: Never allow single-phase operation of three-phase equipment. Compressor will draw locked rotor amperage and fail quickly.

COMPRESSOR ELECTRICAL CHECKS
Winding resistance (ohmmeter, power off, terminals disconnected):
- T1-T2, T2-T3, T1-T3 should be approximately equal.
- Common-to-run, Common-to-start, Run-to-start relationship.
- Winding-to-ground: Must be >100,000 ohms (∞ on standard meter). Less = failed winding.
Typical resistance values: Scroll compressor 2-5T: T1-T2 0.5–2.0 ohms. Larger compressors lower resistance.
Megohm test: 500V DC megohmmeter. Good: >100 Megohms. Suspect: 1–100 Megohms. Failed: <1 Megohm. Do not megohm inverter-driven compressors — damages inverter.

CAPACITORS
Run capacitor: Microfarad (µF) rating on nameplate. Acceptable range: ±6% of rating.
Test with capacitor tester (multimeter capacitance mode). Never short a charged capacitor.
Dual run capacitor: Two capacitors in one can — C (common), FAN, HERM (hermetic/compressor) terminals.
Start capacitor: Much higher µF, only in circuit during start (< 3 seconds). Discharged by bleed resistor. If resistor failed: cap stays charged — shock hazard.
Typical values: Condenser fan motor: 5–10µF/370V. Compressor: 35–80µF/370V. Some: 440V rated (better life in high ambient).

VFD / VARIABLE FREQUENCY DRIVE
Pre-check: Confirm input voltage (L1-L2-L3) and output voltage (T1-T2-T3) within spec.
Common fault codes across brands:
OC = Overcurrent (check motor winding, output short, too-fast acceleration ramp)
OV = DC bus overvoltage (check input voltage, deceleration ramp, braking resistor)
UV = Undervoltage (check input voltage, connections)
OH = Overheat (check cooling fan, fin fouling, ambient temp, VFD sizing)
GF = Ground fault (check motor leads, motor winding to ground)
OL = Motor overload (check motor amps vs FLA, ambient, ramp times)
Do not megohm motors controlled by VFDs with VFD connected.
Minimum motor insulation for VFD: Use inverter-duty motor (NEMA MG1 Part 31) for best life.

NFPA 70E — ARC FLASH SAFETY
Incident energy analysis required for work on energised equipment >50V.
Minimum PPE without arc flash study: Category 1 = 4 cal/cm² rated clothing. Arc flash face shield, leather gloves over rubber insulating gloves.
For panels >240V commercial: Assume Category 2 minimum (8 cal/cm²) without study.
LOTO procedure: Lockout at disconnect, verify absence of voltage on all phases with CAT III/IV meter before touching any conductors.
Never work inside energised panel unless justified by NFPA 70E exception and PPE requirements met.

MOTOR MEGOHM TESTING GUIDE
Test voltage by motor nameplate voltage:
<250V nameplate: Use 500V DC megohmmeter.
250–600V: Use 500V or 1000V DC.
>600V: Use 1000V DC.
Minimum acceptable: For motors in service: 1 Megohm per kV of nameplate voltage + 1 Megohm minimum.
New motor before first start: Minimum 100 Megohms.
Record date, temperature, humidity, and result. Temperature correct if needed: Resistance halves for every 10°C rise.`
}, {
  id: "d6",
  name: "Split Systems — Fault Codes, Charging & Troubleshooting",
  brand: "General",
  type: "Service Manual",
  tags: ["split system", "fault codes", "heat pump", "mini-split", "Carrier", "Trane", "Lennox", "serial decode"],
  content: `SPLIT SYSTEM & HEAT PUMP — FIELD SERVICE REFERENCE

SERIAL NUMBER DECODE BY BRAND

Carrier/Bryant/Payne:
Format: 4-digit factory + year letter + 2-digit week + sequence.
Year codes: A=2011, B=2012, C=2013, D=2014, E=2015, F=2016, G=2017, H=2018, J=2019, K=2020, L=2021, M=2022, N=2023, P=2024, R=2025.
Model: 24ACC = split condensing unit. 24ANA = Infinity single-stage. First digits = product line. Tonnage: 018=1.5T, 024=2T, 030=2.5T, 036=3T, 042=3.5T, 048=4T, 060=5T.
Voltage: A=208/230-1ph, B=208/230-3ph.

Trane/American Standard:
Format: First 2 digits = year, next 2 = week.
Model: 4TTR = R-410A split heat pump. 4TTB = straight cool condenser. 4TEE = air handler.
Tonnage: 3 digits after product code × 1000 BTU (018=18,000=1.5T, 036=36,000=3T, 060=60,000=5T).

Lennox:
Serial: First digit = year (A=2011, B=2012 etc). Next 2 digits = week. Remaining = sequence.
Model: XC21 = high-efficiency condenser. XP21 = heat pump. EL296V = furnace.

Goodman/Amana:
Serial: First digit = year (9=2009, 0=2010, 1=2011, 2=2012 continuing). Second digit = month (A=Jan, B=Feb, C=Mar... M=Dec skipping I).
Model: GSX = split condenser. GSXC = high-efficiency. DSZC = heat pump.

Rheem/Ruud:
Serial: First 4 digits = week + year (e.g., 0922 = Week 09, 2022).
Model: RA = condenser. RP = heat pump. RHSL = air handler.

York/Johnson Controls:
Serial: Starts with 4-letter factory code, then year digit, week, sequence.
Year digit: A=2010, B=2011... continuing.

SPLIT SYSTEM FAULT CODES — CARRIER INFINITY SERIES
Flash code from diagnostic LED on control board (count flashes, pause, repeat):
1 flash – Normal operation / no fault stored.
2 flashes – Low pressure switch lockout: <22 psig (R-410A). Check charge, filter drier, TXV, airflow.
3 flashes – High pressure switch lockout: >600 psig. Check condenser coil, fan motor, overcharge.
4 flashes – Open start circuit: Check start capacitor (µF within ±6%), start relay/potential relay.
5 flashes – Open run circuit: Check run capacitor, compressor winding resistance.
6 flashes – Compressor over-temperature: Let cool 30 min. Check charge, head pressure.
7 flashes – Outdoor ambient below minimum operating temp (typically 55°F cooling, -20°F heating).
8 flashes – High compressor discharge temperature: >260°F. Check charge, outdoor airflow, head pressure.
9 flashes – Low voltage: <18VAC from indoor air handler. Check 24V transformer, wiring.
11 flashes – Check stat signal: Stat calling but no valid signal or missing C wire.
24 flashes – Loss of charge: <7 psig. Refrigerant critically low. Find and fix leak before charging.
33 flashes – Limit circuit open (indoor): Check filter, blower motor, coil freeze, duct restrictions.
45 flashes – Control board fault: Replace board.
13 flashes – Communication fault (Infinity systems): Check comm wire between indoor/outdoor units.

CARRIER/BRYANT WEATHERMAKER — INDOOR ERROR CODES
E0 – EEPROM fault: Replace control board.
E1 – Indoor unit communication fault (to outdoor).
E2 – Low indoor coil temperature: Coil <28°F, airflow issue or low charge.
E3 – Indoor fan motor overload: Check blower motor amp draw vs FLA.
E4 – Condensate drain overflow: Float switch tripped. Check drain pan, line, trap.
E5 – High indoor coil temperature (cooling): >65°F coil temp, check charge, airflow.
E6 – Reversing valve fault (heat pump): 4-way valve stuck. Check coil, 24V signal, stuck spool.

TRANE SPLIT SYSTEM FAULT CODES (XR/XL series)
LED codes on defrost control board:
Continuous ON – Normal cooling/heating.
1 flash – Normal defrost completed.
2 flashes – Outdoor coil sensor fault: Check thermistor resistance (10K at 77°F). Replace if open/shorted.
3 flashes – Defrost thermostat stuck open: Check at <30°F outdoor coil temp.
4 flashes – Outdoor fan motor fault: Check winding resistance, capacitor, bearing.
5 flashes – High pressure cutout: >590 psig (R-410A). Check condenser coil, charge.
6 flashes – Low pressure cutout: <54 psig. Check charge, indoor airflow, TXV.
7 flashes – Compressor protection: High discharge temp or overcurrent. Check winding, capacitor, charge.

HEAT PUMP OPERATION — CRITICAL DIFFERENCES
Reversing valve (4-way valve):
- Most brands: O terminal energised = COOLING (valve shifts to cool mode).
- Rheem, Ruud, some GE: B terminal energised = HEATING (valve shifts to heat mode).
- Defrost cycle: Outdoor unit goes to heating mode briefly to melt ice — normal.
- Stuck reversing valve: System heats when should cool (or vice versa). Check 24V at O/B terminal. Listen for valve shift click. Can sometimes free by cycling 10 times rapidly.

Defrost cycle: Normal for outdoor coil to ice in heating mode. Defrost initiates on time+temp or demand. Board checks outdoor coil temp (typically trips at <26°F). Defrost runs 2–10 minutes, terminates at coil temp >57°F or max 10 minutes. During defrost: indoor unit may blow slightly cool air — inform building occupants.

Balance point: Temperature at which heat pump capacity equals building heat loss. Below balance point, supplemental/emergency heat activates. Typically 25–35°F depending on unit efficiency and building load.

REFRIGERANT CHARGING — SPLIT SYSTEMS
R-410A superheat method (fixed orifice systems):
1. Connect manifold gauges at outdoor unit service valves.
2. Measure outdoor ambient temp (dry bulb) and indoor wet bulb (evaporator inlet).
3. Use manufacturer superheat chart — target typically 10–20°F at suction line service valve.
4. High superheat = undercharged. Low superheat = overcharged or liquid slugging TXV.
Subcooling method (TXV systems):
Target: 10–15°F liquid line subcooling. Measure liquid line temp and compare to condensing temp from discharge pressure on PT chart.
Add charge in liquid phase at liquid line service valve. Charge slowly.

SPLIT SYSTEM STARTUP CHECKLIST
1. Verify supply voltage ±10% nameplate. Check phasing (3-phase).
2. Verify indoor filter clean, all supply/return registers open.
3. Check refrigerant line insulation intact. Suction line should feel cold and sweat in humid weather.
4. Verify thermostat wiring correct — check all terminals with meter.
5. Start in cooling. Let stabilise 15 minutes.
6. Record: suction pressure, discharge pressure, liquid line temp, suction line temp, indoor DB/WB, outdoor DB, calculated superheat or subcooling.
7. Measure temperature split: Return air minus supply air. Target 16–22°F for cooling.
8. Verify amp draw on compressor and outdoor fan within nameplate range.`
}, {
  id: "d7",
  name: "Gas Furnaces — Fault Codes, Diagnostics & Serial Decode",
  brand: "General",
  type: "Service Manual",
  tags: ["furnace", "fault codes", "gas heat", "Carrier", "Trane", "Lennox", "Goodman", "serial decode", "ignition"],
  content: `GAS FURNACE — FIELD SERVICE REFERENCE
SERIAL NUMBER DECODE
Carrier/Bryant furnaces: Same format as split systems — year letter in position 5.
Lennox: Year letter first, week second. G61MP = multi-position 1-stage. EL296V = 96% 2-stage variable.
Goodman/Amana: Year digit first, month letter second. GMVC = variable-speed modulating. GMSS = single-stage.
York/Johnson Controls: Serial starts with 4 factory letters. TMMV = modulating variable. TG8S = standard efficiency.
Rheem/Ruud: Week+year format. RGFJ = standard. R96V = 96% variable-speed.

Efficiency ratings decode:
80 in model = 80% AFUE (standard). 90/92/95/96/97/98 = high efficiency (condensing). Condensing units have PVC flue pipe and condensate drain.

FURNACE FAULT CODES — CARRIER/BRYANT WEATHERMAKER 9/10 SERIES
LED flash codes — count flashes, 2-second pause, repeat:
1-1 (1 pause 1) – Steady ON: Normal operation, no fault.
1-3 – Limit circuit open: High limit or rollout switch tripped. Check: dirty filter, blocked return/supply, blower motor, inducer RPM, cracked heat exchanger, oversized furnace for ductwork.
1-4 – Ignition failure: 3 failed ignition attempts → lockout. Check: gas pressure (3.5" WC NG, 11" WC LP), igniter resistance (normal silicon carbide: 45–90 ohms cold; normal hot surface igniter Norton 271 type: 40–75 ohms), flame sensor (clean with fine steel wool if coated/oxidised), gas valve output 24VAC on call.
2-1 – Control board fault: Replace.
2-2 – Inducer motor fault: RPM too low or not running. Check inducer motor, wiring, pressure switch hose.
2-3 – Pressure switch stuck open: Inducer running but pressure switch not proving. Check: clogged condensate trap (high efficiency), pinched/cracked pressure switch hose, failed pressure switch (normally open, closes on negative pressure ~0.5–1.5" WC depending on model).
2-4 – Pressure switch stuck closed: Check for pressure switch hose off inducer or pressure switch weld-closed.
3-1 – High limit switch open (persistent): Check ΔT across heat exchanger. Should be <60°F rise at design airflow. If >80°F: low airflow, dirty heat exchanger, gas overfired.
3-2 – Flame sensed without call for heat: Check gas valve (leaking), flame sensor wiring short to ground.
3-3 – Gas valve fault or open primary limit: Check primary limit switch continuity. Check gas valve coil resistance (40V coil: typically 25–40 ohms each stage).
3-4 – Rollout switch open: IMMEDIATE CONCERN — do not reset without full inspection. Causes: cracked heat exchanger, blocked flue, high gas pressure, dirty burners creating flame impingement.
4-1 – Inlet air fault (2-pipe sealed combustion): Check intake pipe for blockage (bird nest, ice, insects), verify pipe length vs model spec.
4-2 – TWINNING fault (if two furnaces wired in parallel).
4-3 – Control board memory fault: Replace board.
4-4 – Control board defective: Replace.
5-1 – Duplicate rollout: As above — heat exchanger inspection mandatory.

CARRIER/BRYANT FAULT CODES — INFINITY COMMUNICATING FURNACE
(Displayed on thermostat or furnace board LCD if equipped)
E01 – Low-stage pressure switch did not close: Check inducer, pressure switch, condensate.
E02 – High-stage pressure switch did not close: Low-stage only proving. Check high-stage pressure switch set point.
E03 – Rollout switch: As above.
E04 – Open limit switch: Filter, airflow, blower motor.
E05 – Flame lost after ignition: Check gas pressure, flame sensor, dirty burner ports.
E06 – Ignition failure lockout: Check igniter, gas valve, pilot orifice (standing pilot models).
E07 – Blower motor fault (variable speed ECM): Check motor winding, connector, control board signal.
E08 – Inducer motor fault.
E09 – Control board fault.

LENNOX MERIT/ELITE/DAVE LENNOX FURNACE FLASH CODES
2 flashes – System lockout: Ignition failure after 3 or 5 attempts. Manual reset required (cycle power or stat).
3 flashes – Draft pressure fault: Pressure switch won't close. Check inducer, blocked flue, condensate trap.
4 flashes – Open high-temperature limit: Filter, blower, ductwork restriction.
5 flashes – Flame sensed with gas valve closed: Gas valve leaking or flame sensor shorted.
6 flashes – 115V AC power reversed polarity: Check wiring, verify neutral and hot correct.
7 flashes – Rollout switch: Do not reset — inspect heat exchanger.
8 flashes – Ignition failure.
9 flashes – Low/high gas pressure switch open (if equipped).

GOODMAN/AMANA FURNACE FAULT CODES
2 flashes – System lockout (ignition failure × 3).
3 flashes – Pressure switch failure.
4 flashes – Open temperature limit switch.
5 flashes – Flame present with gas valve off: Possible shorted flame sensor wire.
6 flashes – Rollout switch open.
7 flashes – Low flame signal: Dirty flame sensor, weak flame (check gas pressure, burner orifice).
Continuous flashing – Normal operation (some Goodman boards blink continuously during normal run).

IGNITION SYSTEM TROUBLESHOOTING
Hot surface igniter (HSI) — silicon carbide (grey/black, brittle):
Cold resistance: 45–90 ohms. If >150 ohms or open → replace.
Check voltage at igniter terminals during ignition trial: 120V (most) or 240V (some older).
Do NOT touch igniter surface — skin oils cause premature failure. Handle with gloves.
Typical igniter life: 5–7 years. Replace proactively on 10-year+ furnaces during tune-up.

Silicon nitride igniter (ivory/white, more durable):
Cold resistance: 25–75 ohms. Less brittle than silicon carbide.
Same voltage check procedure.

Flame sensor (rectification type):
Measures microamp signal in flame: Normal reading 2–6 µA DC. Below 1 µA = replace or clean.
Check: Set multimeter to DC microamps. Connect in series between sensor lead and sensor terminal.
Clean with fine steel wool or Scotch-Brite — do NOT use sandpaper (too abrasive, damages coating).
Causes of low signal: Oxidised sensor, improper grounding, gas pressure too low (weak flame), wrong gas/air mix.

GAS PRESSURE — MANIFOLD AND SUPPLY
Natural gas: Supply pressure at gas valve inlet: 5–7" WC. Minimum: 4.5" WC.
LP gas: Supply pressure: 11–14" WC. Minimum: 11" WC.
Manifold pressure (at gas valve outlet, downstream):
- NG low fire: 1.5–2.0" WC. NG high fire: 3.2–3.5" WC.
- LP low fire: 4.5–5.0" WC. LP high fire: 10–11" WC.
Check with magnehelic or manometer at burner manifold test port.
Low gas pressure symptoms: Yellow/lazy flames, hard starts, ignition failure, incomplete combustion.
High gas pressure: Lifting flames, rollout risk, carbon monoxide.

HEAT EXCHANGER INSPECTION
Visual inspection with camera/mirror:
- Cracks around welds, ports, stress points.
- Rust scaling, holes visible.
- Soot deposits on outside of heat exchanger (combustion leak).
Test with flame: Light incense stick, hold at each supply register. If flame deflects or wavers when blower starts → combustion leak present.
CO measurement: Take CO reading in supply air stream. >9 ppm CO air-free = investigate. >100 ppm = shut down immediately.
Cracked heat exchanger: Lock out unit. Do not operate. CO poisoning risk.

CONDENSATE MANAGEMENT — HIGH EFFICIENCY (90%+)
Condensate pH: 3–4 (mildly acidic). Neutraliser recommended before entering floor drain in some jurisdictions.
Condensate production: 1–2 gallons per hour typical.
Condensate trap: Must be primed and clear. Blocked trap = pressure switch won't prove = no heat call.
Drain line: Must slope continuously to drain. No sags (standing water = blockage).
Freeze protection: Condensate drain must not be exposed to freezing temps.`
}, {
  id: "d8",
  name: "Boilers — Gas, Hot Water & Steam Service Reference",
  brand: "General",
  type: "Service Manual",
  tags: ["boiler", "fault codes", "hydronic", "steam", "Burnham", "Weil-McLain", "Lochinvar", "Navien", "Viessmann", "serial decode"],
  content: `BOILERS — HOT WATER & STEAM FIELD SERVICE REFERENCE

SERIAL NUMBER DECODE BY BRAND

Burnham:
Serial format: Year-Week-Sequence (e.g., 23-04-XXXXX = 2023, Week 4).
Model: ES2 = series 2 cast iron. MPO = oil-fired. Alpine = high-efficiency condensing.

Weil-McLain:
Serial: MMYYXXXXXX format (MM=month, YY=year).
Model: GV90 = 90% AFUE gas. Gold CGi = cast iron. Ultra = condensing. EG = Series Gold.

Lochinvar:
Serial: YYWWXXXXX (YY=year, WW=week).
Model: Knight = mod-con (modulating condensing). WHN = hot water. SYNC = storage combo.

Navien (condensing combi and boilers):
Model: NCB = combi boiler. NFB = boiler only. NFC = cascade. CH = combi heat.
Serial: 8-digit on rating plate.

Viessmann:
Model: Vitodens 200-W = condensing combi. Vitodens 100-W = heating only.
Serial: Production date stamped on unit rating plate.

Peerless:
Model: MI = cast iron gas. WBV = gas hot water. PUREFIRE = condensing.

BOILER CONTROLS & SAFETY DEVICES
Aquastat (hot water boiler): Controls burner based on boiler water temperature.
High limit: Typically set 200°F. Shuts burner if boiler overheats. Manual reset on some models.
Operating control (L8148): Differential setting — burner fires when temp drops X°F below setpoint.
LWCO (Low Water Cut-Off): Shuts burner if water level drops. McDonnell-Miller 67/157 common types. Test by slowly opening blow-down valve — burner should shut off. Probe type: Clean annually.
Pressure relief valve: 30 PSI rating standard residential. Test annually — lift lever, ensure valve reseats, no drip after test. Replace if leaking.
Pressure gauge: Normal operating: 12–25 PSI. Cold fill: 12–15 PSI. If pressure rises above 25 PSI: expansion tank waterlogged or system overfilled.
Expansion tank: Bladder/diaphragm type — check air charge with tire gauge (should equal cold fill pressure, typically 12 PSI). Bladder tank that is waterlogged = replace.
Backflow preventer: Required on domestic water makeup connection.

STEAM BOILER CONTROLS
Pressuretrol: Operating control set at 1.0–2.0 PSI (gravity systems). Cut-in differential: 0.5–1.0 PSI.
Vapourstat: For very low pressure systems (<0.5 PSI). More sensitive than pressuretrol.
LWCO: Critical on steam — boiler can go dry. McDonnell-Miller 157S for steam. Blowdown daily on commercial systems.
Sight glass: Shows water level. Should be ½ to ⅔ of sight glass height when boiler is cold. Rising and falling during operation is normal (surging).
Steam traps: Must be functional — test with infrared thermometer or ultrasonic detector. Failed-open trap: both inlet and outlet hot. Failed-closed trap: inlet hot, outlet cold.

HOT WATER BOILER FAULT CODES — LOCHINVAR KNIGHT
E01 – Ignition failure: Check gas pressure, igniter, flame sensor, gas valve.
E02 – Flame loss after ignition: Check gas pressure stability, flame sensor signal (<1 µA = clean/replace), combustion air.
E03 – High limit: Boiler water >210°F. Check circulator, air-bound system, setpoint.
E04 – Blocked flue/air intake: Check vent for blockage, bird/insect screens, condensate drain.
E05 – Temperature sensor fault (supply or return): Check 10K thermistor resistance. 77°F=10K, 140°F=3.8K, 200°F=1.5K.
E06 – Low water temperature differential: Check for short-cycling, incorrect piping, system flow.
E08 – Gas valve fault: Check 24V to gas valve, valve coil resistance.
E10 – Fan fault: Check combustion blower, blocked air intake.
E11 – Communication fault (cascade/BACnet).
E12 – Igniter fault: Check igniter continuity and voltage.
E27 – High water temperature: >185°F supply. Check high limit, strainer, flow.
E28 – Delta-T (supply-return differential) too high: Poor flow — check circulator, air separator, balance valves.
E32 – Return sensor fault.
E38 – Header sensor fault (cascade systems).

NAVIEN NCB/NFB COMBI BOILER FAULT CODES
E001 – No ignition: Check gas pressure, inlet, valve coil, igniter.
E002 – Abnormal flame: Unstable combustion. Check gas pressure, venting, combustion air.
E003 – Ignition failure after max retries: Lockout. Check all E001/E002 causes plus check for air in gas line.
E004 – False flame: Flame sensor signal without call. Check sensor, gas valve.
E010 – Overheated: Check flow rate, scale buildup, heat exchanger.
E012 – Flame loss during operation.
E016 – Exhaust temperature high: Check blocked vent, improper vent length.
E030 – Exhaust sensor fault.
E033 – Outgoing water temperature sensor fault.
E036 – Incoming cold water sensor fault.
E046 – Fan motor fault: Check combustion blower wiring, operation.
E047 – Air pressure sensor fault.
E060 – Domestic hot water (DHW) high temperature: Check DHW sensor, heat exchanger scale.
E067 – Flow sensor fault (domestic water).
E109 – Low water pressure (if equipped with pressure sensor): Check fill, pressure relief valve.
E110 – Water pressure sensor fault.
E351 – PC communication error.
E407 – PCB fault.

WEIL-MCLAIN/BURNHAM FAULT CODES (GV90/Ultra series)
E01 – Ignition lockout.
E02 – High limit open.
E03 – Pressure switch fault.
E04 – Low water.
E05 – Sensor fault (supply temp).
E06 – Sensor fault (return temp).
E07 – Flue sensor fault.
E08 – Blocked vent.
E11 – LWCO fault.

HYDRONIC SYSTEM TROUBLESHOOTING
No heat — single zone:
1. Check thermostat call — check for 24V from stat.
2. Check zone valve: 24V at coil, check actuator opens mechanically.
3. Check circulator: Verify operation, rotation direction (check arrow on pump housing), priming.
4. Check air in zone: Bleed radiators at high point. Gurgling = air-bound.
5. Check balance valves not shut.
No heat — all zones:
1. Check boiler operation, fault codes, reset.
2. Check LWCO — may need manual reset after blowdown.
3. Check main circulator (primary loop).
4. Check thermostat wiring.
5. Check gas supply.

Air bleeding procedure:
Start at lowest/closest zone, work to highest/farthest. Open bleed valve on each radiator until water flows steady without sputtering. Check pressure after bleeding — may need to add water.

System fill pressure: Cold system: 12–15 PSI. Hot system at 200°F: 18–25 PSI. If system loses pressure regularly: check pressure relief valve, expansion tank.

Condensate boiler flue pH: 3–5. Neutralizer required in most jurisdictions before drain.
Condensate production: 1–3 gallons/hour on large mod-con boilers.

COMBUSTION ANALYSIS TARGETS (Natural Gas)
O2: 4–6% (ideal). <4% = rich mix, possible CO. >8% = excessive dilution, heat loss.
CO2: 8–10%.
CO (air-free): <100 ppm ideal. >400 ppm = unsafe, adjust combustion air.
Flue temperature: <500°F (should be flue temp minus ambient). Condensing boiler: 100–130°F (condensing mode).
Efficiency: 80%+ standard, 90%+ condensing.`
}, {
  id: "d9",
  name: "Water Heaters — Commercial & Residential Service Reference",
  brand: "General",
  type: "Service Manual",
  tags: ["water heater", "fault codes", "Rheem", "AO Smith", "Bradford White", "Navien", "Rinnai", "tankless", "commercial"],
  content: `WATER HEATERS — COMMERCIAL & RESIDENTIAL FIELD SERVICE REFERENCE

SERIAL NUMBER DECODE BY BRAND

Rheem/Ruud:
Serial format: F (factory) + YY (year) + WW (week) + sequence.
Example: F2304xxxxx = 2023, Week 04.
Model: XG40 = 40-gallon standard gas. PROG50 = ProGlassPLUS 50-gallon. EcoNet = connected line.

AO Smith:
Serial: 4 digits + letter + 6 digits. Letter = year (A=2011 continuing).
Model: GCF = commercial gas. GPVH = tall gas. Vertex = high-efficiency power vent. Voltex = hybrid electric.

Bradford White:
Serial: Year + Month letter + sequence. Year: 9=2009 to present cycling. Month: A=Jan, B=Feb, C=Mar, D=Apr, E=May, F=Jun, G=Jul, H=Aug, J=Sep, K=Oct, L=Nov, M=Dec.
Model: MI50S6FBN = 50-gal standard natural gas. MITW = tall. MITS = short.

State/American/Kenmore:
Same AO Smith serial format (same parent company — Acuity Brands/Rheem for some).

Rinnai (tankless):
Model: V = value series. RL = luxury series. RSC = commercial. i = indoor, e = exterior.
Serial: 9 digits on rating plate.

Navien (tankless/combi):
NPE-A2 = tankless condensing. NPN = non-condensing.

Noritz (tankless):
NRCP = commercial. NRC = residential condensing.

TANK WATER HEATER COMPONENTS & SPECS
Thermocouple (standing pilot): Generates 25–30 mV when heated by pilot. If <20 mV → replace. Millivolt meter required for accurate test.
Thermopile (electronic spark): Generates 300–750 mV. Powers gas valve electronics. Test at gas valve terminals.
Gas valve (combination): Contains main valve, pilot valve, thermostat control, thermal cutoff. Test: 24V or millivolt signal at coil terminals. If no response → replace valve.
Anode rod: Sacrificial magnesium or aluminum rod. Inspect every 2–3 years. Replace when reduced to core wire or <50% original diameter. Extends tank life significantly.
Dip tube: Cold water inlet tube directs cold water to bottom of tank. If broken → cold and hot water mix → inconsistent temperature.
T&P relief valve: Rated 150 PSI and 210°F. Test annually. Replace every 5 years or if leaking.
Expansion tank: Required on closed systems (backflow preventer on supply). Sized per tank volume and supply pressure.

ELECTRIC WATER HEATER TROUBLESHOOTING
Upper thermostat: Controls upper element. Default setting: 120–125°F. High limit: 170°F manual reset.
Lower thermostat: Controls lower element. Set 5–10°F below upper.
Elements: 240VAC, 3500–5500W typical. Check resistance: 240V/5500W = 10.5 ohms. Open = failed. Short to ground = failed.
Test sequence:
1. Check 240V at disconnect.
2. Check both thermostats — reset upper limit (red button) if tripped.
3. Check element resistance (power off, element disconnected).
4. Upper thermostat provides 240V to upper element first. Upper stat shifts power to lower when upper zone satisfied.
Reset procedure: Power off, access upper thermostat panel, press red reset button firmly. If trips repeatedly → check element resistance, thermostat accuracy.

RHEEM/RUUD GAS WATER HEATER FAULT CODES
(LED on gas valve — 1 flash = one-second on/off cycle)
1 flash – Unit working normally.
2 flashes – Thermopile voltage low: Check pilot flame, thermopile condition.
3 flashes – Pilot outage: Check gas supply, pilot orifice, thermocouple/thermopile.
4 flashes – Flammable vapor sensor (FV sensor) lockout: Detect flammable vapors near unit. Ventilate area, remove source, reset.
5 flashes – Temperature exceeded 180°F: Check thermostat setting, scale buildup in tank.
6 flashes – Thermal cutoff: ECO (Energy Cutoff) tripped. Manual reset required — call service.
7 flashes – Gas valve fault: Check gas supply, valve coil.
Continuous flashing – Control module fault: Replace gas valve assembly.

AO SMITH PROLINE/VERTEX FAULT CODES (Power Vent models)
E1 – Ignition failure: Check gas pressure, igniter, flame sensor.
E2 – Overheating: Check scale, thermostat setting, sensor.
E3 – Pressure switch: Check blower, blocked vent.
E4 – Flue overheat: Blocked vent or excessive vent length.
E5 – Temperature sensor fault.
E6 – Gas valve fault.
E7 – Blower/fan fault.
Solid LED – Lockout mode: Power cycle to reset. If repeats → service required.

RINNAI TANKLESS FAULT CODES
11 – No ignition: Check gas pressure (3.5" WC NG minimum at full load), igniter spark, gas valve, air intake.
12 – Flame failure: Flame established then lost. Check gas pressure stability, dirty flame sensor.
14 – Thermal fuse open: Unit overheated. Check scale buildup on heat exchanger, ventilation.
16 – Outgoing temp too high: Check scale, setpoint, flow rate.
31 – Inlet temp sensor fault: Check thermistor, replace if open/shorted.
32 – Outlet temp sensor fault.
33 – Combustion air temp sensor fault.
34 – Outgoing temp sensor 2 fault.
35 – Flue temperature sensor fault.
41 – Bypassed supply water solenoid fault.
42 – Secondary hot water solenoid fault (combi models).
51 – Gas valve fault: Check 24V to valve, coil resistance.
52 – Modulating gas valve fault.
61 – Combustion fan fault: Check blower motor, blocked air intake.
65 – Water flow control valve fault.
66 – Bypass valve fault.
71 – Gas valve solenoid stuck open.
72 – False flame: Sensor detects flame without call.
79 – Inlet water temp too high: Cold supply >104°F (glycol system issue or cross-connection).
Code 10 series – Gas/ignition issues.
Code 30 series – Sensor issues.
Code 60 series – Mechanical component faults.

NAVIEN NPE TANKLESS FAULT CODES
E001 – Ignition failure.
E002 – Flame loss.
E003 – Ignition lockout after retries.
E004 – False flame.
E010 – Overheating.
E012 – Thermal fuse.
E016 – Exhaust high temp.
E030 – Exhaust thermistor.
E033 – Outlet thermistor.
E036 – Cold water thermistor.
E046 – Fan motor fault.
E047 – Air pressure sensor.
E060 – Domestic hot water high temp.
E110 – Water pressure sensor.

COMMERCIAL WATER HEATER — ADDITIONAL CHECKS
Power venting: Check vent motor operation, verify suction/pressure, clean motor screen annually.
Direct vent: Check both combustion air intake and exhaust for obstruction.
Scale/lime buildup: Scale insulates heat exchanger — reduces efficiency 20–40%. Flush annually with citric acid or white vinegar (commercial descalers preferred). Symptoms: Reduced hot water output, extended recovery, popping/rumbling sounds.
Expansion tank: Closed system requires expansion tank. Size per tank volume and system pressure. Air charge = cold supply pressure (typically 40–80 PSI). If waterlogged: replace.
Mixing valve (ASSE 1017): Commercial systems typically store at 140°F (Legionella prevention) and temper to 110–120°F at point of use. Check mixing valve operation and setpoint.
Legionella prevention: Store at 140°F minimum. Periodically heat to 160°F+ and flush all fixtures. Stagnant water >77°F is primary risk.
Sacrificial anode: Commercial tanks: inspect every 2 years, replace when spent. Some commercial tanks have multiple anodes.
Code clearances: 18" from combustibles front/sides, 6" top clearance. Gas connections: Flexible connector max 36" length, listed for gas service.`
}, {
  id: "d10",
  name: "Chillers — Air & Water Cooled, Fault Codes & Service Reference",
  brand: "General",
  type: "Service Manual",
  tags: ["chiller", "fault codes", "Carrier", "Trane", "York", "Daikin", "McQuay", "Lennox", "centrifugal", "screw", "scroll", "serial decode", "R-134a", "R-410A", "HFO"],
  content: `CHILLERS — AIR-COOLED & WATER-COOLED FIELD SERVICE REFERENCE

CHILLER TYPES & APPLICATIONS
Scroll chiller: 10–60 tons typical. Multiple scroll compressors staged. Most common for small/medium commercial. Air-cooled or water-cooled. Brands: Carrier 30HX, Trane CGAM small, York YCAL, Daikin AWV.
Screw chiller: 60–500+ tons. Single or twin-screw compressor, slide valve capacity control. Air-cooled or water-cooled. Brands: Carrier 30XV, Trane CGAM/RTHD, York YVAA/YPAL, Daikin AGZ, McQuay ALR.
Centrifugal chiller: 150–2000+ tons. Single or two-stage. Water-cooled typical. High efficiency at full load, less efficient at part load without variable diffuser. Brands: Carrier 19XR/19XRV, Trane CenTraVac, York YK/YKK.
Absorption chiller: Fired by steam, hot water, or gas. No compressor. COP 0.6–1.2. Used where waste heat available.

SERIAL NUMBER DECODE BY BRAND

Carrier chillers:
Same format as other Carrier products — year letter + week + sequence.
Model: 30HXC = water-cooled scroll. 30XA = air-cooled scroll. 30XV = air-cooled screw. 19XR = water-cooled centrifugal.
Tonnage: 3 digits in model × 1000 BTU ÷ 12,000 = tons (e.g., 200 = 200 tons on large models; check model nomenclature guide for each series).

Trane chillers:
Serial: First 2 digits = year, next 2 = week.
Model: CGAM = air-cooled screw (20–130T). CGWM = water-cooled scroll. RTHD = water-cooled screw. CVHF = water-cooled centrifugal. RTAF = air-cooled screw (large).

York/Johnson Controls:
Model: YCAL = air-cooled scroll. YVAA = air-cooled screw with VFD. YPAL = air-cooled screw (large). YK = water-cooled centrifugal. YLAA = air-cooled screw.
Serial: Factory code + year digit + week + sequence.

Daikin/McQuay:
Model: AGZ = air-cooled scroll (Daikin). ALR = water-cooled screw (McQuay). WME = water-cooled scroll. PEH = water-cooled screw large.
Serial: Year + week format.

REFRIGERANTS USED IN CHILLERS
R-134a: Most common in centrifugal and large screw chillers. GWP=1430. Cylinder=light blue. Pressure at 77°F: 71 psig. Phasing down — replacement is R-1234ze or R-513A.
R-410A: Scroll and small screw air-cooled chillers. GWP=2088. Cylinder=pink/rose.
R-123: Low-pressure centrifugal chillers (Carrier 19XR older, Trane CenTraVac). GWP=77. Cylinder=grey. Boiling point=82°F — operates below atmospheric pressure. HCFC, being phased out.
R-1234ze(E): Low-GWP replacement for R-134a. GWP=7. A2L (mildly flammable). Increasingly common in new centrifugal chillers.
R-513A: R-134a replacement for screw/scroll chillers. GWP=631. Non-flammable (A1).
R-32 / R-454B: Used in newer air-cooled scroll chillers replacing R-410A. A2L — requires attention to charge limits in enclosed equipment rooms.
R-1233zd(E): Replaces R-123 in low-pressure centrifugals. GWP=1. ASHRAE A1 (non-flammable).

CARRIER 30HX/30XA SCROLL CHILLER FAULT CODES (Pro-Dialog controller)
A0 – Protection device activation: Check all safeties.
A1 – Control module fault.
A2 – Chilled water flow fault: Check flow switch, pump, strainer, delta-P.
A3 – Evaporator freeze protection: Leaving chilled water temp <35°F. Check setpoint, anti-freeze, flow.
A4 – High condenser pressure (air-cooled): >537 psig R-410A. Check condenser fans, coil, ambient.
A5 – High condenser water temperature (water-cooled): >105°F entering condenser water. Check cooling tower, condenser water pump.
A6 – Low evaporator refrigerant pressure: <55 psig R-410A. Check charge, evaporator flow, TXV/EEV.
A7 – Compressor overload: Check amp draw vs RLA. Check winding resistance.
A8 – Low oil pressure differential (screw models): Check oil filter, separator, oil level.
A9 – EEV (electronic expansion valve) fault.
AA – Compressor high discharge temperature: >250°F. Check charge, condenser, head pressure.
Ab – High pressure safety switch manual reset required.
AC – Compressor start failure: Check contactor, voltage, winding resistance.
Ad – Phase reversal/loss: Check all three phases.
AE – Communication fault (between modules or to BAS).
AF – Chilled water pump fault (if pump control enabled).
b0 – Evaporator water circuit sensor fault: Check thermistors.
b1 – Condenser water/air circuit sensor fault.
b2 – Refrigerant pressure transducer fault.
b3 – Discharge temperature sensor fault.
b4 – Liquid line temperature sensor fault.
b5 – Suction temperature sensor fault.
b6 – Oil temperature sensor fault (screw models).
b7 – Ambient temperature sensor fault.
b8 – Motor winding temp sensor fault.

TRANE CGAM AIR-COOLED SCREW CHILLER FAULT CODES (Tracer AdaptiView)
CH001 – Chilled water flow: Verify GPM vs design. Minimum flow typically 3 GPM/ton.
CH002 – Evaporator freeze protection: LWT <35°F. Check glycol concentration (if applicable), setpoint, flow.
CH003 – High discharge pressure: R-134a >445 psig. Check condenser fans, coil, ambient. R-410A >610 psig.
CH004 – Low suction pressure: R-134a <20 psig. Check charge, evaporator fouling, chilled water flow.
CH005 – Compressor motor overtemperature: Check cooling, discharge superheat, refrigerant charge.
CH006 – High motor amp draw: Check voltage, winding resistance.
CH007 – Oil pressure differential fault: Check oil filter differential. Replace filter if >15 psid.
CH008 – Compressor start failure: Check contactor, power, mechanical.
CH009 – High condenser leaving air temp: Recirculation issue. Check fan direction, unit spacing.
CH010 – Phase loss/reversal: Check power quality.
CH011 – Low refrigerant charge: Check charge, leak test.
CH012 – High discharge temperature: Check charge, condenser conditions, valve damage.
CH013 – Sensor failure (specify which): Check wiring, resistance.
CH014 – Communication loss (to BAS or remote panel).
CH015 – Condenser fan fault: Check motor, fuse, capacitor (single-phase fans).
CH016 – High evaporator refrigerant temperature: Possible flooding. Check EEV, charge.
CH017 – Capacity valve fault (screw slide valve): Check solenoid, actuator.
CH018 – Economizer fault (if equipped).

YORK YVAA VARIABLE SPEED AIR-COOLED SCREW (OptiView controller)
FLT001 – High discharge pressure: See above.
FLT002 – Low suction pressure.
FLT003 – Chilled water flow.
FLT004 – Compressor VFD fault: Check VFD display — common: OC (overcurrent), OV (overvoltage), OH (overheat), GF (ground fault).
FLT005 – Motor overtemperature.
FLT006 – High motor current.
FLT007 – Oil pressure.
FLT008 – High discharge temperature.
FLT009 – Phase loss.
FLT010 – Sensor fault.
FLT011 – Communication fault.
FLT012 – Condenser fan VFD fault.
FLT013 – Low refrigerant.

CARRIER 19XR CENTRIFUGAL CHILLER (PIC II/PIC III/Touch Pilot)
SPT – Surge protection trip: Chiller surging. Check: low load condition, low condenser pressure (good thing in centrifugal), chilled water setpoint, hot gas bypass.
HPS – High pressure safety: Condenser pressure exceeded limit. Check cooling tower, condenser water pump, water treatment (scale).
LPS – Low pressure safety: Evaporator pressure too low. Check chilled water flow, setpoint, freeze protection.
OTS – Oil temperature safety: Oil supply temp >180°F. Check oil cooler (water-cooled from condenser), oil heater (must energise 4 hours before start).
LOS – Low oil level: Check sight glass (2/3 full at rest). Add oil if needed — Carrier 6BF or approved.
MOS – Motor over-temperature: Check winding temps, cooling water to motor cooler.
CPA – Compressor motor amp protection: Check voltage balance, winding resistance.
HRT – High return chilled water temperature: Normal alarm only, not shutdown.
WFS – Water flow switch: Check chilled water pump, strainer, flow switch calibration.
FRZ – Freeze protection: LWT <36°F. Check setpoint, glycol, flow.
REV – Phase reversal: Check power.
STF – Start failure: Check prelubrication circuit, oil pressure, starter.
ILP – Inlet guide vane/VSD fault: Check actuator, signal, VSD display.

CHILLER STARTUP CHECKLIST
1. Verify chilled water system filled, purged of air, pressure at design (typically 15–25 psig at chiller).
2. Verify chilled water flow meets minimum GPM (typically 2.4–3.6 GPM/ton depending on ΔT design).
3. Condenser: Air-cooled — clear of debris, fans rotate correct direction. Water-cooled — cooling tower operating, condenser water flow verified, chemical treatment current.
4. Energise oil heater minimum 4 hours before startup (centrifugal and screw chillers). Verify heater operation.
5. Check refrigerant sight glass — full liquid, no bubbles at full load (indicates adequate charge).
6. Verify chilled water setpoint appropriate for load and outdoor conditions.
7. Record startup parameters: EWT/LWT chilled water, EWT/LWT condenser water or ambient, suction pressure, discharge pressure, motor amps (all phases), compressor kW, COP/EER.
8. Compare to design conditions. Adjust setpoints as needed.

CHILLER PERFORMANCE TARGETS
COP targets (at full load, ARI conditions 44°F LCW, 85°F ECW water-cooled):
Scroll: 2.8–3.5 COP (9.6–12 EER).
Screw: 3.2–4.2 COP (10.9–14.3 EER).
Centrifugal: 4.5–6.5 COP (15.4–22.2 EER).
kW/ton: Scroll = 0.97–1.26. Screw = 0.81–1.05. Centrifugal = 0.52–0.75.
IPLV (Integrated Part Load Value) typically 20–40% better than full load.

CONDENSER WATER SYSTEM
Typical design: 85°F entering, 95°F leaving, 3 GPM/ton.
Cooling tower approach: Leaving water temp minus outdoor wet bulb. Target 5–7°F approach.
Water treatment: Check conductivity (target 500–1500 µS/cm), pH (7.0–8.5), inhibitor concentration per water treatment provider spec. Scale reduces efficiency — each 1°F rise in approach = ~2% efficiency loss.
Blowdown: Maintain cycles of concentration 3–5 per water treatment plan.
Legionella: Water-cooled systems require active water management plan per ASHRAE 188.`
}, {
  id: "d11",
  name: "VFD / Variable Frequency Drives — Programming, Fault Codes & Service",
  brand: "General",
  type: "Service Manual",
  tags: ["VFD", "variable frequency drive", "fault codes", "ABB", "Danfoss", "Yaskawa", "Siemens", "Allen-Bradley", "Eaton", "programming", "commissioning"],
  content: `VFD / VARIABLE FREQUENCY DRIVES — HVAC FIELD REFERENCE

VFD OVERVIEW & HVAC APPLICATIONS
A VFD (also called ASD — adjustable speed drive, or inverter) converts fixed AC frequency to variable frequency/voltage to control motor speed. In HVAC: used on supply/return fans, pumps, cooling tower fans, compressors (inverter-driven), and condenser fans.
Energy savings: Fan/pump affinity laws — power varies with cube of speed. 80% speed = 51% power. 50% speed = 12.5% power.
Typical HVAC VFD brands: ABB (ACH/ACS series), Danfoss (FC series), Yaskawa (GA700/J1000), Siemens (G120/G115D), Allen-Bradley/Rockwell (PowerFlex), Eaton (DG1), Schneider/Square D (Altivar).

VFD COMPONENTS
Rectifier section: Converts AC input to DC. Three-phase bridge rectifier typical. DC bus voltage: 1.41 × AC input (e.g., 480V AC → 679V DC bus).
DC bus: Large electrolytic capacitors filter DC. Capacitors age — check ripple voltage. Bulging or leaking caps = replace drive or capacitor bank.
Inverter section: IGBTs switch DC bus to create variable AC output. IGBT failure = drive fault, usually OC or ground fault.
Control board: Microprocessor runs control logic, reads feedback signals, outputs to IGBTs.
Heat sink: Dissipates heat from IGBTs. Must be clean, fins clear, cooling fan operational.

COMMISSIONING A VFD — STANDARD PROCEDURE
1. Verify input voltage matches drive nameplate. Check all phases present and balanced.
2. Motor data entry: Enter motor nameplate data — voltage, FLA (full load amps), RPM, Hz, power factor if available.
3. Motor cable: Max cable length per drive spec (typically 50–300 feet before output reactors needed). Long cables cause reflected wave overvoltage — use output reactor or dV/dt filter if >100ft.
4. Control wiring: Verify analog input (0–10V or 4–20mA), digital inputs (run/stop, speed reference), output signals (run status, fault, actual speed/frequency).
5. Direction of rotation: Jog at low speed (5 Hz), verify motor rotation matches system requirement. Swap any two output phases (T1/T2/T3) to reverse direction — do NOT swap input phases.
6. Acceleration/deceleration ramp: HVAC fans — typically 30–60 seconds acceleration, 30–60 seconds deceleration. Too fast = OC fault. Too slow = extended start time.
7. Minimum speed: Set minimum Hz to prevent motor overheating at low speed. Typical: 15–20 Hz minimum for HVAC fans. Pumps: 20–25 Hz minimum.
8. Maximum speed: Typically 60 Hz (motor nameplate speed). Some systems run 65–70 Hz for additional airflow — verify motor and driven equipment can handle overspeed.
9. Motor protection: Set electronic overload based on motor FLA. Set to 100% of motor FLA.
10. Control source: LOCAL (drive keypad) for commissioning, then switch to REMOTE (BAS/DDC signal) for operation.

ABB ACS/ACH SERIES FAULT CODES (most common HVAC VFDs)
F0001 – Overcurrent (OC): Motor current exceeded trip level. Check: motor winding resistance (disconnect motor leads first — T1/T2/T3), output short circuit, acceleration too fast, motor overloaded. Trip level typically 200% FLA.
F0002 – DC bus overvoltage (OV): DC bus >800V (480V drive) or >400V (208/240V). Check: deceleration too fast (increase decel time), regenerative load (add braking resistor), input line overvoltage.
F0003 – DC bus undervoltage (UV): DC bus < threshold. Check: input voltage too low, momentary power interruption, blown fuse on input.
F0005 – Drive overtemperature (OH): Heat sink temp too high. Check: cooling fan (should spin freely, blowing air OUT of top of drive), ambient temp in panel (max typically 40°C/104°F), fin fouling (clean with compressed air — power off first), drive undersized for load.
F0006 – Motor overload: Drive's electronic overload tripped. Check: actual motor amp draw vs FLA, mechanical load (belt tension, bearing condition, dampers), verify motor FLA set correctly in drive parameters.
F0007 – Communication timeout: Lost signal from BAS/DDC. Check network wiring, termination, BAS output signal.
F0009 – Undervoltage on input: Check utility voltage, main breaker, drive input fuse/CB.
F0011 – Output phase loss: One of three output phases missing. Check T1/T2/T3 connections, motor leads, motor winding continuity.
F0012 – Input phase loss: One of three input phases missing. Check L1/L2/L3, input fuses, upstream breaker.
F0017 – Ground fault (GF): Motor winding shorted to ground, or motor cable insulation failure. Megohm test motor (disconnect VFD first — always). Check cable for physical damage.
F0023 – Earth fault (same as ground fault in some firmware).
F0033 – Drive fault — hardware: Internal drive fault. Cycle power. If persistent: replace drive.
A005 – Drive temperature warning (pre-fault alarm).
A022 – Motor temperature warning (if PTC thermistor connected).

DANFOSS FC102/FC202/FC301/FC302 FAULT CODES (HVAC common)
ALM 1 – 10V supply fault.
ALM 2 – Live zero fault (4–20mA signal lost). Check sensor, signal wiring.
ALM 4 – Mains phase loss: Check input supply.
ALM 5 – DC link voltage high (overvoltage): Add braking resistor or extend decel ramp.
ALM 6 – DC link voltage low (undervoltage): Check input.
ALM 7 – DC overvoltage.
ALM 8 – DC undervoltage.
ALM 9 – Inverter overloaded: Reduce load or increase drive size.
ALM 10 – Motor ETR temperature (electronic thermal relay): Motor overloaded. Check amp draw, mechanical.
ALM 11 – Motor thermistor (PTC): Motor winding overtemp. Check motor cooling, ambient, load.
ALM 12 – Torque limit: Load too heavy. Check mechanical system.
ALM 13 – Overcurrent: Same as F0001 above.
ALM 14 – Earth fault (ground fault): Megohm motor, check cable.
ALM 16 – Short circuit: Output short. Check motor and leads.
ALM 17 – Serial communication timeout: Check BACnet/Modbus/N2 wiring.
ALM 27 – Brake resistor fault (if equipped).
ALM 28 – Brake check fault.
ALM 29 – Drive overtemperature: Check cooling, ambient, fin fouling.
ALM 30 – Motor phase missing: Check T1/T2/T3 and motor connections.
ALM 34 – Fieldbus fault (BACnet/Modbus): Check communication board, wiring.
ALM 38 – Internal fault: Hardware failure. Cycle power, replace if persists.
ALM 47 – 24V supply fault (control card).
ALM 52 – AMA (automatic motor adaptation) failed: Re-run AMA, check motor connections.
ALM 58 – AMA internal fault.
ALM 59 – Current limit: Extended operation at current limit. Check load, size drive correctly.
ALM 65 – Control board overtemperature.
ALM 66 – Heat sink temperature: Check cooling fan in drive, panel temperature.
ALM 68 – Safe stop activated: Check STO (Safe Torque Off) wiring/jumper.
ALM 70 – Illegal frequency: Check setpoint signal and parameter limits.
ALM 80 – Drive initialised to default: All parameters reset — re-program drive.
ALM 90 – Feedback loss: PID feedback signal lost. Check pressure/flow sensor, signal wiring, supply voltage to sensor.
ALM 91 – Analog input out of range: 4–20mA signal <2mA (wiring break) or >21mA.

YASKAWA GA700 / J1000 FAULT CODES
oC (oPE01) – Overcurrent: Same causes as above.
oU – DC bus overvoltage.
Uv – Undervoltage.
oH – Drive overtemperature.
oH3 – Motor overtemperature (PTC).
OL1 – Motor overload (electronic thermal overload).
OL2 – Drive overload: Load exceeds drive rating.
GF – Ground fault.
PF – Input phase loss.
LF – Output phase loss.
CPF – Control circuit fault.
CALL – Communication error.
EF – External fault (digital input triggered fault).
STP – Coast to stop commanded.
bb – Baseblock (drive output disabled by external command).

SIEMENS G120 / SINAMICS FAULT CODES
F07900 – Motor stall/overload.
F07910 – Motor overcurrent.
F07920 – Overcurrent.
F30001 – Overcurrent at power unit.
F30002 – DC link overvoltage.
F30003 – DC link undervoltage.
F30004 – Power unit overtemperature.
F30011 – Input phase failure.
F30012 – Output phase failure.
F30021 – Ground fault.
F30025 – Power unit defect.
A07901 – Motor temperature warning.
A07910 – VFD overtemperature warning.
A30028 – Cooling fan fault.

ALLEN-BRADLEY POWERFLEX 400/525/755 FAULT CODES
F002 – Overcurrent hardware: Check motor, output cables.
F003 – Power loss: Input voltage too low.
F004 – Undervoltage: DC bus low.
F005 – Overvoltage: DC bus high.
F006 – Motor stall: Accelerating too slowly or load too heavy.
F007 – Motor overload (OL1).
F008 – Drive overload.
F012 – HW overcurrent.
F013 – Ground fault.
F021 – Decel inhibit: Overvoltage inhibiting deceleration (no braking resistor).
F025 – Precharge fault.
F033 – Drive overtemperature.
F038 – Phase loss input.
F059 – Output phase loss.
F069 – Speed feedback fault (encoder).
F070 – Communication fault.

VFD FIELD TROUBLESHOOTING QUICK GUIDE
Drive won't start:
1. Check REMOTE/LOCAL control source setting.
2. Verify enable/run input energised (check terminal block).
3. Verify speed reference signal present (0–10V or 4–20mA at reference terminal — measure with meter).
4. Check fault display for active fault. Reset if needed.
5. Check that motor thermal is not tripped.
Motor runs wrong direction: Swap T1/T2 or T2/T3 on OUTPUT terminals only. Never swap input phases to reverse direction.
Overcurrent on start: Increase acceleration time. Check for output short. Check motor windings.
Nuisance overtemperature: Clean heatsink fins with compressed air (drive powered off). Check panel cooling, add ventilation. Verify no recirculation of hot air in panel.
4–20mA signal lost (ALM91/similar): Check sensor supply voltage (typically 24VDC), check 2-wire vs 3-wire wiring, check signal cable for break or ground fault.
BAS communication lost: Check network wiring continuity (shield grounding — ground at one end only), termination resistors (last device on daisy chain must have terminator), device address settings, baud rate match.
Drive trips at high load only: Likely overload. Verify drive kW/HP rating matches or exceeds motor nameplate. Check ambient — every 10°C above 40°C = derate drive capacity ~10%.

VFD BYPASS CONFIGURATION
Manual bypass: Transfers motor directly to utility power. Useful for emergency operation if VFD fails.
Auto-bypass (automatic transfer): Drive faults → automatic transfer to across-the-line start. Program bypass operation carefully — across-the-line current 600% FLA, damaging to motor, load, and ductwork.
Isolation switches: Line side (isolates VFD from power), load side (isolates motor from VFD). Must be both open when servicing VFD. Verify de-energised and locked out.

POWER QUALITY & VFD
Input harmonics: VFDs create harmonic distortion on input. 5th, 7th, 11th, 13th harmonics. Mitigation: Line reactor (5% impedance recommended), 12-pulse converter, active harmonic filter.
Power factor: VFDs draw leading or lagging current depending on loading. Input power factor typically 0.95+ with line reactor.
EMI/RFI: VFDs generate high-frequency noise. Install EMC/EMI filter on input for sensitive environments. Use shielded motor cable for long runs (>50ft). Ground shield at drive end only for output cables.`
}];


