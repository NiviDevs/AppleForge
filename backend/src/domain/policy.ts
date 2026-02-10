import { PolicyDecision, ScoreBreakdown, ScoreInput } from "../types/inputs";

export function evaluatePolicy(input: ScoreInput, scores: ScoreBreakdown): PolicyDecision {
  const reasons: string[] = [];
  let powerAction: PolicyDecision["powerAction"] = "MAINTAIN";

  if (input.energy.pgrid === 0 && input.energy.batteryLevel < 30) {
    powerAction = "SHED_T4";
    reasons.push("GRID_OFF_LOW_BATTERY");
  }

  if (input.energy.batteryLevel < 15 && input.energy.fuel < 20) {
    powerAction = "T1_ONLY";
    reasons.push("SEVERE_ENERGY_DEFICIT");
  }

  const alertLevel = scores.pscore >= 0.75
    ? "CRITICAL"
    : scores.pscore >= 0.5
      ? "MONITOR"
      : "NORMAL";

  if (alertLevel !== "NORMAL") {
    reasons.push(`ALERT_${alertLevel}`);
  }

  const message = `Alert=${alertLevel}; Power=${powerAction}; Score=${scores.pscore.toFixed(3)}`;

  return {
    alertLevel,
    powerAction,
    reasonCodes: reasons,
    message
  };
}
