# MTS Assistant — AI Field Assistant for HVAC Engineers

**JLL MTS · Accelerate 2030 Hackathon 2026 · AMER Region**

🔗 **Live app:** https://solmasta.github.io/mts-assistant  
📁 **Repo:** https://github.com/solmasta/mts-assistant

---

## The Problem

JLL MTS field engineers rely on paper binders, personal experience, and phone calls to colleagues when troubleshooting HVAC equipment on site. This creates delays, inconsistency, and safety risk — especially for less experienced technicians on complex jobs.

## The Solution

MTS Assistant puts an expert HVAC technician in every engineer's pocket. Describe a problem in plain English, get expert step-by-step guidance instantly. No binder. No phone call. No waiting.

---

## Features

**AI Chat** — conversational assistant that builds context throughout a job. Ask anything about HVAC: fault codes, charging procedures, electrical troubleshooting, PPE requirements, part numbers.

**Six AI Agents — structured job workflows:**
- **Fault Diagnosis** — ranks probable causes by likelihood with step-by-step procedures
- **Predictive Maintenance** — analyses equipment age and symptoms to flag upcoming failures
- **Parts Finder** — OEM and compatible part numbers with GPS-located nearby suppliers (Johnstone, Wesco, Grainger, Ferguson)
- **Refrigerant Calculator** — superheat, subcooling, and charge assessment from live readings
- **Safety Briefing** — task-specific PPE list, LOTO procedure, and hazard checklist
- **Closing Comment** — professional CMMS-ready work order comment, one tap to copy

**Connected Workflow** — Fault Diagnosis pre-fills Safety Briefing, which pre-fills Closing Comment. One job, no re-entry.

**Equipment Log** — site-by-site database of every unit serviced. Brand, model, serial, refrigerant, voltage, filter and belt sizes. Stored locally, available offline.

**Tools:**
- PT Chart — R-410A, R-22, R-32, R-454B, R-407C, R-134a
- Belt Calculator — V-belt size from pulley OD and center distance
- Job Notes

**Document Library — 11 technical references** covering Carrier, Trane, Daikin, fault codes, refrigerant safety, HVAC electrical, split systems, gas furnaces, boilers, water heaters, chillers, and VFDs.

**Demo Mode** — self-running 7-step walkthrough of a full job scenario for presentations.

**Dark / Light mode** — system preference respected, manual toggle available.

---

## Tech Stack

- **Frontend:** React 18.2.0 (bundled inline), zero build step, zero dependencies
- **AI:** Anthropic Claude Sonnet 4.6 via Cloudflare Worker proxy
- **Hosting:** GitHub Pages (static, free)
- **Proxy:** Cloudflare Workers (API key secured server-side)
- **Storage:** localStorage with in-memory fallback
- **Platform:** Mobile-first, tested on Android Chrome

---

## Repo Structure

```
index.html              Main app shell (179KB)
app1.js                 Core logic — AI, theme, components (100KB)
app2.js                 Agents, chat, document data (99KB)
app3.js                 Tools, demo mode, app root (81KB)
worker.js               Cloudflare Worker proxy
wrangler.toml           Cloudflare config
README.md               This file
package.json            Project metadata
.github/workflows/
  deploy.yml            GitHub Actions → GitHub Pages
```

---

## Hackathon Context

**Team:** JLL MTS, AMER  
**Event:** JLL Hackathon 2026 – Accelerate 2030  
**Deadline:** 25 June 2026  
**Contact:** JLLHackathon@jll.com

**Impact:** Faster fault resolution · Consistent safety compliance · Accurate work orders · Knowledge transfer to junior engineers · Zero paper, zero phone calls
