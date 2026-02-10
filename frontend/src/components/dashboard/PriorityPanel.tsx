import { DecisionPayload } from "../../types/dashboard";

interface Props {
  latest: DecisionPayload | null;
}

export function PriorityPanel({ latest }: Props): JSX.Element {
  return (
    <section className="panel">
      <h3>Priority</h3>
      <div className="stat-grid">
        <div><label>S_crit</label><strong>{latest?.scores.sCrit.toFixed(3) ?? "--"}</strong></div>
        <div><label>Pscore</label><strong>{latest?.scores.pscore.toFixed(3) ?? "--"}</strong></div>
        <div><label>Alert</label><strong>{latest?.policy.alertLevel ?? "--"}</strong></div>
      </div>
    </section>
  );
}
