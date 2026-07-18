
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

const WORKER_URL = "https://mts-assistant.lukedorsett.workers.dev";

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
      color: GTXT1,
      letterSpacing: ".15em",
      marginBottom: 6
    }
  }, "FieldPro"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 32,
      fontWeight: 900,
      color: _darkMode?"#fff":RED,
      lineHeight: 1
    }
  }, "FieldPro Assistant"), /*#__PURE__*/React.createElement("div", {
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
  const MTS_BADGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADICAIAAADdvUsCAABqC0lEQVR42u29dXwU1/o/fmxm1nez2ThJgOBS3IsWp0C9t0qFuru7uxt1WmpQKJTi7u7uxH1dRs45vz9md5NAoHB/r+8tn3vn/aokm9nZmdnzPo8/D2SMAQMGDPwzgBAAZDwGAwb+OXBukNCAgX+chwYJDRj4h2GQ0IABg4QGDBgkNGDAgEFCAwYMEhowYMAgoQEDBgkNGDBgkNCAAYOEBgwYMEhowIBBQgMGDBgkNGDAIKEBAwYMEhowYJDQgAEDBgkNGDBIaMCAAYOEBgwYJDRgwIBBQgMGDBIaMGDAIKEBAwYJDRgwYJDQgAGDhAYMGDBIaMCAQUIDBgwYJDRgwCChAQMGDBIaMGCQ0IABAwYJDRgwSGjAgAGDhAYMGCQ0YMCAQUIDBgwSGjBgwCChAQMGCQ0YMGCQ0IABg4QGDBg4S5D/rdvlnDMW/xkCCBGA0FgEBgwS/ue4hwiBqE74cwC4pgEI679owMB/GJAlJcN/Nff0F2S/r2b1ioq5fwmpnszRF6Z064Ex0Q/klBpsNGCQ8P8V95SAv3rt6rL5c2pWrowcPsDCMYiA6E6xdzgvddAFGcNHubt0RQgBADhjnFEAkcFGAwYJ/y3ucQ44r+NeKFi7bm3Vonm1y5cHDx5QfSEoQVN+U1f33oqvJrR1k1ZVyxgQ0tzO8zpnDBuZNnykq0PH+MkMNhowSHgW7GMMcA4J0X0sVJFrN6wvmzendvmS6MEDasAPMRazclxdu2WMHpt+wTBLThMOgG/71sr5c6sWzg/t3qnWeiGCQkaGo0u3tKHD04eNcLRsHT85ZZwziAwXjgGDhKfiHsYQQgAA1TT/1k3lixZULV4Y2rlT8/kRQVJGhr1L1/QRo9IuGGEvaAEBoABQRYEQEYFAAKhG/ds2l8+fW7V4YWTfbqXGBxEQs7NdPXqlDR2efsEwe7MC/eMYpYBzg40GDBImuIfiiiIHvHbb1sq5c2qWLAru3aPWVHMIpDSPtV3H9BGjM4ePcLbrAADgAMDGNFiNMYIxAECT5dpNG8pmz6paujB26CD1RzgGYpMm7p69M0aMzrhgmKVJkzgbNQ0AYLDRwP8cCU/gHgDAt29vxaL5VQvm+bdv06oqEQTEnWpr2z59xOiM4SOdHTrGJSSlGEKAUI03sHnb/iPHSkORiFmSWjTP6dm1XYrLDhgDAFAOMEYAACUUqtm4rmru3JqlC8OHDmhhGUiCJb9p6vkDMkaM9PQfaPKkGWw08L9EQs45Y/W5Fzh0sHzpoop5c4PbtigV5YBS4nBY27TJHDoibcSYlK7dMKmLOlDGBFH0+gIvvPXdbzNXlBVVgFgMYAitZpMoZGWk3jph3L23Xa5pmt1mAYBrikpEMe7X8furV62omDe7auWK2PGjPCpjk2hu1tx9/sCsMWPdfc8XHc4EGymAEEIIIASAG6vKwH8FCfUwA4QI4yT3qhYvrFi80Ltlc6y8FKhUcNisbdqlDRmaOWRoSs/egtkMGsbfNUoFQg4eLb5y4nNbtx9s3zq/Y7sCm9VSWFy2adv+mKxJguCt8V9/zcj2rfOLy6tfeGxiisuuaRqCAPC6CEe0sqJyxfKqubN9a1bFSgppjGKbydKiZeqAQenDR3v69BPsdmCE/g38l5CQA84oqBfii5SXVS1bUjlndu36tXJpCVM0aLNYW7RKGzI0c/hId8/egtVapxzWiSNAKSMEL1+z7eb73ywtq3E5LKluZ1a6Ozcno22r/Iy0lB+nLli/eZ/VYqqq8U28dtScRRskQZg55dU2rfIpZQjBk+ON4ZKi6hXLKub+5duwTi48DjQAnXZr69aeIUMzR491d+uBBQEAwDng1GCjgf9bJDxpucdqaypXraj468/aNWvk48eAIiOLydy8WWrfAemjxqb2PV9yOk9jmDHGMMbTZy+fcPdrCCKLSdIoVVVNVjVV1RhjHds179G5zZ8L1jFGOeMWq5jfJGvt+t0tmmcu+P2d3JxMxjhC8FRiOXT8eOWi+ZXz//Ju3ixXlHHKTC6nvUNHz5BhGSPHuDp306+FM86ZkYhj4JwmIeesQXg9VltTtXpl5YL51atWRY8d5qEol4ileXNP3/Mzho5IGzT4TJwilDGC8brNu4df+hAhRBQwpQwAXUbqQOGIrKiqw27lnEMIKGWUUrNZqqisHT+y9+/fv8YBRye7W3QDFUKYYKNv/76KhfOrFswNbt6oVdcCCKS0VGvHTp7hIzOHj9IdswAATik3whsGzikScsYAZxAL+prU5Fjt+nWlf84sX7IoeuQwC0cRQZbcvJQ+fdOGj8gYMsySmfW33KvPFM75iCseXrN+l8thUzXaMDoBAYAIQQihpmoIIQABYwxwDgAQBOL1BRZMe2dA386aRnV/6Smuv36YBPh2bKtcMK9m4bzgzm1qtR8QIGblOLt1Txs+Mv2C4bZmzePXbwQbDZwjJNSDB4zSms0by+bMrlq+NLx7txbwAwxNWVkp3XtljBidMWSoNb9pYu1qgJ9RMEAXg8vXbB3zr8ftNgulrL69CfT3Q6hbbpJIFFWljCf0VVVRtXA4etfEiz989T5N03BC4v3dbkKSd+Tdsqli7pya5YvDe/cofi9A0Jyd6+rVN334SM/AwdbcvOROYSw+A/8QCTkHEPoP7C+cPq1q6eLI7p1KVQ1DQMrIcJ7XKWPIsOwxYx2tWv/bckP3iD787KcfTJqW5nZqtPG7wwRXVfs+eu2e46XVNqvFYZU6dWixat2O7Ez3H3PXHDhWsn3JV6IgMMbP8JNPSJ3TFNm3eVPFwvnVSxeFd+3QvGEgISkvz9WzV/qIMdmjxoiuFP1RGEvQwH+6npBzhhDZ8+arxT/+IDpsRBQ9FwxOHzYic+SFrnbtYWJB646Qf8OfgRECAOzYc0QUCOP8hFQZDjgEkMf3Ag4AuO/Wy0UB3/7IW2aztG7zzkfvvtZiloqKKg4fLW3bKp9zBiE6Pff0i4xfKmOMc8A5ESVPn36ePv20R5+s3bC2Yu7s6iWLwwcPVPz159Fff+35w8/NL/8XoxT+naQ1YJDw/xWwSCSL2dazV6cXX3N36RYvI+KcUU0vXDjN6tRdI43KEM45QigmK5VVXoIx55wDAAEHyQg6BxzGf0UI+oKRbTv2AgA0TYMIlJZVzV+y7tF7rvl91opde4+2bZV/ep2RM6b7S+t0Sz1Gou8jnAEOiMmUPmBw+oDBajBYsXjBjmefFCrLDWepgX+WhBAAABjXQlFri9aebj0Y1ZhGE9wjp9P3AIQY1a37U6hz/kDIFwgijDjnuiHY4ON1XjJmNpn+WrD2069nOOxmjPEPvy4IhhSN8tc/nKIp2sEjxZxzjbLT+GYQxiXLlpozMt1t2zJ9a6hv9UJcJ9U5F+z2zAvH7XjzZVaiGEqogX9eEkKdi6rCGQMMQPL3l6FzT4vFgseP2XKaEIsFInSye4NzrqoaoxzqEjDOQQghRIkQhX6k1WzauecIwTgYigAOjhwvFwXyzqe/mSTRZDNt3XkQQmiSBEr5yXJXZ+D+D985/OP3QxetAo1mhyfZiDHgHHCu+v2AUcAZP0s7vP5dnhWBT05b5yf8gdf7Svip7qDx13XFW7822PDZGjgr/Of1Ig4AAAgBABCCZ+R04RwAULlqRaioUK6untu5w7EZv0OEwiXF8KRcTQihzWoGEACu+0ERwRghRCkNR2JeX7C6xldV46uuDdR6A5xzBrggiJJJslktoih4Ul0mkwgYmzZj0bBLH1iycjPGsC5q35CBex992NOlm+hwMEr//i4ghBhDAABlnGpn9yUhgJAeEIHg7zyr+l/j8dCTiIEgQBAiBBGE8R9Q4lfU+D8nn1+jVDe/McaEYEIwxhghpP+JMcPx+39BHWWMgtOJj4b7PwSM0m333UGD4Zb3P2SThGhp0bZH7z865ccRm3dbMjMYYxAAxhhEuLLKe//TH4cjiiSJsqKEw1FVU80mU2aGu3l+VtO8LLfLgTEKhaM13kBRSUVlldfnDwVDYVXVOIAEY5vdMvD8LmOH93n3099GXv7IZWP7v/PyPRnpqYBzCCFnFGFS9Nef+199UUhxCmazLuXOdAdinHEO4sv0jN7FOU8GWhjnoiBACE/DQ93A1p3eHHAIQH3fEmOcc9bwGXOQYCqvd16YiCQhVP/tLM43wAuLK8ora0KhCCY4NcWZnZXqdjmTn25IxXNdHQW62/K0LIQIxd2YjGGMu3z61caLRu9/6jFzakrJl5+HC0vaPPuslOKKp7BACBFCAMycu/LnX+a7PK6KmkBWeuqAvp26d25d0DTb5bQDAGKyqigaxtButdhsFkkkgAOVarGorKgqB8AsSalup81mXrVuRyAUUWPK/GWbnqzxZWV4KGMQAIiwGg7te+0F0SRRRVFqawCEAJ1hHIOzpPZ2BtDTXzds3nP7Q29bzBJjXNOoxSb99vVL6Z4Uxk/M6dFT7UrKqq67/SVZUREEmqYJBPz05ctNcjIA5xPve33b7iMmEev3AmA8sQECCKG+mehXCAEACEKMUTQWm/zpMx3ataCUAcAxxl5f8Ksf/vxz3pojx0tDoaiqaQAAk0TcbkfrFvkD+3S6ZOyggmY5Bg/PZRLqyhLSrYhTHgPh5ttvtOTmtX3qBQYAp1parz7dfv59283XMVnWmNLxk49b33KX7noBAESqKmNV1SmtW6enuhxue/curS69cGBGempRafWO3Yf+nL+usKTS7w+pqsY5oKEwQMiS4rCYJbNJsljNLqfdYhYFgUQi0bKK6pKSqrRUx8gBXTp3aXvVpUOz0lMZYwghTikipHzRQvnAfinVDRkPHzyghkOC1RY3806/7JKZc3HSntEajUTkXXuOWa1mxjnByFvre/Gtbz5582FOGcDwBI5DSJ5749ulK7a6XHbGGNU0QYCqpusd8MDhku07D1ktJsZYQl9vaCjW/wECCGAkFolEZQAAZUwUyMp122+5/82Dh0utZkmSBJNZsgAzB4xSWlUdKCreNG/hulfenfzCEzffd9sVlFJk+IHPYUnIT6eLUQYJQYJU9OVnBfc8KNodAGIAQMagIW1ef2/TVVd2/OiDVrfcpa9qnR57nn7Mu2XLsI3bx48ZsKVdQVZm6hMvTXrl/Z/LymuoPyCkOFJc9hSnDWEcjkTHXDL4pmvG5GanQQhjilJbG6ip9fsDoUhMUVSVUm3Jys2hYGTypOeTOpium+mXXL1siR5RwSZT7NgR78YN6QMHc8YQIXp483TWXTyCcTbqOwRmk2gxi7oUzcxM++6n+ZeNHTy4f7f6iXWUMkLInIVrpvw2PyszlXEGAaAUCwJKbnaigCVRkCSBUQZgXOGEdXnqem4sr79pMKbpRBUFsnHL7ouueVyRaWaak3HAOYhGZFXTAAcYI0kibqeDEFRcWqHrz4xzg4Lnrk3IOWtUG+WMIYTKN6zb/vB9Ka1aK0F/+YI5eZdc6T98aOdLz6f36GnKyYUiNqVnFP72c6yyotmNtxCzOVRSXD5resG9DxTPniV7fQXXXS/HlLmL19fU+rIz3RdcNmT9lr17DxYRgiVRsJilF5+4uVle5mkusXWLvLseeScmKwLBHACMIIRIjcaISWKchw7tR6IYD5BoWtHUn9IHDQEARGuqzame0/Iwrvzxs9uvOGOMMa6beQghgsmjz3229M+PLGaJ65Yq5whBfyD06POfiwJhjDLGIYSM6aSKf6AoCoQgghGHEMC4gRo3HhPfjSgKutoMIUAIMSbouXuKoj741EfRiJLisqmaRjUmq1rL5k2yMjyUapVV3tLy6qpaL8HY43FdPGaAvuMYBDt3JSEHgAFwshdN19c83Xs4O7StmjUT2+3FM6blXXZV2Yxp1VN/8S2Zjxi1Zadtv+8OLRgEsqZGo+0feaLw1x+5KlcsWbj52RcyRgzPv+oaySSe3/u876fMuf2hazPT3Ldcf+HGrQeisrxx676lq7YpiqooKtfTayBglImiUFRSuWHb3vHD+1HGqmv9drtVEgUIIaMUQuTduT10/HjuheNi3lqlsgIKBHDOOSNOZ+W82d6d21I6dCqcPcvdtl1az96M0sbD8Tyu5Z3V4tRLJOsFBpjNatqx5/CLb3795gt3axrFGDLGCcHvfPLrvgNFaR6HptH6aqb+dkrZNx8/EY0quteYcYYg3LRl78T73pJMAkaw1he84eoRTz1wo0o1GP8qEOcsI80NANi28+D2XYedDqtGKaPMbBa++uiJURf0MplEAEBMVoqKK5av2Tbpm99dbmfTvCxdQzEIdg6TMN4ilJ/s+q9av27LnbcooSDnADBaOXP6lrtup/7alN69u33zw+777qhcvcbRu3fbx57acvvESHlZxYqlhZ9/ghAObt7U9Jp/dXv7Q0QwAGBQ387f/jxnYJ/z3vjwF38gsHzWxwCA3fuOdfjr5lpvoHWL3LoPxrjWG7jgkgcO7tg/6Ytnb7l+nM8fcjntEEKqUYSgFo1svuvm1g8+DgCIFhdp1ZWIEM45BAASDPzh/a++0PvnGZIkbrlz4pAVG4hkOlUiATpjJ86JPqx6nKSUuV2Oz7/9Y9yo/uf37qQoqigKW7bv/2jSdLfLTjU9NU//L4SgjsKZ6aknnLy21s8YhUDUFfvUFGduk/ST/EMUALBr7+GorNisFgxxrS943b8uuXhMf03TdPlsksSWBbktC3JvuGpUWUWNwauzC0H9I58K9ZXVWMwamc2W1m3yb7i548df9vzpjw5vvF8z/8/axQvk6mrBlZp//yORmlC7F19P7z+IYOxdMGfrtVeYbHb7eV3FtHT/vDkL2xVULlkIABg7rLfH7Tx6rHT69y9brPZQKCLLaquCJkP6d7n5gTenzlq6ddeh8sraUDhSVlEz6oqHMlIdwy8c9NBzn335w5+/zlw6sF8XAAClGkTo4KTPvBs2kxQ34Lx65RIWDsYjfghxygSns2rhvJIFcyHG/s2793/wFsToVCEEmLTzzsp+rmcfqhrl8eABeviZjyKRGIRQ1bTHXvhCUTWMEWNM1WjSgq3vcWGMURr/R1E1xnhMVgBECesQUkoZ57KqJg+jlOlWYjgcTSQBcoGQ0vIaAAAhhANAGaOUUspUTSOE5OZkAAAM1+g57x3F+OTvSM+AST2vU/+fpiZfNBe0LPxpsrJ7Bzt2eGW/rq4ePezZKUVTvtv/4J3a8cNco+5hI7r+NF2wWMLFRaG9u6tXrrA0yWWcp7id999yySvvfPevS4ZNuHyoySRBCBGCUz574omXJ73w1veUcYy5QEgwLHdomffr1y/MXbph8cott973ZpPctAfvuIJzLohizFtbMvkrk4nwSARAWPbbL8RkgRBRTYaMIZOJMybZ7PuffRyYLbYmnsJJn+aOu9jZ/rxGlFII+dkvzeRqhhBqVOvascXu/YUaZTarZdO2A29+OOX5x29+/4upq9bvcrts0WjM5bC0ad181dodFrPIdG9Lfc22zgujx+J1tw1M5s8kg/gnbALZWekYYwAgZcxut85fsmnifW/eNfGiLh1b6UnzGqUIxotyDAb+H3DM6P7xRr8oRinXNM45JqR625YVw4bYCpr3+HMhY2z/c0/UzJ8npbjKf5psbpLX6pW35arK0imTt997R8e33rM2ybU2yc0YNlLf8hnnj9xzzY9T573w5pcvPXk7SKSSZKanfvvhEwCAUDji84eCoYhJEpvlZwMA8nMyHDZLMBTu26OD2+XQFIWIYvnCeUpxkWA21yyeHz56OLJvr5iaSkNBz5jxkUMHI7t3YpsNiKJWUc4YI1aLUlN14J03enwz5dSaeGPW8BkAY1RdG7x07IDWLQu/+P7P9FSny+mYNPnPJjnpH3/5h91qQRB6/aGXn7w5GI7NXbjWajVxoIEz1X/hqWImumnXu0eHNI9Ljql6Uq4kClN+WzBj9rJeXduMHz1gzPA+TXIydN3VYOD/DXX0NP5BhDGWJGIyAYwFm92S5sGyovoDGBEsShBBPavD3KZ9zoSbs268lXjSjn09OXDsGNc0LRKhsRhnDELEGBdFYfKnz7794U/3PPruoaPF8WA0Y5pGOec2q6VJdnrbVk2b5WcfPV4yZPyd469+BDCmxWItC3L1KDYAoGrJYgSg6HSVz5h2+M1XscNBKdVUVQ0EOk36Drs9XFUhgFAQsCQBTRMczsolC/wH9iGMT8wRjcfC/w0GxqUZ51xj9MUnbva4HYpKCSFUYw8/+2koFBFF4g9GundufcfNl3p9AaR3jNMt09OzgvPTh4wghBqlOVmeh++6srrWjzHGGHMOXE4bQXj56h13P/penxG3Tbz31fWb9yTz1wxqncskjOeOcnhSshfnEMJQYWHJnL8i5WUAQlebtv2XrYIi337DlRvGDo2WlTi7dYOxmLVtu9Lff13Urd3KC3pHouFeM6endekKCSEWCzaZIEIAcIyRRmmPru0uv3jEx299u27THoQgZQxCqMfWmO745xwA0Cw/55mHb2KMUU2BkHdp3wJCiARBlWORvXuw2cwBh4QgSdAbwkFJCuzZaW/avMWTz7JwCCEIuV4jBRAmWihYsXSx7ms6ecFzDtjZrFGIEATxh4UQDIWiqW7n84/d4A+EMMYQIovZBKFu76mvP3cbhEBVKdQT2BM5MWegm4DTSGg9+fb+O6586uHrvb5AMBhBCEOIIEJ2u8WT6opG1SlTF4287KHbH3zLHwgZPDzHSViXvc9O9I5SAEDZ/Dmbxl24bnDfTReN3PPEgzsevidaVSVZzPYu3Qeu3Z558eVKRWWXz7/t9t1PLODnPp+5RStn526R8vLqDRuOTvlx/2cfa5GI3oRXx3kdWhCHvUm2R/9Y3sDPAWtq/VOmLfroq+n7Dxd3bN8yGpNdKbbOHVsBADBCclWVUlOJBAIAgIBDzqEelaMMO+xcVZtccoWpdTsWiwEOIKV6JB5jUrt5g06g02oCZ7ZM666YAwAFgXDOb50wfuyIPl5vgBDMKMcY19T6b7tx3AUDugMABIEkn/XJXuiTTs5P0Dwb/c4QQoyxl5+cOHPKqwP6nBeLydW1vkhM0b9QTHBKitNkEr+cPHvcNY/V1PqB0cLjnFdHG1mFEBPGWIubbz1/7Tpzs6a+NauKvp5UtXx5waPPmApamVu0VH3eshm/I7Opdt367LHjzQ5XSr8B/vXrlvbtumxY/3UXjdx6+0173ng1Wl0N660AzrmGoM1q1lenvpiSzgOHw9b1vJa5OWkYoVBU4RS0aZnfND+LUQYAUENBKscARLqUgxxyVUWSiYZC7u69kSAQSXL0OV8J+s3tO5D0TKAqAABMhEhJkZ5QflKRh17GBc/mUdUXZTyZbv3B6/elp7lisooxCoUirVs0ee6RmzU9Q62+C/a0H8V0VTRhEOLTRvZ09+nwwT3nTH1r3rS3Hrzz8hZNM0PhiC8QhhDqlZM5makrVu94/o2vEULMIOG5TEKEMIIn7rt6Kna4qPDgC8/7Nm8R0jMQIW2ffqHt3Q9gl9s/Z9aK3p0DG9YJzpTtt9ywbsQgVFPV6sHHB8xfhglmNdVExB3feHvcgWO23FzOOYBIzybxB8KiWXKnOAAAe/YdDkeiGONkxQ3BqG2rfE2RX37nh8NHShlGPbu1xwhRqum6JYIIcAYARwhpQb9z4GBTXjNosRbccS9nDABuzW+q1Sqpfc/PvvxKHgpBjAGEXFX1ZooNOMgZZwxCkOgbcKZUrN+fgzIKAFAUNTcn4/XnbgsGQxACRYm9/dKdeiRd523CowrQacv84tVk8X0BMs7+7otDGqWMsd7d273+3B2r530+c8prV148OCbLlDIIkaJpaanO2fNWJ5sbGBw7V21CqO+sqJG9NhaLFh9r/thT9k5dscOZd8VVnNIWjzxh696r1bMvpf3rejkc6vjeR4JInAMG2gtapLTv4OrRhwEA7a69Dz944KP3IYScUgShKAhef2jLjgNZGal6nBoTcuNdL2/Zvl8gBGPEGKeUxWRl7MiB9956aTQqY4R6du+QlCPmrCwxJZVrGoSIKwrOyGj7whtKWUnb5152FLRkqgoAjB0+aGmek3v1hNT+g4AoAcapppncbqw7ZiBsnE7/rhdLX9UYY02j/7pk6MTrxpTs2X/3LZcMH9xL1bR4KimEydRsvarwdOINJFj6d7k8lDHKGEZIF4mappnN0gUDu3/3yVNfffBYXF3gAGPs9YeOHi892eIwcA5JQs4a+Xb0OKGzdZtB2/bmXntDxZzZ6Vdfa0r1cM49ffv3njmv4NY7NTkWVpQmE27svWhNl+lzzbl5nLGM4cMjgUibl99IHX0hx5gDwDhXVW3CPa91HTxx0fKNnTu2sJhNiqK2bpHfqWOrnoNvuf+pj3fuOYwxEgRikkRJEu6//XK73Wyxmvp076hv+Yxqos1u79qdRqNQENRw2DN4mCMvv82r7zSbcDPnDIki1bTUAUP6rVhrzc1DNhuwmAFnTJWdHTolrdyGm0x8Us1Za+5Jl1YybIgg5/ylpyZed+slTz4wgXOeVCZP0kPh39mE/PQ2oX4gwZhgzHk8h0ZX7FVVUxT1snGDu57XIhSOxusJOVNU9czN3v9x/GNpa6e0UjQNEqLW1qYMH930hlv1/C+maYiQg198Ujlrhojgnpee6fL6u4BSDgAiJGv4aKTdpfn8/ab9AQDQKCWC8Mk3Myb/OCctLQUjftUlQ3W/KKXs0Xuvmbt4wwcf/vLLH0v79mg3oPd5zZtmU0p/nLqgaNeBB5++tVleFqUMIaRTqOnEW6tmTweccQis2U04Y1kjRyevH2GcM/5ifVvRggGgqlBE2GrLvezKRhwzEDAA63lKzmiFIlS/uwZP7l46G90pzslfvATidUx1Yf2683N+ug+CEEAEEtpro0XxnAOEYExWXn7zm9HD+/br3QkhcoIvJxAIHS+qkARBTwo3SyY949QIGZ67JIynNDb2Dekt8Z1t2vT59fe4eQMhAGDvG6/se/ppS5obm63H3nnPmpHZ6oFHGaWcc2te/pDla2wFLfRZaJiQQ0eKX313Slq6GwLudtratszDCOllqQIhX3/42NBLHgqHlQVLNs+at4YQIkejTfMyPvri2YnXXqjXHwAAIMKc0tRuPZs+8OixN15CghAuOgYRooqCBKFu16CUU4pF0bdxPZAVJRwqeOoFZ5v2jaVxx9vEwbN+WPWFYQOe6D0WTyjO1LVRHvfjgL8NUPBTnLzejglLS6vf+/z3j7/6o2/P9iOH9urX67ymedlWixSJyrv3HX3zwynFpdVWiwkAIMeUtm2aNs3P4pyfvmGkgX+ShAgAxBusG71bIec8HA5HIhGrxWKxWgHnTNOwIBybMnnb40+3feje2OFDkcMH04YN3/vgY6asnLx/XcM0DWLs6dWHA6Bpmp6H9fhLkyqrvGkeJ6U0ElXGXv3o1x8+NXRgd02jqqq2Lsj76r2HL7vpeavF7HRaOWdeTocN6n73xEsBAPGRTPpVQcip1ubBx4nZcvSNF8qm/drivkfsLVo1IBgEWBSj1ZVHPnyXQtDiyRdaPvAYoxQ2lqkCAURnWdTLOY8X4AIOTvJmncLtkjh/ncF3OtdrIs+UN3os4wwDtHbjLgSxzWZdsXbXkpVbbVaz2+3USVhWUcMos9ssjDEiCP5Q6PYbx4mCcCYtzA38cyEKAHnD/oAIIU3Tjh8/XlRUWF1dVVhUVF5erqqqPmwste/5vSZ/2/ntDzSENEY7f/VD6zdfMest5SFkjKmyAgEQCNEbgF02diCA8TihJImBYOyKG5/55KtphGBBEGKyMmJIr28+fDQSi4YjMcChw277ceqiCy6+v7rGr+dAJ68KYcIobXHHvd3/WJA2YOiexx4MFx6Pd4NIrHctGDzw+kuO7j17/rmo5YOPJToCw1MYYGenpUGE9GZKhGCBEHIGy5oQpB9JCD5Vy8bkkxcIJhjrLZsatQn1a126elvYG6CUuVMcGempkiR5fcHjRZU1tQGbxexy2hCCnPHSkoo7b7rk+itHUUoNBp6zkhACABioSxzhnEcikVgs5vN5YzEZY4wQYIxXV1f7fL4UV4o71W1v1tzerDnnvO3zL2t+P8a4zSNPgniVDcQYYYz9gdAfc1ZM+m5mWprrjx/e2L3/6CvvTsnOSJEVVZJEzviDT3+yZcfBd1662+W0x2Tl8nGDHTbL7Q+/V17hddjNdpt1xZqdF1792IzvX87K9DDOa2tqKKV2h8NsMgHGUjp36/Hr9ODBg2ooHPcWUsY5RxhpitryvkcsuXm6dnq63r6c87N0V1BKfV5/TI5hjGK1fllR//YtsqxGa301gMmKIomEnrrDIqWsxus3RQWCYaTaF4nEGg1LcM4fvvtKkyTMWbi+vLyaAy6KgigQQjDnLBqLKYqqajTV7XrxqYlPP3xD0ogwcG6SkOumTNLxp6hKYWGh7lfA8ca+en9ArKlqZWVFNBbJzMgUBQEilNqxU9wLomoII30y9p79R3+evmj67JUHDxdJkhDaFL3ipqd+++aV7bsOzluy0ZPiUClFELrdzh+nLtyybf8bz98+fEhvAMCIIb1W/PnhYy9+PnfRBkKwJ9Wxceu+K29+buaU150OG2O8pro6EPBbrTany2WWRM6BvWXLOJUgIAmy4VQ3SHWrisI5QBjBRO+pxu+en2mkQj9Dk5y0OyZeQkSCIQxHIj26tI17axpVbCAEAPTv0zF895Vmi0lRVJFgp8N6svTVT56V6b7jxnFEIASjSCQ6sG8ncFJFvH5k21ZNP3nrwdLy6iUrNq9cu23/waLyytpINEYwststTfOyBvbrcvGYgc3ysxhjRh3F2cml//BAGL1l4LpbJpR8O7nJ7bf0+nhSNBw5VngMJsbr1jnECXG5XA6HQ5QkVK+9PKMMJRSn1et3fD75z3mL1nn9QZvFbJIkzhnGuKy86u6JF7/+3J0dzr++1hsySwLjAABOMA6FY5Qq11w+/PnHbk73uAnBAIAb733jp6kLXQ4bRKCivGre7++MGNI7JivBQCAQ8MmyAhFyOhzZ2dmcUg4AgIhzNu3PFdForHOHlvm5GSku++k8wJxDhGK11UuHDQgfPtjty8nNLr9Kt2bPkIpn6Fs+27ec+ZGMcc65/rh0eH3BaEwmBNutFrNZ0l88zTw5A+dYiKLe/xFGZotVd82ZTCZJkgAAmqbZ7XaTyXSCC4EDQEQBALBw2aaPv56+dNVWWVYddktaqotSRhmFAGoazc5M//irGW1bN5v61Qu9R91hlly6AFIpM5tFCMQvv/qjsKRyzi/vqBpFEBaXVOox6HAk0rZNfq9u7SuratPT3KY0j81mCwT8Pp8vbuEgxCglGH41Zd4t97wpmCTGmd1mzm+S3u28lm1a5rdomt0sL6tt66aSJJ7U9i/eXOms3KN6onnyeek1gH+nwTK90VNcUJ+a6md+coSgvmXrgg5jlOKypwB7/U9EEBkM/D9jE8b5xPS5nELTfH30yomGBGMsFAqFw2Gn02U2m+LSb+POtz76ZdGyzZRRh81sMUmUUU1joF5Opkq1jHTPPY+9N+vH195+4a4HnvwoOytd1dTEaGCenpO+et2uLdv3d+vceuPWfes377HZzBCBUDB864Qb123ee81Nz9w0Yew9t1yW1yTTbDY5nU5Jkni8lAFxzn/7Y4kgoI9fu7tFQZM9+44tXbV58q8LOAcYQQjYwH6dZ/zwmtkk6V7fpC4YDxKeTZwwqaWfhbcNQQTw/4uT1z++vg515p9o4FzxjurNF1jSu6jReF0FY9XV1dXV1XpORmVlVVFhodfn098SjsTufuKDkZc/vGDJBpvV5HRYGec0kX0CG+hYEACemuK69o5XenRuc/HYgRXV3uTq0aNqsqL9OG0BhPD32SuiMYVgrGnMnerq26Pj829+G5TVdz6d2nf0Ha9/8EM4EjWZTDoD9f5Fu/cf27hln91u+ezbP76dMiccjpzXtiAt1eVxO1JS7JgIRaVVSf+qqqrBQAA0Qrv/22YTrAeDSP/31FGAMIeAQQQAUBTl6PFCm83apEmTSDhcVlYGADSbzVarVVUViFBWZqbFYg4Ew5fd+PSiZVvS01L0KfNx0XeiulcnczAhikZvuu/1F5+YuOfA8aoqn+7NAwByDhx26x9zVtx/2+VrNuw2myTGuappTXLSlqzctnvvsdQUB+AgElGefuXr32ctn/zZM21b5estWDAAs+au9gciaR7n0ePl+w8VTZm6EBPsctoBBxjDqCxfNn6QxWxSVS0UClZVV5tE0e5w/P9M4TrBWjv90m9QP3zaNO76vUYbnetyQvHXmb+dA/C3AwJ4vX77Z3WnDY9p5JDkAXFvwhlnsf7n95R/Lnc04YXjnKuqEovF9K8EY4wxSpYhmUwmh8MBAHjkuU8WLtmYnZmqdys6EynCGLNYTMWlVe9+8ku3zm1oPBUG6o2mCMH+QOTeJz4oLKkQJYFxLgjE6w1+8f0sk0mkjGuUEYwz0lK27zx0zW0v+AMhCCFGWKP0r4XrTJIAAFBUlXGWmeFOczsZYwACypjVYho/qj8AoLKqsqSkxCSZUj0e/X70zr+J3NGzYyVqiNPQT0+7I4lpLfpIHD1b/QRfC2UM1YtD4vjwHNZQ1Wz8Q/VWqKd5O9IDracFbuxezuROGx4CTyZS3d8SEzXOEP8zkhDwuvraeipN8gedn5Qxu92BMV63adfk3xZmpHtkRa2bEApPyrQ6yftPNeqw2w4cKT54pNhkkjjjiYpzwDmXRHHlup2CIGAI9RZmiqopqoYQ0gsgOOCKqqWlpWzbeeiX6Ytvu2E8AGDr9sM79x11OqxVtf5rLh3aomnWu59PFTAxSQJlIBAMde1Y0Ll9C03TAOf5+fl2uz15eRAACP+dvRZCGAiGQuEohIgz5nTaLGbTyX0VdRMUIeD1BfYdLKyp8XEAPamO5vnZGfF+h/Gnro92AQBUVHkPHCr0B8IYo3RPSvOmWSkuR/I4znlVtZdSxjkzmySXy5Hc4PS3l5RVHjxcEgpHRFHISHM3zc1wOu36G6PRWCAYBoncOpD8uiBPKCycc0AITve4k18chDAYDIfCUb0Lo8tlM5sauVOfPxiNyghBxpgn1UUIqX9MJBrzevUeHzDV7RQEEgiGI/o569Uxw7qvhUMAOeeiSFLdrv96EsabQHAAWGJCWH0dRm/0pf/q8XgEQQQATP51IaMcIchOaBAF62YKJRbNid8WY0wSRb3RQwNTDEIOgEkS6y2QeBYY5wzovTsBABBqlJlMpplzVt5y/ViE0F8L1yqygiHo0Cb/mw8fq6r2vf3Z1IKCnE/eeODym56vqKwaPaw3xlhRlJycHABALBYLh0KpHo9OP4wgOst6Ql3kXnzd03v2HTObTIFAaMTQnlMmPaur1icwsLrW/+q7k2fNXV1Z5dM0DQBACHY5bZ07tLjpugsvHN4HY8wYxxgfOlL86ns/LFmxvdbrp4xCAAjBaanOfr3a33TtmPN7d9a7y1x6/dOHj5VFI5FLxvb/+uOnNY1ByDHGu/cdefW9H5ev2uYPhBnjEAJBJGluR7/eHW++9sLze3f6Y+6q+x7/yGm3qqrKOYt74yAEnOn1VQiCaEwtaJa1ZNZHSWeyqmqXXP/Urj1HrRaTLxC6dNzAL957tL6fWZ+T8+zr3/w0bbEnxeH1BceP7j3p/SdYPEefEkIWLN5w492vuVz2aDQ2c8qrvbp3eP/z3z78bFqKy65P5mjQTyC+74NAKNKrW5vZv76j385/e4iC0rqBXLwBCRGEeg6N2Wy22WwAgFpvYOGyjVariTKW9IAmpSCEUHeriCJhjMHGYuGnsAc4AJA1Nma0jpN6h1TOzSZp575jpWXV2VmeeUs2CBhpTPvh06e/mzKzdcsCzvmYYb0jkVhxSbnH7Rg78nzd6yvLss/n8/l8okDiGimEnIOzGhKqr6oVa7avWrvDbrMqaogxPnfhun0Hj7Vp2TQ5dIVzDiAsr6y58MpHNm/Zn+J2IsjjTXQ49/mCf85dfeho8eihvSHkGKPN2/aNv+aJikqfy2mDgFONAsA5Y9U1/u+nzD9WWLb0z0/05xCOxIKhaCQSjUZlfVMTRbJq7bZLrn/a6wu7nFYEgUo1ACBnrKrK9903M4OhyPm9OwWD4aqiirDbQTWNAyCJhAgEAMg5j0VlxjlCMBaRnQ6L/h1QxgRCVq7bvmLNdrvV4guENI39NW9NySOVOdnplLH6WQThcMzvC2IIGWM//LboqkuH68M59G9fUTV/IEoICYfDikoBAD5fqKaoIhqVNUYhgCaTRAjmHDBGo1GZA44hjAZCNc2yGtep/vtCFJAzyBPNFBIt15OCixDi9Xqj0ajLlWKzWVet31FYXJHisusRqvpuRoigLCud2jcvLquurvHbLGbG6Ck+8xQ+gcY3CZh0M+jHCALyBSMxRTlWVL5n/3EA4Xsv39MsLysSiTbJyUAYDh3Q7duf5iqhcM9BXTu0aU4pq66p9vt8lFLAuWSz1Q93JiyuM7MJIQQA/DRtAQRAEFAspljMpspq729/LHr2kYnJoSuMc4LQs699tXnL/pycdJ8/0Cw/u3PHVoSg0rLqI8dKghXVQwd2E0VB06iiqPc9/kF1TSArI8UXCHdo06xNq3yqaUePlxw9XuarUi8ceb4uVQAAGEGBYIFgPVKPMYpEY/c98X4oFE3zOILBcKeOrVq3yFUU5Xhh+cHDRYBp40b2AwBkeFK69WrvcFipRiGCJWXVNd4AwQhC0KZFgd4IR5bV5s2y9eii/qx/nroQciYIKCarNou5sto746/ld99yOWMM1YumQMAJRhhDjJBIyHOvfdWv13m6kNdDJgJBBCNM4gZjs/zMrv06Ou02xhhC+FhReTAUQQiaTdJ57Zvp9A6FI13Oa/W/YBPqleEEoLjnDNarBJAkyWq1RSJhhGAoFLI7nACAtRt36bP42ClOFo5EX33y5sdf/tIfiJgk4US5B8FJs6HrpJ5+BK9PSh63URVFUVRNb4SBEJIj0S9/mF1V5ffXBDJy0lRFO3/Mve4U6wev3Td0UPfcnMwFyzZjSbxo1AAIYTAUqKqq0h1Lbneqy+lI8gkCgOIFPn+/1+qltJXV3uWrt1usJkkS+vfpvHj5ZqvV8sfsFY/ec50kifr9EoxD4ciKNdvdbqfP5+/Vvd3Uya+5E3k8ldXeP2Yva9+2QM96Wb9p39adBz1uR3Wt7+brLnz7pXskMV6cdfho8dSZi8eO7Mc5gAgBxgBCemRTr0vCGG3dcWD/waIUp62m1nfbjePfevEeMfH2A4cKf/tj4YC+XQAAY0f3Hz9mgC7iMEKPv/D5O5/86nbZJQn/PvmV7Ky0ZIqpvjERgqtrfEtWbjGbzWaz1K9352WrtprNpqkzltxx0yUnxDPj1h3jmqbZrOa1G3Z++uXU+++6WtVUAWCMEEjUhugp73dNvPSeWy8HieK4625/+fdZy0yS0KJ51rLZn5xQ0PMfdpD+c/WEdYuQQ4RkWQ6Hw1artUmTnGAwFAoFVVW1mM0AgC07DogCYckAt27Vx3nDLGZp6/aDqzfu+uWrF4Zf9iDnwt/IQXiiK6dhAg/QI3vRmJybk9YkOz3dk2K3W0ySBCEoKqmKxeQRw3uXllfe/9SHhEhCMbpy4vOeFOdTr3xVUe3LyvaMHtoHABAMBhGEqR5PWlqaXiCC9LtGiDc0SP5GF2UMITR7/prS8hqTJDTLz3r56Ykr1+7gjO7dX7hi7bbhg3tRyvTaqFpvMByKEoJDIS2vSbrOQEVRIYTpnpRbb7gYAKBpGiGktKxK79Kraax9m2aSKDDONJUihAqaNXn8/gkgMXI0qaJAWJeXXlJWpVEGEdA0rWun1qIoUMaoRhFGrVrkPf3wzXHjPKHbM8b02Tv12szxE8yE5J2WlFVLIilolvX84zcNuvBes1nauuPA5m17e3broFHaoBUV54wzIiBFVZ0O+1sfTblk/JAm2RlJURmPFyda+0HOkyZlYkJdXDHRReg/Fe/8h2zCev3OeIIXpaWl6enpDofD4bA7HHa9FqaqxnfwcJEkknpDnnl91qiqlp7u/uybPyZeN+7Zhyc8/uKkzDSXRmkd9/TlUPfrCQxs8AshOBiO2qzm9165e+yIvidnhCZRWeW99Ibntu8+WF5eU1xcuWXHAaZpfXt0y8lOk2UlHAqLopSRkaEoSmlpqSRJWVlZer4MS87rPQMqYj07Z8YSUSDRaPT83h1bFeR2Pa/FijXbOOC/zlg0fHCv5MwXp8NqkqRIVHG57DPnrn78hU8nXje2RfP46JuYrAiE6JzKyEjFCFMGnA77q+/+GInJ/7p4aHamRyeMqmqJpomQx8ek6fp5nAAZaSkYQca4w2F74Y1vZFkbP+b8jLRUfYlrmiYIQiNjDk4KLdY3CPQ7/VW/01i0b8+OHdo2a9cmf8fOg7Ki/jpjcc9uHepHHfU+WpFwpE/PtpTjjZv3hCPKC2989fVHT4Mz2ubiXaR5ovfsP4j/eFRE10ZFAcIG/gndH1NWVnbs+LGamhpFiTe0PF5YVusNCIScyrei76gY46df+fy2G8bn5aTFZDXRLbceWU/qMV1XTs7rGOjzB7My3LN/fv36K0ekuOyMcUrp0cKyeUvWf/3jX6998NMzr33z5MtfPfD0x/c//fHRojI9PmaSBIfNRKl65cVDAQCU0eTi8vl8fr8/PhueMapqnEMkmc9EHdWjcDt2H16/eY9ZEiWJjB7ah3M+alivaEy226wLlmwoK6/GGHPOKaVOh23E0J611V5BEEVBev+zaf1H33Xp9U/+Mn1RKBQxSSKEAEHIGO/WuU3P7u2ra/xmsykaVR9//ou+I26/8a5XZs9fpVdgNgjQJxUGXZIw1q1z2xYFebW+kNViCQSjdz/6fp9ht9/24JuLV2yGEEiSyBvt2hZnMufsxBZD+p3uP1S4aetes0kwm8XRw/pyzkdc0CMSle12218L1/oDIUIIb9jdgzImiuJLT97CAXA5nb9MX7J4+SZdjCe0rdMk9EAAwN82mPuvDdZjszXurQYAAkAp1RK9g+SYXFlZeeTIEa/Xq2s+sqyhxtKCeT1NxumwLViy8djx0jtuusjnDyKMeKLdNT/lVtBAFBFCan2BDu0KFk57u9t5LVVVH/rFEUIr12774ruZX3w/8/PvZr7z6a+vvTLp/be+/+2PpeFwRB+BwgEPR6LN87MuGNgTAIBx3RjreLIlrNOfEEKi3X4mT0lfqVNnLomEo7KitG3VtFPHlpSx4UN6prjsCOHyCu8fc1boK0mPqr345MQxo/uWlFdFYrFUt5NzOHfR+hvufLXPiNu//H5msguTJAqfvvNQ29Z5JaVVGqVpqSmRiPLz74svm/BM/9F3zFmwGmOsf3oiqlmnPVKN2azmSR882iQnrayimnOQ7nEFQrHvf5o//ponBo69e+nKzQkHCTwhvH76O50+e0UwFJUVtX2b5p06tGSMjR7ax2o1C4Jw5Fj53IVr9O+6wULCyOcP9e3Z4ZorRtR4A6IgPv7Cp5RSURDio4dA3TJrNC0GngPJg/9Q7qgocQZ0agmCkJWdbTabKaWMMoSQIAj6dFo9lEwZh6d3tgKAENQY/3rKXzdfe2FqikNVtbrcKV4n7XhCKNb7n+78JJU1vl7d2s355Y383ExN0wjBycDJ9VeOmjH51Q0LJx3f+mvJzmmL5392291XuJy2hKsAYoTDkdjQgd2dditlDDZQv/ThvPqujDgEABNitpyhSyYUjs6as8JuM4ci0cvGX2AxmwjGrQryhvTvGghGzWbztJnLGOMYYf1S3S7HzClvTHrv0Xatm4ZCkVqv32wSPamu4pKqW+976/4n39c7IFLK2rbMWz77w6cevjYrPaXG6/cHQk67NTXFuWPX0YuufeqLb6eThKfxhLZUCCNKWa+u7VbN/fThe672pDpqan2hUDjFaXPabVu3Hxxz5aPTZi3FGJ1AmLpB4Q0XPgeAYByNyr/PWmazmsKR2BUXDTWZJIxxl/Na9e3ZIRSOCYLw8/TFoF57YprsfgAh5/y5R2/IzHALAtm0dd/XP8x0Om00nm4Rd781Fonipxoj+T9BQmKSAEqMPoDQ5XQ2bdo0NzfP7rADCCmlECJBEAAAVdX+pMw8VbwDQMgYd9iss+ausllNo4b1CYSiiX0XNtA561GwLhwBQXllzbBB3Wb+8IrH7dC0E/syxGT50NGS3fuO7txzuKSsMj83Y0j/bnqCRdwDAAAheNyo/nUBRoQSLtB6tpDeRZgQbLHUeadOqYtyCOGqdTsOHS2TJNFqMW/cuv/pl798/PnPnnzpi8qaACHEYjZt2rZ/87a9iTEbSE9Yu2XCuFXzPps77e0H7rwizeOs9frNJikrK+2zr/9YuXYbQogDTil1Oe0vPjFx3aIvfv/+pev/NVyUBF8g7HTYHHbbUy9POny0GCHI6u2AyQgqQkijLDM99fXn7li7cNKPXz572fiBDLBAMOxy2gRCnnnlS38ghBE8ydxqRCgxSiGEazbu2n+oSBJFm9WyaeuB5177+smXvnju9a9D4RhCyGYxr9u45+DhomQDdUxwPOsUQc55Vobn6Yeu93r9qSnO9z+buu/gcZvVyvlpk5MSmUP/eG/U/7hjhnMAgJiSghBgsZi+2qKxsNVqtdmsNps1JsvBQMDn88V76QWj8dkmjbg668ZBc85NknS8qGL56q03Xzd2yu+Lkj1v6ysjJy4BzgGAGqO3XDf2g9fulUSB0gY1qXoOSjQq/zFnxfHiCp8v4PUFikur9uwvstmsGEIOOIQwJistm+f263Werr42zGyNN75PROoZlCTicJyh/3jarGWMcc6hWTL9NX+tLCv6aCmLyWSxmCGE0ajy8/SFPbq20xVGjJGqaYxxUSB9e3bs27PjY/dd+9TLk6ZMXeh02CFEK9ZsH9C3C+ccY6yoGuDcYbeOGd53zPC+R46V3vXIe6vX73TYrZVVwbUbdxU0a8IakxUQAoyRoqi67L107OBLxw7etffI7Q++vXPPYZvNXFJWvWvvkX69zqOM4RMUPw4gRA26YEEIAPh1xmI91G4ymf6Ys1JRVF1SWS0ms8mEEKyu9U37c+kT91+f0JNR4suEesLqTdeNnTpzydoNu6tqApO+n202mylVT2l718ll8I93R/2PS0IIAABSejoCgIeDup1UXFR87Ngxn89HKTVJUlpaWn5+vl7RG4vJp1ijUE/S1bsUEYFgQgghM/5a3r9Xh9YFeYFgVNOYLKuRqByOxELhaDAU8QfD/kDY5w95/UGfP+QPRWp8Qcb40w9dL4mCptGTe5lxzlNcjofvuuqj1+7/4bNnZ//89idvPpya6krwGWKEo1F5+JBeNqtF06huQPEG3T5hcv0BRonVKjqc4LTZ+jpJyitqFi7dZLNaKKPRWMwkEafD4rSZUxw2UcCyLHMOrFbznAVrA4EQIZgxLsuKQIgkCnr+VzQqu1McTz00QRAEXbRGZTUZChMFIooCY1xR1Gg01rxp9r23XRqNyghCAIGqasnkggYbAwCaRjljoiiIosAYUxQ1Eot1aNv8lgljwxEZIcwBiMaUxkOz9bIUYULrLi2rmrdwnc1i1iiNxWJmk6jfqdNhwQjGZJlzbjaZZvy5XFYUgRAAANW0+ruyrtO+8vTtGGNCyPGicsY0qOcnndb1ci6UYv0zGTOWjCwiYS0YAABgQhBGeqdDURRtNpvT6TSbzVoixw9CiADEGMO4o44zxnRfjqZRjTJG9fbsUJWVOYvXM8ZuvWHs8298m57uFAVBkgRCsCQJoiAIAsEI6m3FNFWVFQ0i5PMFZy9cc8t1Y/VObeAkfqiq9se8VQcOF1dWVR8vKt+w+UAspkoi0V3sCEFBJBcO73vSRhtfZ3XDcTWNx2KSJ038O0moB81mzV9TVlGT7nZGYrFP33moQ7sCTVV1B4woCNNmLX3749/cKfajx0qXrNg8fswAjNHE+95z2s3XXTm8fZtmJpMkCCQUjn745e8xWbVYTJTSFs1yAADBYOT2B98dPKDz6KG983MzRVEAQCirqP78uz8lSWKMCwS3aZmf2IaS2jQHABCCyipqbrjz1YvH9B9xQc/8vCxRFEQglJRV/Th1kcVs1jRms1lbNs894UEmyqp4/UlQuv7814K15ZW1aZ6UWEye9MFjbVs1VTVNLzQVBPLz74s++uL3lBT7nn3H123cNbBf10S8N74WdFtR07Se3dpdf9WoSd/PTve4FFWLP/zGK6EYOMOEif9CEuozHrJzBKtDra3VZJlIkm5eI4xVVa2pqfH5fHl5+XqfC1EklNKorERjskYpB5wgZDaJVqvF4bClpjg8qU5PqisjLSXd4/KkOj1uh6rRO28cf+X4wRazyWKW6rdF+dugXL1AZt00JMpYuifFYjZZze2PFZdv3naAaYo3EqaUIYxURW3ftnmvbu3iRfQNLNEGXzRVYjQUsrTrQCTTyWMqTr6SaTOXWkxSNKa0bpl39WXDTjjG7XZ8PWWOHmieOnPJRRcODIYiazbsPni4aPKv85vmZebnZhKCDx4pPnS4xOWwer3+/LyM0cN6AwCOFZbPXrDuzwVrX333p2ZNMzPTXJqq7tx7tKLS706xl5ZXD+zXsXuXtnprfYwQBLB+54uDR4qXrtq+cu3OlLcnN2+WnZ2ZKivqrj1HKqv9Lqe1qKTypmvH5Odm1O/gmgj3QwTrrGUOgK78/zFnpcVsjkbljh0KLh8/+IQ7ddit3/00F3BIKZv6x1KdhARjlEi3r6+2PPnAdX/OWx2OyAIhnHMEUaP+z/iSg+jvm4X895FQ3xpN2TliegatrVFDISJJJskUjUaJrl5irChKIOBPT88AAFitJlHAzfKzcrI9zfKz85qkN83NzM1Jz0r3pKY6zSbxVB+Ume6OyUowHJFlVVGUcCRGKYvJclzAcgAgEAg2mSSCsdkkAcCJIFjNkiiKJkmor5cSggf26ZT8deTgXiWllYUllUePlx46UnzoaOndt1xqMUvJXOq4FpcgIEqIAy0Y4sGQNTdPZ/mpujxRxgjGqzfsXLFmu8NqqaquHTXscs65oqqkrrUEz8lK69Gl9Z/z1tqt0pzFa0vKqjSNer1ejIAsq/sPFu47UAgAIAIRBVRRUZWa6vzy/cf17vSHjxbHolGr1RwMhrftOMQoBYCLAiEYFpWUn9e+4PN3HyUC0fMcYrISU5RYTFHVeF7u0eOlmioL2BQIhLZuP7B5KweASwKBgBcVl/fv2/m1Z26ND6Wqf1+apkSVqEnhgOi8YJQJAlm/ec/SVdtsFnNVde2Fw/vUv1Pdt9k0L7PLeS0WL99iNgl/zF3x1MMTsjI8MVmJyQrnRNVYMgRCKc3K9Dx239V3PfJeqtulT/tpNBavajQqKwBCVaMN87f+NyQhZ0yy2awtW3rXLNUCPpCamp2dZXc6vLW1kUgEIkSIwBhnnFGN33LduBv+NTqvScbJHYRiMbm0rKq8ylte6a2sqq2srq2q9td6g75AMBSK+kORcCQWi8qyomqqqmiaHtFO5mro3YoEgpPtiTDBVrPZZJIsZsluM6c47TabOd2Tkp6WkuK0paelZKa7s9Ld+g/dOrc5yd8ENEphvDQR6akInNf1YtFCISZDW+u2dW84tddu1drtGalOd4o9zWO7aPT5EEK9NjfxcRQAcNn4wTt2H3I77bU+/4q1W6+6ZPjSPz/4bcaSxSs2HSssj0RkvUAuI8M9qN+Ie265rGVBEz1bbdzo/vOnv/3bH0s3bNlbWVkbizGEkMUi5WRnjLqg1723X+Z2OfSMJc55TlYqY0xRlZwcj24QXnXJ0LwmGb9NX7xmw87yqlo5piIEzGaxWV72+DED77z5YqvFdFKTK+B225s2zUxJcVjMgijULbxV67anp9pTXI6sTNfYkf1OuFP9kV42buCBQ8dTnPZan2/dpl0XjxnkdtkKmmaLEsnLzUg+Nd13evN14xYu27jvwHFJFGOxqCQJJ1MsI81V0CzLLEn5eZmwsUDif5QT/+GWh7pphARh96sv7n7quf7z52QNH6XPe9EoDQVDGGObzXrC91frCxSXVBWXVh08WlxYUlFaVl1cWlVbGwgEI8FwNKaoLN5fTFdrEYYwXrOdmPylZxE2OG3d2BSYLGBljOv81+v39RRhBgCCAGNsEgW7zeRy2TPT3bk5ac3ysprnZxc0zcrJTs/O8DR0q7JINCaJUjQa9fm8FsmUmp527Jef1lx1zQUrlmX0H/i3/Q5jsqKX4GGCTIkeUyerFbGYossciJAokOQNFpVUVlTWUspcLlteTobekjApq5OHhSOx4pLK6hofFkhmmjs3J12/i/qapKKouotUb7Jc/+3RmFxcUlnrDWCMPR5X09yMeBrKSQwEAGiapmlMd1qLIkku+5isAM4Z40TAkiieKolMllXGOeAcYSSJgqJqjDI9o1UQhJPdadGoDCHknEmSeHKegKpqlDIIIURAFIT/NcdM3Cz09D3f3b83sFg1jerBBIKxy+UEAMiKcry4Yt+B4/sOHt93qPjIsbKi0qpabyAWk1WNAs4RhIQQvcd70hkIUdJ3wBGCenZyYtaCrvnrU8mYnmkBIYIQMsb1KTGcA41SvTRG/xYZZzqH4xRlnDIaCsv+QOTQkVJNo4wxhKDZLDodjqxMd0F+VquC3Lat89u3zi/Iz7ZaLAAAu91mt9uYplFKkdmcPXKIs30H3a1++odkNknghABdY05UUz2FPC7qOScY5+ak5+ak1yeA3vCh3pEMAGC1mFq3zGvdMq/+kSc0jJAk8YQrSb7dbJJaFuQ2vAAt2VHiBAhCHVnq31HDO2Wnkkkn3Gmy7OPk56OnYlssptM8PvHUb/+fkIT1Q3DJX0tKK3cfOL5lx8GtOw7sO1RUWl4dCIQ1yhDCokBEkQgExxuGwHj/eZ1CCMF4QnDcdQogBJGIrFFqt1l1d1xMUUPhCABAFASbxQQRDATDmkYRwnabVRCJzx9CCDnsVs55MBjRKDWbJJNJVBWNA44QQhgiiDjnKN7zjzPGdInAOFc1qiiarKiUUoSR3WbJyfK0b920a8eWndo3b9c6v0lOBqrresjP/BGdkGN15sewxAS2RLXmKbs8xQ9MDI9prGNSXNlrtMuTnniSiNfBf++O/o07rddF6hS9zk97zr99+/8ECXXtaMbsFcvWbt+z78iho6VVtSFFUQnGkiRIgoDjjjlIOWeUUco0qmmqpmrUZjEBCEKhqB7cIwKxmOsUNlVTe3Ztm5aasmTlFk1jkUgkNzfj+itGmE3S4hUb12/ZFwlHxwzvM7h/1yNHS6fPXukLhq67fLg/GJn+12oAYJ8ebdNSndt2Hjx0pCgrw6NX7sdkRVE1s0miGg2GIqIoWCwmzrlGNQigIBAAoB6pgxBqlMcUVZZlTdUIwW6XrVleevu2zYYP7HbphYMgMtrjGjgHSKiLwUAw3L7fhOLiSovNIokCIXH9UNUowQRCoKpqKBw1myRJEiRRTHHZ3Cn2jLSU7bsOhiOxZx6+sUeXNoePFn/27Z9bdx6SJAI41yi1WqWtS75OdTvHXvXYouVbsjKci2d+3CwvU//ofqPvalnQ5LuPntB/3bbz4KDx9xTtnF5V5S3oeuUHbzx47y2X6H+69vaXJ/xr5MB+nUvLqlSNVtf4r5j4YrrHdeNVI5au3r5w2WZJFJwOM6PUF4hACP3BkNViVRQVAChKoiQQjCGlTFNVVVNCvmCL1vm7V03W4+NGq04D/6hNWA9Ohy3ilolAGKOMMUYZISjVZfMHI7KstWiec8/Ei/9atKFn1za3XnchxshuswAArrn9pXEj+l158ZBIJNatU6t9h0tXb9htMYuc82go0rdn+1S3EwAwoG/n2TOX9b+of7O8zBfe+mbWvNVXXXTBrr2H33ju9kAw1GPYzf16dbaaTIos+/3h6hp/itt+x4SxO/Yc+fCLqbffMN4fjKxavyM7w92+bXNFVR12q6zKY0f2uXviJQP6dl6yclsgFH735TuGDezea/jtJpPw+jO3fP3rfJfVIstKaUWt1x8MhhWzJGCCRNFMMHa77GebLswpA5zHS/8BhPGBORxQCglJHEMTicgccAAxjudkUdqgFPeEg/XEynrdwU9xARRwnjxnfeMv+Uqdh+kUr3PdC5VUyJPTwpNnbvBGHk+rOeG0CMGGFb0NX+Rco/rZOGMgHoZNFqtCeA7PaftnSQgpZRqlCEO91EBW5O8+fu783p1GX/XY+nU77rjxjhuvHl3jC4SC0fKK6jYt8w8cLvrqu5klZZWXjRu0aOmGi659ql3bZiUVtQ67hVKGMVIUZVC/zpFItKrGf8HAblASorICABg9tM+uvUeffeObWFSp9QYcdttDd1w1afKszdsOeVIdEAJMMACQci4IeO+B4/3H3IMInj1v9ey5KzYt/fatj39+5b2fAdf69WhPKW3RLLtNyybrNu4RCM5Md1996QWzF6295fqxO/YeevTea3Kz0r3+YCQqr9mw685H3odQT5hm/4bSgU7KNIjb0snmTonZxiccAyHUWXqCCdrIwadNG0ge36DCsCEf4vYV5ye+Hk/yhFAQ6p/hhGvgJ73xBLMt+df6l3rCixAiKMSfCcIYnES5M+lE/L9IQr3KvH7ND0awaW6WO8Vx6Zj+e/YfGz20t0apSMgLr3/7xeQ/jm+dtnn7/rde/jyrXctITB54ftcfJj3z7U9/7Tlw3KqP9WVMkoQxQ3svXrl14bINH7x6X0HLvEVLN89ZuGb0sL5Tv3lpx66Do6949MU3vm7fuumtEy66dcJFb374w7NvfAshEgj21gQ/nPT7o/dctXrup8vXbLv9oXeOHyuz2qwQQk2j0UCoefPM3t3bz128dsTgXgP7dlq3cqueO37jVaM2bj+gURqLKfc9+PaN148dO6o/BKCgaRbGiDOuh0j4Ca01zsCNfPTnKaG9u7ksM03lZkvbhx83uVy127aWTP+95f0PmtxuDsCx334O7NxBFRlSylSt5QMP25s2U6PR/e+85enXL3PwBbrE0E956LtvIkcO82gECYKzU+esseMFi/U0PDz85WeR0pKW9z1kcrp4ghKy13v8qy98m9ZDQUgbOiL32gkIIYhQuLTk2Befh/btJnZH1viLsy4cByGM1dYc+OiDnLHjU7t2Y5RCjEvnzimf9osWDllbtGx66x3WvKY1mzYUff8tMpuR3UEVWQ0ERI+n3WNPYUIghP79+45+86W7V5+8Sy7jjOnyM3Dk8PGvvsgeNz61dz/AeaymZt87b+RdebW7U+fy5ctKfv5JsFkEh4OpquL34hR3uyefI5J0+h3nn8I/7SSIh/BgvQCOCgAYNbT32DEDc7LSCMYQAoCRIIiMc7MkipnpgWD4iRc/i0RjF48ZMGvKG7dOGBcIhDBBsqLm5aa3bpmnaarHZQcA9O3RzlvrH3PVI8Muu2/e4rXndWh5zVWjNq/Y2nXQDTfc81JxaeV9t12Zme6WFYUDYLKaH3vmo9H/emjF2q0D+3Z+7N5ropGoHjdDCEFN7daljd1mef2Dn/ccOD5sYFegF65C2KpF3r/GDSIYW8ymGb/89e5nv3IO7nj4nQsuehAhCJJFIJyfBQc5hwAUfvNl0Zefy5XlsdLSWHUV0zQAgHf71oOvvKJ4vQAACEDxD9+VfvmpUlkpl5fJ1VVM1QAAWjRy8J1Xq9esAqBeBwMIj37xWeFXX6i1taF9+/bce8faAX2Chw/FVbiG4hEC4N+7Z/+jDx99/pXymTMAhLoaqcmxTddcWTjpU1t+M4xQ2V+zuKpChOTa2s2XjK+YOc3WvAULhyoWztOXu+L1Hnr1Jf+WLQAAhHHxTz9uv/ZywJmteYvatWuCR44AAGg0QmtrlfKyo++8WTlnluqtVQOBRCMwePjD94+/+e6B55+WAwGYuNTQkUNH3n5rx43XhY4eBRDKNdWH3nwruHcPAECNhBW/T6muOfbBO9Xz/qJ+vxYKGTbhKTYAhEgiLRvqBUkAIIw1jebnZj5z39W13oA7xZGIZDA9n19Vqc1q/uTzaT/+Ov/yiwZ+8uYjl48b9MV3f0IIo9FYt049AYAXjxl48ZiBAIBunVsvXLbhoTv+9eGX077/Ze7wwb2sVvMdD0/Iy3J/Oum33RcPGzGkt9VmpRqFACAC77vzitkLVl92w5MHNvzaqUMLKEoJDRByyoYN7gkAePTeqzxuZ3amR3I7OOdeX2DLjn0TrhqlKz3Yane5bBAChHEoLJvNkh7YAMlwwVk9IkFMHTayx7dT6ltTWJIEjxMk4gFYxOmDB3f99seGmxuUXE5iaVA9DAGAhLiGDOv+9fcAgGhp6YaBPQ+9/GyXb386ueYVQFj6w/euTp2tebklX36ef/2NugYo19QEVi3Nu+3Odm++Gw+HaBoAIFx4PLJ1c+sPP2p2293J1yEhECMpLQ0nBhjWLllocto7fjxJsFhAotdSev9B6f0HMQDmFuQ1uXpC24cejW8EEIZLSypnzSh4/MHyn38snzUj/9oJOgmxKFoLmqrh8M57bu0zeyEWBXOGm9hsAIDcUWNyR43hAMw7b23G1de1eeCR5AeBc9Ih9g9LQt7gB8g5sFpNew4e23/oeJuWeb/PXqZ3HwHxpHnGOQeM2azmGT+/cfO1Y4LBCCHYFwhplCIAKGPjRvWHEN79+PtX3/pCVY3v0gsHX3LhkIfuvvr49uk/f/kiQmjNhl1XX3LB4/dfX7hn9oghvVes3X68uCIj3W02SbnZ6e+/ev+hTVN3rPzR5XRs2n6AU6prRJxxYJH6dGuvqtrgvp0z090pLnvbVnmhUIRx/vn3s/Q0ccY5Zcm59JAQxOuZI/9GJwUuEN/2LTueenTjnbce/vlHfQ0xSqmq1JVTSpJ3y6b1V126fOig7c8+GRcgnANGE5Ov6p1Q1WgsyinVIlFzdnb6lVf6t22kqoowrjOZOEcYKwF/+dSfm933QMvX3grs3FazdhXEmKmqKT0j+7Y7i7/8fHmXdrufeSJceBwRwil1tm6Tfs01ux6+f8WAXgffe0v2eWEi/5NSVc+zA5znTLiJQmFx6/yN111ZvnCe3vCQUcqppnhruaqwcIhTSmMxXXUsmjIZmKX2r72TOnT48S8/5YDHT8u4Fo0VvPqGd8vGvW+8IjgcgKp6bQRTFK5pcsCvqYoWjXBKqRw7Zw3Cf9wm5JyxE+xljFBllX/txl3dO7edNX/NTVdfSOPTRZDFbLbbLFzV8nIzLxrd/6LR/QEAoXD0gy9+FwjWKLVazU679affF33y5QygUavFPGJIj3mL1/9r4nOXjRusatpvM5esWLX1ugNHLxk7qEvHlkePl37781zIwSvv/qBRWlJcceXNz952w0W5Oenzlsx75b0fLVZzOCyHwpFabyAz09OhbfOvp/x5z4PvDBzUbe6v74wf1Z9DmJriXLZq26Zt+7p1aq1pFEAEIGIsXoaRaJFUXxqBM2/wzCFksVi0tFTzemkgAGByumOdZssUDZot9k5dLIGArWXr5KkRRJADwBngLNnHAQKOMIIIQoIBAGogCAgBJ3hQGYOElEyfGqsu9+7dE6mqEuzW4snfePr2BxBiQjq99UHOxZdXTP2l9OvPK2dN7zV3iTkrG5vNXb75Mf3SK8qnTz362gu1ixd0+20msViSTa4AAExTPf0H9lmxrvi3nypnzdh+6Vjlk0l5193IVRUKAtQrESGEGEPGIMZqJFIx9WdzqufYd99wiGo2bazeuCGtRy99k5P93vT+g8gnX26+5kpksxKHg6tqcv+DGHM9qQNjeA50czpXvaPxJVX3gh7sTnM7fvxtYWl5dVlZDcZIIPGUsy3b923efkBy2HftPdpj2O3DB3VnnM5funn/gSKb1UQpEwm5+taXKGUZ6akQgp+nL/7u57l2m/WPOWum/7UKcI4JdtitvkDkw0m/6x9st1ktZtN7n00FEDgd1lnz181euF4UhUhUsZokq9V06EhJ96G3B0MxzuGFVz1+8GgpMllWr9/zyTczVE0tLKk4eLgoFlMnTZ715XuPmU0S4EDPWyUInbj3nr0qBBm1d+naK6FqMk2FRIAQYFLXU5DKMUuLVu0ef/oEXR9gAggBEKGEUs0BEESBWM0AIiyKVevXFP46JfemWzHGdbmsnCOMGaOFP3xrbtHKt3EdUFV7m/ZVSxaES4qtOU20WEwNBjx9z/f0PT9lyJCN4y8NHNhvyc5Rg0HOWJMx45qMGXf0o3f3PfFIrLrKlpePEMKSGA+MIhStqrTm5LR+4JHWDzyyrGVuxdy/8q67MalCY1HUdwdOKRKEisULosePpvTqV/rbT8RuEWy2wh+/10kIIcSCoNZU5198eeVVfx58/iloMfN69fKQc73s24gTno1OCiGEsLisurrGd6Sw/OiPc7Iz3BPuenXXvqNOpzUSU4Ze+jBl3G6zQAj2HSzcsuMAZ9xiMVutJj17W08xIwRzwPWuM9BupYybTFK8uJNzyrhJkqxms/65lHHOucfj0vMhXU4HB5xR5nZKLN5+BJaV1+rFa4tWbDFJosViApw/+MynAsGiKEz6bpYkSX/MWR2NvXzwcKnJaS8urdqx+7DeHCXRZSret/NsTRLN50PRCKeUU5p0uzNZ1mqDIFmcoSr+VctXjxrCVE2Lxtq99lbGgIFMVlRNPfzR++Xz5rBg0H3+wE6vvcUA50CrmvPnitFDVb8vcGBf9ugL2zz+HGcsGSHQxeDxqb+WL1kzcNnizIFDAACRyoolLXIOv//WeW99IHtr140Zana7UWqqf+um1CHnu87rBAAIHj646YqLbW3aEoslsHZV+lVXm7OzdfKr1dUsGgEAIEwOvf5y1fy5tvO6qBVlsVCoxdXX1NeMVG8ti0X1GKOmKPtee0lq26HnrHn6Y9v+1CNH33+n1X0P2ZsXUFlWq0O6s/S8t95bs3dH1drtTJeECReCUl3Fzm2XzD+fMeMPhnsPv620vFYUhKR2ZTaJMUUFHBECFUULhaMmSZAkkTN9Y4N6mmM8S1jvn5wIPidG/8TzITnjNKEW1k0FSjZoSnRa0DMeod75BEJdG4r/CdYdAABAGMWb4QKAMebxDAOd/yAQCkuiKImCoqoQAEEgye0FIRCJyu3aNF3916eEoEaLDBr7csCx337DopA3/mLdqcA5Qwh79+6uXLSw2XU3iC4XB6B4zp9y4XGuaVzTqKbljL/U0bKlEgkXzZhGvT5ONa4q1hatci+6lHFeOntWtLiQc44EwdWxs6d3nxNDhZxBiArnz4kWFra48RaEEWcMEVI8czqNxXIv/xdgrGb1Su/qFbGA3966TZNLrhScTs4YU9Xq5Utq1qzSZDm1R6+scRdDjCGEsYC/8Nef08/v72rbnnMeLS6qmPdX8MhhMSUla/RYZ4fzEoE+SGX52A/fOzt18vToBQCI+n3Hfpzs6dk7rXsPpqqQkFhlRdG039IuGJ7Stm2w8HjZnzPzrrhK8ngghP4D+0rnzssec6GzRQtGKcJYU5SjP3yX0r6jp3cfRum5nC34D6et9Rp+e2lZjSgSnuiMxTjHGCGIdIcpRpAyRilnjDHGKaOUMo0yxjmjVB8RgxBECGKMCUECIXqOGxGIJBFJEMwmkRBsMUmSJCCE9MEmCCHGKGNcVjVKuUZZLCZHo7JGWUxWwuGonpOtqqqiaPpACp3DEMbHTRKCMcIYQaxfLkIYQ8o4pQwCnizL53HzDEaisXat89fM/fwsSHiKKbOwYS54o3nVjb548sHxyEQjrZwafi7nsN7sJ9hYuP/EMydD7ae92gb8TxaXNfbGE15p8NfE5TW45oZnM9TRU6qhGCN9witjjDKmUcoYi8WYqukyDOij8CRRMJskp8Nit1nsNovTYXM5rA67xe2yOx1Wl8PmTnHYbBanw2q1mu12i9lsEkTRZJJEkZzVHTIAZJVGwlFVUWIxJRyOBINhfzBS6w34A6FAMOzzh2q8Aa8vWOMN+APhQDAcCEWjsizLqqZRvaQAQUAIIRgRrANhjDAhCOO6TitneD2aBurnhcUtZwYoTSaCMU1LtPoHybQ1vWorMRGiLguswcEQQtR4MhejFDCWzIwDENZdCecseWZQl/hW94kA1E+I45xzTQMY6f3R9JLNeG7aSZlojGp6J426N9Y7hjPGaV1uWvJnAGH8guun1zU8m0HCU6wwympqfbU1XiKKejN5m9XsdFhTnPbMtJTMjJScrLSMtJT0NLcn1eVJdaW47Fa71XQmPWM447KshQNqrSxrlKsKlWVOKddUqlG9gYwuvBDGEBMkECQI2GRCgiBIUqrVBFy2vzfYAAj4Qz5foLraV1ntraisraiqLSuvqajyVlX7anxBnz8YCsdCoZjGmBqO+TJSz3ZPbjTjEUII6u0tp8qKbPy9Z5ZCCROZcY2+8aw+EQAA6++E8HRpnBCTU74x4fZs5OfGLvjksxkkbASCQG65/kKLyZyXk56d6fF4UjxpKS6Xw0TQqailBoLhgF/2+2VvrRoIaD6v4vWqwYDm9ykBH41EQDisBYNaNAJkhcViTFMhZ5BSQCkHXB/TzhPzQiCCAECuNx/CCBECBBGJIhRFJJmIxYrMJmi1Ci43sliJyyW6UojDKaS4JJdbdLkkpzPF6XLnZzfPzz75YlUOfN5AdVVtZVVtaXn10cJyo3TCwDlkE56g4tcTLqpcWxOtrIxWVcWqKmOVFXJVper1qr5azednAR8LBrVIhMZiTI5xqgFG66wupHuk484UgCDQnTe6a0Uf8pUcgg3q2uBznqhOZfFBPYDFswIA1zs0M5aM+EEIMIaCiERRMJmx1UocTsGVQlwu0e0R0zNM2dlSRqY5Lc2clmbypAEinGyYGTBwrpAQcE4Zq1y1snLGtPDhwywWpXKUBvxawM8UmWkaSFr8CEGIoK49CgToWWAI8mSfCN1SZxzwhKHPeXIKaTz8kTCP4k1nOU+2xOAA8ro3AoAQTCS4cKjTVm+2T+vmGzIOKAWaBhjjjHJKGaPxjv2CgEwmbHMguxNJIrFaLAWtm1xxjadnT4wgMOShgXOIhLra5vf7Nm+s+GtW9YK5ctExRATidAFR1Bss6aV0iWIZABmlsgwhgqLIKUUYUTkGAcAmM6AMIAQg4IrKVQWJEhQErudtQQQ0FRGCMGaqRmNRbDIBhGk0gogABYFrFBBMIxHAORQlpsgQQkwEJEpcVYAocMaYRoEoMFWFAFI5BgFEhGCTSW/szhNZBwxwCBGLxrRgAABmbdPOPXR4xtCR7i7dic1mLDgD5yIJk0qpGgpVLVlU+ddM/8plqs8LbXauT3VIdtJlDEuStVlzqqixkmJktbBQ0FLQAgIYO3wYWUxaIMQ0TczIFDIzlaJCWlUFzCbGOVc1U2YGjEZZKAytFqmgIHb8OA0GLe3aUZ9Pq66CNnusvNxc0AIQIpcUmZu1gICz2hqtskrMztZKy4AoAKtFq6omaalaTDY1yYcQslgkeuwoICThJ48rm0ooaG3WPG3Q0LRRYzz9BiQnrRu6qIFG8c97b7ke8dM0wWbLHndR5y++7TF/Wdpl/1JrayCp1zESIS0ccXbt4bzwEoVDISvHPWQYzshOvfgaanFwQlIvvQJJZi2mpF91naV56/QrrhWbt2AxGQDIIG9yz0OWrj2jPn/m3Q+JBe1knz91/CUpQ8eyiEyycpxDR9ratsu+/jaqUkaZrXvv9CuuVcNRnJmZ/8SzyGKFWGjzwWdik1x3/wuI22Nu0SJrws0UkQZTnwBEGCuBQMHjz52/cGX7195OHzAYYsw0lVFqMNDAuUtCoIfbMeaMMU1jmmbJze/w7seuAUO06gpEiF5Zp6uklHPBasFcg5xBQjjlEHBaW83kGJQsasDPqcaVWOV3k0Ib19u7dtPkqBIOugYPjflDtu49odVaNWs6FrA5v1ntsmWxsmJzy5aAMSSZwvv2+7dudrTvhAPB4JoVwZ1b/Tv2O0eMChWWukeOUmWlauOGlOEjpabNWW1N7YqlwV3bg5s3cEL0eKbeR1Gurmx27/1t7n+I2Oz6vQDGICZGcycD5zoJ6xRTjCHGTNMwxp2/mmzr2kOrqkREAIxDwAEHjLPQxrWRrVsQwUBTANOYHBNSPIwQZDKlXnI59qQCAD033WLv3Tu4cR00SVwQzC1ahtYsB7GItXNn1VtDHFZ71y40GtKCXnu3rghDIEcZApHKMnun86TUFEwQlWOmts0Eh8M/b5aQnQ0zUmN7d3rnzrW2aUOpSmw2ADm2WnVLVfcPRSvKm9x6Z7unX2KappeQn9iaxYCBc9MmbFxHZQxhLNfWbJlwdWDlMjEjk1HKmQZNJgggi0SgKCJRpLGoKS8fmS2RQ/uJ3SFlZEWPH4WCYG6SJ5cUKjXVQJQ4QkgysYoKbLMhm5W4UgSnK7x7J0lxWZsWxA4eoJoKRYlGo+ZWbZTSElpdCa1WBgDjADLOampIerre4loLBHCKi6sK5wCZTFogqMtxyGi0pjbv7vvPe+n1eMMig3sG/q+TMMlDNRLZee/t1TOmkhQ3wJirit7KB3AOOQcYUUXmjGKTmWsaV1UkSYBzripQkgARQMJhggQB6IYZpUxVicUCGGOyTEwmiBDTGzdEIkgUkSgyRgHTB5pAKAhAVeL1uIRwqkGMAABcYwAhiDANhRgALZ55oeC2uw0GGvivImGShwCAwx+9f/Sd14CqEIeTaRrg+hBnCCDgyVRjPRKo5zTWm5ilK7qgXl6v7g6CeoyRcwgAh4AzXhdgrOvOrAcgGgzeTbwXQ8aV6mqpVct2b3+c1q8/oxqEyGCggf8qEiYowSHCtZs37nvm8dCmdcTmgKLIqabzkJ8wBrCxWXT6iRp7tY5fvOH/OK8Ly8O6f+ODmiHELBxknGdeemXLZ14wpab97YAXAwb+z5JQ5wSliBCqase+/LT4iw/VigricHKEEkkqpyZhcuhVXV1R8uhkrW0DjtarQKpHQv03BBHCPBpVQ2F7z16tnng27fyBQO9oZDDQwH83CXXVVE8BjRQXHn3/7Yrff+HRKHI4AUzcAmxImURbJQ4bIWF9qtbTH2HdxGzeQIwCCBFCVI7RYMjcvKDJrXflXXcjEUWmaX/bxNqAgf8SEsaVREYREQAA3i0bj370bs3CeUDTiN0BMOZM73MGeQMSwka00ZN78NYvH21Iv3gueEzWQgEhJzdnws35N0yUUtwAcEbpqerxDBj4LyVhHRWZ3kq9as2qwq8/8y1exKIRYrdDQWSU8oTbJv6fRqUUP8HurHPJ1NEPIQghC0fUaMTctFn2VdflXnuDKT0jrn8aAtDA/y4Jk9ppoorUu3Vz8bdf1s6fo/lqgcUKJYlxDhItJGCCh3X+Tt6Q0vWU0bjsRBgyRkNBpmnm1m1yrr0h+7J/mVI9Bv0MGCRshIoAAD2METp8sGzqz2UzZ0SPHkIYY4sNYgI45SeYgLyhhZgMRvCE6IvJWjgEJcnZo1eTa65PH3WhYLUZ9DNgkPBvqcgRJgAAxe+vmD+n7NcpgY3rgBxDNhuSTPoxSYMvPtS3rn0QghBCSmk4zFRFyMpJHTEq5/Kr3D1764Qz6GfAIOEZU5Fz3VbkAPg2b6yYPrVq0dxYYSEEHFusQBQBBzwZ1YAIQAQYZZEIi0ax1eLo0i39ossyRo81Z2SCREsig34GDBL+O26b5PA6xeetWbWyYu6f/lUr5PISACExWZAkccZoNKrGotBssbVulzZkSMaosc4u3ZKi7+TxmgYMGCT89wUjACBaWVG9fGnlvL/CWzcppcVQMlnatncNGJQxdKSza3esy09D9BkwSPj/SDACCFCi+51cW+PbvFH0eJyduiAUHxvEDdFnwCDhf0hNrdf0so57Rt2DAYOE/4RsNLhnwCChAQMGAADnVnsLAwYMEhowYMAgoQEDBgkNGDBgkNCAAYOEBgwYMEhowIBBQgMGDBgkNGDAIKEBAwYMEhowYJDQgAEDBgkNGDBIaMCAAYOEBgwYJDRgwIBBQgMGDBIaMGDAIKEBAwYJDRgwYJDQgAGDhAYMGDBIaMCAQUIDBgwYJDRgwCChAQMGDBIaMGCQ0IABAwYJDRgwSGjAgAGDhAYMGCQ0YMCAQUIDBgwSGjBgwCChAQMGCQ0YMGCQ0IABg4QGDBgwSGjAgEFCAwYMGCQ0YMAgoQEDBgwSGjBwzuP/A3dj7SzEUpN3AAAAAElFTkSuQmCC";
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
    onRun: () => ai("You are an expert HVAC safety officer for FieldPro. Generate thorough task-specific safety briefings covering OSHA, NFPA 70E, and EPA 608 requirements. Be specific about exact PPE items with ratings and standards.", `Pre-job safety briefing:\nJob: ${job}\nEquipment: ${equip || "Not specified"}\nLocation: ${loc || "Not specified"}\nRefrigerant: ${ref || "Not specified"}\nAdditional hazards: ${haz.join(", ") || "None"}\n\nGenerate this exact structure:\n\n⚠️ CRITICAL SAFETY WARNINGS\n(2-3 top hazards for this specific job)\n\n🦺 REQUIRED PPE - JOB SPECIFIC\nList every item the tech must wear, with ratings/standards. Cover:\n- Head/eye protection (safety glasses ANSI Z87.1, face shield if needed)\n- Hand protection (cut-resistant, electrical-rated, cryogenic for refrigerant — specify which)\n- Foot protection (steel-toe ASTM F2413, slip-resistant for rooftop)\n- Hearing protection (if equipment >85 dB)\n- High-vis vest (rooftop, occupied building)\n- Arc flash gear (NFPA 70E Cat 2 for electrical work — specify cal/cm² rating)\n- Respiratory protection (refrigerant exposure, dust)\n- Fall protection (>6ft height — harness, lanyard, anchor point)\n- Body protection (long sleeves, FR clothing for electrical)\n\n🔐 LOTO PROCEDURE\n(Step-by-step for THIS equipment)\n\n☢️ REFRIGERANT SAFETY (if applicable)\n\n⚡ ELECTRICAL SAFETY\n\n✅ PRE-JOB CHECKLIST (8-10 items)\n\n📞 EMERGENCY RESPONSE`),
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

