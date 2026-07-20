
const {
  useState,
  useEffect,
  useRef
} = React;
const RED = "#2563EB";
const APP_VERSION = "1.4.3";

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

const WORKER_URL = "https://feild-pro.lukedorsett.workers.dev/api/chat";

async function ai(system, prompt, retries = 2, history = []) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const messages = [
        ...history.filter(h => h.role !== "system").map(h => ({ role: h.role, content: h.parts[0].text })),
        { role: "user", content: prompt }
      ];
      const r = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-5",
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

// Simple client-side storage manager with lightweight "encryption"
class DataManager {
  constructor() {
    this.STORAGE_KEYS = {
      EQUIPMENT: 'mts_equipment',
      PARTS: 'mts_parts',
      DOCS: 'mts_docs',
      SETTINGS: 'mts_settings',
      CHAT_HISTORY: 'mts_chat_history',
      CALCULATIONS: 'mts_calculations'
    };
  }

  save(key, data) {
    try {
      const encrypted = btoa(JSON.stringify(data));
      localStorage.setItem(key, encrypted);
      return true;
    } catch (e) {
      console.error('Save error:', e);
      return false;
    }
  }

  load(key, defaultValue = []) {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return defaultValue;
      return JSON.parse(atob(encrypted));
    } catch (e) {
      console.error('Load error:', e);
      return defaultValue;
    }
  }

  async syncToCloud() {
    if (!navigator.onLine) return false;
    try {
      const data = {
        equipment: this.load(this.STORAGE_KEYS.EQUIPMENT),
        parts: this.load(this.STORAGE_KEYS.PARTS),
        settings: this.load(this.STORAGE_KEYS.SETTINGS),
        timestamp: Date.now()
      };
      // Placeholder: implement your backend endpoint to receive backups
      await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => {});
      return true;
    } catch (e) {
      console.error('Cloud sync error:', e);
      return false;
    }
  }
}

// Lightweight equipment database for quick lookups and calculators
const HVAC_EQUIPMENT_DB = {
  manufacturers: [
    { id: 'trane', name: 'Trane', logo: 'trane.png' },
    { id: 'carrier', name: 'Carrier', logo: 'carrier.png' },
    { id: 'york', name: 'York', logo: 'york.png' },
    { id: 'daikin', name: 'Daikin', logo: 'daikin.png' },
    { id: 'lennox', name: 'Lennox', logo: 'lennox.png' },
    { id: 'mitsubishi', name: 'Mitsubishi Electric', logo: 'mitsubishi.png' },
    { id: 'fujitsu', name: 'Fujitsu', logo: 'fujitsu.png' },
    { id: 'goodman', name: 'Goodman', logo: 'goodman.png' },
    { id: 'rheem', name: 'Rheem', logo: 'rheem.png' },
    { id: 'american_standard', name: 'American Standard', logo: 'american_standard.png' }
  ],
  equipmentTypes: [
    {
      id: 'rtu',
      name: 'Roof Top Unit',
      subtypes: ['Single Zone', 'Multi Zone', 'VAV', 'Heat Pump'],
      commonIssues: ['Compressor failure', 'Fan motor issues', 'Capacitor failure', 'Refrigerant leaks', 'Control board problems'],
      maintenanceSchedule: {
        monthly: ['Check filters', 'Clean coils', 'Check belts'],
        quarterly: ['Check electrical connections', 'Test safety controls'],
        annually: ['Full system inspection', 'Refrigerant charge check']
      }
    },
    {
      id: 'ahu',
      name: 'Air Handling Unit',
      subtypes: ['Draw-thru', 'Blow-thru', 'Horizontal', 'Vertical'],
      commonIssues: ['Blower motor failure', 'Coil freezing', 'Drain pan clogging', 'Damper motor failure']
    },
    { id: 'chiller', name: 'Chiller', subtypes: ['Centrifugal', 'Screw', 'Scroll', 'Absorption'], commonIssues: ['Low refrigerant', 'Oil pressure problems', 'Condenser fouling'] },
    { id: 'boiler', name: 'Boiler', subtypes: ['Fire-tube', 'Water-tube', 'Condensing', 'Electric'], commonIssues: ['Heat exchanger cracks', 'Burner problems', 'Water level issues'] },
    { id: 'vrf', name: 'VRF System', subtypes: ['Heat Pump', 'Heat Recovery', '2-pipe', '3-pipe'], commonIssues: ['Communication errors', 'Refrigerant leaks', 'Expansion valve failure'] }
  ],
  partsDatabase: [
    {
      id: 'compressor_001',
      name: 'Scroll Compressor',
      type: 'compressor',
      manufacturer: 'Copeland',
      models: ['ZP21K5E-PFV', 'ZR28K5E-PFV'],
      specs: { refrigerant: 'R410A', voltage: '208-230V', phase: '1', capacity: '2-5 tons' },
      crossReference: [{ brand: 'Trane', part: 'CGTN2421ALC' }, { brand: 'Carrier', part: 'HPS24G241A' }],
      troubleshooting: ['Check for grounded windings', 'Verify proper voltage', 'Check capacitor']
    },
    { id: 'motor_001', name: 'Blower Motor', type: 'motor', manufacturer: 'GE', models: ['5KCP39PG'], specs: { hp: '1/3', rpm: '1075', voltage: '115V' } },
    { id: 'capacitor_001', name: 'Dual Run Capacitor', type: 'capacitor', manufacturer: 'AmRad', models: ['RUND44'], specs: { mfd: '44+5', voltage: '440V' } }
  ],
  beltCalculations: {
    calculateVbeltLength: (pulley1, pulley2, centerDistance) => {
      const L = 2 * centerDistance + 1.57 * (pulley1 + pulley2) + Math.pow((pulley2 - pulley1), 2) / (4 * centerDistance);
      return Math.round(L * 100) / 100;
    },
    calculateBeltSpeed: (motorRPM, motorPulley, fanPulley) => {
      const ratio = motorPulley / fanPulley;
      const fanRPM = motorRPM * ratio;
      return Math.round(fanRPM);
    },
    calculateBeltTension: (hp, rpm, beltLength) => {
      const torque = (hp * 5252) / rpm;
      const tension = (2 * torque) / (beltLength / 12);
      return Math.round(tension);
    }
  },
  refrigerants: [
    { type: 'R410A', pressureTemp: [{ temp: 40, pressure: 118 }, { temp: 60, pressure: 172 }], properties: { gwp: 2088, safety: 'A1', oil: 'POE' } },
    { type: 'R134a', pressureTemp: [{ temp: 40, pressure: 37 }, { temp: 60, pressure: 59 }], properties: { gwp: 1430, safety: 'A1', oil: 'POE/PAG' } }
  ],
  faultCodes: {
    trane: [{ code: 'E01', description: 'Room Temperature Sensor Fault', solution: 'Check sensor wiring and resistance' }, { code: 'E03', description: 'High Pressure Fault', solution: 'Check refrigerant charge' }],
    carrier: [{ code: '33', description: 'Low Pressure Switch Open', solution: 'Check refrigerant charge' }],
    daikin: [{ code: 'E6', description: 'Communication Error', solution: 'Check wiring between indoor/outdoor units' }]
  }
};

// Lightweight AI helper for on-device assistance and fallback logic
class HVACAssistantAI {
  constructor() {
    this.context = {
      userRole: 'technician',
      experienceLevel: 'intermediate',
      currentEquipment: null,
      location: null,
      lastMaintenance: null
    };

    this.knowledgeBase = {
      troubleshooting: {
        'no cooling': ['Check thermostat settings', 'Verify condenser fan operation', 'Check compressor amp draw', 'Measure refrigerant pressures', 'Inspect filter condition'],
        'no heat': ['Check gas valve operation', 'Verify igniter spark', 'Check flame sensor', 'Test limit switches', 'Inspect heat exchanger'],
        'high head pressure': ['Clean condenser coils', 'Check condenser fan', 'Verify proper airflow', 'Check refrigerant charge', 'Look for non-condensables'],
        'low suction pressure': ['Check filter condition', 'Verify evaporator airflow', 'Look for refrigerant leaks', 'Check TXV operation', 'Test compressor valves']
      },
      maintenanceChecklists: {
        spring: ['Clean condenser coils', 'Check refrigerant charge', 'Test capacitor values', 'Inspect electrical connections', 'Check drain pan and lines'],
        fall: ['Clean burners and heat exchanger', 'Test gas pressure', 'Check heat exchanger for cracks', 'Test safety controls', 'Check flue pipe condition'],
        monthly: ['Change filters', 'Check thermostat operation', 'Listen for unusual noises', 'Check condensate drain', 'Verify proper airflow']
      },
      commonConversions: {
        temperature: { 'F to C': f => (f - 32) * 5 / 9, 'C to F': c => (c * 9 / 5) + 32 },
        pressure: { 'PSI to kPa': psi => psi * 6.895, 'kPa to PSI': kpa => kpa * 0.145, 'inHg to PSI': inhg => inhg * 0.491, 'PSI to inHg': psi => psi * 2.036 },
        electrical: { 'kW to tons': kw => kw / 3.517, 'tons to kW': tons => tons * 3.517, 'BTU/hr to tons': btu => btu / 12000, 'tons to BTU/hr': tons => tons * 12000 }
      },
      safetyProtocols: ['Always lock out/tag out equipment', 'Wear appropriate PPE', 'Check for voltage before touching', 'Use refrigerant recovery equipment', 'Follow EPA 608 regulations', 'Never bypass safety controls']
    };
  }

  async processQuery(query, context = {}) {
    const lowerQuery = (query || '').toLowerCase();

    try {
      if (lowerQuery.includes('pressure') || lowerQuery.includes('psi')) return this.handlePressureQuery(query);
      if (lowerQuery.includes('temperature') || lowerQuery.includes('temp')) return this.handleTemperatureQuery(query);
      if (lowerQuery.includes('belt') || lowerQuery.includes('pulley')) return this.handleBeltQuery(query);
      if (lowerQuery.includes('refrigerant') || lowerQuery.includes('charge')) return this.handleRefrigerantQuery(query);
      if (lowerQuery.includes('fault') || lowerQuery.includes('error') || lowerQuery.includes('code')) return this.handleFaultCodeQuery(query);
      if (lowerQuery.includes('part') || lowerQuery.includes('replace')) return this.handlePartsQuery(query);

      // Fallback to cloud AI if available (uses existing ai() helper)
      const reply = await ai(null, query);
      return { type: 'ai', content: reply };
    } catch (e) {
      return { type: 'error', message: e.message || 'Processing error', fallback: this.getFallbackResponse(query) };
    }
  }

  handlePressureQuery() {
    const pressures = (HVAC_EQUIPMENT_DB.refrigerants || []).flatMap(r => (r.pressureTemp || []).map(pt => ({ refrigerant: r.type, temperature: pt.temp, pressure: pt.pressure, unit: 'PSIG' })));
    return { type: 'pressure_data', data: pressures, suggestions: ['Compare readings to these charts', 'Verify ambient temperature', 'Check for non-condensables'] };
  }

  handleTemperatureQuery(query) {
    // Simple parse for numeric temperature and unit
    const m = (query || '').match(/(-?\d+(?:\.\d+)?)\s*(f|c)/i);
    if (m) {
      const val = parseFloat(m[1]); const unit = m[2].toLowerCase();
      if (unit === 'f') return { type: 'conversion', value: this.knowledgeBase.commonConversions.temperature['F to C'](val), to: 'C' };
      return { type: 'conversion', value: this.knowledgeBase.commonConversions.temperature['C to F'](val), to: 'F' };
    }
    return { type: 'temperature_help', message: 'Provide a temperature like "72 F" or "22 C" to convert.' };
  }

  handleBeltQuery(query) {
    const match = (query || '').match(/(\d+(?:\.\d+)?)\s*(?:in|inch|\")?\s*pulley.*?(\d+(?:\.\d+)?)\s*(?:in|inch|\")?\s*pulley.*?(\d+(?:\.\d+)?)\s*(?:in|inch|\")?\s*center/i);
    if (match) {
      const pulley1 = parseFloat(match[1]); const pulley2 = parseFloat(match[2]); const center = parseFloat(match[3]);
      const length = HVAC_EQUIPMENT_DB.beltCalculations.calculateVbeltLength(pulley1, pulley2, center);
      return { type: 'belt_calculation', pulley1, pulley2, centerDistance: center, beltLength: length, recommendation: `Closest standard size to ${length.toFixed(2)}"` };
    }
    return { type: 'belt_info', commonSizes: ['A31','A33','A35','B50','B55','C90'], installationTips: ['Check sheave wear', 'Set proper tension (1/2"/ft)'] };
  }

  handleRefrigerantQuery() {
    return { type: 'refrigerant_list', data: HVAC_EQUIPMENT_DB.refrigerants || [] };
  }

  handleFaultCodeQuery(query) {
    const lower = (query || '').toLowerCase();
    for (const brand of Object.keys(HVAC_EQUIPMENT_DB.faultCodes || {})) {
      const codes = HVAC_EQUIPMENT_DB.faultCodes[brand] || [];
      for (const c of codes) {
        if (lower.includes((c.code || '').toLowerCase())) return { type: 'fault', brand, code: c.code, description: c.description, solution: c.solution };
      }
    }
    return { type: 'fault_search', message: 'No matching fault code found locally.' };
  }

  handlePartsQuery(query) {
    const q = (query || '').toLowerCase();
    const matches = (HVAC_EQUIPMENT_DB.partsDatabase || []).filter(p => (p.name + ' ' + (p.models || []).join(' ')).toLowerCase().includes(q));
    return { type: 'parts', results: matches.slice(0, 10) };
  }

  getFallbackResponse(query) {
    const lowerQuery = (query || '').toLowerCase();
    if (lowerQuery.includes('how to') || lowerQuery.includes('troubleshoot')) return { type: 'troubleshooting', steps: this.knowledgeBase.troubleshooting['no cooling'] || [], suggestion: 'See documentation' };
    if (lowerQuery.includes('maintenance') || lowerQuery.includes('checklist')) return { type: 'maintenance', checklists: this.knowledgeBase.maintenanceChecklists, safety: this.knowledgeBase.safetyProtocols };
    return { type: 'general', message: "I'm here to help—please be more specific." };
  }
}

// Parts finder utility for cross-reference and alternative suggestions
class PartsFinder {
  constructor() {
    this.partsDatabase = HVAC_EQUIPMENT_DB.partsDatabase || [];
    this.crossReferenceDB = this.buildCrossReference();
  }

  buildCrossReference() {
    const crossRef = {};
    this.partsDatabase.forEach(part => {
      if (part.crossReference) {
        part.crossReference.forEach(ref => {
          if (!crossRef[ref.brand]) crossRef[ref.brand] = {};
          crossRef[ref.brand][ref.part] = {
            original: part.name,
            manufacturer: part.manufacturer,
            originalPart: part.id,
            specs: part.specs
          };
        });
      }
    });
    return crossRef;
  }

  search(query, filters = {}) {
    const results = [];
    const lowerQuery = (query || '').toLowerCase();

    // Direct matches
    this.partsDatabase.forEach(part => {
      if ((part.id || '').toLowerCase().includes(lowerQuery) || (part.name || '').toLowerCase().includes(lowerQuery) || (part.models || []).some(m => (m||'').toLowerCase().includes(lowerQuery))) {
        if (this.matchesFilters(part, filters)) {
          results.push({ ...part, matchType: 'direct', relevance: 100 });
        }
      }
    });

    // Cross-reference matches
    Object.entries(this.crossReferenceDB).forEach(([brand, parts]) => {
      Object.entries(parts).forEach(([partNum, info]) => {
        if (partNum.toLowerCase().includes(lowerQuery) || brand.toLowerCase().includes(lowerQuery)) {
          const originalPart = this.partsDatabase.find(p => p.id === info.originalPart);
          if (originalPart && this.matchesFilters(originalPart, filters)) {
            results.push({ ...originalPart, crossReference: [{ brand, part: partNum }], matchType: 'cross-reference', relevance: 90 });
          }
        }
      });
    });

    // Equipment-type related parts (best-effort)
    (HVAC_EQUIPMENT_DB.equipmentTypes || []).forEach(equipment => {
      if ((equipment.name || '').toLowerCase().includes(lowerQuery) || (equipment.id || '').toLowerCase().includes(lowerQuery)) {
        const relatedParts = this.partsDatabase.filter(p => p.type && (equipment.commonIssues || []).some(issue => (issue || '').toLowerCase().includes((p.type || '').toLowerCase())));
        relatedParts.forEach(part => {
          if (this.matchesFilters(part, filters)) results.push({ ...part, equipmentType: equipment.name, matchType: 'equipment', relevance: 80 });
        });
      }
    });

    return results.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
  }

  matchesFilters(part, filters) {
    if (!filters) return true;
    if (filters.type && part.type !== filters.type) return false;
    if (filters.manufacturer && part.manufacturer !== filters.manufacturer) return false;
    if (filters.voltage && part.specs && part.specs.voltage !== filters.voltage) return false;
    return true;
  }

  getAlternativeParts(partId) {
    const part = this.partsDatabase.find(p => p.id === partId);
    if (!part) return [];
    const alternatives = [];

    const sameType = this.partsDatabase.filter(p => p.type === part.type && p.id !== partId && p.specs && part.specs && Math.abs(this.parseCapacity(p.specs.capacity) - this.parseCapacity(part.specs.capacity)) <= 0.5);
    alternatives.push(...sameType);

    if (part.crossReference) {
      part.crossReference.forEach(ref => {
        const altParts = this.partsDatabase.filter(p => p.crossReference && p.crossReference.some(r => r.brand === ref.brand && r.part === ref.part));
        alternatives.push(...altParts);
      });
    }

    // Deduplicate by id
    const map = {};
    alternatives.forEach(a => { if (a && a.id) map[a.id] = a; });
    return Object.values(map);
  }

  parseCapacity(capacityStr) {
    if (!capacityStr) return 0;
    const match = (capacityStr || '').toString().match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  }
}

// Expose utilities to the global window for console interaction
if (typeof window !== 'undefined') {
  try {
    window.DataManager = DataManager;
    window.HVAC_DB = HVAC_EQUIPMENT_DB;
    window.HVACAssistant = HVACAssistantAI;
    window.PartsFinder = PartsFinder;

    window.dataManager = window.dataManager || new DataManager();
    window.hvacAssistant = window.hvacAssistant || new HVACAssistantAI();
    window.partsFinder = window.partsFinder || new PartsFinder();

    console.log('✅ MTS Assistant enhancements loaded: DataManager, HVAC_DB, HVACAssistant, PartsFinder');
  } catch (e) {
    console.warn('Failed to attach MTS Assistant globals', e);
  }
}

// ── AI CALL ──────────────────────────────────────────────────────────────
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
        /*#__PURE__*/React.createElement("div", {style:{fontSize:9,color:GTXT3,fontWeight:600,letterSpacing:".05em",alignSelf:"flex-start",marginTop:2}},
          "v"+APP_VERSION)
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
  chainBtns,
  autoChainMs
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
          const result = await ai("You are an expert HVAC parts specialist for FieldPro. Provide OEM and compatible part numbers with real specifications. Include typical price ranges where known.", prompt);
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
      const result = await ai(`You are a FieldPro field technician writing a closing comment for a work order or CMMS system.
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

// Main App1 component that manages onboarded state and renders appropriate screens
function App1() {
  const [isOnboarded, setIsOnboarded] = React.useState(() => {
    try {
      return localStorage.getItem('mts_onboarded') === 'true';
    } catch {
      return false;
    }
  });
  const [profile, setProfile] = React.useState(() => {
    try {
      const p = localStorage.getItem('mts_profile');
      return p ? JSON.parse(atob(p)) : { name: '', region: '' };
    } catch {
      return { name: '', region: '' };
    }
  });
  const [ctx, setCtx] = React.useState({});

  const handleOnboard = (profile) => {
    setProfile(profile);
    setIsOnboarded(true);
    try {
      localStorage.setItem('mts_profile', btoa(JSON.stringify(profile)));
      localStorage.setItem('mts_onboarded', 'true');
    } catch {}
  };

  return React.createElement(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'inherit'
      }
    },
    isOnboarded
      ? React.createElement(Dashboard, {
          profile,
          ctx,
          setCtx,
          onLogout: () => {
            setIsOnboarded(false);
            try {
              localStorage.removeItem('mts_onboarded');
            } catch {}
          }
        })
      : React.createElement(Onboarding, {
          onDone: handleOnboard
        })
  );
}

// Export App1 for React app to render
window.App1 = App1;
console.log('✅ App1 component exported to window');

