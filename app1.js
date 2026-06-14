
const {
  useState,
  useEffect,
  useRef
} = React;
const RED = "#E30613";

// ── THEME ────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    BG:         "transparent",
    CARD:       "#141414",
    DARK:       "#0f0f0f",
    BORDER:     "rgba(227,6,19,0.18)",
    CARDBORDER: "rgba(255,255,255,0.06)",
    GREY1:      "#1e1e1e",
    GREY2:      "#2a2a2a",
    GREY3:      "#3a3a3a",
    GTXT1:      "rgba(255,255,255,0.65)",
    GTXT2:      "rgba(255,255,255,0.35)",
    GTXT3:      "rgba(255,255,255,0.18)",
    TXT:        "#ffffff",
    TXTBODY:    "rgba(255,255,255,0.8)",
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
    GTXT1:      "rgba(0,0,0,0.7)",
    GTXT2:      "rgba(0,0,0,0.45)",
    GTXT3:      "rgba(0,0,0,0.25)",
    TXT:        "#111111",
    TXTBODY:    "rgba(0,0,0,0.75)",
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

const PROXY = "https://api.anthropic.com/v1/messages"; // direct API

// ── STORAGE ──────────────────────────────────────────────────────────────
const _mem = {};
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
async function ai(system, prompt, retries = 2, history = []) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const messages = [
        ...history.map(h => ({role: h.role, content: h.parts[0].text})),
        {role: "user", content: prompt}
      ];
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1024,
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
      return d.content?.[0]?.text || "No response.";
    } catch (e) {
      if (attempt < retries) {
        await new Promise(res => setTimeout(res, 1000 * (attempt + 1)));
        continue;
      }
      return "⚠️ Connection error: " + e.message + ". Please check your network.";
    }
  }
}

// ── HELPERS ──────────────────────────────────────────────────────────────
const gid = () => "id" + Date.now() + Math.random().toString(36).slice(2, 5);
const ago = t => {
  const m = Math.floor((Date.now() - t) / 60000);
  return m < 1 ? "now" : m < 60 ? m + "m" : Math.floor(m / 60) + "h";
};
const BRANDS = ["Carrier", "Trane", "York", "Lennox", "Daikin", "Mitsubishi", "LG", "Goodman", "Rheem", "Ruud", "Bryant", "Bosch", "American Standard", "Amana"];
const REFS = ["R-410A", "R-22", "R-32", "R-454B", "R-407C", "R-134a"];
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
      background: red ? "linear-gradient(135deg,#E30613,#b00010)" : CARD,
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
      color: GTXT1,
      letterSpacing: ".15em",
      marginBottom: 6
    }
  }, "JLL MTS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: 900,
      color: _darkMode?"#fff":RED,
      lineHeight: 1
    }
  }, "MTS ASSISTANT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: TXTBODY,
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
  const JLL_FULL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHAAAAA0CAMAAABl90wDAAAA8FBMVEX///8AAADxGw/sGg7YGQnpGg7iGQvfGQvmGg3RGAfKFwbGFwXx8fEkJCSfn59gYGCzs7PW1tafEwKAgIAwMDAQEBCtra3vAADfAADnAACcAADOAAD/+fnZAAD74uDzlZX50tDuhoD+7OtDQ0Pj4+PkSUnqRDz0qKTFxcUbGxvuXFf3vbuSkpL83Nr4yshzc3NQUFDvfnnuLSfza2bsrKjjNDPwcXDny8n5op+1TkTvTkixFQTYVk7jkYvXRz3iJyXduLf0NzW+bmvIh4SrLSiyU06/eXbSNizWZF7deXXUmJLYqabTLh63YFuvQTi7MyTOYhwpAAACyElEQVR42u2YUW/aMBDHD9txYkLHiLaZQEhZtgIDwTbI0B7a7qXbWonv/3nqnO0ky0NLtViaptyDcRLkH//z5e4MQGeddfavWiL3d5NkLmESAZEwnTvmEXIJ8IsQNWVUqlGI1CEuJSQDkIoXZZRSCJF4cqlvDbBWvJ8R8kJNvHfHIzhSAMXLIAnDW4CTEIkbnnJlbqmUxoW4fr/YTMYcCvyG2+h5Hgh1q18QbxlbuOAtCEmtQM+LoQiWqRANiRc9a1DN0N7ay3cAq+G5ApdEvXwQK4G/kSXEFGD2h0/1qoMS8cE+eFXhB703zwNp8d4p6lZ7dIqxIgpsxti4QRxW7MZPwdnw4xkhQ2liZO48bwEJYzMUtwPwfb8BHD0NPMeKF89EZxwEmdm5I2LH5wEvXghU2nJK9wBBEJShguOV72/aBmaobU/pzgKVNxPjzTnnftvAo+cddHgCcM7VeM1YbreP83HbwB+el+rwtMAcY1PP9dgqUGlLDDDTy2e+XwK1kx0AceGd76MeBGqUC2AQWGBeB8aI0q52AEQHznWgZBgpGuUAuOc8szum38CNW+Ca86NNKRp45PyyAtK2gSnqUc5MLVA7GTPevChXbac2DJElY1cWqCMTgWtKvzsAam/ObFJD4BGLlqS0kbwHfw+cVduncsy1rvpFn7O0lQT0YoNq2TqwZwqyvRw9u4mYyURZdmPMdbalknr9BqWajopPvPwC1VefNhT3gD1F0cro8MSOQyK17C5K3udezeqPz3Mtw53DniIR9wl6dF9rrGrEBl7f+/RCngmYKbaiAqgRqFBfsTU2tnq9aq1PVMGZmlYUdliPpWnFiaNWH925DcMHG5eEKOoBGzk3hychVI3vqyPMJaVRVJ41pLPT0w02v+FJCVxGqXTOQ6+qmrE1/tS8g9sjcN6/eS83dxFImU0mQLzuX4jOOvt/7BEGDCs442ZXEgAAAABJRU5ErkJggg==";
  const MTS_BADGE = "data:image/png;base64,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";
  return /*#__PURE__*/React.createElement("div", {style:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}},

    /* ── HERO HEADER ── */
    /*#__PURE__*/React.createElement("div", {style:{
      background:_darkMode?"linear-gradient(160deg,#1a0000 0%,#0f0000 40%,#000 100%)":"linear-gradient(160deg,#fff5f5 0%,#fff 60%,#fff 100%)",
      borderBottom:`1px solid rgba(227,6,19,0.25)`,
      padding:"20px 18px 18px",
      position:"relative",
      overflow:"hidden",
      flexShrink:0
    }},

      /* Top row: JLL logo left, theme toggle + MTS badge right */
      /*#__PURE__*/React.createElement("div", {style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}},
        /*#__PURE__*/React.createElement("img", {src:JLL_FULL,alt:"JLL",style:{height:44,display:"block",imageRendering:"crisp-edges",mixBlendMode:_darkMode?"screen":"multiply"}}),
        /*#__PURE__*/React.createElement("div", {style:{display:"flex",alignItems:"center",gap:8}},
          /* Demo button */
          /*#__PURE__*/React.createElement("button", {
            onClick: onDemo,
            style:{
              background:`linear-gradient(135deg,${RED},#b00010)`,
              border:"none",
              borderRadius:20, padding:"5px 12px",
              cursor:"pointer", display:"flex", alignItems:"center", gap:5,
              fontSize:12, fontWeight:800, color:"#fff",
              fontFamily:"inherit",
              boxShadow:"0 2px 8px rgba(227,6,19,.4)"
            }
          },
            /*#__PURE__*/React.createElement("span", {style:{fontSize:11}}, "▶"),
            /*#__PURE__*/React.createElement("span", null, "DEMO")
          ),
          /* Theme toggle button */
          /*#__PURE__*/React.createElement("button", {
            onClick: (e) => toggleThemeAndSync(e),
            title: _darkMode ? "Switch to light mode" : "Switch to dark mode",
            style:{
              background: GREY1, border:`1px solid ${GREY2}`,
              borderRadius:20, padding:"5px 12px",
              cursor:"pointer", display:"flex", alignItems:"center", gap:6,
              fontSize:12, fontWeight:700, color:GTXT1,
              fontFamily:"inherit"
            }
          },
            /*#__PURE__*/React.createElement("span", {key:String(_darkMode), className:"theme-icon-spin", style:{fontSize:14,display:"inline-block"}}, _darkMode ? "☀️" : "🌙"),
            /*#__PURE__*/React.createElement("span", null, _darkMode ? "Light" : "Dark")
          ),
          /* MTS Assistant badge */
          /*#__PURE__*/React.createElement("img", {src:MTS_BADGE,alt:"MTS Assistant",style:{height:56,display:"block",mixBlendMode:_darkMode?"screen":"multiply"}})
        )
      ),

      /* Greeting + avatar row */
      /*#__PURE__*/React.createElement("div", {style:{display:"flex",alignItems:"center",gap:12,marginBottom:14}},
        /*#__PURE__*/React.createElement("div", {style:{
          width:44,height:44,borderRadius:12,flexShrink:0,
          background:`linear-gradient(135deg,${RED},#8b0000)`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:16,fontWeight:900,color: TXT,
          boxShadow:"0 4px 14px rgba(227,6,19,0.4)"
        }}, initials),
        /*#__PURE__*/React.createElement("div", null,
          /*#__PURE__*/React.createElement("div", {style:{fontSize:12,color: GTXT1,fontWeight:500,letterSpacing:".04em"}}, greet+","),
          /*#__PURE__*/React.createElement("div", {style:{fontSize:22,fontWeight:900,color:TXT,letterSpacing:".01em",lineHeight:1.1}},
            profile.name.split(" ")[0]),
          profile.region && /*#__PURE__*/React.createElement("div", {style:{fontSize:11,color:RED,fontWeight:600,marginTop:2,letterSpacing:".05em"}},
            profile.region)
        )
      ),

      /* Stat pills */
      /*#__PURE__*/React.createElement("div", {style:{display:"flex",gap:8}},
        [{l:"Jobs",v:jobs,accent:RED},{l:"Docs",v:5,accent:"rgba(255,255,255,.2)"},{l:"Agents",v:6,accent:"rgba(255,255,255,.2)"}].map(s=>
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
          /*#__PURE__*/React.createElement("div", {style:{fontSize:15,fontWeight:800,color: TXT,letterSpacing:".02em",marginBottom:4}}, "💬 ASK THE AI ASSISTANT"),
          /*#__PURE__*/React.createElement("div", {style:{fontSize:11,color:"rgba(255,255,255,.9)",lineHeight:1.6}},
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
          display:"flex",flexDirection:"column",alignItems:"center",gap:5,
          boxShadow:"0 2px 8px rgba(0,0,0,.3)"
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
  chainBtns
}) {
  const [step, setStep] = useState(0);
  const [res, setRes] = useState("");
  const [err, setErr] = useState("");
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
  }, res), chainBtns && /*#__PURE__*/React.createElement("div", {
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
      const r = await ai("You are an expert HVAC fault diagnosis agent for JLL MTS. Give structured ranked diagnosis with probability percentages. Flag safety items with ⚠️. Be concise and field-ready.", `Diagnose this HVAC fault:\nEquipment: ${equip || "Unknown"} - ${brand || "Unknown"} ${model || ""}\nFault code: ${fault || "None"}\nRefrigerant: ${ref || "Unknown"}\nAge: ${age || "Unknown"} years\nSymptoms: ${symp}\n\nProvide:\n1) TOP 3 CAUSES ranked by probability %\n2) IMMEDIATE on-site checks\n3) STEP-BY-STEP diagnostic procedure\n4) ⚠️ SAFETY notes\n5) When to escalate`);
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
    { name: "Johnstone Supply", color: "#E30613", emoji: "🔴" },
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
            color: locStatus==="got" ? "#27AE60" : "#fff",
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
        c: "🔍 Find Parts + Pricing",
        disabled: !part,
        style:{width:"100%",padding:13},
        onClick: async () => {
          if (!part) return;
          // Use AgentScreen-style result — just call ai directly and show result
          const locationCtx = locStatus==="got" ? `\nTechnician location: ${locLabel}` : "";
          const prompt = `Find replacement parts:\nBrand: ${brand||"Unknown"} Model: ${model||"Unknown"}\nFailed part: ${part}\nDetails: ${desc||"None"}${locationCtx}\n\nProvide:\n1) OEM part number and specs\n2) 2-3 compatible alternatives with part numbers\n3) Key specs to verify match\n4) Where to source: Johnstone Supply, Wesco, Grainger, Ferguson${locStatus==="got"?` — note these are common suppliers near ${locLabel}`:""}\n5) Typical price range\n6) Install notes\n7) ⚠️ Warnings`;
          // Store result in state and show
          window._partsResult = "searching";
          const el = document.getElementById("parts-result");
          if (el) { el.style.display="block"; el.textContent="Searching…"; }
          const result = await ai("You are an expert HVAC parts specialist for JLL MTS. Provide OEM and compatible part numbers with real specifications. Include typical price ranges where known.", prompt);
          if (el) { el.textContent = result; }
        }
      }),

      /* Result box */
      /*#__PURE__*/React.createElement("div", {
        id:"parts-result",
        style:{
          display:"none", marginTop:14,
          background:GREY1, border:`1px solid ${GREY2}`,
          borderRadius:12, padding:14,
          fontSize:13, color:TXT, lineHeight:1.7, whiteSpace:"pre-wrap"
        }
      })
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
    onRun: () => ai("You are an expert HVAC refrigerant charging agent. Show calculations clearly with target ranges. Include EPA 608 compliance notes.", `Refrigerant calculation:\nRefrigerant: ${ref}\nEquipment: ${equip || "Unknown"}\nSuction pressure: ${sp || "Unknown"} psig\nDischarge pressure: ${dp || "Unknown"} psig\nSuction line temp: ${st || "Unknown"}°F\nLiquid line temp: ${lt || "Unknown"}°F\nAmbient: ${at || "Unknown"}°F\n\nCalculate:\n1) Saturation temps from pressures\n2) Actual superheat + target + assessment\n3) Actual subcooling + target + assessment\n4) Charge assessment (under/over/correct)\n5) Recommended action with estimated amount\n6) ⚠️ EPA 608 notes`),
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
  ctx
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
    onRun: () => ai("You are an expert HVAC safety officer for JLL MTS. Generate thorough task-specific safety briefings covering OSHA, NFPA 70E, and EPA 608 requirements. Be specific about exact PPE items with ratings and standards.", `Pre-job safety briefing:\nJob: ${job}\nEquipment: ${equip || "Not specified"}\nLocation: ${loc || "Not specified"}\nRefrigerant: ${ref || "Not specified"}\nAdditional hazards: ${haz.join(", ") || "None"}\n\nGenerate this exact structure:\n\n⚠️ CRITICAL SAFETY WARNINGS\n(2-3 top hazards for this specific job)\n\n🦺 REQUIRED PPE - JOB SPECIFIC\nList every item the tech must wear, with ratings/standards. Cover:\n- Head/eye protection (safety glasses ANSI Z87.1, face shield if needed)\n- Hand protection (cut-resistant, electrical-rated, cryogenic for refrigerant — specify which)\n- Foot protection (steel-toe ASTM F2413, slip-resistant for rooftop)\n- Hearing protection (if equipment >85 dB)\n- High-vis vest (rooftop, occupied building)\n- Arc flash gear (NFPA 70E Cat 2 for electrical work — specify cal/cm² rating)\n- Respiratory protection (refrigerant exposure, dust)\n- Fall protection (>6ft height — harness, lanyard, anchor point)\n- Body protection (long sleeves, FR clothing for electrical)\n\n🔐 LOTO PROCEDURE\n(Step-by-step for THIS equipment)\n\n☢️ REFRIGERANT SAFETY (if applicable)\n\n⚡ ELECTRICAL SAFETY\n\n✅ PRE-JOB CHECKLIST (8-10 items)\n\n📞 EMERGENCY RESPONSE`),
    onReset: () => setHaz([]),
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
  const [step, setStep] = useState(0);
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");
  function copy() {
    navigator.clipboard?.writeText(comment).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  async function generate() {
    if (!workDone.trim() && !ctx?.diagSymp) return;
    setStep(1);
    setErr("");
    try {
      const context = [ctx?.diagEquip && `Equipment type: ${ctx.diagEquip}`, unit && `Unit: ${unit}`, ctx?.diagRef && `Refrigerant: ${ctx.diagRef}`, ctx?.diagSymp && `Reported fault: ${ctx.diagSymp}`, workDone && `Work performed: ${workDone}`, parts && `Parts used: ${parts}`, `Outcome: ${outcome}`, tech && `Technician: ${tech}`, site && `Site: ${site}`].filter(Boolean).join("\n");
      const result = await ai(`You are a JLL MTS field technician writing a closing comment for a work order or CMMS system.
Write in first person, past tense. Be professional, factual, and concise.
Output ONLY the closing comment text — no headings, no labels, no extra formatting.
Keep it to 3–6 sentences maximum. Include: what was found, what was done, outcome, and any follow-up needed.
Do not include the technician's name in the text. Do not add any preamble or sign-off.`, `Generate a closing comment from this job information:\n${context}`);
      if (result.startsWith("⚠️")) {
        setErr(result);
        setStep(0);
      } else {
        setComment(result.trim());
        setStep(2);
      }
    } catch (e) {
      setErr("An error occurred. Please try again.");
      setStep(0);
    }
  }
  function reset() {
    setStep(0);
    setComment("");
    setCopied(false);
    setErr("");
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Hdr, {
    title: "CLOSING COMMENT",
    sub: "WORK ORDER SUMMARY",
    onHome: () => _nav.go && _nav.go("home")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      padding: 14
    }
  }, step === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, (ctx?.diagSymp || ctx?.diagEquip) && /*#__PURE__*/React.createElement("div", {
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
  }, "\u26A1"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#27AE60",
      lineHeight: 1.5
    }
  }, "Pre-filled from diagnosis", ctx?.diagEquip ? ` · ${ctx.diagEquip}` : "", ctx?.diagSymp ? ` · "${ctx.diagSymp.slice(0, 40)}${ctx.diagSymp.length > 40 ? "…" : ""}"` : "")), err && /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(227,6,19,.12)",
      border: "1px solid rgba(227,6,19,.4)",
      borderRadius: 10,
      padding: "10px 12px",
      fontSize: 12,
      color: "#ff6b6b",
      marginBottom: 12
    }
  }, err), /*#__PURE__*/React.createElement(Card, {
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
      ph: "e.g. Replaced run capacitor, checked charge, tested operation\u2026",
      rows: 3
    }), /*#__PURE__*/React.createElement(Inp, {
      label: "PARTS USED (optional)",
      val: parts,
      set: setParts,
      ph: "e.g. 45/5\xB5F capacitor P291-4534RS, filter drier"
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
  }), /*#__PURE__*/React.createElement(Btn, {
    red: true,
    c: "\u26A1 Generate Closing Comment",
    onClick: generate,
    disabled: !workDone.trim() && !ctx?.diagSymp,
    style: {
      width: "100%",
      padding: 13,
      fontSize: 14
    }
  })), step === 1 && /*#__PURE__*/React.createElement("div", {
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
  }, "GENERATING\u2026")), step === 2 && comment && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
    onClick: copy,
    style: {
      background: copied ? "rgba(39,174,96,.2)" : "rgba(255,255,255,.08)",
      border: `1px solid ${copied ? "rgba(39,174,96,.4)" : BORDER}`,
      borderRadius: 6,
      padding: "4px 12px",
      cursor: "pointer",
      fontSize: 11,
      fontWeight: 700,
      color: copied ? "#27AE60" : "rgba(255,255,255,.7)",
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
    onClick: copy,
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
  }, copied ? "✓ Copied to clipboard" : "📋 Copy to clipboard")), /*#__PURE__*/React.createElement("button", {
    onClick: reset,
    style: {
      width: "100%",
      background: GREY1,
      border: `1px solid ${BORDER}`,
      borderRadius: 10,
      padding: "11px",
      cursor: "pointer",
      fontSize: 13,
      color: GTXT1,
      fontFamily: "inherit"
    }
  }, "\u21A9 Generate again"))));
}
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
          parts.push(React.createElement('strong', {key: k++, style:{color:'#fff',fontWeight:700}}, boldMatch[2]));
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
        React.createElement('span', {style:{color:'rgba(255,255,255,.5)',minWidth:16,flexShrink:0,fontWeight:700}}, numMatch[1]+'.'),
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
      elements.push(React.createElement('div', {key: key++, style:{color:'rgba(255,255,255,.5)',fontSize:10,fontWeight:700,letterSpacing:'.08em',marginTop:8,marginBottom:3}},
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
}
function ChatConvo({
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
      background: m.role === "user" ? RED : GREY1,
      borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
      padding: "10px 14px",
      fontSize: 13,
      color: m.role === "user" ? "#fff" : TXT,
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
