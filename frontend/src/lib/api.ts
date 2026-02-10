import { DecisionPayload } from "../types/dashboard";

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:4000";

export async function setScenario(scenario: "normal" | "outage" | "critical"): Promise<void> {
  await fetch(`${API_BASE}/scenario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario })
  });
}

export async function fetchScore(input: DecisionPayload["input"]): Promise<DecisionPayload> {
  const response = await fetch(`${API_BASE}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("Failed to fetch score");
  }

  return response.json() as Promise<DecisionPayload>;
}

export function streamUrl(): string {
  return `${API_BASE}/stream`;
}
