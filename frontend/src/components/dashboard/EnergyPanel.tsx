import { DecisionPayload } from "../../types/dashboard";

interface Props {
  latest: DecisionPayload | null;
}

export function EnergyPanel({ latest }: Props): JSX.Element {
  const energy = latest?.input.energy;

  return (
    <section className="panel">
      <h3>Energy</h3>
      <div className="stat-grid">
        <div><label>Grid</label><strong>{energy ? (energy.pgrid === 1 ? "ON" : "OFF") : "--"}</strong></div>
        <div><label>Battery</label><strong>{energy ? `${energy.batteryLevel.toFixed(1)}%` : "--"}</strong></div>
        <div><label>Fuel</label><strong>{energy ? `${energy.fuel.toFixed(1)}%` : "--"}</strong></div>
      </div>
    </section>
  );
}
