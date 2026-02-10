# AppleForge Team Starter

Purpose
Build a fault-tolerant, energy-aware hospital management demo that prioritizes care and logs decisions on-chain for auditability.

Success Criteria

1. Live demo shows vitals, energy state, priority score, and decision output.
2. Decisions change when energy degrades or patient risk spikes.
3. Each decision is logged to a local Solidity contract as a verifiable event.

Team Split

1. Nevedya (Logic and Chain)
   Deliver scoring, policy logic, simulator, API, and contract integration.
2. Panshul (Frontend)
   Build a React + shadcn dashboard wired to the API/SSE stream.
3. Abhinav (Docs and Presentation)
   Produce slides, README, and demo script using the architecture and formulas below.

Architecture Overview

1. Simulator
   Generates synthetic vitals and energy events every 2 seconds with scenario presets.
2. Scoring Service
   Normalizes vitals, computes S_crit and Pscore, applies energy-aware policy.
3. Decision Logger
   Hashes each decision and emits it to a local Solidity contract.
4. UI Dashboard
   Displays live signals, scores, and the latest on-chain audit entries.

Data Model (Inputs)

1. SPO2 (percent, 70..100)
2. HeartRate (bpm, 40..200)
3. BloodPressure (systolic mmHg, 70..200)
4. Equipment tier: T1, T2, T3, T4
5. Room class: ICU, ER, Lobby
6. Energy state: Pgrid (0 or 1), BatteryLevel (0..100), Fuel (0..100)

Corrected Formulas
Define clamp(x, lo, hi) = min(hi, max(lo, x))

Targets

1. SPO2 target: 95 to 100
2. HR target: 70, HR max: 180
3. BP target range: 90 to 140
4. BP min: 70, BP max: 200

Normalized Risks

1. spo2_risk = clamp((95 - SPO2) / 10, 0, 1)
2. hr_risk = clamp((HeartRate - HR_target) / (HR_max - HR_target), 0, 1)
3. bp_risk = if BP < 90 then clamp((90 - BP) / (90 - 70), 0, 1) else if BP > 140 then clamp((BP - 140) / (200 - 140), 0, 1) else 0

Vitality Score

S_crit = clamp(w1 * spo2_risk + w2 * hr_risk + w3 * bp_risk, 0, 1)
Recommended weights: w1=0.5, w2=0.3, w3=0.2

Equipment Mapping
T1=1.0, T2=0.7, T3=0.4, T4=0.1

Room Mapping
ICU=1.0, ER=0.7, Lobby=0.2

Priority Score
Pscore = clamp(A * S_crit + B * E_class + C * R_status, 0, 1)
Recommended weights: A=0.6, B=0.25, C=0.15

Energy State (for policy only)
E_state = 0.5 * Pgrid + 0.3 * (BatteryLevel/100) + 0.2 * (Fuel/100)

Decision Policy (Demo Rules)
1. If Pgrid=0 and BatteryLevel < 30, shed T4 loads.
2. If BatteryLevel < 15 and Fuel < 20, only power T1 in ICU or ER.
3. If Pscore >= 0.75, raise Critical alert.
4. If 0.5 <= Pscore < 0.75, raise Monitor alert.

On-Chain Logging
1. decisionHash = keccak256 of normalized payload + decision.
2. Contract event: DecisionLogged(decisionHash, ts, roomClass, tier, pscoreBps)
3. pscoreBps = round(Pscore * 10000)

API Contract (Backend)
1. POST /score
   Input JSON: {spo2, hr, bp, roomClass, equipmentTier, energy}
   Output JSON: {s_crit, pscore, decision, decisionHash}
2. GET /stream
   Server-Sent Events with the same fields as /score

UI Requirements (Frontend)

1. Vitals panel: SPO2, HR, BP
2. Energy panel: Pgrid, BatteryLevel, Fuel
3. Priority panel: S_crit and Pscore
4. Decision feed: alert type and power shedding actions
5. Audit log: last 10 on-chain DecisionLogged events

Presentation Outline (Docs)

1. Problem and constraints (energy instability, life-critical)
2. Architecture and data flow
3. Scoring logic and policy rules
4. Web3 auditability and decision transparency
5. Demo scenarios and outcomes

Demo Scenarios

1. Normal state with grid on and normal vitals.
2. Grid outage with battery dropping, non-essential loads shed.
3. Patient SPO2 crash in ICU, critical alert and T1 prioritization.

Suggested Prompts (ChatGPT helpers)

1. Frontend: "Create a React + shadcn dashboard layout for a clinical control room with panels for vitals, energy, priority score, decision feed, and on-chain audit log."
2. Docs: "Draft a 6-slide deck explaining an energy-aware hospital system with Web3 audit logs, including architecture diagram guidance and demo narrative."

Next Actions

1. Nevedya implement scoring module and API.
2. Panshul builds UI against mock data, then wires SSE.
3. Abhinav builds slides and README using the exact formulas above.
