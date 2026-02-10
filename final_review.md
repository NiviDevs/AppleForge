# Final Review

## 1. Team name(members Reg number)
- Team Name: AppleForge
- Members:
  - Nevedya Gwalani    24BEC0431
  - Panshulaj Pechetty 24BEC0177
  - Abhinav Kisore     24BCE2891

## 2. System Architecture & Technical Depth
- Distributed Topology: The system is split into independent nodes: (a) data source/sensor stream (simulator in MVP), (b) backend decision node (scoring + policy + API), (c) blockchain logging node (DecisionLog smart contract), and (d) clinician dashboard node (frontend SSE client). This separation prevents a single central database from being the only source of truth for critical decisions.
- Logic Separation: Off-chain services handle real-time ingestion, risk scoring, and energy-aware policy (low latency, no gas, privacy-preserving). On-chain logic stores only verifiable decision proofs (`decisionHash`, `ts`, `roomClass`, `tier`, `pscoreBps`) for immutable auditability and replay verification.

## 3. W3 Technology Application
- Core Protocol Logic: A Solidity contract (`contracts/contracts/DecisionLog.sol`) emits `DecisionLogged` events for every evaluated decision. Backend computes a deterministic Keccak-256 hash over normalized payload + policy output, then anchors it on-chain for decentralized auditability.
- Autonomous Triggers: Policy rules execute automatically on each incoming sample and stream tick. Example triggers: `pgrid=0 && battery<30 => SHED_T4`; `battery<15 && fuel<20 => T1_ONLY`; `pscore>=0.75 => CRITICAL`; `0.5<=pscore<0.75 => MONITOR`.

## 4. Reliability & Fault Tolerance
- Failure Recovery Plan: During power instability, the policy progressively sheds non-essential loads and eventually enforces life-critical-only operation (T1 only). During chain/RPC outages, backend continues operating and returns decisions; chain logging gracefully degrades via `NoopChainLogger` instead of blocking care logic.
- Prioritization Algorithm: Priority score combines clinical severity and context:
  - `S_crit = 0.5*spo2_risk + 0.3*hr_risk + 0.2*bp_risk`
  - `Pscore = 0.6*S_crit + 0.25*equipment_weight + 0.15*room_weight`
  This ensures life-critical ICU/T1 cases dominate queueing and response under instability.

## 5. Transparency & Trust Minimization
- Verifiable Audit Trail: Every decision produces an immutable on-chain event with timestamp and compact metadata. Off-chain records can be re-hashed to verify integrity against on-chain anchors.
- Permissionless Verification: Any independent verifier with RPC access can read contract events and validate decision hashes without relying on a privileged admin database operator.

## 6. Real-World Feasibility
- Constraint Handling: The design minimizes bandwidth and compute by streaming concise SSE payloads and writing only compact hashes/metadata on-chain. Energy-aware control logic explicitly uses `pgrid`, battery, and fuel to adapt behavior under constrained power.
- Compliance Logic: Sensitive patient payloads stay off-chain while tamper-evident proofs go on-chain, reducing privacy exposure. This supports privacy-by-design and creates a foundation for regulated deployments (with future additions such as role-based access, encryption at rest, and consent policies).

## 7. Technical Explanation & Demo
- Architecture Justification: Compared with a traditional centralized database-only approach, W3 anchoring adds tamper-evident, independently verifiable decision history, which is critical for post-incident accountability in life-critical systems.
- Trade-off Analysis: In the 8-hour sprint, we prioritized deterministic scoring, autonomous fault policies, live monitoring, and verifiable logging over advanced features (multi-region consensus, DID identity layer, encrypted PHI ledger, full contract access controls). This delivered a working reliability-first MVP with clear upgrade paths.
