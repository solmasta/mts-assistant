// React hooks already destructured in app1.js, so we can use them directly

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
  }, "FieldPro AI ASSISTANT")), hasMessages && /*#__PURE__*/React.createElement("div", {
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
  }, "FieldPro Field Assistant"), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: "#E67E22",
      marginBottom: 8,
      lineHeight: 1.4
    }
  }, "\u26a0\ufe0f AI-generated \u2014 verify against OEM documentation before acting."), hasMessages && !busy && /*#__PURE__*/React.createElement("div", {
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
E5 – Compressor overheat / overload (OL) trip: Check discharge thermistor connection, refrigerant charge and airflow, four-way valve leakage. Avoid repeated resets — repeated E5 without resolving root cause risks compressor/inverter damage.
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
  type: "FieldPro SOP",
  tags: ["R-410A", "R-22", "R-454B", "safety", "EPA 608", "PPE", "recovery", "GWP"],
  content: `REFRIGERANT SAFETY & HANDLING SOP — FieldPro

SCOPE: All FieldPro technicians handling refrigerants. Compliance with EPA Section 608, ASHRAE 15, OSHA 29 CFR 1910.1000, and local codes required.

REFRIGERANT IDENTIFICATION & PROPERTIES

R-410A (Most common in use):
Type: HFC blend (R-32/R-125 50/50). GWP: 2088. ODP: 0.
Cylinder: Pink/rose. Pressure at 77°F: 226 psig. Critical temp: 160.7°F.
Boiling point: -61.9°F. Non-flammable (A1 per ASHRAE 34).
Being phased out per AIM Act. New equipment after 2025 must use lower-GWP alternatives.

R-22 (Legacy systems only):
Type: HCFC. GWP: 1810. ODP: 0.055.
Cylinder: Green. Pressure at 77°F: 137 psig. Critical temp: 204.9°F.
Production ended 2020. Reclaimed R-22 only. Document purchase/use. Cost: $50–120/lb.
Never mix with R-410A or other refrigerants.

R-454B (Puron Advance — new equipment replacement for R-410A):
Type: HFO/HFC blend (R-32/R-1234yf). GWP: 467. ODP: 0.
Cylinder: Light green. Pressure at 77°F: 213 psig. Mildly flammable (A2L classification).
ASHRAE 34 Class A2L: Low burning velocity (<10 cm/s). Requires spark-free tools in confined spaces.
Charge limit per ASHRAE 15: 35 lbs in occupied spaces without additional ventilation.

R-32 (Pure refrigerant, increasingly common):
Type: HFC. GWP: 675. ODP: 0.
Cylinder: Red. Pressure at 77°F: 245 psig. A2L flammable classification.
Higher pressure and lower charge weight than R-410A.

R-407C (Drop-in for R-22 in some applications):
Type: HFC blend. GWP: 1774. ODP: 0.
Cylinder: Brown/tan. Pressure at 77°F: 154 psig. Temperature glide: ~9°F.
Must charge as liquid (bottom of cylinder) due to glide.

R-134a (Chillers, some RTUs):
Type: HFC. GWP: 1430. ODP: 0.
Cylinder: Light blue. Pressure at 77°F: 82 psig. Non-flammable (A1).

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

HOT WATER BOILER FAULT CODES — LOCHINVAR KNIGHT, NAVIEN NCB/NFB
A previous version of this reference listed specific numbered fault codes
for these two brands. On review, several of those code-to-meaning
mappings did not match the manufacturers' own service documentation
(confirmed against multiple independent sources) — presenting the wrong
ones alongside correct ones risked more harm than a shorter, honest
reference. Rather than publish a partially-wrong table, use the boiler's
own display (most modern condensing boilers show a plain-language fault
description, not just a bare code) and the manufacturer's service manual
for exact code definitions on the specific model in front of you — codes
also vary between model lines within the same brand (e.g. Knight vs
Knight XL vs Knight Fire Tube), so a single generic table is inherently
risky. General troubleshooting for common boiler symptoms (ignition
failure, flame loss, high limit, sensor faults) follows the same logic
regardless of the exact code: check gas supply and pressure, igniter and
flame sensor condition/signal, combustion air and venting, water flow
and circulator operation, and sensor resistance against the thermistor's
published temperature/resistance table before condemning a part.
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
R-134a: Most common in centrifugal and large screw chillers. GWP=1430. Cylinder=light blue. Pressure at 77°F: 82 psig. Phasing down — replacement is R-1234ze or R-513A.
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
}, {
  id: "d12",
  name: "Insulation & Weatherproofing — Refrigerant Lines, Ductwork & Piping",
  brand: "General",
  type: "FieldPro SOP",
  tags: ["insulation", "weatherproofing", "condensation", "CUI", "maintenance"],
  content: `INSULATION & WEATHERPROOFING — FIELD REFERENCE

REFRIGERANT LINE INSULATION
Suction line insulation: closed-cell elastomeric foam (e.g. Armaflex), minimum 3/4" wall thickness for lines up to 1-3/8" OD, 1" wall for larger. Never insulate the liquid line on standard split systems — it should remain bare metal to reject heat. Exception: liquid lines exposed to direct sun on long exterior runs may need light insulation to prevent flash gas — check manufacturer guidance.
UV protection is mandatory for any exterior insulation: bare foam insulation degrades from UV exposure within 12–24 months, cracking and losing R-value. Field fix: wrap with UV-resistant tape (aluminum foil tape or purpose-made UV jacketing) or apply water-based UV-protective mastic coating over the full exposed length.
Seam sealing: all foam insulation seams and butt joints must be sealed with contact adhesive rated for the insulation type — a gapped seam is a direct path for moisture intrusion and condensation formation inside the insulation, which degrades performance and can cause line corrosion over years.
Inspection signs of failure: cracking, splitting at bends, dark/wet staining (indicates moisture trapped inside), sagging or loose fit (foam has shrunk/hardened with age — typical after 8-10 years, full replacement needed not just patching).

DUCTWORK INSULATION
External duct wrap: standard commercial requirement is R-6 minimum per energy code (varies by climate zone — verify local requirement), consisting of fiberglass blanket with a foil-scrim-kraft (FSK) vapor barrier facing.
Vapor barrier integrity is the critical factor on any duct carrying air below the dew point of surrounding air (typically all supply ducts in cooling mode). A break in the vapor barrier — from a puncture, a poorly-taped seam, or a hanger strap compressing the insulation — allows humid ambient air to contact the cold duct surface, causing condensation that can saturate the insulation, drip, and promote mold growth.
Repair procedure: cut back damaged insulation 2" beyond the visible damage to reach sound material, install matching R-value replacement, tape all seams with FSK-rated foil tape (not general purpose duct tape — it fails over time), reseal around any penetrations.
Duct liner (internal insulation, common in built-up AHU casings and some ductwork): inspect for erosion of the airstream-facing surface, which indicates excessive velocity or turbulence; eroding liner sheds fibers into the airstream, an IAQ concern. Also check for microbial growth, especially if liner has been wet from a coil leak or condensate issue.

CHILLED WATER & HOT WATER PIPING INSULATION
Chilled water piping (typically 40-45°F supply): closed-cell elastomeric foam or fiberglass with vapor-retardant jacket, thickness per ASHRAE 90.1 based on pipe size (commonly 1"-1.5" wall for pipe under 4" diameter). Vapor barrier is critical here too — the same condensation/CUI (corrosion under insulation) risk applies as with ductwork, but on metal pipe the consequence is worse: trapped moisture against carbon steel pipe under insulation is one of the leading causes of unexpected pipe failure in mechanical rooms, because the corrosion is hidden until the insulation is removed or the pipe fails.
Hot water/steam piping: mineral wool or fiberglass insulation rated for the operating temperature (check insulation temperature rating against system design temp — using low-temp-rated insulation on a high-temp steam line is a fire/degradation risk). PVC or metal jacketing typically used for mechanical protection rather than vapor barrier (not usually needed on hot piping since it's above ambient dew point, except at startup/shutdown transients).
Common failure points to inspect: pipe hangers and supports (insulation is frequently missing or crushed exactly at the hanger — install proper insulated pipe shields/saddles rather than letting the hanger clamp directly onto bare or thin insulation), valve bodies and flanges (often left uninsulated by original installers — a bare valve body on chilled water is both an energy loss and a condensation/drip point), unions and threaded connections (harder to insulate cleanly, frequently skipped).

CABINET & EQUIPMENT INSULATION
RTU/AHU cabinet panels: internal insulation (typically 1"-2" fiberglass with foil facing) prevents cabinet sweating on the exterior in humid conditions and reduces radiated heat gain/loss. Damaged or missing internal panel insulation shows as a "sweating" cabinet exterior or, on the interior, as fiberglass shedding into the airstream — replace damaged panels rather than attempting field insulation repair inside an air-handling cabinet due to IAQ concerns with exposed fiberglass.
Access panel and door gaskets: inspect annually — compressed, torn, or missing gaskets allow air bypass (unconditioned air infiltration or conditioned air leakage) and are a common source of both energy waste and condensation at the panel edge. Replace with OEM gasket material matched to the panel profile.
Curb-to-unit seal: verify continuous gasket/sealant around the full perimeter where a rooftop unit sits on its curb. Gaps here allow both air leakage and water intrusion into the building — re-seal with roofing-membrane-compatible sealant (do not use generic silicone on a modified bitumen or TPO roof without checking compatibility, as some sealants degrade certain membrane types).

QUICK DIAGNOSTIC — "IS THIS A CONDENSATION OR A LEAK PROBLEM?"
Dripping observed on a chilled water pipe, cold refrigerant line, or duct: 90% of the time on properly insulated systems this is condensation from a vapor barrier breach, not an actual fluid leak. Diagnostic steps: 1) Confirm the fluid is water, not refrigerant oil residue or a rust-colored leak (which points to an actual pipe/joint failure, not condensation). 2) Locate the exact point insulation is missing, gapped, or has a vapor barrier break directly above or at the drip point — condensation almost always originates exactly where the vapor seal is broken. 3) If insulation appears intact and sealed but dripping continues, escalate to leak investigation (pressure test, dye test, or infrared/acoustic leak detection) rather than continuing to treat it as an insulation issue.`
}, {
  id: "d13",
  name: "Preventive Maintenance Procedures — RTU, Chiller, Boiler, Cooling Tower",
  brand: "General",
  type: "Maintenance Procedure",
  tags: ["PM", "maintenance", "checklist", "quarterly", "annual"],
  content: `PREVENTIVE MAINTENANCE PROCEDURES — FIELD CHECKLISTS

QUARTERLY PM — PACKAGED ROOFTOP UNIT (RTU)
1. Filters: replace or clean, confirm correct size and MERV rating per spec sheet. Note pressure drop across filter bank if manometer available — compare to prior readings for loading trend.
2. Condenser coil: inspect for debris, leaves, cottonwood fluff; clean with coil cleaner and low-pressure rinse (high pressure can bend fins). Comb any bent fins with a fin comb to restore airflow.
3. Evaporator coil: inspect through access panel for cleanliness, biological growth, or ice; clean if needed with coil cleaner rated for the coil material (aluminum vs copper require different chemistry in some cases).
4. Refrigerant charge: verify via superheat/subcooling method against target values for that specific unit and refrigerant type; log actual readings.
5. Electrical: tighten all power and control connections (a loose lug is one of the most common causes of premature contactor/compressor failure due to arcing and heat); check contactor contacts for pitting.
6. Belts (belt-drive units only): check tension (standard: 1/64" deflection per inch of span under moderate thumb pressure) and condition; replace if cracked, glazed, or frayed.
7. Bearings: lubricate per schedule if serviceable type (many modern motors are sealed — verify before greasing; over-greasing a sealed bearing causes failure).
8. Condensate: check drain pan and trap for clogs, algae, correct slope; flush line; verify float switch (if equipped) trips correctly by manually raising water level.
9. Economizer: cycle damper through full range (0–100%) and visually confirm smooth mechanical movement matching the commanded position; check linkage for looseness.
10. Safety controls: test high/low pressure switches, freeze stat, high limit switch by simulated trip if safe to do so, or verify last-test documentation.
11. Compressor amps: record running amps at steady state, compare to nameplate RLA — elevated amps can indicate high head pressure, low charge, or mechanical wear.
12. Insulation: inspect refrigerant line and cabinet insulation per insulation SOP; repair any UV or seam damage found.
13. BAS/controls: if unit is networked, confirm setpoints match sequence of operations and that all monitored points are updating (cross-check field reading against BAS display).

ANNUAL PM — AIR-COOLED CHILLER
1. Condenser coils: thorough clean, pressure wash from inside-out where accessible; heavy fouling may require coil cleaner chemical treatment.
2. Oil analysis: pull sample per compressor manufacturer procedure; check moisture content and acid number (high acid indicates a burnout risk or has already occurred — investigate before returning to service).
3. Sensor calibration: check all temperature and pressure sensors against a certified reference instrument; document any drift found and recalibrate or replace.
4. Safety controls: test high pressure cutout, low pressure/freeze protection, oil pressure differential switch, motor overload/thermal protection — do not skip due to time pressure, these are life-safety and equipment-protection critical.
5. Motor megger test: measure insulation resistance on compressor windings, compare to baseline and manufacturer minimum; trend year over year, as declining resistance predicts eventual failure.
6. Electrical: inspect and tighten all control panel and power wiring; thermal-scan under load if an imaging camera is available — hot spots indicate developing connection problems before failure.
7. Refrigerant charge: verify and log with subcooling calculation at as-close-to-design load as achievable.
8. Fan motor bearings: inspect and lubricate condenser fan motors per schedule.
9. VFD (if equipped): review fault history log in drive memory; clean cooling fans and heat sinks on the drive itself.
10. Documentation: record entering/leaving chilled water temps, entering/leaving condenser temps (or ambient), suction/discharge pressures, compressor amps; compare against prior years to identify gradual degradation trends before they become failures.

QUARTERLY PM — COOLING TOWER
1. Fill media: inspect for scale, algae/biological growth, physical damage; fouled fill significantly reduces heat transfer and increases approach temperature.
2. Water treatment: verify conductivity/cycles of concentration against program target; confirm biocide feed system is operating correctly per schedule — critical for Legionella risk management; check pH against target range.
3. Basin: inspect for sediment and biological growth; schedule full drain-and-clean at minimum annually.
4. Fan and drive: check belt condition/tension or gearbox oil level; inspect fan blades; verify vibration switch functions (safety device — do not bypass).
5. Drift eliminators: inspect for damage; damaged eliminators increase water carryover, a water-waste and Legionella-aerosol-risk issue.
6. Legionella water management plan: confirm facility's written plan (per ASHRAE 188) is current and that any observed deficiencies are reported through the proper channel — this is a serious life-safety item, not a routine maintenance checkbox.

ANNUAL PM — COMMERCIAL BOILER
1. Combustion analysis: measure O2/CO2%, CO (ppm), stack temperature, calculated efficiency with a calibrated combustion analyzer; elevated CO requires immediate investigation as a life-safety issue.
2. Gas pressure: verify static and dynamic manifold pressure against manufacturer spec using a manometer at the test port.
3. Safety controls — test every one, every year: high limit cutout, low water cutoff (LWCO — test by controlled drain-down while firing to confirm shutdown before unsafe water level), flame safeguard response time (should be ≤4 seconds from flame loss to burner shutdown per most codes), pressure relief valve (verify set pressure, test per code — some jurisdictions require periodic replacement rather than just testing).
4. Refractory/heat exchanger: visually inspect for cracking, erosion, soot buildup (soot indicates a combustion problem needing correction).
5. Venting: check draft, look for blockage, condensation damage, or corrosion in the flue system; confirm combustion air supply is unobstructed and adequate.
6. Documentation: any safety control failure takes the boiler out of service until repaired. Never bypass a safety control to keep equipment running — this is a fireable/liability-critical rule, not a suggestion.

BELT & BEARING MAINTENANCE (applies across RTU, AHU, cooling tower fan drives)
Belt tension: 1/64" deflection per inch of span under moderate thumb pressure at midpoint is the standard rule of thumb; over-tight belts cause premature bearing wear, under-tight belts slip and glaze.
Belt alignment: check with straightedge or laser tool across pulley faces; misalignment causes uneven wear and vibration.
Bearing lubrication: use only the grease type specified by the manufacturer (do not mix lithium-based and other grease chemistries); typical interval 2000–4000 operating hours for continuous duty, but always follow the specific equipment's schedule; purge old grease but avoid overfilling a sealed bearing.
Vibration baseline: where equipment has a vibration monitoring point or portable meter is available, establish a baseline reading on new/known-good equipment for future trend comparison — rising vibration is often the earliest indicator of bearing wear or misalignment, appearing before audible or visible symptoms.`
}, {
  id: "d14",
  name: "BAS Integration — BACnet Fundamentals & Field Diagnostics",
  brand: "General",
  type: "BAS Integration",
  tags: ["BAS", "BACnet", "controls", "VAV", "diagnostics", "integration"],
  content: `BAS INTEGRATION — BACNET FUNDAMENTALS & FIELD DIAGNOSTICS

WHAT A FIELD TECHNICIAN NEEDS TO KNOW ABOUT BACNET
BACnet is the dominant open protocol for building automation integration in commercial buildings. Every point in the system — a sensor reading, a command, a status — is represented as a BACnet "object." The main object types a technician will encounter: Analog Input (AI) — a sensor reading such as space temperature or duct pressure; Analog Output (AO) — a command such as valve or damper position; Binary Input (BI) — an on/off status such as a fan proof switch or filter status; Binary Output (BO) — an on/off command such as a fan start relay; Multi-State Value (MSV) — a mode selection such as occupied/unoccupied/standby.
Device Instance number: every controller on the network has a unique Device Instance ID. Duplicate device instances on the same network will cause unpredictable communication failures and must be corrected — usually by the controls contractor or BAS administrator — before any point-level troubleshooting will be productive. If a controller was recently replaced and is suddenly "invisible" to the BAS, a duplicate or incorrectly-set device instance is one of the first things to check.
Network types: BACnet/IP runs over standard Ethernet and is typical for the supervisory/backbone level connecting building controllers together. BACnet MS/TP runs over RS-485 twisted-pair serial wiring and is typical at the field/unitary controller level (VAV boxes, unit controllers, etc.), usually connecting back to a network router or gateway that bridges to the BACnet/IP backbone.

MS/TP WIRING RULES (the most common source of BAS communication problems a field tech will encounter)
Topology must be daisy-chain (device to device to device), never a star or "home run" topology — MS/TP does not support star wiring and will produce intermittent or total communication failure if wired that way.
Polarity matters: the +/− (sometimes labeled Net+/Net− or A/B) must be consistent in the same orientation at every device on the trunk. A single reversed pair anywhere on the trunk can degrade or kill communication for the whole segment.
Termination: a 120-ohm termination resistor must be installed at each of the two physical ends of the trunk — and only at the two ends. Extra terminators or missing terminators both cause signal reflection problems and unreliable communication, especially as trunk length or device count increases.
Shield grounding: cable shield should be grounded at one point only (typically at the head end/panel) — grounding the shield at multiple points can create ground loops that introduce noise onto the data lines.
Baud rate and MAC address: all devices on an MS/TP trunk must be set to the same baud rate. Each device also needs a unique MAC address (separate from the Device Instance) on that trunk segment — conflicting MAC addresses cause token-passing failures.

DIAGNOSTIC SEQUENCE — "BAS SHOWS A FAULT/BAD VALUE BUT THE UNIT SEEMS FINE" (or vice versa)
1. Always physically verify actual field conditions first with a calibrated instrument (thermometer, manometer, clamp meter) before trusting or distrusting the BAS reading — never assume either the field or the graphic is correct without checking.
2. If a controller shows offline/not communicating on the BAS graphic: check the controller has power and no fault LED; verify MS/TP wiring per rules above (polarity, termination, daisy-chain topology, unique address); check for a duplicate device instance or MAC address if the controller was recently replaced or reprogrammed.
3. If a specific sensor reading looks wrong (implausible temperature, stuck value, wildly fluctuating): physically locate the sensor and check its position (e.g., a duct temperature sensor not fully inserted into the airstream, a return air sensor picking up nearby heat source like a light fixture, an outdoor air sensor without a sun shield reading falsely high in direct sun); check wiring for damage, corrosion, or a loose connection (many field sensors are 2-wire resistive/thermistor types where a partial short or high-resistance connection produces a predictable, calculable reading error rather than an obviously "broken" one).
4. If an actuator/valve/damper position on the BAS doesn't match physical reality: this is very often a slipped or broken mechanical coupling between the actuator and the damper/valve shaft — the actuator itself moves and reports correctly, but the shaft isn't actually turning. Always verify by watching the physical device move through a commanded range, not just trusting the feedback signal.
5. Calibration offsets: many BAS platforms allow a manual calibration offset to be applied to a sensor point. An incorrect offset entered by a previous technician or programmer is a real and surprisingly common cause of a "sensor reading wrong" complaint where the sensor hardware is actually fine. Check the raw/unscaled value at the controller versus the calibrated/displayed value if the platform provides that view.
6. A unit that operates correctly in local/standalone/hand mode but doesn't respond to or report to BAS command points to a network/communication issue rather than a mechanical HVAC fault — don't spend time chasing a mechanical problem that isn't there.

VAV BOX TROUBLESHOOTING USING BAS TREND DATA
For a "zone too hot/cold" complaint, before mechanical inspection, pull BAS trend data for: zone temperature vs. setpoint over the complaint period; VAV box airflow (CFM) vs. its programmed minimum/maximum setpoints; damper position command vs. actual zone demand; discharge air temperature if the box has reheat.
If airflow is stuck at or near minimum despite an active cooling call and the damper command shows fully open: suspect a mechanical damper linkage failure or stuck/failed actuator — confirm by physical inspection and a manual override test.
If the airflow reading itself looks implausible (negative, erratic, wildly jumping): suspect the airflow sensor — typically a differential pressure sensor across an averaging pitot array inside the box — and specifically check for disconnected or pinched sensor tubing, which is an extremely common and easy-to-miss field failure.
If the BAS zone temperature doesn't match a handheld reading at the space thermostat: treat as a sensor discrepancy per the diagnostic sequence above (position, wiring, calibration offset).
If reheat isn't raising discharge air temperature despite a heating call and 100% valve command: check the actuator-to-valve-stem coupling first (very commonly slipped), then check for a scaled/stuck valve (common with poorly-treated hot water systems), then verify hot water is actually available at the coil — a manually closed isolation valve, left shut after prior work, is a frequently overlooked and easily fixed cause.

ECONOMIZER/OUTDOOR AIR DAMPER — BAS-ASSISTED TROUBLESHOOTING
Command the damper through its full range (0–100%) via BAS override and physically watch it move — confirms both the actuator and the mechanical linkage are functioning together, since a controller can report a commanded position that the damper physically isn't achieving if the coupling has slipped.
Check outdoor and return air temperature/enthalpy sensors for accuracy against a calibrated handheld reference — a faulty outdoor air sensor is a common cause of an economizer that never opens during favorable conditions (wasting free cooling opportunity) or one that opens fully during unfavorable hot/humid conditions (driving up cooling load and potential humidity/IAQ problems).
Verify minimum outdoor air damper position matches the design ventilation requirement for the space (per the original ASHRAE 62.1 ventilation calculation) — a damper stuck fully closed provides zero outdoor air and is a code compliance and IAQ issue that should be flagged immediately, not treated as routine.

WHEN TO ESCALATE TO THE CONTROLS CONTRACTOR VS. HANDLE IN THE FIELD
Field-technician-appropriate: verifying and repairing the mechanical side (actuator coupling, damper/valve mechanical operation, sensor physical position and wiring continuity), physically confirming field conditions against BAS readings.
Escalate to controls contractor/BAS administrator: any change to point configuration, calibration offsets, sequence of operations logic, device addressing, or network-level programming — these are typically outside a field HVAC technician's scope and unauthorized changes can create larger problems across the network or violate the facility's controls service agreement. Document findings clearly (what was checked, what was found, what mechanical repair if any was made) so the controls contractor can act efficiently on a clear field report rather than starting their diagnosis from zero.`
}
, {
  id: "d15",
  name: "Commercial Boilers — Cleaver‑Brooks, Fulton, Hurst, Miura",
  brand: "Cleaver-Brooks",
  type: "Service Manual",
  tags: ["boiler", "Cleaver-Brooks", "Fulton", "Hurst", "Miura", "firetube", "watertube", "steam", "hot water", "burner", "controls"],
  content: `COMMERCIAL BOILERS — ADDITIONAL BRANDS & SERVICE REFERENCE

CLEAVER‑BROOKS FIRE‑TUBE / WATER‑TUBE BOILERS
Model examples:
- CBLE / CBEX = fire‑tube, 15–800 HP, dryback or wetback
- ICB = industrial water‑tube, up to 2,500 HP
- FLX = 4‑pass fire‑tube (15–800 HP)
- Prometha = fire‑tube with advanced controls

Serial number decode: varies by decade – check nameplate for date code (YYWW format on newer).
Burner control: Cleaver‑Brooks uses C‑B Hawk or Fireye control systems.
Flame scanner: UV or IR. Check signal strength (≥4.0 µA for UV, ≥8.0 µA for IR) – clean lens quarterly.
Gas train: double block & bleed or single shutoff. Verify safety shutoff valves (SSOV) close completely – leak test annually.
Low water cutoff (LWCO): probe or float type – test blowdown weekly; clean probe monthly.
O2 trim: optional – maintains excess O2 at 3–4% for best efficiency. Calibrate annually with flue gas analyser.

FULTON VERTICAL / FLEXIBLE WATER‑TUBE
Model examples:
- VMP = vertical multi‑port, 4–50 HP, 80‑125 PSI
- FB = flexible water‑tube (FB‑A, FB‑L), 10–150 HP, 160 PSI
- ICS = immersion‑coil steam generator, electric
- J Series = oil/gas, 20–150 HP

Burner: Fulton uses Riello or Eclipse burners – check ignition transformer (spark should be strong, blue), gas pressure (3.5" WC NG, 11" WC LP).
Steam pressure control: modulating control valve regulates firing rate – stroke and position feedback should be accurate (4–20 mA).
Water hardness: ≤1 grain per gallon to prevent scale. Scale reduces heat transfer – can cause tube failure. Use water softener and chemical treatment.

HURST SCOTCH MARINE / FIRE‑TUBE
Model examples:
- 4‑pass dryback, 5‑pass wetback, 5‑pass dryback, vertical scotch marine
- 15–2,500 HP, up to 450 PSI design.
Wetback vs dryback: wetback has water‑cooled rear turnaround – better efficiency, less refractory maintenance. Dryback has refractory rear door – need inspection for cracks/settlement.
Burner: Hurst uses Power Flame, Riello, or Weishaupt – check air/fuel linkage for slop, ensure damper closes fully on shutdown.
Safety relief valve: set at or below MAWP – test quarterly (manual lift). Replace every 5 years or if leaking.
Refractory: inspect annually for spalling or cracking – damaged refractory causes short‑cycling, high flue temp, and CO formation.

MIURA EX‑GAS / LX SERIES (once‑through, rapid steam)
Model: EX‑GAS, LX, BL, K – compact, quick‑start (5 min from cold to full steam)
Once‑through design: no steam drum; water tube coils in a single pass – efficient but scale‑sensitive.
Water quality is critical: boiler feedwater TDS <150 ppm, hardness <0.5 grain. Use reverse osmosis or softener.
Control system: Miura uses BOILERMATE™ – 4‑20 mA signals for O2, pressure, flow. Auto blowdown based on TDS.
Fault codes: flash codes on LCD – refer to local display. Common: E01 (low water), E02 (high pressure), E03 (flame failure), E04 (gas pressure low).

BOILER ROOM SAFETY
- LOTO on all steam/piping before entering firebox.
- Confined space entry required for firebox inspection – gas test, forced ventilation, standby.
- NFPA 85 for boiler combustion controls – annual check of flame safeguard and safety interlock.
- OSHA 1910.119 for steam systems >15 PSIG and water >250°F – documented PSM required if hazardous substances present.
- Blowdown vessel and separator – check every 6 months; ensure blowdown line unobstructed.`
},
{
  id: "d16",
  name: "Cooling Towers & Evaporative Coolers — BAC, Marley, Evapco",
  brand: "BAC",
  type: "Service & Maintenance Manual",
  tags: ["cooling tower", "evaporative cooler", "BAC", "Marley", "Evapco", "water treatment", "fan", "drift", "fill", "vibration"],
  content: `COOLING TOWERS & EVAPORATIVE COOLERS — FIELD REFERENCE

BRANDS & TYPES
- BAC (Baltimore Aircoil): series 1500, VXT (hybrid), FXT (forced draft), CXVB (closed circuit), TrilliumSeries (adiabatic).
- Marley (SPX Cooling): NC (induced draft), LW (low‑noise), SS (stainless), MH (field‑erected).
- Evapco: ATW (induced), LSW (low‑sound), PM (pump‑assisted), ESW (closed circuit).

KEY COMPONENTS
Fill media: splash or film. Film fill is efficient but fouling‑sensitive – clean with low‑pressure water (max 40 PSI) to avoid damaging fins.
Drift eliminators: capture water droplets. If drift >0.001% of circulation flow, check eliminators for damage or fouling.
Fan: direct‑drive or belt‑drive. Belt tension: 1/64" deflection per inch of span under moderate thumb pressure. Check sheave alignment with straight edge.
Gearbox (induced draft): oil level and condition – check monthly. Change oil annually (ISO 220 or OEM spec).
Distribution basin / spray nozzles: check for even water flow – plugged nozzles cause dry spots and reduced efficiency.
Bleed / blowdown: maintain cycles of concentration (3–5) per water treatment plan. Use conductivity controller (setpoint 1000–2000 µS/cm typical).
Make‑up water valve: check float or solenoid operation – stuck open = overflow, stuck closed = low sump.

MAINTENANCE SCHEDULE (monthly)
- Visual: water level, fan rotation, vibration, leaks, excessive drift.
- Water chemistry: pH (6.5–8.0), conductivity, hardness, alkalinity, biocide (free chlorine 0.3–0.5 ppm or bromine).
- Strainer / suction screen: clean – debris reduces pump flow and causes cavitation.
- Fan belt: inspect for wear, glazing, cracks – replace if damaged.
- Motor bearings: grease per motor nameplate (typically every 3–6 months, 2–3 pumps of grease).

ANNUAL / SEMI‑ANNUAL
- Clean sump and basin – remove sludge and debris.
- Inspect fill: remove and clean if scaled/fouled. Use chemical soak for heavy scale (acid or alkaline degreaser depending on scale type).
- Inspect gearbox oil – replace if milky (water contamination) or dark/black (overheating).
- Fan balance / vibration analysis: use portable meter – ISO 1940 Grade G6.3 typical. Vibration >0.3 in/s (7.6 mm/s) RMS indicates problem.
- Motor megohm test (500V) – minimum 1 MΩ per kV plus 1 MΩ.
- Check drift eliminator condition – missing/damaged sections increase drift (water loss and potential Legionella).

TROUBLESHOOTING
High leaving water temp:
- Fan speed low or reverse rotation – check motor rotation (should match arrow).
- Air recirculation – adjacent units or building causing hot air ingestion – adjust fan speed or add discharge screens.
- Low water flow – check pump, strainer, distribution nozzles.
- Fouled fill – reduced heat transfer surface – clean.

Excessive drift: damaged eliminators – inspect and replace sections.

Vibration / noise:
- Unbalanced fan – clean blades and check for debris buildup; balance if needed.
- Loose belt or sheave – tighten and align.
- Worn bearings – replace gearbox or motor bearings.
- Cavitation in pump – check suction strainer, NPSH, pump speed.

WINTER OPERATION
- Basin heaters: should be on when ambient <40°F – check thermostat and amperage.
- Ice buildup on fan blades or fill: reduce fan speed, add basin heaters, maintain water flow.
- Shut down for freeze: drain all piping, basin, and pump; use compressed air to clear heat exchanger coils (closed circuit).
- Freeze protection of outdoor water piping: trace heating or glycol (if system design allows).`
},
{
  id: "d17",
  name: "Air Handlers, VAV Boxes & DOAS — Trane, Carrier, York",
  brand: "Trane",
  type: "Service Manual",
  tags: ["AHU", "air handler", "VAV", "DOAS", "Trane", "Carrier", "York", "fan array", "reheat", "static pressure", "filters"],
  content: `AIR HANDLING UNITS, VAV BOXES & DOAS — FIELD REFERENCE

AIR HANDLING UNITS (AHU)
Major brands: Trane (M‑Series, Climate Changer, Modular), Carrier (39/40 series, Aero), York (Sunline, Airfoil).
Components:
- Fan: belt‑drive or direct‑drive (plug or plenum). Check shaft alignment, bearing condition, belt tension (1/64" deflection per inch of span under moderate thumb pressure).
- Coils: cooling (chilled water or DX) and heating (hot water, steam, electric). Air‑side pressure drop <0.5" w.c. at design flow – higher = fouled coil.
- Filters: MERV 8, 11, 13, HEPA. Pressure drop across filter bank should be monitored with magnahelic – change when ΔP exceeds initial + 0.5" w.c. (or per spec).
- Mixing box: outdoor air and return air dampers. Check for binding, correct actuator travel (0–90°), end switches.
- Drain pan: slope to drain, no standing water. Clean quarterly with antimicrobial treatment. Check condensate trap (at least 1" per foot).
- Insulation: inspect for moisture or delamination – wet insulation reduces R‑value and can harbor mold.

VAV BOXES (Variable Air Volume)
Brands: Titus, Price, Nailor, Trane, Carrier.
Types: single‑duct, dual‑duct, fan‑powered (series or parallel), induction.
Components:
- Inlet flow sensor (averaging pitot): reads velocity pressure; must be clean – dirt causes under‑reporting.
- Actuator: 24V modulating (2‑10V or 4‑20mA). Check for full stroke (0–90°), damper linkage tight.
- Reheat coil: hot water or electric. Check coil ∆T (water) or amp draw (electric) – reheat should engage at minimum flow per zone setpoint.
- Fan‑powered: small centrifugal fan for recirculation – check wheel balance, motor bearings, capacitor.

Commissioning VAV:
1. Set minimum airflow per zone (typically 20–30% of design).
2. Set maximum airflow per zone.
3. Calibrate flow sensor with manometer (inlet pressure taps) – compare to flow coefficient (K‑factor) for box size.
4. Test heating mode: reheat valve opens when zone temp below setpoint.
5. Test cooling mode: box modulates to max airflow when zone temp above setpoint.

DOAS (Dedicated Outdoor Air Systems)
Brands: Trane (DOAS), Carrier (DOAS), Semco (energy recovery), Munters (desiccant).
Energy recovery wheel: rotating total energy wheel (sensible + latent). Check wheel speed (10–20 RPM), belt tension, and wheel cleanliness.
Enthalpy bypass: used for economiser operation – check outdoor air and return air enthalpy sensors (calibrated annually).
Frost control: pre‑heat coil or wheel speed control – prevents wheel icing in cold climates.
Supply air setpoint: typically 55–60°F (dry‑cooling) or 70–72°F (neutral). CO2 control (800–1000 ppm) drives outdoor air damper.

AHU TROUBLESHOOTING
Low airflow: check filters, fan speed, VFD, blocked duct (dampers), belt slip.
High static pressure: check VFD setpoint, duct restriction, VAV boxes at minimum, excess pressure drop in filters or coils.
Water carryover: high face velocity (>550 fpm across coil) or frozen coil (poor drainage).
Temperature out of spec: check chilled water valve / DX operation, hot water / steam valve, economiser mode (free cooling), and controls.
VFD fault: check drive display (common: OC – overcurrent, OV – overvoltage, GF – ground fault).
Fan vibration: check bearings, balance, sheave alignment, shaft straightness – correct within ISO 1940 Grade G6.3.

FILTER REPLACEMENT SCHEDULE
- MERV 8: 3–6 months (or 0.5" w.c. ΔP rise)
- MERV 11: 6–12 months
- MERV 13: 12 months
- HEPA: annual or per differential pressure monitor
- Bag filters: replace at 1.0–1.5" w.c. ΔP rise.`
},
{
  id: "d18",
  name: "Exhaust Fans & Make‑Up Air Units — Roof, Wall, Kitchen & Lab",
  brand: "General",
  type: "Service & Maintenance Manual",
  tags: ["exhaust fan", "make-up air", "MUA", "roof fan", "wall fan", "kitchen hood", "lab exhaust", "belt", "motor", "vibration"],
  content: `EXHAUST FANS & MAKE‑UP AIR (MUA) UNITS — FIELD REFERENCE

TYPES & BRANDS
Exhaust fans: roof (upblast, downblast), wall (propeller, centrifugal), inline (duct mount), kitchen hood (Grease Master, CaptiveAire), lab exhaust (fume hood).
Make‑up air (MUA): rooftop units with heating (gas or electric), sometimes cooling (DX or chilled water). Brands: Greenheck, Loren Cook, Trane (MUA), Carrier (MUA), York.
Common sizes: 500–50,000+ CFM.

FAN TYPES – CFM & PRESSURE
- Propeller (axial): high CFM, low static pressure (<1" w.c.). Use for general ventilation.
- Centrifugal: medium‑high CFM, higher static pressure (up to 4–6" w.c.). Use for ducted exhaust.
- Vaneaxial: high CFM, moderate pressure – use for large roof exhaust.
- Inline (duct fan): boost duct static.

SAFETY – CRITICAL FIRST STEP
- LOTO at disconnect.
- Check that fan wheel is mechanically locked before entering.
- Lock out gas supply (for MUA units) – double block and bleed if required.
- Test for hazardous fumes (kitchen grease, lab chemicals) with appropriate detector.

ROOF EXHAUST FAN MAINTENANCE
- Belt tension: 1/64" deflection per inch of span under moderate thumb pressure – adjust by moving motor base.
- Sheave alignment: use straight edge – within 1/16" per foot.
- Bearings: grease with NLGI #2 lithium complex – 2–3 pumps every 6 months (or per motor nameplate).
- Motor: check amp draw vs nameplate FLA. 10–15% higher indicates mechanical binding, overvoltage, or undersized pulley.
- Fan wheel: clean quarterly – debris buildup causes imbalance and reduced flow. Use plastic scraper (no impact on blades).
- Bird screen / inlet guard: clean monthly – clogged inlet reduces CFM and can cause motor overload.

KITCHEN HOOD EXHAUST – SPECIAL
- Grease filters: wash monthly (or per local fire code) – use degreaser.
- Fire suppression system: inspect by certified contractor semi‑annually – fusible links, chemical cylinder pressure, nozzle caps.
- UL 300 compliance: grease removal and fire suppression – verify tags.
- Fan speed: often interlocked with cooking equipment (dishwasher, grill) – check sequence.
- Ductwork cleanout: schedule semi‑annual grease removal (NFPA 96) – use qualified contractor.

LAB FUME HOOD EXHAUST
- Face velocity: 100 fpm at hood face – check with velometer / anemometer.
- Static pressure: check at hood collar (≈0.4–0.6" w.c. typical).
- Corrosion‑resistant materials: FRP, stainless, or coated – inspect for rust, chemical attack.
- Exhaust fan: typically VFD‑controlled to maintain hood face velocity.
- Alarm: audible / visual if face velocity drops below 80 fpm – test monthly.

MUA (MAKE‑UP AIR) UNITS
- Gas heating: check burner flame (blue, stable), gas pressure (3.5" WC NG, 11" WC LP), flue exhaust (CO < 100 ppm air‑free).
- Electric heating: check contactors, heater elements (resistance), safety limit switches.
- Supply fan: similar to AHU fan checks – belt, motor, bearings, vibration.
- Interlock: MUA must run at same or slightly lower CFM than exhaust to avoid negative pressure building.
- Temperature control: discharge air setpoint (55–65°F for cooling, 70–75°F for heating) – check sensors and modulating valves.

TROUBLESHOOTING
Low CFM: fan rotation reverse, dirty wheel, clogged filters, VFD fault, belt slip, dampers closed.
High amp draw: over‑voltage, tight belt, misaligned sheave, wheel rubbing housing, motor bearings failing.
Excessive vibration: unbalanced wheel (clean or rebalance), worn bearings, loose mounting.
Noise: turbulence from damper or duct transition, worn bearings, loose panel.
MUA burner won't fire: gas pressure low, igniter failed (check resistance), flame sensor dirty, combustion air pressure switch stuck.
Overheating (electric MUA): clogged filter, fan low speed, stuck contactor, failed limit.`
}, {
  id: "d19",
  name: "Electrical & Motors — Diagnostics, Testing & VFD Tuning",
  brand: "General",
  type: "Electrical Reference",
  tags: ["electrical", "motors", "VFD", "megger", "single-phasing", "amperage", "troubleshooting"],
  content: `ELECTRICAL & MOTORS — FIELD DIAGNOSTICS REFERENCE

MOTOR NAMEPLATE INTERPRETATION
FLA (Full Load Amps): the amp draw at rated load and voltage — this is the number to compare field readings against, not LRA.
LRA (Locked Rotor Amps): the momentary inrush current at startup, typically 5-7x FLA. A motor that trips on start every time but runs fine once up to speed often points to an undersized breaker/starter for the LRA, not a motor problem.
Service Factor (SF): a multiplier showing how much overload the motor can handle continuously (e.g., 1.15 SF means the motor can run at 115% of nameplate HP without immediate damage) — this is a safety margin, not a target operating point.
NEMA design letter (B, C, D): describes the torque/slip characteristic — Design B is standard for most HVAC fan and pump loads, Design C for high-inertia starting loads.
Insulation class (A, B, F, H): maximum allowable winding temperature rise. Class F (155°C) is most common in modern commercial motors. Running a motor consistently at or near its insulation class temperature limit shortens life dramatically — insulation life roughly halves for every 10°C above rated temperature.

MOTOR AMPERAGE DIAGNOSTICS
Amps below FLA at rated load: possible undervoltage, or motor is underloaded (fan/pump not achieving design flow — check for a closed valve, damper, or slipping belt reducing actual mechanical load).
Amps above FLA: mechanical binding (bearing failure, coupling misalignment, impeller/wheel rubbing), overvoltage causing higher magnetizing current, or the driven load genuinely exceeds design (e.g., a fan moving more air than intended due to a wide-open damper that should be throttled).
Unbalanced phase currents (more than 10% difference between phases on a 3-phase motor): almost always indicates a voltage imbalance problem upstream, a connection issue (loose or corroded terminal), or developing winding damage. A small voltage imbalance causes a much larger current imbalance — roughly 6-10x amplification — and generates significant extra heat, so even a 2-3% voltage imbalance is worth investigating.
Single-phasing: occurs when one leg of a 3-phase supply is lost while the motor is running (fuse blown, loose connection, contactor contact failure) — the motor will attempt to keep running on the remaining two legs, drawing very high current on those legs and overheating rapidly. This is one of the most common causes of sudden 3-phase motor burnout. Symptoms: motor hums loudly, may still turn but with reduced torque, high amp draw on two legs with the third reading near zero. If a motor won't start and hums: de-energize immediately and check all three phases at the motor terminals before attempting to restart — running a stalled single-phased motor for even a short time can cause severe winding damage.

MEGGER (INSULATION RESISTANCE) TESTING
Purpose: measures the resistance of motor winding insulation to ground, detecting moisture intrusion, insulation breakdown, or contamination before it causes a ground fault failure.
Procedure: disconnect motor from all power and control wiring, disconnect any solid-state devices (VFD, soft starter) as they can be damaged by megger test voltage, test each phase winding to ground and phase-to-phase if accessible.
Test voltage: typically 500V DC for motors rated up to 600V (do not exceed manufacturer's recommended test voltage — always check nameplate/manual first).
Minimum acceptable reading: a common rule of thumb is 1 megohm per kV of rated voltage plus 1 megohm (e.g., a 460V motor: roughly 1.46+ megohm minimum), but always defer to the manufacturer's specific minimum if published — readings in the hundreds of megohms or higher (with a good meter, often shown as ">999" or in gigohms) indicate excellent insulation condition.
Trending matters more than a single reading: a motor reading 50 megohms today that read 500 megohms a year ago is degrading even though 50 megohms might still pass a one-time minimum threshold — always log readings for year-over-year comparison.
Temperature and humidity affect readings: cold, dry conditions give artificially high readings; hot, humid conditions give lower readings — note ambient conditions when testing for accurate trend comparison.

VFD (VARIABLE FREQUENCY DRIVE) TUNING & COMMISSIONING
Motor parameter entry: before running, enter the exact motor nameplate data into the drive (voltage, FLA, frequency, poles/RPM, service factor) — running a drive with generic/default motor parameters instead of the actual nameplate data is a common cause of poor performance, nuisance trips, and reduced motor life.
Auto-tune function: most modern drives have an auto-tune routine (sometimes called "motor ID" or "auto-tuning") that runs a brief test sequence to measure actual motor characteristics (winding resistance, inductance) for optimal control — always run this after initial parameter entry and after any motor replacement, as it significantly improves control accuracy versus using only nameplate-derived defaults.
Acceleration/deceleration ramp times: too fast causes nuisance overcurrent trips and mechanical stress; too slow wastes energy and can cause process control issues. Typical starting point for HVAC fan/pump loads: 10-30 second ramps, adjusted based on the specific application and any observed trip behavior.
V/Hz curve vs. vector control: V/Hz (volts per hertz) is simpler and adequate for most constant-torque HVAC fan and pump applications; vector control (sensorless or with encoder feedback) provides better low-speed torque and is used where precise speed/torque control matters — most standard HVAC applications do not need vector control.
Minimum speed setting: many HVAC applications should not run the motor below a certain frequency (commonly 15-20 Hz) — running too slow on a motor with a shaft-mounted cooling fan (most standard motors) can cause overheating since the cooling fan also slows down, reducing airflow over the motor at exactly the point where the motor may be working harder relative to its speed.
Carrier frequency (PWM switching frequency): higher carrier frequency reduces audible motor noise but increases drive heat generation and can increase motor bearing current issues on some installations — default settings are usually appropriate; only adjust if there's a specific noise complaint or bearing failure pattern suggesting VFD-induced bearing current damage (common on larger motors, mitigated with shaft grounding rings).

COMMON ELECTRICAL FIELD MEASUREMENTS & WHAT THEY MEAN
Voltage drop under load: measure voltage at the source and at the load while running — a significant drop (more than about 3% under normal load) indicates undersized wiring, a loose connection, or excessive circuit length for the wire gauge; voltage drop causes equipment to draw higher current to deliver the same power, generating extra heat and reducing efficiency and lifespan.
Ground fault: current is leaking from a circuit conductor to ground instead of returning through the intended neutral/return path — a ground fault circuit interrupter (GFCI) or ground fault protection relay detects this by comparing current going out versus coming back; in motor circuits, a ground fault often indicates winding insulation breakdown (confirm with megger test) or physical damage to conductor insulation.
Power factor: the ratio of real power (doing useful work) to apparent power (total power drawn) — inductive loads like motors typically have lagging power factor; low power factor doesn't damage equipment directly but can result in utility power factor penalty charges on the electric bill, and correction (via capacitor banks) is sometimes specified for large motor loads.
Thermal imaging: an infrared camera scan of electrical panels and connections under load is one of the most effective non-invasive PM tools — a connection running hotter than its neighbors of the same rating and load is a developing failure point (loose termination, corrosion) that can be identified and corrected before it causes an outage or fire; document baseline thermal images for critical equipment for future comparison.`
}, {
  id: "d20",
  name: "Controls Sequences of Operation — Common System Types",
  brand: "General",
  type: "Controls Reference",
  tags: ["sequence of operation", "controls", "SOO", "programming reference", "commissioning"],
  content: `SEQUENCES OF OPERATION — COMMON COMMERCIAL HVAC SYSTEM TYPES

WHY THIS MATTERS IN THE FIELD
Understanding the intended sequence of operation (SOO) is what separates diagnosing "this behavior is wrong" from just observing "this behavior is unusual." Many service calls that appear to be equipment failures are actually the system doing exactly what it was programmed to do — just not what the occupant or even the technician expected. Always compare observed behavior against the intended sequence before assuming a mechanical or control fault.

PACKAGED RTU — TYPICAL SINGLE-ZONE SEQUENCE
Occupied mode: fan runs continuously (or per schedule); cooling stages engage based on space temperature rising above cooling setpoint plus a deadband (typically 1-2°F); heating stages engage based on space temperature falling below heating setpoint minus deadband; economizer (if equipped) checks outdoor conditions first — if outdoor air is suitable for free cooling (below a temperature or enthalpy changeover point, commonly 55-65°F depending on design), the economizer damper modulates to meet the cooling call before mechanical cooling stages engage.
Unoccupied mode: fan cycles with demand rather than running continuously (unless a specific unoccupied ventilation requirement applies); setpoints widen (setback heating lower, setup cooling higher) to save energy while maintaining minimum protection against extreme conditions.
Morning warmup/cooldown: many systems have a pre-occupancy period where the system runs to bring the space to occupied setpoint before the scheduled occupied time begins, sometimes with economizer/outdoor air locked out during this period to avoid pulling in unconditioned outdoor air while trying to recover space temperature quickly.
Common "not a fault" observations: short cycling appearing to occur when it's actually staged equipment cycling individual stages on/off around a single space temperature reading (normal for multi-stage equipment); economizer running with mechanical cooling appearing "off" when outdoor conditions are fully meeting the load (correct free-cooling operation, not a compressor failure).

VAV AIR HANDLER WITH VAV BOXES — TYPICAL SEQUENCE
Supply fan: VFD-controlled to maintain a duct static pressure setpoint (commonly 1.0-1.5" w.c., measured at a point roughly 2/3 down the longest duct run) — the fan speed is not directly tied to any single zone's demand but to the overall system static pressure requirement created by all VAV boxes' collective damper positions.
Discharge air temperature reset: many systems reset the AHU discharge air temperature setpoint based on the zone(s) with the highest cooling demand — if all zones are satisfied with a warmer discharge temp, the system raises the setpoint to save cooling energy (this can appear to a technician as "discharge temp isn't at 55°F" when in fact 58-60°F is correct for current conditions under a properly functioning reset sequence).
VAV box sequence: each box modulates airflow between its programmed minimum and maximum CFM to satisfy its zone temperature; reheat (if equipped) engages only after the box reaches minimum airflow and the zone still calls for heat — a box calling for heat while still at a high airflow percentage typically indicates the box hasn't reached minimum yet, which is expected behavior, not a fault.
Static pressure reset (advanced/optimized systems): rather than holding a fixed static pressure setpoint, the system monitors all VAV box damper positions and resets the AHU static pressure setpoint down as long as at least one box remains nearly fully open — saving significant fan energy versus a fixed high setpoint; if this logic malfunctions, boxes may appear "starved" for airflow even though the AHU output seems adequate — check the actual static pressure trend against box damper positions.

CHILLED WATER PLANT — TYPICAL PRIMARY/SECONDARY SEQUENCE
Chiller staging: lead chiller starts based on system load (often determined by return water temperature or a calculated load estimate); lag chiller(s) stage on when the lead chiller reaches a high percentage of capacity for a sustained period, and stage off in reverse as load drops — nuisance staging (chillers cycling on/off too frequently) often indicates the staging deadband or timer is too tight for the actual load swings at the building.
Primary/secondary pumping: primary pumps run at fixed/constant flow matched to each chiller's design flow requirement; secondary pumps (VFD-controlled) vary flow to meet actual building demand, decoupled from the primary loop via a common bypass pipe — if the secondary loop begins pulling more flow than the primary loop is providing (detectable by reversed flow or unusual temperature readings in the bypass), it indicates the primary pumps/chillers aren't keeping pace with secondary demand.
Chilled water reset: supply water temperature setpoint may reset upward when building load is low (saving chiller energy) — a chilled water supply reading 46-48°F instead of a fixed 44°F is not necessarily a problem if reset logic is active and load is genuinely low; verify by checking actual zone comfort complaints against the reset schedule before assuming an equipment problem.
Condenser water reset (cooling tower loop): tower fan staging and/or VFD speed modulates to maintain a condenser water supply temperature setpoint, which itself may reset based on outdoor wet-bulb temperature and chiller efficiency optimization logic on more advanced systems.

HOT WATER HEATING PLANT — TYPICAL SEQUENCE
Boiler staging: similar logic to chiller staging — lead/lag based on load, with reset schedules for supply water temperature based on outdoor air temperature (a common and effective energy-saving sequence: colder outside means higher hot water supply temp, warmer outside allows a lower supply temp) — hot water supply reading lower than a fixed expected number is often correct reset operation on a mild day, not an underperforming boiler.
Primary/secondary or variable primary pumping: similar decoupling concept as chilled water — verify actual system type before assuming a fixed-flow expectation.
Outdoor air reset curve: typically defined by two points (e.g., at 0°F outdoor, supply water = 180°F; at 60°F outdoor, supply water = 120°F) with linear interpolation between — if a zone is cold on a mild day, check whether the reset curve is delivering adequate temperature for that specific zone's actual load rather than assuming the boiler itself is at fault.

ECONOMIZER-INTEGRATED SYSTEM — SEQUENCE LOGIC
Changeover method — fixed dry-bulb: economizer enabled whenever outdoor temperature is below a fixed setpoint (simple, doesn't account for humidity, can cause high-humidity outdoor air to be pulled in on a cool-but-humid day).
Changeover method — differential dry-bulb: compares outdoor temperature to return air temperature, enabling economizer whenever outdoor air is cooler than return air (better than fixed, still doesn't account for humidity directly).
Changeover method — enthalpy (single or differential): compares total heat content (temperature + humidity) of outdoor versus a fixed reference or return air — most effective at avoiding high-humidity "free cooling" that isn't actually beneficial, but requires properly calibrated and maintained humidity sensors, which are a common failure/drift point requiring periodic verification.
100% outdoor air economizer mode: when outdoor conditions are favorable enough, the system may fully open the outdoor air damper and close return air damper for "free cooling" without any mechanical cooling — a system appearing to run with compressors off and outdoor damper wide open during mild weather is very likely correct high-economizer operation, not a broken compressor.

DEMAND-CONTROLLED VENTILATION (DCV) — TYPICAL SEQUENCE
CO2 sensor(s) in representative space(s) or return air duct drive outdoor air damper position above the fixed minimum when CO2 rises above a setpoint (commonly 800-1000 ppm), indicating higher occupancy than the minimum ventilation design assumed.
A system correctly reducing outdoor air toward the fixed minimum during low-occupancy periods (evenings, weekends, partially-occupied spaces) is functioning as designed for energy savings — this is often mistaken for an economizer or damper fault by someone unfamiliar with the DCV sequence, when in fact the reduced outdoor air is intentional and correct.`
}, {
  id: "d21",
  name: "Codes & Compliance — ASHRAE, NFPA, EPA Refrigerant Regulations",
  brand: "General",
  type: "Codes & Compliance",
  tags: ["codes", "compliance", "ASHRAE", "NFPA", "EPA", "refrigerant regulations", "safety codes"],
  content: `CODES & COMPLIANCE — FIELD REFERENCE FOR HVAC TECHNICIANS

EPA SECTION 608 — REFRIGERANT MANAGEMENT
Certification requirement: any technician who opens equipment containing refrigerant (for repair, maintenance, or disposal) must hold EPA 608 certification appropriate to the equipment type — Type I (small appliances), Type II (high-pressure/medium-pressure appliances, most commercial split systems and RTUs), Type III (low-pressure appliances, most chillers), or Universal (all three).
Venting prohibition: intentionally releasing refrigerant to the atmosphere during installation, maintenance, repair, or disposal is illegal under federal law regardless of refrigerant type (this applies to ozone-depleting substances and, as of recent rule updates, to many HFCs as well) — always recover to an appropriate recovery cylinder.
Leak repair requirements: for appliances containing 50+ lbs of covered refrigerant, if the annual leak rate exceeds the applicable trigger rate (commonly 10-30% depending on equipment type and current rule set — verify current EPA threshold, as these have been updated over time), the owner is legally required to repair the leak within a specified timeframe and may need to file leak repair reports; technicians should document leak rate calculations and refer facility owners/managers to their compliance obligation rather than assuming it's outside the technician's concern.
Refrigerant sales restrictions: many refrigerants can only be purchased by certified technicians — always verify current purchase restriction status for the specific refrigerant type being used, as regulations have expanded certification requirements to additional refrigerant types over time (including some HFCs previously unrestricted).
Recordkeeping: technicians and companies are generally required to keep service records showing refrigerant added, recovered, and equipment serviced — maintain accurate field documentation as a compliance matter, not just good practice.

AIM ACT & HFC PHASEDOWN (U.S.)
The American Innovation and Manufacturing (AIM) Act established a phasedown schedule for HFC refrigerant production and consumption in the United States, driving the industry-wide shift toward lower-GWP (Global Warming Potential) alternatives like R-454B, R-32, and R-1234yf/ze in new equipment. Field implication: expect continued introduction of new refrigerant types in commercial equipment, often with different safety classifications (some newer refrigerants are A2L — mildly flammable — requiring different handling precautions than traditional A1 non-flammable refrigerants). Always verify the specific refrigerant classification and required precautions before servicing unfamiliar equipment, rather than assuming standard A1 refrigerant handling procedures apply.

A2L REFRIGERANT SAFETY (R-32, R-454B, R-1234yf, and similar)
A2L classification means mildly flammable, lower toxicity under ASHRAE 34 — these refrigerants require additional precautions beyond standard A1 refrigerant handling: no open flame or spark-producing tools in the immediate work area during recovery/charging operations; ensure adequate ventilation, especially in confined spaces or mechanical rooms with limited air exchange; use only refrigerant-specific rated recovery machines, cylinders, and gauge sets (do not cross-contaminate A2L equipment with A1 refrigerant service tools); leak detection equipment must be rated appropriately for flammable refrigerant detection, as standard electronic leak detectors calibrated for A1 refrigerants may not perform correctly. Charge limits per room volume apply per manufacturer specification and adopted mechanical/fire code — do not assume a charge amount is safe without checking the applicable limit for the specific space volume and ventilation characteristics.

NFPA 70E — ELECTRICAL SAFETY IN THE WORKPLACE
Arc flash risk assessment: before working on or near energized electrical equipment, an arc flash risk assessment determines the incident energy exposure and required PPE category — always check for equipment-specific arc flash labeling (required on most commercial electrical equipment) rather than assuming a generic PPE level is adequate.
Established boundaries: NFPA 70E defines approach boundaries (limited approach, restricted approach, arc flash boundary) based on voltage and calculated incident energy — unqualified persons must stay outside the limited approach boundary; only qualified persons with appropriate PPE and an energized work permit (where required) may work within the arc flash boundary.
De-energized work as the default: the standard's core principle is that electrical equipment should be placed in an electrically safe work condition (properly locked out, tagged, and verified de-energized with a rated tester) before work begins whenever feasible — energized work should be the exception, justified and documented, not the default approach for convenience.
PPE categories: arc-rated clothing and equipment is selected based on the calculated incident energy at the specific piece of equipment (measured in cal/cm²) — PPE category requirements range from minimal (Category 1) to substantial arc-rated suits (Category 4) depending on the equipment's fault current and clearing time characteristics; always use the PPE specified for that specific equipment's labeled category, not a generic assumption.

NFPA 90A / 90B — AIR CONDITIONING AND VENTILATING SYSTEMS
Governs construction and installation requirements for HVAC systems, including fire damper requirements at fire-rated wall/floor penetrations, duct construction and insulation flame spread ratings, and smoke detector requirements in air handling systems above certain airflow thresholds. Field relevance: fire/smoke dampers must remain functional and are subject to periodic testing requirements (commonly tested at set intervals per adopted code and insurance requirements) — a damper found stuck or inoperative during PM should be flagged as a life-safety deficiency requiring prompt repair, not treated as routine deferred maintenance.

NFPA 96 — VENTILATION CONTROL AND FIRE PROTECTION OF COMMERCIAL COOKING OPERATIONS
Governs kitchen exhaust hood, ductwork, and fire suppression system requirements. Grease duct cleaning frequency is specified based on cooking volume/type (ranges from monthly for high-volume solid fuel cooking to semi-annually for moderate-volume operations) — always verify current cleaning documentation is in place and current, as this is a common fire marshal inspection point and liability issue for the facility. Fire suppression system (wet chemical, typically) requires semi-annual inspection by a certified contractor — a field technician noticing an expired inspection tag during other kitchen exhaust work should flag it, even though the suppression system inspection itself is typically outside general HVAC technician scope.

NFPA 85 — BOILER AND COMBUSTION SYSTEMS HAZARDS CODE
Establishes safety requirements for boiler combustion control systems, including flame safeguard supervision, purge sequences before ignition, and safety interlock requirements. Field relevance for PM: flame safeguard response time testing (verifying the burner shuts down within the required time after simulated flame loss) is a code-driven safety test, not an optional check — document results and never return a boiler to service with a failed or bypassed safety interlock.

ASHRAE 62.1 — VENTILATION FOR ACCEPTABLE INDOOR AIR QUALITY
Establishes minimum outdoor air ventilation rates based on space type and occupancy. Field relevance: verify economizer/outdoor air minimum damper positions are actually delivering the design ventilation rate — a damper mechanically stuck at a lower position than its intended minimum setting is both a comfort/IAQ issue and a code compliance gap; when in doubt about whether current airflow meets design intent, this is worth flagging to building management/engineering rather than assuming "it's always been like that" is acceptable.

ASHRAE 15 — SAFETY STANDARD FOR REFRIGERATION SYSTEMS
Establishes requirements for refrigerant charge limits per occupied space volume, machinery room ventilation and refrigerant detection requirements for larger systems, and general refrigeration system safety provisions. Machinery rooms containing chillers or large refrigeration systems typically require mechanical ventilation interlocked with a refrigerant leak detection system — verify these systems are tested periodically and functioning, as a machinery room refrigerant leak without proper detection/ventilation is a serious life-safety hazard, particularly for A2L, A3, or toxic (B-classified) refrigerants.

ASHRAE 188 — LEGIONELLOSIS RISK MANAGEMENT
Establishes a framework for building water systems (cooling towers being the primary HVAC-relevant application) to have a documented water management program addressing Legionella risk. Field relevance: any facility with a cooling tower should have a written water management plan; technicians performing cooling tower maintenance should be familiar with their specific facility's plan requirements (water treatment parameters, inspection frequency, documentation) and report any observed deficiencies (e.g., biocide feed system malfunction, basin not being cleaned per schedule) through the appropriate channel rather than treating it as a purely mechanical maintenance matter.

GENERAL COMPLIANCE PRINCIPLE FOR FIELD TECHNICIANS
Codes and standards referenced here establish minimums and requirements, but the specific code edition and any local amendments adopted by the Authority Having Jurisdiction (AHJ) govern actual legal compliance for a given facility and location — this reference provides general field awareness, not a substitute for verifying the specific applicable code edition and any local requirements for a given job. When a safety-critical compliance question arises that isn't clearly resolved by this reference (a safety control test result, a suspected code violation, an unclear regulatory requirement), escalate to a supervisor or the facility's compliance/engineering resource rather than making an independent judgment call on a life-safety or legal compliance matter.`
}, {
  id: "d22",
  name: "Pumps & Hydronics — Troubleshooting, Glycol Systems & Balancing",
  brand: "General",
  type: "Service Manual",
  tags: ["pumps", "hydronics", "glycol", "cavitation", "circulator", "balancing"],
  content: `PUMPS & HYDRONICS — FIELD REFERENCE

CENTRIFUGAL PUMP FUNDAMENTALS
Pump curve basics: a centrifugal pump produces a specific flow rate (GPM) at a corresponding head (feet of water, or psi) — as system resistance (head) increases, flow decreases along the pump's curve, and vice versa; a pump doesn't have a single fixed flow rate, it operates at whatever point its curve intersects the system's actual resistance curve.
Affinity laws: for a centrifugal pump, flow varies directly with speed, head varies with the square of speed, and power varies with the cube of speed — this is why even modest speed reduction via VFD produces significant energy savings (a pump running at 80% speed uses roughly 51% of full-speed power, not 80%).
Impeller trim: reducing impeller diameter (a common energy-efficiency retrofit) reduces both flow and head capability at a given speed — follows similar but not identical relationships to the affinity laws; consult manufacturer pump curves for accurate trimmed performance rather than estimating.

CAVITATION — DIAGNOSIS AND CAUSES
Symptoms: a rattling or "marbles in a can" noise from the pump, vibration, reduced flow/head performance, and accelerated impeller erosion damage over time if not corrected.
Root cause: cavitation occurs when the pressure at the pump suction (impeller eye) drops below the fluid's vapor pressure, causing vapor bubbles to form and then violently collapse as they move into the higher-pressure discharge area — this bubble collapse is what causes the noise and physical erosion damage to the impeller.
Common causes: insufficient NPSH (Net Positive Suction Head) available — the pump is trying to pull more flow than the suction-side piping and elevation can supply without the pressure dropping too low; a clogged suction strainer restricting inlet flow; suction piping that's undersized or has too many restrictive fittings for the flow rate; pump running significantly beyond its rated capacity (operating far right on the pump curve, which increases NPSH required); air entrainment from a leak on the suction side of the pump (drawing air into a system that should be a closed loop) or from inadequate air separation/venting on an open or partially-open system.
Correction approach: verify strainer/suction piping isn't restricted first — this is the most common and easiest-to-fix cause; check for suction-side leaks if air entrainment is suspected; if the pump is oversized for the system and operating far right on its curve, throttling the discharge valve slightly can sometimes help by moving the operating point, but the better long-term fix is correcting the pump selection or trimming the impeller.

GLYCOL SYSTEMS — SPECIAL CONSIDERATIONS
Purpose: propylene glycol (more common, lower toxicity) or ethylene glycol (higher toxicity, avoid in systems where any potable water cross-contamination risk exists) is added to hydronic systems for freeze protection (outdoor piping, systems that may be exposed to freezing temperatures) or sometimes for burst protection in systems that could freeze during a power/equipment failure.
Concentration and freeze point: glycol concentration is checked with a refractometer (more accurate) or a hydrometer — typical concentrations range from 20-50% depending on the required freeze protection level for the specific climate and application; always verify actual concentration rather than assuming the original fill percentage remains accurate, as water loss/makeup over time changes the ratio (adding only water to top off a glycol system dilutes the concentration and reduces freeze protection).
Reduced heat transfer: glycol solutions have lower specific heat and higher viscosity than plain water, which reduces heat transfer efficiency and increases pumping energy/pressure drop — systems are typically designed accounting for this at the intended concentration, but if concentration is significantly higher than design (over-concentrated), it can noticeably reduce system capacity and increase pump energy use beyond what the original design anticipated.
Glycol degradation: over time, glycol can break down chemically (especially with air exposure/oxidation or overheating), forming acidic byproducts that can attack system metals — periodic testing of glycol pH/reserve alkalinity is recommended per the glycol manufacturer's guidance, with glycol replacement or chemical treatment adjustment if degradation is found; a system with unexplained recurring pump seal failures or unusual pipe corrosion should have glycol condition checked as a possible contributing factor.
Corrosion inhibitor depletion: most commercial glycol products include corrosion inhibitor packages that deplete over time and require periodic testing/replenishment (test kits are typically available from the glycol manufacturer) — using an automotive-grade glycol product instead of an HVAC-specific product is a common and problematic mistake, as automotive glycols are not formulated for the metals and long service intervals typical of commercial hydronic systems.

CIRCULATOR PUMP TROUBLESHOOTING
Pump runs but no/low flow: check for a closed isolation valve somewhere in the loop (very common after other maintenance work — always verify all valves are in their correct operating position after any service), an air-bound system (air pocket preventing flow, especially at a high point in the piping — bleed air from high points), or a failed/seized check valve preventing flow in the intended direction.
Pump won't run: check power supply and any interlocks (many circulators are interlocked with a call for heat/cooling from a control system or aquastat — verify the pump should actually be calling to run before assuming a pump failure); check capacitor on single-phase pumps (a common wear component); check for a seized rotor (many wet-rotor circulators can seize from mineral deposit buildup if the pump sits idle for extended periods, particularly in hard water areas — some models have a manual "bleed screw" at the pump shaft that can be used to manually free a seized rotor).
Noisy pump: cavitation (see above), a worn/failing bearing (dry-rotor style pumps have separate bearings subject to wear, unlike wet-rotor pumps where the fluid itself provides bearing lubrication), or entrained air in the system.
Pump seal leak (dry-rotor/mechanical seal pumps): mechanical seals wear over time and eventually leak — this is a normal wear item requiring seal replacement or pump replacement, not usually indicative of a system problem, unless the seal failure is premature (check for cavitation, excessive vibration from misalignment, or running dry as possible causes of premature seal failure rather than normal wear-out).

SYSTEM BALANCING BASICS
Purpose: hydronic balancing ensures each piece of equipment (coil, terminal unit, etc.) receives its designed flow rate — without balancing, equipment closest to the pump (lowest resistance path) tends to receive excess flow while equipment furthest away is starved, causing uneven comfort and capacity across the system.
Balancing valves: circuit setters or balancing valves with a measurable port allow a technician to measure actual flow (using a differential pressure meter matched to the valve) and adjust the valve position to achieve the design flow rate at each piece of equipment — balancing should be performed with the system at or near design operating conditions where practical.
Symptoms of an unbalanced system: some zones/coils perform well while others consistently underperform despite adequate overall system capacity and no apparent equipment fault at the underperforming location — if individual equipment checks out fine (clean coil, functioning valve, correct control operation) but capacity is still inadequate, insufficient flow due to poor system balance is a strong candidate, verifiable by an actual flow measurement at that piece of equipment compared to its design flow requirement.
Variable flow systems: on modern variable-flow hydronic systems (VFD-controlled pumps with 2-way control valves at each coil, rather than traditional 3-way valves and constant flow), traditional fixed balancing valve settings are less critical since flow inherently self-adjusts to each coil's control valve position, but minimum flow bypass and proper valve authority (the pressure drop ratio of the control valve versus the rest of its circuit) still matter for good control response — a control valve with poor authority (too small a pressure drop relative to the circuit) will be sluggish and non-linear in its response even if perfectly functional itself.

EXPANSION TANK & SYSTEM PRESSURIZATION
Purpose: as water heats and expands in a closed hydronic loop, the expansion tank absorbs the volume change while maintaining system pressure within an acceptable range — without proper expansion capacity, system pressure would rise dangerously as water heats, potentially lifting relief valves repeatedly or causing other pressure-related problems.
Diaphragm/bladder tanks: pre-charged with air on one side of a diaphragm, separated from system water — pre-charge pressure should be set (with the system depressurized/isolated from the tank) to match the system's static fill pressure at the tank's installed elevation; an incorrectly pre-charged tank (checked with a tire-gauge-style tool at the tank's air valve when isolated from system water) is a common cause of a system that won't hold pressure properly, cycles the makeup water feeder excessively, or has a relief valve that weeps/lifts more than expected.
Makeup water and relief valve troubleshooting: a system requiring frequent makeup water addition indicates a leak somewhere in the system (even a small one) or a failed/leaking relief valve — investigate rather than simply continuing to add makeup water, as continuous fresh water makeup also introduces additional dissolved oxygen and minerals that accelerate corrosion and scale formation in the system over time.`
}, {
  id: "d23",
  name: "Equipment Commissioning — New Installation & Retrofit Startup",
  brand: "General",
  type: "Commissioning",
  tags: ["commissioning", "startup", "retrofit", "checklist", "verification"],
  content: `EQUIPMENT COMMISSIONING — NEW INSTALLATION & RETROFIT STARTUP PROCEDURE

WHY FORMAL COMMISSIONING MATTERS
A significant share of equipment problems discovered months after installation actually originated at startup — an issue that would have been caught and corrected easily during commissioning becomes a much more disruptive and costly service call once the equipment has been "accepted" and is in normal operation. A disciplined commissioning process catches these issues while the installing contractor and design intent are still fresh and accessible.

PRE-STARTUP VERIFICATION (BEFORE ANY POWER OR REFRIGERANT)
Physical installation check: verify equipment is mounted level and per manufacturer clearance requirements (service access, airflow clearance for condensers, etc.) — inadequate clearance discovered after startup is far more disruptive to correct than catching it before energizing equipment.
Electrical verification: confirm supply voltage matches equipment nameplate before energizing (a surprisingly common and completely avoidable failure is connecting 208V-rated equipment to a 230V supply or vice versa, especially relevant since many nameplates list a dual rating like "208/230V" with different performance implications at each); verify proper wire sizing and overcurrent protection per equipment documentation, not just "whatever was already there."
Refrigerant piping verification (split systems, VRF): confirm line set sizing matches manufacturer specification for the given equivalent length and elevation change — undersized piping causes excessive pressure drop and poor performance that can be very difficult to diagnose after the fact if not verified against spec at installation; pressure test and evacuate per manufacturer procedure (deep vacuum, typically 500 microns or per specific manufacturer requirement, held to verify no significant rise before charging) — a system charged without proper evacuation retains non-condensable gases and moisture that cause long-term reliability problems and are difficult to fully correct after the fact without a full recovery and re-evacuation.
Ductwork/piping verification: confirm ductwork or piping connections match design (correct sizing, no unauthorized field changes that weren't verified against the design's airflow/head calculations) before startup airflow or flow testing.
Controls pre-check: verify all field wiring matches the control wiring diagram before applying power — energizing a system with a wiring error can damage control boards or sensors, whereas the same error found with a continuity/point-to-point check before power-up is a simple correction.

INITIAL STARTUP SEQUENCE
Energize and observe: bring equipment up per manufacturer startup sequence (many have a specific required order — e.g., crankcase heater energized for a specified period before compressor start on some equipment) rather than simply throwing every disconnect at once; observe for any abnormal sounds, smells, or visible issues immediately upon startup before proceeding further.
Rotation verification: for any 3-phase motor (fans, pumps, compressors on some equipment types), verify correct rotation direction before allowing extended run time — reversed rotation on a fan will still move air but at drastically reduced volume and can cause overcurrent trip or motor damage if run for an extended period; reversed rotation on a scroll compressor is a well-known cause of rapid, sometimes immediate, compressor damage.
Safety control verification: confirm all safety controls (high/low pressure switches, freeze protection, high limit switches, flow switches) are wired and functioning correctly before the equipment is placed in unattended service — testing these at commissioning (with an appropriate simulated fault where safely possible) is far preferable to discovering a non-functional safety control during an actual fault event later.

PERFORMANCE VERIFICATION
Refrigerant charge verification: charge per manufacturer weight specification for the installed line length (with any required adjustment for line length beyond base allowance), then fine-tune using superheat/subcooling method at stable operating conditions — record actual operating pressures, temperatures, and calculated superheat/subcooling as baseline documentation for future service reference.
Airflow verification: measure actual delivered airflow (via traverse, flow hood, or other appropriate method for the equipment type) against design CFM — airflow significantly below design reduces both capacity and efficiency and can cause coil icing (cooling) or overheating/short-cycling (heating on gas furnaces); document actual measured airflow as commissioning baseline.
Electrical load verification: record actual running amps on all major components (compressor, fan motors, pump motors) against nameplate FLA at stable operating conditions — this becomes the baseline for future trend comparison and immediately flags any component running outside expected range even at initial startup.
Control sequence verification: actually exercise every control sequence the equipment/system is supposed to perform (not just confirm it turns on) — cycle through occupied/unoccupied modes if applicable, verify economizer operation across its range if equipped, verify staging sequence on multi-stage equipment, verify safety shutdowns actually shut the equipment down when simulated (where safely testable) rather than assuming the programming is correct because it compiled without error.

BAS/CONTROLS INTEGRATION COMMISSIONING
Point-to-point verification: for any equipment integrated with a building automation system, verify every physical input and output point matches its intended BAS graphic/point list — command each output point from the BAS and physically confirm the equipment responds correctly; read each input point on the BAS and physically confirm it matches the actual field condition; a point list with points that are wired but never actually verified against physical reality is a common source of "the BAS shows X but the equipment does Y" problems discovered much later.
Alarm verification: confirm alarm points (high temperature, equipment fault, filter status, etc.) actually generate the expected notification when the condition is simulated or genuinely present — an alarm point that exists in the programming but was never actually tested to confirm it fires and notifies correctly provides false confidence and can mean a real fault condition goes unnoticed.
Trend verification: confirm key points are actually being trended/logged at an appropriate interval for future diagnostic use — discovering during a troubleshooting investigation that a critical point was never actually being logged (due to a trend configuration oversight at commissioning) significantly hampers the ability to diagnose intermittent issues after the fact.

RETROFIT-SPECIFIC CONSIDERATIONS
Existing infrastructure compatibility: verify existing electrical service, structural support, ductwork/piping connections, and controls infrastructure are actually compatible with the new equipment's requirements — retrofits are more prone to "it should work with what's already there" assumptions that don't get formally verified the way a new installation's complete design typically does.
Transition/interim operation: if the retrofit involves any period where old and new equipment must coexist or where the space must remain occupied and conditioned during the changeover, verify the transition plan and sequence explicitly rather than assuming it will work itself out — document what interim conditions (temporary equipment, partial capacity, etc.) are acceptable during the changeover period.
Removed equipment disconnection: verify any replaced/decommissioned equipment is fully and safely disconnected (electrically, and refrigerant/fluid systems properly evacuated or drained per applicable regulation) rather than simply left in place de-energized — abandoned but still-connected equipment is a source of future confusion and potential hazard for anyone working on the system later without knowledge of its decommissioned status.

DOCUMENTATION — THE COMMISSIONING RECORD
A complete commissioning record should include: as-installed equipment nameplate data, initial refrigerant charge and line length/adjustment calculation, startup performance readings (pressures, temperatures, superheat/subcooling, airflow, electrical loads), control sequence verification results, and any deficiencies found and corrected during the process (or, if not correctable at the time, formally noted and communicated to the responsible party for follow-up). This record is the baseline every future service technician will wish existed when trying to determine whether a current reading represents equipment degradation or was simply the as-installed condition from day one.`
}

];


