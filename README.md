# MTS Assistant — AI Field Assistant for HVAC Engineers

**JLL MTS · Accelerate 2030 Hackathon 2026 · AMER Region**

MTS Assistant is a mobile-first AI tool built for JLL MTS field engineers. It puts an expert HVAC assistant in every technician's pocket — diagnosing faults, calculating refrigerant charge, finding parts, generating safety briefings, logging equipment, and calculating belt sizes, all from a single app on their phone.

---

## What it does

**AI Chat** is the core of the app. Technicians describe a problem in plain English and get expert, step-by-step guidance — fault diagnosis, electrical troubleshooting, refrigerant charging procedures, PPE requirements, part numbers. The AI remembers everything said in the conversation so it builds context as the job progresses.

**Six specialist agents** handle structured workflows:

- **Fault Diagnosis** — ranks probable causes by likelihood with a full step-by-step procedure
- **Predictive Maintenance** — analyses equipment age and observations to flag upcoming failures
- **Parts Finder** — OEM and compatible part numbers with specs, pricing, and GPS-located nearby suppliers (Johnstone, Wesco, Grainger, Ferguson)
- **Refrigerant Calculator** — computes superheat, subcooling, and charge assessment from live readings
- **Safety Briefing** — generates a task-specific PPE list, LOTO steps, and hazard checklist
- **Closing Comment** — writes a professional work order closing comment ready to paste into a CMMS

These agents are connected: running Fault Diagnosis pre-fills the Safety Briefing, which pre-fills the Closing Comment. One job, no re-entry.

**Equipment Log** lets technicians build a site-by-site database of every unit they service — brand, model, serial, refrigerant, voltage, filter sizes, belt sizes, and notes. Stored on the device, available offline.

**Tools:**
- **PT Chart** — pressure-temperature calculator for R-410A, R-22, R-32, R-454B, R-407C, R-134a
- **Belt Calculator** — calculates V-belt size from pulley OD and center distance, with standard belt cross-reference and adjusted center distance
- **Job Notes** — quick field notes with titles

**Document Library — 11 technical references:**
1. Carrier 48/50XC RTU — fault codes, serial decode, R-410A charging
2. Trane RTU/AHU/Chiller — Voyager, Precedent, Intellipak, CGAM fault codes
3. Daikin VRV/VRF — commissioning procedure, A0–UF fault codes (60+)
4. Refrigerant Safety & Handling — R-410A, R-22, R-454B, R-32, R-407C, R-134a
5. HVAC Electrical — 24V controls, VFDs, NFPA 70E, motor testing
6. Split Systems & Heat Pumps — flash codes, serial decode, charging
7. Gas Furnaces — Carrier, Lennox, Goodman fault codes, ignition troubleshooting
8. Boilers — Lochinvar Knight, Navien NCB, hydronic troubleshooting
9. Water Heaters — Rheem, AO Smith, Rinnai, Navien tankless fault codes
10. Chillers — Carrier 30HX, Trane CGAM, York YVAA, Carrier 19XR centrifugal
11. VFDs — ABB, Danfoss, Yaskawa, Siemens, Allen-Bradley fault codes and commissioning

**Dark / Light mode** — toggleable with a circular wipe animation. Preference saved across sessions.

---

## Tech

- Single `index.html` file — no build step, no dependencies, no server required
- React 18.2.0 bundled inline — works with no internet after first load
- AI powered by Anthropic Claude Sonnet 4.6 via direct API call
- Data stored in localStorage with in-memory fallback
- Full dark/light theme system with smooth transitions
- Designed for mobile Chrome/Safari, tested on Android

---

## Deploying

The entire app is `index.html`. Upload it anywhere that serves static files.

**GitHub Pages** — push to a repo, enable Pages under Settings → Pages → GitHub Actions. The included `deploy.yml` handles automatic deployment on every push to main.

**Vercel / Netlify** — drag and drop the file.

**Direct** — send the file to a technician. Open in any mobile browser. No server needed.

---

## Repo structure

```
index.html          The entire app (~440KB, self-contained)
README.md           This file
deploy.yml          GitHub Actions workflow → copy to .github/workflows/
package.json        Project metadata
```

---

## Hackathon context

**Problem:** JLL MTS field engineers rely on paper binders, personal experience, and phone calls to colleagues when troubleshooting HVAC equipment on site. This creates delays, inconsistency, and safety risk.

**Solution:** A pocket AI expert that every technician has on their phone — fault codes, refrigerant tables, PPE requirements, part numbers, nearby suppliers, belt sizing, and work order documentation, all in one place and all AI-assisted.

**Team:** JLL MTS, AMER  
**Event:** JLL Hackathon 2026 – Accelerate 2030  
**Deadline:** 25 June 2026  
**Contact:** JLLHackathon@jll.com
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JLL%20Hackathon-2026-E30613?style=for-the-badge" alt="JLL Hackathon 2026"/>
  <img src="https://img.shields.io/badge/Status-Live%20%26%20Working-27AE60?style=for-the-badge" alt="Live"/>
  <img src="https://img.shields.io/badge/Region-AMER-000000?style=for-the-badge" alt="AMER"/>
  <img src="https://img.shields.io/badge/Tools-9%20Built--in-E30613?style=for-the-badge" alt="9 Tools"/>
  <img src="https://img.shields.io/badge/AI%20Agents-8-E30613?style=for-the-badge" alt="8 Agents"/>
</p>

## 🚀 Live App

**[👉 Open MTS Assistant — tap here on your phone](https://YOUR-GITHUB-USERNAME.github.io/mts-assistant)**

> Works on any smartphone. No install required. Just open the link.

---

## The Problem

Mobile HVAC engineers and mechanics at JLL MTS work alone in the field — without consistent access to troubleshooting support, equipment documentation, safety guidance, or real-time expert backup.

This leads to repeat call-outs, inconsistent PPE compliance, lost time searching for OEM manuals, and unnecessary vendor escalations that erode margin.

---

## The Solution

**MTS Assistant** — one app, 9 tools, 8 specialist AI agents, a searchable document library, and a connected agentic workflow built by a 15-year JLL MTS field engineer.

> We are building MTS Assistant to solve the lack of consistent HVAC troubleshooting support, documentation, and safety guidance for JLL MTS mobile engineers — so they can diagnose faster, work safely, reduce vendor spend, and expand margin through first-time-right execution.

---

## App Structure

```
MTS Assistant
├── 🏠 Dashboard          — Personalised home with live stats and quick-launch
├── 💬 AI Chat            — Multi-job persistent HVAC chat assistant
├── 🤖 AI Agents (8)      — Specialist task agents
├── 📚 Document Library   — Searchable manuals, fault codes, SOPs + AI Q&A
├── 🔍 Model Lookup       — Model/serial number register by brand
├── 🌡️ PT Chart           — Pressure-Temperature calculator (6 refrigerants)
├── 📝 Job Notes          — Field notes saved persistently
├── 🏭 Equipment List     — Site equipment register
├── 🔩 Parts Log          — Parts used with cost tracking
├── 📷 Photos             — Site photo capture and gallery
└── 📋 Service History    — Searchable maintenance log
```

---

## 8 AI Agents

| Category | Agent | What it does |
|----------|-------|-------------|
| Diagnostic | 🔍 Fault Diagnosis | Ranks causes by probability with full procedure |
| Diagnostic | ⚠️ Escalation | Clear escalate/don't decision with who to call |
| Diagnostic | 📈 Predictive Maintenance | Predicts failures before they happen |
| Technical | 🔩 Parts Finder | OEM + compatible parts with specs and suppliers |
| Technical | 🧊 Refrigerant Calculator | Superheat, subcooling, charge assessment |
| Technical | 🚀 Commissioning | Full startup checklist with target values |
| Documentation | 🦺 Safety Briefing | Task-specific PPE + LOTO + hazard checklist |
| Documentation | 📄 Service Report | Auto-imports notes and parts — ready to send |

---

## Connected Agentic Workflow

```
Fault Diagnosis  →  pre-fills Safety Briefing  →  pre-fills Parts Finder  →  pre-fills Service Report
```

One job. Four agents. Zero re-entry. This is agentic AI at scale.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Babel (browser), CSS-in-JS |
| AI Engine | Claude Sonnet (Anthropic API) |
| Storage | localStorage — persistent across sessions |
| Hosting | GitHub Pages — zero infrastructure |
| Compatibility | Any smartphone, any browser |

---

## JLL Accelerate 2030

| Pillar | How MTS Assistant Delivers |
|--------|---------------------------|
| Agentic AI at scale | 8 agents + 9 tools, zero IT deployment |
| Expand margin | Reduces repeat visits and vendor spend |
| Grow market share | Differentiates JLL MTS service quality |
| Cross-functional | Works across AMER, APAC, EMEA |

---

## Team

**JLL MTS Team — AMER Region**  
JLL Hackathon 2026 · *Accelerate 2030: Pioneer Tomorrow's CRE Solutions with Data & AI*

> Built by a 15-year JLL MTS field engineer who lived this problem every day.

---

*Repository set to **Internal** visibility — accessible to all JLL employees per hackathon requirements.*
