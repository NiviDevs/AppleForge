import dotenv from "dotenv";

dotenv.config();

function parseNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  port: parseNumber(process.env.PORT, 4000),
  frontendOrigin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  simulationIntervalMs: parseNumber(process.env.SIMULATION_INTERVAL_MS, 2000),
  chainRpcUrl: process.env.CHAIN_RPC_URL ?? "",
  chainPrivateKey: process.env.CHAIN_PRIVATE_KEY ?? "",
  decisionLogAddress: process.env.DECISION_LOG_ADDRESS ?? ""
};
