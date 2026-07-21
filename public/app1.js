
const {
  useState,
  useEffect,
  useRef
} = React;
const RED = "#2563EB";
const APP_VERSION = "1.4.4";

// ── THEME ────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    BG:         "transparent",
    CARD:       "#141414",
    DARK:       "#0f0f0f",
    BORDER:     "rgba(37,99,235,0.25)",
    CARDBORDER: "rgba(255,255,255,0.08)",
    GREY1:      "#1e1e1e",
    GREY2:      "#2a2a2a",
    GREY3:      "#3a3a3a",
    GTXT1:      "rgba(255,255,255,0.92)",
    GTXT2:      "rgba(255,255,255,0.65)",
    GTXT3:      "rgba(255,255,255,0.38)",
    TXT:        "#ffffff",
    TXTBODY:    "rgba(255,255,255,0.90)",
    SURFACE:    "#0a0a0a",
  },
  light: {
    BG:         "#f4f4f5",
    CARD:       "#ffffff",
    DARK:       "#ffffff",
    BORDER:     "rgba(227,6,19,0.2)",
    CARDBORDER: "rgba(0,0,0,0.08)",
    GREY1:      "#f0f0f2",
    GREY2:      "#d4d4d8",
    GREY3:      "#a1a1aa",
    GTXT1:      "rgba(0,0,0,0.82)",
    GTXT2:      "rgba(0,0,0,0.70)",
    GTXT3:      "rgba(0,0,0,0.45)",
    TXT:        "#0a0a0a",
    TXTBODY:    "rgba(0,0,0,0.85)",
    SURFACE:    "#f4f4f5",
  }
};

// Theme state — module-level reactive refs updated on toggle
let _darkMode = (() => { try { return localStorage.getItem("mts-theme") !== "light"; } catch { return true; } })();
let _themeListeners = [];
function getTheme() { return THEMES[_darkMode ? "dark" : "light"]; }
function toggleTheme() {
  _darkMode = !_darkMode;
  try { localStorage.setItem("mts-theme", _darkMode ? "dark" : "light"); } catch {}
  // Update body background
  document.body.style.background = getTheme().SURFACE;
  _themeListeners.forEach(fn => fn());
}
function useTheme() {
  const [, rerender] = React.useState(0);
  React.useEffect(() => {
    const fn = () => rerender(n => n+1);
    _themeListeners.push(fn);
    return () => { _themeListeners = _themeListeners.filter(f => f !== fn); };
  }, []);
  return getTheme();
}

// Apply initial body background
document.body.style.background = getTheme().SURFACE;
if (!_darkMode) document.body.classList.add("light-mode");

// Shorthand accessors (these are functions now, evaluated at render time via useTheme)
// For backwards compatibility, expose as vars updated via hook in each component
// Instead we access via T = useTheme() in components that need them.
// Global fallback for components that don't call useTheme:
let BG, CARD, DARK, BORDER, CARDBORDER, GREY1, GREY2, GREY3, GTXT1, GTXT2, GTXT3, TXT, TXTBODY;
function _syncThemeVars() {
  const t = getTheme();
  BG=t.BG; CARD=t.CARD; DARK=t.DARK; BORDER=t.BORDER; CARDBORDER=t.CARDBORDER;
  GREY1=t.GREY1; GREY2=t.GREY2; GREY3=t.GREY3;
  GTXT1=t.GTXT1; GTXT2=t.GTXT2; GTXT3=t.GTXT3;
  TXT=t.TXT; TXTBODY=t.TXTBODY;
}
_syncThemeVars();
// Re-sync on toggle
const _origToggle = toggleTheme;
// patch: sync vars on every toggle
function toggleThemeAndSync(evt) {
  _origToggle();
  _syncThemeVars();
  // Re-render subscribers after theme vars are synchronized.
  // _origToggle notifies listeners before _syncThemeVars runs,
  // which can leave parts of the UI one toggle behind.
  _themeListeners.forEach(fn => fn());
  // Circular wipe from click position
  const ripple = document.getElementById("theme-ripple");
  if (ripple && evt) {
    const x = evt.clientX || window.innerWidth / 2;
    const y = evt.clientY || window.innerHeight / 2;
    const maxR = Math.hypot(Math.max(x, window.innerWidth-x), Math.max(y, window.innerHeight-y)) * 2;
    const col = _darkMode ? "#f4f4f5" : "#0a0a0a";
    ripple.style.cssText = `
      position:fixed; border-radius:50%; pointer-events:none; z-index:99999;
      width:${maxR}px; height:${maxR}px;
      left:${x - maxR/2}px; top:${y - maxR/2}px;
      background:${col}; transform:scale(0); opacity:1; transition:none;
    `;
    // Force reflow then animate
    void ripple.offsetWidth;
    ripple.style.transition = "transform 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease 0.45s";
    ripple.style.transform = "scale(1)";
    ripple.style.opacity = "0";
    setTimeout(() => { ripple.style.cssText = ""; }, 700);
  }
  if (_darkMode) {
    document.body.classList.remove("light-mode");
  } else {
    document.body.classList.add("light-mode");
  }
}

const WORKER_URL = "https://pro-worker.lukedorsett.workers.dev/api/chat";

async function ai(system, prompt, retries = 2, history = []) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const messages = [
        ...history.filter(h => h.role !== "system").map(h => ({ role: h.role, content: h.parts[0].text })),
        { role: "user", content: prompt }
      ];
      const r = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-FieldPro-Client": "fieldpro-app-2026" },
        body: JSON.stringify({
          model: "claude-sonnet-5",
          max_tokens: 4096,
          system: system,
          messages: messages
        })
      });
      if (!r.ok) {
        if (attempt < retries && r.status >= 500) {
          await new Promise(res => setTimeout(res, 1000 * (attempt + 1)));
          continue;
        }
        const errData = await r.json().catch(() => ({}));
        return "⚠️ Error " + r.status + ": " + (errData?.error?.message || "Please try again.");
      }
      const d = await r.json();
      if (d.error) return "⚠️ " + (d.error.message || "An error occurred.");
      const text = (d.content || []).filter(c => c.type === "text").map(c => c.text).join("\n\n");
      return text || "⚠️ No response received. Please try again.";
    } catch (e) {
      if (attempt < retries) {
        await new Promise(res => setTimeout(res, 1000 * (attempt + 1)));
        continue;
      }
      return "⚠️ Connection error: " + e.message + ". Please check your network.";
    }
  }
}const _mem = {};
const _hasLS = (() => {
  try {
    localStorage.setItem("_t", "1");
    localStorage.removeItem("_t");
    return true;
  } catch {
    return false;
  }
})();
const S = {
  get: async k => {
    if (_hasLS) {
      const v = localStorage.getItem('m__' + k);
      if (v === null) throw 0;
      return {
        value: v
      };
    }
    if (!(_mem['m__' + k] !== undefined)) throw 0;
    return {
      value: _mem['m__' + k]
    };
  },
  set: async (k, v) => {
    if (_hasLS) localStorage.setItem('m__' + k, v);else _mem['m__' + k] = v;
    return {
      value: v
    };
  },
  del: async k => {
    if (_hasLS) localStorage.removeItem('m__' + k);else delete _mem['m__' + k];
  },
  list: async p => {
    const out = [];
    if (_hasLS) {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('m__' + (p || ''))) out.push(k.slice(3));
      }
    } else {
      for (const k of Object.keys(_mem)) {
        if (k.startsWith('m__' + (p || ''))) out.push(k.slice(3));
      }
    }
    return out;
  }
};

// ── AI CALL ──────────────────────────────────────────────────────────────
// ── HELPERS ──────────────────────────────────────────────────────────────
const gid = () => "id" + Date.now() + Math.random().toString(36).slice(2, 5);
const ago = t => {
  const m = Math.floor((Date.now() - t) / 60000);
  return m < 1 ? "now" : m < 60 ? m + "m" : Math.floor(m / 60) + "h";
};
const BRANDS = ["Carrier", "Trane", "York", "Lennox", "Daikin", "Mitsubishi", "LG", "Goodman", "Rheem", "Ruud", "Bryant", "Bosch", "American Standard", "Amana"];
const REFS = ["R-410A", "R-22", "R-32", "R-454B", "R-407C", "R-134a"];

// Shared refrigerant PT (pressure/temperature) table — single source of truth
// for the PT Chart tool and the Refrigerant Calc agent, so superheat/subcooling
// numbers come from real tabulated data instead of an LLM freehand-calculating them.
// Values cross-referenced against published manufacturer PT charts (Hudson
// Technologies, Honeywell Solstice 454B) as of July 2026 — verify against your
// own gauge card for field-critical work, as always.
const PT = {
  "R-410A": [[40, 118], [50, 141], [60, 163], [70, 196], [80, 230], [90, 269], [100, 312], [110, 360], [120, 414]],
  "R-22": [[20, 43], [30, 55], [40, 68], [50, 84], [60, 102], [70, 121], [80, 144], [90, 168], [100, 196]],
  "R-32": [[40, 121], [50, 146], [60, 173], [70, 214], [80, 258], [90, 311], [100, 371], [110, 439], [120, 518]],
  "R-454B": [[40, 112], [50, 135], [60, 161], [70, 190], [80, 223], [90, 260], [100, 301], [110, 346], [120, 396]],
  "R-407C": [[40, 76], [50, 94], [60, 114], [70, 137], [80, 161], [90, 189], [100, 219], [110, 252], [120, 288]],
  "R-134a": [[20, 18], [30, 24], [40, 35], [50, 45], [60, 57], [70, 71], [80, 87], [90, 104], [100, 124]]
};
function getSatTemp(refrigerant, psig) {
  const d = PT[refrigerant];
  if (!d || isNaN(psig)) return null;
  if (psig <= d[0][1]) return d[0][0];
  if (psig >= d[d.length - 1][1]) return d[d.length - 1][0];
  for (let i = 0; i < d.length - 1; i++) {
    if (psig >= d[i][1] && psig <= d[i + 1][1]) {
      return d[i][0] + (d[i + 1][0] - d[i][0]) * (psig - d[i][1]) / (d[i + 1][1] - d[i][1]);
    }
  }
  return null;
}
function getSatPress(refrigerant, degF) {
  const d = PT[refrigerant];
  if (!d || isNaN(degF)) return null;
  if (degF <= d[0][0]) return d[0][1];
  if (degF >= d[d.length - 1][0]) return d[d.length - 1][1];
  for (let i = 0; i < d.length - 1; i++) {
    if (degF >= d[i][0] && degF <= d[i + 1][0]) {
      return d[i][1] + (d[i + 1][1] - d[i][1]) * (degF - d[i][0]) / (d[i + 1][0] - d[i][0]);
    }
  }
  return null;
}
const SH_TARGETS = {"R-410A":"8-12°F","R-22":"10-15°F","R-32":"8-12°F","R-454B":"8-12°F","R-407C":"10-15°F","R-134a":"10-15°F"};
const SC_TARGETS = {"R-410A":"10-15°F","R-22":"10-15°F","R-32":"10-15°F","R-454B":"10-15°F","R-407C":"10-15°F","R-134a":"8-12°F"};

// Global nav ref — set by App, used by any component to navigate home
const _nav = {
  go: null
};

// ── UI PRIMITIVES ────────────────────────────────────────────────────────
function Btn({
  c,
  onClick,
  disabled,
  red,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    disabled: disabled,
    style: {
      background: red ? "linear-gradient(135deg,#2563EB,#b00010)" : CARD,
      border: red ? "none" : `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: "11px 18px",
      color: TXT,
      fontWeight: 700,
      fontSize: 14,
      cursor: "pointer",
      opacity: disabled ? .4 : 1,
      boxShadow: red ? "0 4px 16px rgba(227,6,19,.3)" : "none",
      ...style
    }
  }, c);
}
function Inp({
  label,
  val,
  set,
  ph,
  type = "text",
  rows
}) {
  const s = {
    width: "100%",
    background: GREY1,
    border: `1px solid ${GREY2}`,
    borderRadius: 10,
    padding: "10px 12px",
    color: TXT,
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: GTXT1,
      fontWeight: 700,
      marginBottom: 4,
      letterSpacing: ".08em"
    }
  }, label), rows ? /*#__PURE__*/React.createElement("textarea", {
    value: val,
    onChange: e => set(e.target.value),
    placeholder: ph,
    rows: rows,
    style: {
      ...s,
      resize: "vertical"
    }
  }) : /*#__PURE__*/React.createElement("input", {
    type: type,
    value: val,
    onChange: e => set(e.target.value),
    placeholder: ph,
    style: s
  }));
}
function Sel({
  label,
  val,
  set,
  opts
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 12
    }
  }, label && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: GTXT1,
      fontWeight: 700,
      marginBottom: 4,
      letterSpacing: ".08em"
    }
  }, label), /*#__PURE__*/React.createElement("select", {
    value: val,
    onChange: e => set(e.target.value),
    style: {
      width: "100%",
      background: GREY1,
      border: `1px solid ${GREY2}`,
      borderRadius: 10,
      padding: "10px 12px",
      color: val ? TXT : GTXT2,
      fontSize: 14,
      outline: "none",
      fontFamily: "inherit"
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select\u2026"), opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o
  }, o))));
}
function Spin({
  label
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "60px 20px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 6,
      marginBottom: 14
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      width: 9,
      height: 9,
      borderRadius: "50%",
      background: RED,
      animation: "bounce 1.2s infinite",
      animationDelay: i * .2 + "s"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      color: GTXT2,
      fontSize: 12,
      letterSpacing: ".1em"
    }
  }, label));
}
function Hdr({
  title,
  sub,
  onBack,
  onHome
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: DARK,
      borderBottom: `3px solid ${RED}`,
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexShrink: 0
    }
  }, onBack && /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: _darkMode ? GREY1 : "rgba(0,0,0,0.06)",
      border: `1px solid ${GREY2}`,
      borderRadius: 8,
      padding: "6px 12px",
      color: TXT,
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\u2190"), onHome && !onBack && /*#__PURE__*/React.createElement("button", {
    onClick: onHome,
    style: {
      background: _darkMode ? GREY1 : "rgba(0,0,0,0.06)",
      border: `1px solid ${GREY2}`,
      borderRadius: 8,
      padding: "6px 12px",
      color: TXT,
      fontSize: 18,
      cursor: "pointer"
    }
  }, "\uD83C\uDFE0"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 800,
      color: TXT
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: RED,
      fontWeight: 600,
      marginTop: 2
    }
  }, sub)));
}
function Card({
  c,
  style = {},
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      background: _darkMode?"linear-gradient(135deg,#181818 0%,#121212 100%)":CARD,
      border: `1px solid ${CARDBORDER}`,
      borderTop: `1px solid rgba(255,255,255,0.09)`,
      borderRadius: 14,
      padding: 14,
      marginBottom: 10,
      boxShadow: _darkMode?"0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)":"0 1px 4px rgba(0,0,0,0.08)",
      ...style,
      cursor: onClick ? "pointer" : "default"
    }
  }, c);
}

// ── ONBOARDING ───────────────────────────────────────────────────────────
function Onboarding({
  onDone
}) {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100vh",
      background: BG,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: RED,
      padding: "40px 24px 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "rgba(255,255,255,0.75)",
      letterSpacing: ".15em",
      marginBottom: 6
    }
  }, "FieldPro"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: 900,
      color: "#ffffff",
      lineHeight: 1
    }
  }, "FieldPro Assistant"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "rgba(255,255,255,0.80)",
      marginTop: 4
    }
  }, "AI Field Assistant")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 800,
      color: TXT,
      marginBottom: 6
    }
  }, "Quick setup"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: GTXT2,
      marginBottom: 20
    }
  }, "30 seconds. Personalises your reports."), /*#__PURE__*/React.createElement(Inp, {
    label: "YOUR NAME *",
    val: name,
    set: setName,
    ph: "e.g. Luke Johnson"
  }), /*#__PURE__*/React.createElement(Sel, {
    label: "REGION",
    val: region,
    set: setRegion,
    opts: ["AMER – North", "AMER – South", "AMER – East", "AMER – West", "APAC", "EMEA"]
  }), /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: "Get Started \u2192",
    onClick: () => onDone({
      name,
      region,
      joined: Date.now()
    }),
    disabled: !name.trim(),
    style: {
      width: "100%",
      padding: 14,
      fontSize: 15,
      marginTop: 8
    }
  })));
}

// ── DASHBOARD ────────────────────────────────────────────────────────────
function Dashboard({
  profile,
  jobs,
  onNewJob,
  onStartChat,
  onNav,
  onDemo
}) {
  const hr = new Date().getHours();
  const greet = hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
  const initials = profile.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  // Subscribe to theme changes so button label + colors re-render on toggle
  useTheme();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installDismissed, setInstallDismissed] = useState(() => {
    try { return localStorage.getItem("fp-install-dismissed") === "1"; } catch { return false; }
  });
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function dismissInstall() {
    setInstallDismissed(true);
    setInstallPrompt(null);
    try { localStorage.setItem("fp-install-dismissed", "1"); } catch {}
  }

  function triggerInstall() {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then(() => { setInstallPrompt(null); });
  }

  const showInstallBanner = !isInStandaloneMode && !installDismissed && (installPrompt || isIOS);
  return /*#__PURE__*/React.createElement("div", {style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}},

    /* ── HERO HEADER ── */
    /*#__PURE__*/React.createElement("div", {style:{
      background:_darkMode?"linear-gradient(160deg,#0a1628 0%,#0d1b3e 40%,#0a0a0a 100%)":"linear-gradient(160deg,#eff6ff 0%,#fff 60%,#fff 100%)",
      borderBottom:`1px solid rgba(37,99,235,0.25)`,

      padding:"20px 18px 18px",
      position:"relative",
      overflow:"hidden",
      flexShrink:0
    }},

      /* Top row: FieldPro logo left, theme toggle right */
      /*#__PURE__*/React.createElement("div", {style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
        /*#__PURE__*/React.createElement("div", {style:{fontSize:18,fontWeight:900,color:"#2563EB",letterSpacing:".05em",fontFamily:"Space Grotesk, sans-serif"}}, "FieldPro"),
        /*#__PURE__*/React.createElement("div", {style:{display:"flex",alignItems:"center",gap:8}},
          /* Theme toggle button */
          /*#__PURE__*/React.createElement("button", {
            onClick: (e) => toggleThemeAndSync(e),
            title: _darkMode ? "Switch to light mode" : "Switch to dark mode",
            style:{
              background: _darkMode ? "#1e293b" : "#fef9c3",
              border: _darkMode ? "2px solid #334155" : "2px solid #fcd34d",
              borderRadius:22, padding:"6px 14px",
              cursor:"pointer", display:"flex", alignItems:"center", gap:6,
              fontSize:12, fontWeight:700,
              color: _darkMode ? "#e2e8f0" : "#92400e",
              fontFamily:"inherit",
              boxShadow: _darkMode ? "0 2px 8px rgba(0,0,0,0.5)" : "0 2px 8px rgba(253,211,77,0.5)",
              transition: "all 0.2s ease"
            }
          },
            /*#__PURE__*/React.createElement("span", {key:String(_darkMode), className:"theme-icon-spin", style:{fontSize:14,display:"inline-block"}}, _darkMode ? "🌙" : "☀️"),
            /*#__PURE__*/React.createElement("span", null, _darkMode ? "Dark" : "Light")
          )
        )
      ),

      /* Greeting + avatar row */
      /*#__PURE__*/React.createElement("div", {style:{display:"flex",alignItems:"center",gap:12,marginBottom:14}},
        /*#__PURE__*/React.createElement("div", {style:{
          width:44,height:44,borderRadius:12,flexShrink:0,
          background:`linear-gradient(135deg,${RED},#1d4ed8)`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:16,fontWeight:900,color:"#ffffff",
          boxShadow:"0 4px 14px rgba(37,99,235,0.4)"
        }}, initials),
        /*#__PURE__*/React.createElement("div", {style:{flex:1}},
          /*#__PURE__*/React.createElement("div", {style:{fontSize:12,color: GTXT1,fontWeight:500,letterSpacing:".04em"}}, greet+","),
          /*#__PURE__*/React.createElement("div", {style:{fontSize:22,fontWeight:900,color:TXT,letterSpacing:".01em",lineHeight:1.1}},
            profile.name.split(" ")[0]),
          profile.region && /*#__PURE__*/React.createElement("div", {style:{fontSize:11,color:RED,fontWeight:600,marginTop:2,letterSpacing:".05em"}},
            profile.region)
        ),
        /*#__PURE__*/React.createElement("div", {style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,alignSelf:"flex-start"}},
          /*#__PURE__*/React.createElement("div", {style:{fontSize:9,color:GTXT3,fontWeight:600,letterSpacing:".05em"}},
            "v"+APP_VERSION),
          onDemo && /*#__PURE__*/React.createElement("button", {
            onClick: onDemo,
            style: {background:"none",border:"none",padding:0,cursor:"pointer",fontSize:10,color:RED,fontWeight:700,letterSpacing:".03em",textDecoration:"underline"}
          }, "View Demo")
        )
      ),

      /* Stat pills */
      /*#__PURE__*/React.createElement("div", {style:{display:"flex",gap:8}},
        [{l:"Jobs",v:jobs,accent:RED},{l:"Docs",v:DOCS.length,accent:"rgba(255,255,255,.2)"},{l:"Agents",v:6,accent:"rgba(255,255,255,.2)"}].map(s=>
          /*#__PURE__*/React.createElement("div", {key:s.l,style:{
            flex:1,background:GREY1,
            border:`1px solid ${GREY2}`,
            borderTop:`1px solid ${GREY3}`,
            borderRadius:10,padding:"8px 0",textAlign:"center",
            backdropFilter:"blur(4px)"
          }},
            /*#__PURE__*/React.createElement("div", {style:{fontSize:22,fontWeight:900,color:s.l==="Jobs"?RED:TXT,lineHeight:1}}, s.v),
            /*#__PURE__*/React.createElement("div", {style:{fontSize:9,color: GTXT1,fontWeight:700,letterSpacing:".08em",marginTop:3}}, s.l.toUpperCase())
          )
        )
      )
    ),

    /* ── SCROLL CONTENT ── */
    /*#__PURE__*/React.createElement("div", {style:{flex:1,overflowY:"auto",overflowX:"hidden",padding:"16px 14px 24px"}},

      /* ── PWA INSTALL BANNER ── */
      showInstallBanner && /*#__PURE__*/React.createElement("div", {style:{
        background: _darkMode ? "linear-gradient(135deg,#1e3a5f,#0f2040)" : "linear-gradient(135deg,#eff6ff,#dbeafe)",
        border: `1px solid ${_darkMode?"rgba(37,99,235,.4)":"rgba(37,99,235,.25)"}`,
        borderRadius: 14, padding: "12px 14px", marginBottom: 14,
        display: "flex", alignItems: "center", gap: 12, position: "relative"
      }},
        /*#__PURE__*/React.createElement("div", {style:{fontSize:28,flexShrink:0}}, "📲"),
        /*#__PURE__*/React.createElement("div", {style:{flex:1,minWidth:0}},
          /*#__PURE__*/React.createElement("div", {style:{fontSize:13,fontWeight:800,color:TXT,marginBottom:3}}, "Install FieldPro App"),
          /*#__PURE__*/React.createElement("div", {style:{fontSize:11,color:GTXT2,lineHeight:1.5}},
            isIOS
              ? "Tap the Share button \uD83D\uDCE4 below, then \u2018Add to Home Screen\u2019"
              : "Install for offline access on this device"
          )
        ),
        !isIOS && /*#__PURE__*/React.createElement("button", {
          onClick: triggerInstall,
          style:{
            background:RED, border:"none", borderRadius:8, padding:"8px 14px",
            fontSize:12, fontWeight:700, color:"#fff", cursor:"pointer", flexShrink:0
          }
        }, "Install"),
        /*#__PURE__*/React.createElement("button", {
          onClick: dismissInstall,
          style:{
            position:"absolute", top:6, right:8, background:"none", border:"none",
            color:GTXT3, cursor:"pointer", fontSize:16, padding:2, lineHeight:1
          }
        }, "\xD7")
      ),

      /* AI Chat CTA */
      /*#__PURE__*/React.createElement("button", {
        onClick:()=>onStartChat("Hello! I'm on a job and need some HVAC help. What can you assist me with today?"),
        className:"cta-pulse",
        style:{
          width:"100%",
          background:`linear-gradient(135deg,#c00010 0%,${RED} 50%,#e8200a 100%)`,
          border:"none",borderRadius:16,padding:"16px 16px",
          cursor:"pointer",display:"flex",alignItems:"center",
          justifyContent:"space-between",marginBottom:16,
          boxShadow:"0 8px 28px rgba(227,6,19,.45), inset 0 1px 0 rgba(255,255,255,.15)"
        }
      },
        /*#__PURE__*/React.createElement("div", {style:{textAlign:"left"}},
          /*#__PURE__*/React.createElement("div", {style:{fontSize:15,fontWeight:800,color:"#ffffff",letterSpacing:".02em",marginBottom:4}}, "💬 ASK THE AI ASSISTANT"),
          /*#__PURE__*/React.createElement("div", {style:{fontSize:11,color:"rgba(255,255,255,0.82)",lineHeight:1.6}},
            "Fault diagnosis · Part numbers · Safety", /*#__PURE__*/React.createElement("br",null),
            "Refrigerant charging · Service reports"
          )
        ),
        /*#__PURE__*/React.createElement("div", {style:{
          width:46,height:46,background:"rgba(0,0,0,.25)",borderRadius:12,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0,
          border:"1px solid rgba(255,255,255,.15)"
        }}, "🔧")
      ),

      /* Quick Ask label */
      /*#__PURE__*/React.createElement("div", {style:{display:"flex",alignItems:"center",gap:8,marginBottom:10}},
        /*#__PURE__*/React.createElement("div", {style:{height:1,flex:1,background:GREY2}}),
        /*#__PURE__*/React.createElement("div", {style:{fontSize:10,color:GTXT2,fontWeight:700,letterSpacing:".12em"}}, "QUICK ASK"),
        /*#__PURE__*/React.createElement("div", {style:{height:1,flex:1,background:GREY2}})
      ),

      /* Quick Ask grid */
      /*#__PURE__*/React.createElement("div", {style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}},
        [{i:"🔍",l:"Diagnose a fault",p:"I have a fault on an HVAC unit. Let me describe it and you help diagnose."},
         {i:"🧊",l:"Refrigerant charge",p:"I need help checking the refrigerant charge. Walk me through superheat and subcooling."},
         {i:"⚡",l:"Electrical issue",p:"I'm troubleshooting an electrical problem. Help me work through it step by step."},
         {i:"🦺",l:"Safety checklist",p:"What PPE and safety steps do I need before starting this job?"}
        ].map((q,_qi)=>/*#__PURE__*/React.createElement("button", {key:q.l,onClick:()=>onStartChat(q.p),className:"anim-slideUp",style:{
          background:CARD,
          border:"1px solid "+GREY2,
          borderTop:"1px solid "+GREY3+"",
          borderRadius:12,padding:"12px 12px",cursor:"pointer",
          display:"flex",alignItems:"center",gap:10,textAlign:"left",
          boxShadow:"0 2px 8px rgba(0,0,0,.3)"
        }},
          /*#__PURE__*/React.createElement("span", {style:{fontSize:22,flexShrink:0}}, q.i),
          /*#__PURE__*/React.createElement("span", {style:{fontSize:12,fontWeight:700,color:TXT,lineHeight:1.3}}, q.l)
        ))
      ),

      /* Connected Workflow */
      /*#__PURE__*/React.createElement("div", {style:{
        background:_darkMode?"linear-gradient(135deg,rgba(227,6,19,.1),rgba(100,0,0,.15))":"rgba(227,6,19,.06)",
        border:`1px solid rgba(227,6,19,.2)`,
        borderRadius:14,padding:14,marginBottom:16,
        boxShadow:"inset 0 1px 0 rgba(227,6,19,.1)"
      }},
        /*#__PURE__*/React.createElement("div", {style:{fontSize:11,color:RED,fontWeight:700,letterSpacing:".08em",marginBottom:6}}, "⚡ CONNECTED WORKFLOW"),
        /*#__PURE__*/React.createElement("div", {style:{fontSize:12,color: GTXT1,lineHeight:1.6,marginBottom:10}},
          "Fault Diagnosis → pre-fills Safety Briefing → pre-fills Closing Comment. One job, zero re-entry."
        ),
        /*#__PURE__*/React.createElement("button", {onClick:()=>onNav("agents","diag"),style:{
          background:RED,border:"none",borderRadius:8,padding:"8px 16px",
          cursor:"pointer",fontSize:12,fontWeight:700,color: TXT,
          boxShadow:"0 4px 12px rgba(227,6,19,.4)"
        }}, "Start Workflow →")
      ),

      /* All Tools label */
      /*#__PURE__*/React.createElement("div", {style:{display:"flex",alignItems:"center",gap:8,marginBottom:10}},
        /*#__PURE__*/React.createElement("div", {style:{height:1,flex:1,background:GREY2}}),
        /*#__PURE__*/React.createElement("div", {style:{fontSize:10,color:GTXT2,fontWeight:700,letterSpacing:".12em"}}, "ALL TOOLS"),
        /*#__PURE__*/React.createElement("div", {style:{height:1,flex:1,background:GREY2}})
      ),

      /* Tools grid */
      /*#__PURE__*/React.createElement("div", {style:{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}},
        [{t:"docs",i:"📚",l:"Docs"},{t:"tools",s:"pt",i:"🌡️",l:"PT Chart"},
         {t:"tools",s:"belt",i:"⚙️",l:"Belt Calc"},
         {t:"tools",s:"equip",i:"🏢",l:"Equip Log"},{t:"tools",s:"notes",i:"📝",l:"Notes"},
         {t:"agents",i:"🤖",l:"Agents"},{t:"chat",i:"💬",l:"AI Chat"}
        ].map((it,_ii)=>/*#__PURE__*/React.createElement("button", {key:it.l,onClick:()=>onNav(it.t,it.s),className:"anim-slideUp",style:{
          background:CARD,
          border:"1px solid "+GREY2,
          borderRadius:12,padding:"14px 6px",cursor:"pointer",
          boxShadow:_darkMode?"0 2px 8px rgba(0,0,0,.3)":"0 1px 4px rgba(0,0,0,.08)",
          display:"flex",flexDirection:"column",alignItems:"center",gap:5
        }},
          /*#__PURE__*/React.createElement("span", {style:{fontSize:24}}, it.i),
          /*#__PURE__*/React.createElement("span", {style:{fontSize:10,fontWeight:600,color:GTXT1}}, it.l)
        ))
      )
    )
  );
}
// ── AGENTS ───────────────────────────────────────────────────────────────
function AgentScreen({
  title,
  sub,
  intro,
  form,
  onRun,
  canRun,
  onReset,
  resetLabel,
  chainBtns,
  autoChainMs,
  renderResult
}) {
  const [step, setStep] = useState(0);
  const [res, setRes] = useState("");
  const [err, setErr] = useState("");
  const [countdown, setCountdown] = useState(autoChainMs ? Math.ceil(autoChainMs / 1000) : 0);
  
  // Auto-chain after result is shown
  useEffect(() => {
    if (step === 2 && autoChainMs && autoChainMs > 0) {
      setCountdown(Math.ceil(autoChainMs / 1000));
      const countdownInterval = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(countdownInterval);
            // Click the first chain button (stored in window._chainFirstBtn)
            setTimeout(() => {
              if (window._chainFirstBtn) window._chainFirstBtn.click();
            }, 100);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [step, autoChainMs]);
  
  async function run() {
    setStep(1);
    setErr("");
    try {
      const r = await onRun();
      setRes(r);
      setStep(2);
    } catch (e) {
      setErr("An error occurred. Please try again.");
      setStep(0);
    }
  }
  function reset() {
    setStep(0);
    setRes("");
    setErr("");
    setCountdown(0);
    if (onReset) onReset();
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: title,
    sub: step === 1 ? "WORKING…" : step === 2 ? "COMPLETE" : sub,
    onHome: () => _nav.go && _nav.go("home")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, step === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, err && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(227,6,19,.12)",
      border: "1px solid rgba(227,6,19,.4)",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 12,
      color: "#ff6b6b",
      marginBottom: 12
    }
  }, err), intro && /*#__PURE__*/React.createElement(Card, {
    style: {
      background: _darkMode?"rgba(227,6,19,.06)":"rgba(227,6,19,.04)",
      marginBottom: 14
    },
    c: /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: GTXT1,
        lineHeight: 1.5
      }
    }, intro)
  }), form, /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: "\u25B6 Run Agent",
    onClick: run,
    disabled: !canRun,
    style: {
      width: "100%",
      padding: 13,
      marginTop: 4
    }
  })), step === 1 && /*#__PURE__*/React.createElement(Spin, {
    label: "ANALYSING\u2026"
  }), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
      marginBottom: 10
    }
  }, "\u26a0\ufe0f", /*#__PURE__*/React.createElement("span", null, "AI-generated \u2014 verify against OEM documentation before acting, especially PPE ratings and LOTO steps.")), renderResult ? renderResult(res) : /*#__PURE__*/React.createElement("div", {
    className: "anim-result",
    style: {
      background: GREY1,
      border: `1px solid ${GREY2}`,
      borderRadius: 12,
      padding: 14,
      whiteSpace: "pre-wrap",
      fontSize: 13,
      color: TXT,
      lineHeight: 1.7,
      marginBottom: 12
    }
  }, res), autoChainMs && countdown > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(37,99,235,.1)",
      border: "1px solid rgba(37,99,235,.3)",
      borderRadius: 10,
      padding: "8px 12px",
      fontSize: 12,
      color: RED,
      fontWeight: 600,
      marginBottom: 10,
      textAlign: "center"
    }
  }, "Auto-advancing to next step in ", countdown, "s\u2026"), chainBtns && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(227,6,19,.07)",
      border: `1px solid rgba(227,6,19,.25)`,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: RED,
      fontWeight: 700,
      marginBottom: 8
    }
  }, "\u26A1 CONTINUE WORKFLOW"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap"
    }
  }, chainBtns)), /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: resetLabel || "Run Again",
    onClick: reset,
    style: {
      width: "100%"
    }
  }))));
}

// 1. Fault Diagnosis
function DiagAgent({
  ctx,
  setCtx,
  onChain
}) {
  const [brand, setBrand] = useState(ctx?.diagBrand || "");
  const [model, setModel] = useState(ctx?.diagModel || "");
  const [equip, setEquip] = useState(ctx?.diagEquip || "");
  const [fault, setFault] = useState("");
  const [ref, setRef] = useState(ctx?.diagRef || "");
  const [age, setAge] = useState("");
  const [symp, setSymp] = useState(ctx?.diagSymp || "");
  return /*#__PURE__*/React.createElement(AgentScreen, {
    title: "FAULT DIAGNOSIS",
    sub: "AI DIAGNOSTIC AGENT",
    intro: "\uD83E\uDD16 Describe the fault \u2014 the AI ranks causes by probability and gives a full diagnostic procedure.",
    canRun: !!symp.trim(),
    onRun: async () => {
      const r = await ai("You are an expert HVAC fault diagnosis agent for FieldPro. Give structured ranked diagnosis with probability percentages. Flag safety items with ⚠️. Be concise and field-ready.", `Diagnose this HVAC fault:\nEquipment: ${equip || "Unknown"} - ${brand || "Unknown"} ${model || ""}\nFault code: ${fault || "None"}\nRefrigerant: ${ref || "Unknown"}\nAge: ${age || "Unknown"} years\nSymptoms: ${symp}\n\nProvide:\n1) TOP 3 CAUSES ranked by probability %\n2) IMMEDIATE on-site checks\n3) STEP-BY-STEP diagnostic procedure\n4) ⚠️ SAFETY notes\n5) When to escalate`);
      if (setCtx) setCtx({
        diagBrand: brand,
        diagModel: model,
        diagEquip: equip,
        diagRef: ref,
        diagSymp: symp
      });
      return r;
    },
    chainBtns: onChain && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      ref: el => { window._chainFirstBtn = el; },
      onClick: () => onChain("safety"),
      style: {
        background: RED,
        border: "none",
        borderRadius: 8,
        padding: "8px 12px",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
        color: TXT
      }
    }, "\uD83E\uDDBA Safety \u2192"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onChain("parts"),
      style: {
        background: "#222",
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: "8px 12px",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
        color: TXT
      }
    }, "\uD83D\uDD29 Parts \u2192"), /*#__PURE__*/React.createElement("button", {
      onClick: () => onChain("report"),
      style: {
        background: "#222",
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: "8px 12px",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
        color: TXT
      }
    }, "\uD83D\uDCCB Comment \u2192")),
    autoChainMs: onChain ? 2000 : 0,
    form: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Sel, {
      label: "EQUIPMENT TYPE",
      val: equip,
      set: setEquip,
      opts: ["RTU", "Chiller", "Split System", "VRF/VRV", "Air Handler", "Heat Pump", "Mini-Split", "FCU", "Boiler"]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Sel, {
      label: "BRAND",
      val: brand,
      set: setBrand,
      opts: BRANDS
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "MODEL #",
      val: model,
      set: setModel,
      ph: "e.g. 48XC024"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Inp, {
      label: "FAULT CODE",
      val: fault,
      set: setFault,
      ph: "e.g. E79"
    }), /*#__PURE__*/React.createElement(Sel, {
      label: "REFRIGERANT",
      val: ref,
      set: setRef,
      opts: REFS
    })), /*#__PURE__*/React.createElement(Inp, {
      label: "UNIT AGE (years)",
      val: age,
      set: setAge,
      ph: "e.g. 7",
      type: "number"
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "SYMPTOMS *",
      val: symp,
      set: setSymp,
      ph: "Describe what the unit is doing\u2026",
      rows: 4
    }))
  });
}

// 2. Predictive Maintenance
function PredAgent() {
  const [equip, setEquip] = useState("");
  const [brand, setBrand] = useState("");
  const [age, setAge] = useState("");
  const [hours, setHours] = useState("");
  const [obs, setObs] = useState([]);
  const [issues, setIssues] = useState("");
  const OBS = ["Unusual noise", "High amps", "Frequent cycling", "Reduced airflow", "Ice formation", "Oil stains", "Vibration", "Longer run times", "Refrigerant loss", "Delayed startup"];
  const tog = o => setObs(p => p.includes(o) ? p.filter(x => x !== o) : [...p, o]);
  return /*#__PURE__*/React.createElement(AgentScreen, {
    title: "PREDICTIVE MAINT.",
    sub: "FAILURE PREDICTION AGENT",
    intro: "\uD83D\uDCC8 Analyses equipment age, runtime, and observations to predict what will fail next.",
    canRun: !!equip,
    onRun: () => ai("You are an expert HVAC predictive maintenance agent. Predict component failures by risk level. Be specific about which components and timeframes.", `Predictive maintenance analysis:\nEquipment: ${equip} - ${brand || "Unknown"}\nAge: ${age || "Unknown"} years\nRun hours: ${hours || "Unknown"}\nObservations: ${obs.join(", ") || "None"}\nKnown issues: ${issues || "None"}\n\nProvide:\n1) 🔴 IMMEDIATE failures (within 30 days)\n2) 🟡 SHORT-TERM risks (3 months)\n3) 🟢 SCHEDULE soon (6 months)\n4) Component health ratings\n5) Recommended PM actions\n6) 12-month PM schedule`),
    onReset: () => setObs([]),
    form: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Sel, {
      label: "EQUIPMENT",
      val: equip,
      set: setEquip,
      opts: ["RTU", "Chiller", "Split System", "VRF/VRV", "Air Handler", "Heat Pump", "FCU", "Cooling Tower"]
    }), /*#__PURE__*/React.createElement(Sel, {
      label: "BRAND",
      val: brand,
      set: setBrand,
      opts: BRANDS
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Inp, {
      label: "AGE (years)",
      val: age,
      set: setAge,
      ph: "e.g. 12",
      type: "number"
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "RUN HOURS",
      val: hours,
      set: setHours,
      ph: "e.g. 35000",
      type: "number"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: GTXT1,
        fontWeight: 700,
        marginBottom: 8,
        letterSpacing: ".08em"
      }
    }, "OBSERVATIONS"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }
    }, OBS.map(o => /*#__PURE__*/React.createElement("button", {
      key: o,
      onClick: () => tog(o),
      style: {
        background: obs.includes(o) ? RED : GREY1,
        border: `1px solid ${obs.includes(o) ? RED : GREY2}`,
        borderRadius: 20,
        padding: "5px 11px",
        cursor: "pointer",
        fontSize: 11,
        color: TXT,
        fontWeight: obs.includes(o) ? 700 : 400
      }
    }, o)))), /*#__PURE__*/React.createElement(Inp, {
      label: "KNOWN ISSUES",
      val: issues,
      set: setIssues,
      ph: "Recurring problems\u2026",
      rows: 2
    }))
  });
}

// 3. Parts Finder
function PartsAgent({
  ctx
}) {
  const [brand, setBrand] = useState(ctx?.diagBrand || "");
  const [model, setModel] = useState(ctx?.diagModel || "");
  const [part, setPart] = useState("");
  const [desc, setDesc] = useState("");
  const [locStatus, setLocStatus] = useState("idle"); // idle | getting | got | denied
  const [locLabel, setLocLabel] = useState("");
  const [locCoords, setLocCoords] = useState(null);
  const [partsResult, setPartsResult] = useState(null);
  const [partsBusy, setPartsBusy] = useState(false);
  const PARTS = ["Run Capacitor", "Start Capacitor", "Contactor", "Condenser Fan Motor", "Evaporator Fan Motor", "Compressor", "TXV / Expansion Valve", "Filter Drier", "Control Board", "Thermostat", "Pressure Switch (High)", "Pressure Switch (Low)", "Gas Valve", "Reversing Valve", "Other"];

  function getLocation() {
    if (!navigator.geolocation) { setLocStatus("denied"); setLocLabel("GPS not available"); return; }
    setLocStatus("getting");
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLocCoords({ lat, lng });
        // Reverse geocode using a free API to get city name
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(r => r.json())
          .then(d => {
            const city = d.address?.city || d.address?.town || d.address?.county || "your area";
            const state = d.address?.state_code || d.address?.state || "";
            setLocLabel(`${city}${state ? ", " + state : ""}`);
            setLocStatus("got");
          })
          .catch(() => {
            setLocLabel(`${lat.toFixed(2)}, ${lng.toFixed(2)}`);
            setLocStatus("got");
          });
      },
      err => {
        setLocStatus("denied");
        setLocLabel("Location denied — stores won't be localised");
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }

  function openStore(store) {
    const q = encodeURIComponent(store + " HVAC parts" + (locLabel ? " near " + locLabel : ""));
    window.open(`https://www.google.com/maps/search/${q}`, "_blank");
  }

  const STORES = [
    { name: "Johnstone Supply", color: "#2563EB", emoji: "🔴" },
    { name: "Wesco",            color: "#0066CC", emoji: "🔵" },
    { name: "Grainger",         color: "#E87722", emoji: "🟠" },
    { name: "Ferguson HVAC",    color: "#006341", emoji: "🟢" },
  ];

  return /*#__PURE__*/React.createElement("div", {style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}},
    /*#__PURE__*/React.createElement("div", {style:{background:DARK,borderBottom:`3px solid ${RED}`,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,flexShrink:0}},
      /*#__PURE__*/React.createElement("div", {style:{flex:1}},
        /*#__PURE__*/React.createElement("div", {style:{fontSize:17,fontWeight:800,color: TXT}}, "PARTS FINDER"),
        /*#__PURE__*/React.createElement("div", {style:{fontSize:11,color:RED,fontWeight:600,marginTop:2}}, "OEM + COMPATIBLE PARTS")
      )
    ),
    /*#__PURE__*/React.createElement("div", {style:{flex:1,overflowY:"auto",overflowX:"hidden",padding:14}},

      /* Location bar */
      /*#__PURE__*/React.createElement("div", {style:{
        background:GREY1, border:`1px solid ${GREY2}`, borderRadius:12,
        padding:"10px 14px", marginBottom:14,
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:10
      }},
        /*#__PURE__*/React.createElement("div", {style:{flex:1,minWidth:0}},
          /*#__PURE__*/React.createElement("div", {style:{fontSize:11,color: GTXT1,fontWeight:700,letterSpacing:".06em",marginBottom:2}}, "📍 YOUR LOCATION"),
          /*#__PURE__*/React.createElement("div", {style:{fontSize:13,color:locStatus==="got"?TXT:GTXT2,fontWeight:locStatus==="got"?600:400}},
            locStatus==="idle" ? "Tap to find nearby stores" :
            locStatus==="getting" ? "Getting location…" :
            locStatus==="denied" ? "Location unavailable" :
            locLabel
          )
        ),
        /*#__PURE__*/React.createElement("button", {
          onClick: getLocation,
          disabled: locStatus==="getting" || locStatus==="got",
          style:{
            background: locStatus==="got" ? "rgba(39,174,96,.15)" : RED,
            border: locStatus==="got" ? "1px solid rgba(39,174,96,.4)" : "none",
            borderRadius:8, padding:"7px 14px", cursor:"pointer",
            fontSize:12, fontWeight:700,
            color: locStatus==="got" ? "#27AE60" : GTXT1,
            flexShrink:0, opacity: locStatus==="getting" ? .5 : 1
          }
        }, locStatus==="got" ? "✓ Found" : locStatus==="getting" ? "…" : "Use GPS")
      ),

      /* Nearby store buttons */
      /*#__PURE__*/React.createElement("div", {style:{marginBottom:14}},
        /*#__PURE__*/React.createElement("div", {style:{fontSize:11,color: GTXT1,fontWeight:700,letterSpacing:".08em",marginBottom:8}},
          locStatus==="got" ? `STORES NEAR ${locLabel.toUpperCase()}` : "FIND STORES NEAR YOU"
        ),
        /*#__PURE__*/React.createElement("div", {style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}},
          STORES.map(s => /*#__PURE__*/React.createElement("button", {
            key: s.name,
            onClick: () => openStore(s.name),
            style:{
              background:GREY1, border:`1px solid ${GREY2}`,
              borderLeft:`3px solid ${s.color}`,
              borderRadius:10, padding:"10px 12px",
              cursor:"pointer", textAlign:"left",
              display:"flex", alignItems:"center", gap:8
            }
          },
            /*#__PURE__*/React.createElement("span", {style:{fontSize:16}}, s.emoji),
            /*#__PURE__*/React.createElement("div", null,
              /*#__PURE__*/React.createElement("div", {style:{fontSize:12,fontWeight:700,color: TXT}}, s.name),
              /*#__PURE__*/React.createElement("div", {style:{fontSize:10,color: GTXT1}}, "Open in Maps →")
            )
          ))
        )
      ),

      /* Divider */
      /*#__PURE__*/React.createElement("div", {style:{display:"flex",alignItems:"center",gap:8,marginBottom:14}},
        /*#__PURE__*/React.createElement("div", {style:{height:1,flex:1,background:GREY2}}),
        /*#__PURE__*/React.createElement("div", {style:{fontSize:10,color: GTXT1,fontWeight:700,letterSpacing:".1em"}}, "AI PART LOOKUP"),
        /*#__PURE__*/React.createElement("div", {style:{height:1,flex:1,background:GREY2}})
      ),

      /* Part lookup form */
      /*#__PURE__*/React.createElement("div", {style:{
        background:GREY1, border:`1px solid ${GREY2}`,
        borderTop: `1px solid ${GREY2}`,
        borderRadius:12, padding:14, marginBottom:10,
        boxShadow:"0 2px 12px rgba(0,0,0,.4)"
      }},
        /*#__PURE__*/React.createElement("div", {style:{fontSize:11,color:RED,fontWeight:700,marginBottom:10,letterSpacing:".08em"}}, "PART DETAILS"),
        /*#__PURE__*/React.createElement("div", {style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}},
          /*#__PURE__*/React.createElement(Sel, {label:"BRAND",val:brand,set:setBrand,opts:BRANDS}),
          /*#__PURE__*/React.createElement(Inp, {label:"MODEL #",val:model,set:setModel,ph:"Optional"})
        ),
        /*#__PURE__*/React.createElement(Sel, {label:"FAILED PART *",val:part,set:setPart,opts:PARTS}),
        /*#__PURE__*/React.createElement(Inp, {label:"ADDITIONAL DETAILS",val:desc,set:setDesc,ph:"Known specs, voltage, µF…",rows:2})
      ),

      /* Run button */
      /*#__PURE__*/React.createElement(Btn, {
        red: true,
        c: partsBusy ? "…" : "🔍 Find Parts + Pricing",
        disabled: !part || partsBusy,
        style:{width:"100%",padding:13},
        onClick: async () => {
          if (!part) return;
          setPartsBusy(true);
          setPartsResult(null);
          const locationCtx = locStatus==="got" ? `\nTechnician location: ${locLabel}` : "";
          const prompt = `Find replacement parts:\nBrand: ${brand||"Unknown"} Model: ${model||"Unknown"}\nFailed part: ${part}\nDetails: ${desc||"None"}${locationCtx}\n\nProvide:\n1) OEM part number and specs\n2) 2-3 compatible alternatives with part numbers\n3) Key specs to verify match\n4) Where to source: Johnstone Supply, Wesco, Grainger, Ferguson${locStatus==="got"?` — note these are common suppliers near ${locLabel}`:""}\n5) Typical price range\n6) Install notes\n7) ⚠️ Warnings`;
          const result = await ai("You are an expert HVAC parts specialist for FieldPro. Provide OEM and compatible part numbers with real specifications. Include typical price ranges where known.", prompt);
          setPartsResult(result);
          setPartsBusy(false);
        }
      }),

      /* Loading */
      partsBusy && /*#__PURE__*/React.createElement(Spin, {
        label: "SEARCHING…"
      }),

      /* Result box */
      partsResult && /*#__PURE__*/React.createElement(React.Fragment, null,
        /*#__PURE__*/React.createElement("div", {
          style:{
            display:"flex", alignItems:"flex-start", gap:8,
            background:"rgba(227,6,19,.1)", border:`1px solid rgba(227,6,19,.35)`,
            borderRadius:10, padding:"8px 10px", marginTop:14, marginBottom:10,
            fontSize:11, color:RED, lineHeight:1.5, fontWeight:600
          }
        }, "⚠️", /*#__PURE__*/React.createElement("span", null,
          "Confirm this part number against the OEM parts catalog before ordering. AI-suggested part numbers and prices can be wrong or outdated — a wrong order costs real time and money."
        )),
        /*#__PURE__*/React.createElement("div", {
          className: "anim-result",
          style:{
            background:GREY1, border:`1px solid ${GREY2}`,
            borderRadius:12, padding:14,
            fontSize:13, color:TXT, lineHeight:1.7, whiteSpace:"pre-wrap"
          }
        }, partsResult)
      )
    )
  );
}

// 4. Refrigerant Calc
function RefAgent() {
  const [ref, setRef] = useState("");
  const [equip, setEquip] = useState("");
  const [sp, setSp] = useState("");
  const [dp, setDp] = useState("");
  const [st, setSt] = useState("");
  const [lt, setLt] = useState("");
  const [at, setAt] = useState("");
  return /*#__PURE__*/React.createElement(AgentScreen, {
    title: "REFRIGERANT CALC",
    sub: "SUPERHEAT \xB7 SUBCOOLING \xB7 CHARGE",
    intro: "\uD83E\uDDCA Enter pressures and temps \u2014 the agent calculates superheat, subcooling, and recommends charge action.",
    canRun: !!ref && (sp !== "" || st !== ""),
    onRun: async () => {
      // Compute superheat/subcooling deterministically from the verified PT
      // table (same source as the PT Chart tool) instead of letting the AI
      // freehand the saturation-temp lookup — precise numeric lookups are a
      // known weak spot for LLMs, and a wrong number here cascades into a
      // wrong charge recommendation.
      const suctPress = parseFloat(sp);
      const dischPress = parseFloat(dp);
      const suctTemp = parseFloat(st);
      const liqTemp = parseFloat(lt);

      const satSuction = getSatTemp(ref, suctPress);
      const sh = satSuction !== null && !isNaN(suctTemp) ? suctTemp - satSuction : null;
      const satLiquid = getSatTemp(ref, dischPress);
      const sc = satLiquid !== null && !isNaN(liqTemp) ? satLiquid - liqTemp : null;

      const shTarget = SH_TARGETS[ref];
      const scTarget = SC_TARGETS[ref];
      const shStatus = sh === null ? null : sh < 5 ? "LOW — risk of liquid slugging" : sh > 20 ? "HIGH — possible low charge or restriction" : "NORMAL — good charge";
      const scStatus = sc === null ? null : sc < 5 ? "LOW — possible undercharge or restriction" : sc > 20 ? "HIGH — possible overcharge" : "NORMAL — good charge";

      const lines = ["✅ VERIFIED CALCULATION (refrigerant PT table — not AI-generated)"];
      if (satSuction !== null) lines.push(`Suction saturation temp: ${satSuction.toFixed(1)}°F (from ${suctPress} psig)`);
      if (sh !== null) lines.push(`Superheat: ${sh.toFixed(1)}°F  |  Target ${shTarget}  |  ${shStatus}`);
      if (satLiquid !== null) lines.push(`Liquid saturation temp: ${satLiquid.toFixed(1)}°F (from ${dischPress} psig)`);
      if (sc !== null) lines.push(`Subcooling: ${sc.toFixed(1)}°F  |  Target ${scTarget}  |  ${scStatus}`);
      if (sh === null && sc === null) lines.push("Not enough data to calculate — enter a pressure and its matching line temp.");
      const verified = lines.join("\n");

      const aiReply = await ai(
        "You are an expert HVAC refrigerant charging agent. The superheat and subcooling values you're given have already been calculated from a verified refrigerant PT table — treat them as ground truth, do NOT recompute or second-guess them. Interpret what they mean, assess the charge, and recommend action. Include EPA 608 compliance notes.",
        `Refrigerant: ${ref}\nEquipment: ${equip || "Unknown"}\nAmbient: ${at || "Unknown"}°F\n\n${verified}\n\nBased on the verified calculation above, provide:\n1) Charge assessment (under/over/correct)\n2) Recommended action with estimated amount if adjustment needed\n3) ⚠️ EPA 608 notes`
      );
      return `${verified}\n\n──────────\n\n${aiReply}`;
    },
    form: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Sel, {
      label: "REFRIGERANT *",
      val: ref,
      set: setRef,
      opts: REFS
    }), /*#__PURE__*/React.createElement(Sel, {
      label: "EQUIPMENT",
      val: equip,
      set: setEquip,
      opts: ["RTU", "Split System", "Heat Pump", "Chiller", "VRF/VRV", "Mini-Split"]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        background: GREY1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: RED,
        fontWeight: 700,
        marginBottom: 10
      }
    }, "PRESSURES (psig)"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Inp, {
      label: "SUCTION",
      val: sp,
      set: setSp,
      ph: "e.g. 130",
      type: "number"
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "DISCHARGE",
      val: dp,
      set: setDp,
      ph: "e.g. 380",
      type: "number"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: GREY1,
        borderRadius: 10,
        padding: 12,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: RED,
        fontWeight: 700,
        marginBottom: 10
      }
    }, "TEMPS (\xB0F)"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Inp, {
      label: "SUCTION LINE",
      val: st,
      set: setSt,
      ph: "e.g. 55",
      type: "number"
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "LIQUID LINE",
      val: lt,
      set: setLt,
      ph: "e.g. 90",
      type: "number"
    })), /*#__PURE__*/React.createElement(Inp, {
      label: "AMBIENT",
      val: at,
      set: setAt,
      ph: "e.g. 95",
      type: "number"
    })))
  });
}

// 5. Safety Briefing
function SafetyAgent({
  ctx,
  onChain
}) {
  const [job, setJob] = useState("");
  const [equip, setEquip] = useState(ctx?.diagEquip || "");
  const [ref, setRef] = useState(ctx?.diagRef || "");
  const [loc, setLoc] = useState("");
  const [haz, setHaz] = useState([]);
  const JOBS = ["Fault Diagnosis", "Electrical Work", "Refrigerant Handling", "Compressor Replacement", "Coil Cleaning", "Control Board Replacement", "Gas Heat Repair", "Rooftop Access", "Preventive Maintenance"];
  const LOCS = ["Rooftop", "Basement / Plant Room", "Electrical Room", "Confined Space", "Outdoors", "Indoor – Occupied"];
  const HAZS = ["Electrical >50V", "Refrigerant present", "Gas / flame", "Height >6ft", "Confined space", "Occupied building", "Working alone", "Extreme heat"];
  const tog = h => setHaz(p => p.includes(h) ? p.filter(x => x !== h) : [...p, h]);
  return /*#__PURE__*/React.createElement(AgentScreen, {
    title: "SAFETY BRIEFING",
    sub: "PRE-JOB SAFETY AGENT",
    intro: "\uD83E\uDDBA Generates task-specific PPE, LOTO procedure, and hazard checklist before you start.",
    canRun: !!job,
    onRun: () => ai("You are an expert HVAC safety officer for FieldPro. Generate thorough task-specific safety briefings covering OSHA, NFPA 70E, and EPA 608 requirements. Be specific about exact PPE items with ratings and standards.", `Pre-job safety briefing:\nJob: ${job}\nEquipment: ${equip || "Not specified"}\nLocation: ${loc || "Not specified"}\nRefrigerant: ${ref || "Not specified"}\nAdditional hazards: ${haz.join(", ") || "None"}\n\nGenerate this exact structure:\n\n⚠️ CRITICAL SAFETY WARNINGS\n(2-3 top hazards for this specific job)\n\n🦺 REQUIRED PPE - JOB SPECIFIC\nList every item the tech must wear, with ratings/standards. Cover:\n- Head/eye protection (safety glasses ANSI Z87.1, face shield if needed)\n- Hand protection (cut-resistant, electrical-rated, cryogenic for refrigerant — specify which)\n- Foot protection (steel-toe ASTM F2413, slip-resistant for rooftop)\n- Hearing protection (if equipment >85 dB)\n- High-vis vest (rooftop, occupied building)\n- Arc flash gear (NFPA 70E Cat 2 for electrical work — specify cal/cm² rating)\n- Respiratory protection (refrigerant exposure, dust)\n- Fall protection (>6ft height — harness, lanyard, anchor point)\n- Body protection (long sleeves, FR clothing for electrical)\n\n🔐 LOTO PROCEDURE\n(Step-by-step for THIS equipment)\n\n☢️ REFRIGERANT SAFETY (if applicable)\n\n⚡ ELECTRICAL SAFETY\n\n✅ PRE-JOB CHECKLIST (8-10 items)\n\n📞 EMERGENCY RESPONSE`),
    onReset: () => setHaz([]),
    chainBtns: onChain && /*#__PURE__*/React.createElement("button", {
      ref: el => { window._chainFirstBtn = el; },
      onClick: () => onChain("report"),
      style: {
        background: RED,
        border: "none",
        borderRadius: 8,
        padding: "8px 12px",
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
        color: TXT
      }
    }, "\uD83D\uDCCB Closing Comment \u2192"),
    autoChainMs: onChain ? 2000 : 0,
    form: /*#__PURE__*/React.createElement(React.Fragment, null, (ctx?.diagEquip || ctx?.diagRef) && /*#__PURE__*/React.createElement(Card, {
      style: {
        background: "rgba(39,174,96,.08)",
        border: "1px solid rgba(39,174,96,.25)",
        marginBottom: 12
      },
      c: /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: "#27AE60"
        }
      }, "\u26A1 Pre-filled from Diagnosis: ", [ctx?.diagEquip, ctx?.diagRef].filter(Boolean).join(" · "))
    }), /*#__PURE__*/React.createElement(Sel, {
      label: "JOB TYPE *",
      val: job,
      set: setJob,
      opts: JOBS
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Sel, {
      label: "EQUIPMENT",
      val: equip,
      set: setEquip,
      opts: ["RTU", "Chiller", "Split System", "VRF/VRV", "Air Handler", "Heat Pump", "FCU", "Boiler"]
    }), /*#__PURE__*/React.createElement(Sel, {
      label: "LOCATION",
      val: loc,
      set: setLoc,
      opts: LOCS
    })), /*#__PURE__*/React.createElement(Sel, {
      label: "REFRIGERANT",
      val: ref,
      set: setRef,
      opts: REFS
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: GTXT1,
        fontWeight: 700,
        marginBottom: 8
      }
    }, "HAZARDS"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6
      }
    }, HAZS.map(h => /*#__PURE__*/React.createElement("button", {
      key: h,
      onClick: () => tog(h),
      style: {
        background: haz.includes(h) ? RED : GREY1,
        border: `1px solid ${haz.includes(h) ? RED : GREY2}`,
        borderRadius: 20,
        padding: "5px 11px",
        cursor: "pointer",
        fontSize: 11,
        color: TXT,
        fontWeight: haz.includes(h) ? 700 : 400
      }
    }, h)))))
  });
}

// 6. Closing Comment
function ClosingComment({
  ctx,
  profile
}) {
  const [tech, setTech] = useState(profile?.name || "");
  const [site, setSite] = useState("");
  const [unit, setUnit] = useState(ctx?.diagBrand && ctx?.diagModel ? ctx.diagBrand + " " + ctx.diagModel : ctx?.diagModel || "");
  const [workDone, setWorkDone] = useState("");
  const [outcome, setOutcome] = useState("Completed – unit operational");
  const [parts, setParts] = useState("");
  const [copied, setCopied] = useState(false);
  function copy(text) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return /*#__PURE__*/React.createElement(AgentScreen, {
    title: "CLOSING COMMENT",
    sub: "WORK ORDER SUMMARY",
    canRun: !!(workDone.trim() || ctx?.diagSymp),
    onReset: () => setCopied(false),
    resetLabel: "↩ Generate again",
    onRun: async () => {
      const context = [ctx?.diagEquip && `Equipment type: ${ctx.diagEquip}`, unit && `Unit: ${unit}`, ctx?.diagRef && `Refrigerant: ${ctx.diagRef}`, ctx?.diagSymp && `Reported fault: ${ctx.diagSymp}`, workDone && `Work performed: ${workDone}`, parts && `Parts used: ${parts}`, `Outcome: ${outcome}`, tech && `Technician: ${tech}`, site && `Site: ${site}`].filter(Boolean).join("\n");
      const result = await ai(`You are a FieldPro field technician writing a closing comment for a work order or CMMS system.
Write in first person, past tense. Be professional, factual, and concise.
Output ONLY the closing comment text — no headings, no labels, no extra formatting.
Keep it to 3–6 sentences maximum. Include: what was found, what was done, outcome, and any follow-up needed.
Do not include the technician's name in the text. Do not add any preamble or sign-off.`, `Generate a closing comment from this job information:\n${context}`);
      return result.trim();
    },
    form: /*#__PURE__*/React.createElement(React.Fragment, null, (ctx?.diagSymp || ctx?.diagEquip) && /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(39,174,96,.08)",
        border: "1px solid rgba(39,174,96,.25)",
        borderRadius: 10,
        padding: "10px 14px",
        marginBottom: 14,
        display: "flex",
        gap: 8,
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, "⚡"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "#27AE60",
        lineHeight: 1.5
      }
    }, "Pre-filled from diagnosis", ctx?.diagEquip ? ` · ${ctx.diagEquip}` : "", ctx?.diagSymp ? ` · "${ctx.diagSymp.slice(0, 40)}${ctx.diagSymp.length > 40 ? "…" : ""}"` : "")), /*#__PURE__*/React.createElement(Card, {
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
      }, "JOB DETAILS"), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement(Inp, {
        label: "TECHNICIAN",
        val: tech,
        set: setTech,
        ph: "Your name"
      }), /*#__PURE__*/React.createElement(Inp, {
        label: "SITE / BUILDING",
        val: site,
        set: setSite,
        ph: "e.g. Tower One"
      })), /*#__PURE__*/React.createElement(Inp, {
        label: "UNIT / ASSET ID",
        val: unit,
        set: setUnit,
        ph: "e.g. Carrier 48XC, AHU-3"
      }))
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
      }, "WORK PERFORMED *"), ctx?.diagSymp && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: GTXT2,
          marginBottom: 6
        }
      }, "Fault reported: ", /*#__PURE__*/React.createElement("span", {
        style: {
          color: GTXT1
        }
      }, ctx.diagSymp)), /*#__PURE__*/React.createElement(Inp, {
        label: "DESCRIBE WHAT YOU DID",
        val: workDone,
        set: setWorkDone,
        ph: "e.g. Replaced run capacitor, checked charge, tested operation…",
        rows: 3
      }), /*#__PURE__*/React.createElement(Inp, {
        label: "PARTS USED (optional)",
        val: parts,
        set: setParts,
        ph: "e.g. 45/5µF capacitor P291-4534RS, filter drier"
      }))
    }), /*#__PURE__*/React.createElement(Card, {
      style: {
        marginBottom: 14
      },
      c: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: "#2980B9",
          fontWeight: 700,
          marginBottom: 10,
          letterSpacing: ".08em"
        }
      }, "OUTCOME"), /*#__PURE__*/React.createElement(Sel, {
        label: "",
        val: outcome,
        set: setOutcome,
        opts: ["Completed – unit operational", "Completed – monitoring recommended", "Pending parts – unit offline", "Pending parts – unit operational on backup", "Requires follow-up visit", "Escalated to senior technician", "Requires engineering review"]
      }))
    })),
    renderResult: (comment) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: GTXT2,
        fontWeight: 700,
        letterSpacing: ".08em",
        marginBottom: 8
      }
    }, "CLOSING COMMENT"), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "#0d0d0d",
        border: `1px solid ${GREY2}`,
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: GREY1,
        borderBottom: `1px solid ${GREY2}`,
        padding: "8px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: GREY1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: GREY1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: GREY1
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: GTXT2,
        letterSpacing: ".08em"
      }
    }, "WORK ORDER CLOSING COMMENT"), /*#__PURE__*/React.createElement("button", {
      onClick: () => copy(comment),
      style: {
        background: copied ? "rgba(39,174,96,.2)" : "rgba(255,255,255,.08)",
        border: `1px solid ${copied ? "rgba(39,174,96,.4)" : BORDER}`,
        borderRadius: 6,
        padding: "4px 12px",
        cursor: "pointer",
        fontSize: 11,
        fontWeight: 700,
        color: copied ? "#27AE60" : GTXT1,
        fontFamily: "inherit",
        transition: "all .2s"
      }
    }, copied ? "✓ Copied!" : "Copy")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 16
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "#e8e8e8",
        lineHeight: 1.8,
        margin: 0,
        whiteSpace: "pre-wrap",
        fontFamily: "system-ui,-apple-system,sans-serif"
      }
    }, comment))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: GTXT2,
        marginBottom: 16,
        textAlign: "right"
      }
    }, comment.length, " characters"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: () => copy(comment),
      style: {
        flex: 1,
        background: copied ? "rgba(39,174,96,.15)" : "rgba(227,6,19,.12)",
        border: `1px solid ${copied ? "rgba(39,174,96,.4)" : "rgba(227,6,19,.3)"}`,
        borderRadius: 10,
        padding: "12px",
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 700,
        color: copied ? "#27AE60" : RED,
        fontFamily: "inherit"
      }
    }, copied ? "✓ Copied to clipboard" : "📋 Copy to clipboard")))
  });
}
