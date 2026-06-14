# MTS Assistant — AI Field Assistant for HVAC Engineers

**JLL MTS · Accelerate 2030 Hackathon 2026 · AMER Region**

🔗 **Live app:** https://solmasta.github.io/mts-assistant  
📁 **GitHub repo:** https://github.com/solmasta/mts-assistant  
🎥 **Demo video:** *(add your YouTube/Vimeo link here)*

---

## The Problem

JLL MTS field engineers arrive on site every day to diagnose complex HVAC faults — often alone, on unfamiliar equipment, with paper binders that may be years out of date. When they hit a fault code they haven't seen before, they call a colleague, wait, and the building stays down.

This creates delays, inconsistency across the team, safety risk, and knowledge gaps that are especially costly for less experienced technicians on complex equipment.

---

## The Solution

MTS Assistant puts an expert HVAC technician in every engineer's pocket. Describe a problem in plain English, get expert step-by-step guidance instantly. No binder. No phone call. No waiting.

> *"We are building MTS Assistant to solve the lack of consistent HVAC troubleshooting support, equipment documentation, safety guidance, and expert backup for mobile engineers working alone in the field, for JLL MTS mobile HVAC engineers and mechanics, so they can diagnose faults faster, work safely with correct PPE and LOTO procedures, reduce repeat visits and vendor spend, and expand margin through consistent first-time-right HVAC execution across the JLL MTS portfolio."*

---

## Features

### 💬 AI Chat
Conversational assistant powered by Anthropic Claude Sonnet 4.6. Ask anything about HVAC — fault codes, charging procedures, electrical troubleshooting, PPE requirements, part numbers. The AI builds full context throughout the conversation so guidance improves as the job progresses.

### 🤖 Six AI Agents — Structured Job Workflows

| Agent | What it does |
|-------|-------------|
| **Fault Diagnosis** | Ranks probable causes by likelihood with step-by-step procedures |
| **Predictive Maintenance** | Analyses equipment age and symptoms to flag upcoming failures |
| **Parts Finder** | OEM and compatible part numbers with GPS-located nearby suppliers |
| **Refrigerant Calculator** | Superheat, subcooling, and charge assessment from live readings |
| **Safety Briefing** | Task-specific PPE list, LOTO procedure, and hazard checklist |
| **Closing Comment** | Professional CMMS-ready work order comment, one tap to copy |

### ⚡ Connected Workflow
Fault Diagnosis → Safety Briefing → Closing Comment. Each agent pre-fills from the previous one. One job. Zero re-entry.

### 🛠️ Tools
- **PT Chart** — pressure-temperature lookup + superheat and subcooling calculator for R-410A, R-22, R-32, R-454B, R-407C, R-134a
- **Belt Calculator** — V-belt size from pulley OD and center distance with standard belt cross-reference
- **Job Notes** — quick field notes saved locally

### 📚 Document Library — 11 Technical References
| # | Document | Coverage |
|---|----------|----------|
| 1 | Carrier 48/50XC RTU | Fault codes E1–E79, serial decode, R-410A charging |
| 2 | Trane RTU/AHU/Chiller | Voyager, Precedent, Intellipak, CGAM fault codes |
| 3 | Daikin VRV/VRF | A0–UF fault codes (60+), commissioning procedure |
| 4 | Refrigerant Safety | R-410A, R-22, R-454B, R-32, R-407C, R-134a, EPA 608 |
| 5 | HVAC Electrical | 24V controls, VFDs, NFPA 70E, motor testing |
| 6 | Split Systems & Heat Pumps | Flash codes, serial decode, charging |
| 7 | Gas Furnaces | Carrier, Lennox, Goodman fault codes, ignition |
| 8 | Boilers | Lochinvar Knight, Navien NCB, hydronic troubleshooting |
| 9 | Water Heaters | Rheem, AO Smith, Rinnai, Navien tankless fault codes |
| 10 | Chillers | Carrier 30HX, Trane CGAM, York YVAA, Carrier 19XR |
| 11 | VFDs | ABB, Danfoss, Yaskawa, Siemens, Allen-Bradley |

### 📋 Equipment Log
Site-by-site database of every unit serviced — brand, model, serial, refrigerant, voltage, filter sizes, belt sizes, notes. Stored locally on the device. Works fully offline.

### 🎬 Demo Mode
Self-running 7-step walkthrough of a complete job scenario. Tap ▶ DEMO on the home screen. Perfect for presentations and demonstrations to judges or stakeholders.

### 🌗 Dark / Light Mode
Full theme system with smooth circular wipe transition animation. Preference saved across sessions.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18.2.0 (bundled inline, zero build step, zero dependencies) |
| AI Engine | Anthropic Claude Sonnet 4.6 |
| API Proxy | Cloudflare Workers (API key secured server-side, never exposed) |
| Hosting | GitHub Pages (static, free, auto-deploys on push) |
| Storage | localStorage with in-memory fallback |
| Platform | Mobile-first PWA — no install, works offline after first load |

---

## Architecture

```
Browser (GitHub Pages)
    ↓ HTTPS POST
Cloudflare Worker (mts-assistant.lukedorsett.workers.dev)
    ↓ x-api-key header (secret, server-side only)
Anthropic API (Claude Sonnet 4.6)
```

The API key never touches the browser or the repository. All AI calls are proxied through Cloudflare Workers with the key stored as an encrypted environment secret.

---

## Repo Structure

```
index.html              App shell — React, ReactDOM, CSS (179KB)
app1.js                 Core logic — AI function, theme, base components (100KB)
app2.js                 Agents, chat UI, document data (99KB)
app3.js                 Tools, demo mode, equipment log, app root (86KB)
worker.js               Cloudflare Worker — secure API proxy
wrangler.toml           Cloudflare Worker config
README.md               This file
package.json            Project metadata v1.4.0
.github/
  workflows/
    deploy.yml          GitHub Actions → GitHub Pages auto-deploy
```

---

## Running Locally

No build step required. Just open `index.html` in a browser:

```bash
npx serve .
# or
python3 -m http.server 8080
```

For AI to work locally, the Cloudflare Worker URL in `app1.js` needs to be accessible, or replace it with a direct Anthropic API call with `anthropic-dangerous-direct-browser-access: true` header and a valid API key.

---

## The Impact

| Outcome | Detail |
|---------|--------|
| ⚡ Faster fault resolution | Reduces equipment downtime, improves client outcomes |
| 🦺 Safety compliance | Every job begins with task-specific PPE and LOTO |
| 📋 Accurate documentation | Professional work orders generated automatically |
| 🧠 Knowledge transfer | Senior expertise available to every tech on the team |
| 💰 Margin expansion | Fewer repeat visits, reduced vendor spend, first-time-right execution |

---

## Team

| Name | Role | Location |
|------|------|----------|
| Luke Dorsett | Lead Engineer / Mobile Developer | Chicago |
| Brandon Gill | Business / Presentation | Nashville |
| Michael Cummings | Business | Kansas City |
| Greg Dziedzic | Mobile Developer | Chicago |

**Event:** JLL Hackathon 2026 — Accelerate 2030  
**Region:** AMER  
**Deadline:** June 25, 2026  
**Contact:** JLLHackathon@jll.com
