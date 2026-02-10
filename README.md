# AppleForge

Energy-aware, fault-tolerant hospital management demo with Web3-auditable decision logs.

## Repo layout
- `backend/`: Express API, scoring engine, policy logic, simulator, and chain logger client.
- `frontend/`: React (Vite) dashboard for live vitals, energy state, decisions, and audit logs.
- `contracts/`: Hardhat Solidity project with `DecisionLog` contract.
- `shared/`: shared JSON schemas and canonical mappings.
- `docs/`: architecture notes, API notes, slide outline, and demo script.

## Quick start
1. Install dependencies:
```bash
npm install
```
2. Start local chain in terminal 1:
```bash
npm run dev:chain
```
3. Deploy contract in terminal 2:
```bash
npm run contract:deploy
```
4. Start backend + frontend in terminal 3:
```bash
npm run dev
```
5. Open dashboard at `http://localhost:5173`.

## Backend env
Create `backend/.env` (optional):
```bash
PORT=4000
FRONTEND_ORIGIN=http://localhost:5173
SIMULATION_INTERVAL_MS=2000
CHAIN_RPC_URL=http://127.0.0.1:8545
CHAIN_PRIVATE_KEY=<hardhat_private_key>
DECISION_LOG_ADDRESS=<deployed_contract_address>
```

See `TEAM_STARTER.md` for formulas and team delegation.
