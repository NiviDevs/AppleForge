import { DecisionPayload } from "../../types/dashboard";

interface Props {
  latest: DecisionPayload | null;
}

export function PriorityPanel({ latest }: Props): JSX.Element {
  const alertLevel = latest?.policy.alertLevel;
  const alertText = alertLevel === "CRITICAL"
    ? "Critical"
    : alertLevel === "MONITOR"
      ? "Monitor"
      : alertLevel === "NORMAL"
        ? "Normal"
        : "--";

  return (
    <section className="panel priority-panel">
      <h3>Priority</h3>
      <div className="priority-grid">
        <div className="priority-item">
          <p className="priority-label">Patient Risk (S_crit)</p>
          <strong className="priority-value">{latest?.scores.sCrit.toFixed(3) ?? "--"}</strong>
          <p className="priority-help">How unstable the patient vitals are right now.</p>
        </div>
        <div className="priority-item">
          <p className="priority-label">Priority Score (Pscore)</p>
          <strong className="priority-value">{latest?.scores.pscore.toFixed(3) ?? "--"}</strong>
          <p className="priority-help">Overall urgency after combining risk, room, and equipment context.</p>
        </div>
        <div className="priority-item">
          <p className="priority-label">Alert Level</p>
          <strong className="priority-value">{alertText}</strong>
          <p className="priority-help">Action tier for operators: normal, monitor closely, or critical response.</p>
        </div>
      </div>
    </section>
  );
}
